/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../../components/FormInput'
import { OnBoardCompany, checkBusinessExists, type BusinessExistsResponse } from '../../../api'

import { useAppSelector } from '@/store'

import DaumPostcode from 'react-daum-postcode'
import { showSuccessToast, showErrorToast } from '@/components/Toast/toast'

type OnBoardFormValue = {
  companyName: string
  businessNumber: string
  address: string
  detailAddress: string
  postcode: string
}

const CompanyOnBoardForm: FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isPostOpen, setIsPostOpen] = useState(false)
  const [businessValidation, setBusinessValidation] = useState<{
    status: 'idle' | 'checking' | 'valid' | 'invalid'
    data?: BusinessExistsResponse
  }>({ status: 'idle' })

  const onboarded = useAppSelector(s => s.auth.onboarded)

  const toastShownRef = useRef(false)

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<OnBoardFormValue>({ mode: 'onChange' })

  const businessNumber = watch('businessNumber')

  // 사업자 등록번호 검증
  const validateBusinessNumber = useCallback(
    async (number: string) => {
      // 하이픈 제거하고 숫자만 추출
      const cleanNumber = number.replace(/\D/g, '')

      // 10자리가 아니면 검증하지 않음
      if (cleanNumber.length !== 10) {
        setBusinessValidation({ status: 'idle' })
        return
      }

      try {
        setBusinessValidation({ status: 'checking' })
        const result = await checkBusinessExists({ businessNumber: cleanNumber })

        if (result.exists) {
          setBusinessValidation({ status: 'valid', data: result })

          // 우편번호가 있으면 자동으로 입력
          if (result.postcode) {
            setValue('postcode', result.postcode, { shouldValidate: true })
          }

          // 회사명이 있으면 자동으로 입력
          if (result.companyName) {
            setValue('companyName', result.companyName, { shouldValidate: true })
          }

          // 주소가 있으면 자동으로 입력
          if (result.address) {
            setValue('address', result.address, { shouldValidate: true })
          }
        } else {
          setBusinessValidation({ status: 'invalid', data: result })
        }
      } catch (err: any) {
        console.error('사업자 등록번호 검증 실패:', err)
        setBusinessValidation({
          status: 'invalid',
          data: {
            exists: false,
            message: err.response?.data?.message || '사업자 등록번호 검증 중 오류가 발생했습니다.',
          },
        })
      }
    },
    [setValue]
  )

  useEffect(() => {
    if (onboarded === true && !toastShownRef.current) {
      toastShownRef.current = true
      showErrorToast('이미 온보딩이 완료된 회사입니다.')
      navigate('/', { replace: true })
    }
  }, [onboarded, navigate])

  // 사업자 등록번호 변경 시 검증 (디바운싱)
  useEffect(() => {
    if (!businessNumber) {
      setBusinessValidation({ status: 'idle' })
      return
    }

    const cleanNumber = businessNumber.replace(/\D/g, '')
    if (cleanNumber.length !== 10) {
      setBusinessValidation({ status: 'idle' })
      return
    }

    const timer = setTimeout(() => {
      validateBusinessNumber(businessNumber)
    }, 500) // 500ms 디바운싱

    return () => clearTimeout(timer)
  }, [businessNumber, validateBusinessNumber])

  // 다음 단계로 이동
  const handleNext = () => {
    const { companyName, businessNumber } = getValues()

    if (!companyName || !businessNumber) {
      alert('회사 이름과 사업자 등록번호를 입력하세요.')
      return
    }
    setStep(2)
  }

  // 이전 단계로 이동
  const handlePrev = () => {
    setStep(1)
  }

  /** 최종 제출 요청 */
  const handleSubmit = async () => {
    const values = getValues()

    if (toastShownRef.current) return

    try {
      await OnBoardCompany(values)

      toastShownRef.current = true
      showSuccessToast('온보딩이 완료되었습니다!')

      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err: any) {
      const status = err.response?.status

      if (status === 409) {
        toastShownRef.current = true
        showErrorToast('이미 온보딩이 완료된 회사입니다!\n잠시 뒤 홈으로 이동합니다.')

        setTimeout(() => {
          navigate('/')
        }, 2000)
        return
      }

      toastShownRef.current = true
      showErrorToast('온보딩 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  useEffect(() => {
    if (!isPostOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPostOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPostOpen])

  return (
    <div className="flex flex-col justify-center w-3/5 text-center bg-gray-50 p-14 rounded-r-3xl">
      <div className="mb-10">
        <h1 className="mb-4 text-5xl font-semibold">정보 입력</h1>
      </div>

      {step === 1 && (
        <form className="flex flex-col">
          <FormInput
            label="사업자등록번호"
            name="businessNumber"
            placeholder="888-88-88888"
            value={register}
            format="businessNumber"
            rules={{
              required: '사업자등록번호를 입력하세요.',
              validate: (v: any) =>
                String(v ?? '').replace(/\D/g, '').length === 10 ||
                '사업자등록번호는 10자리입니다.',
            }}
            error={errors.businessNumber}
          />

          <FormInput
            label="회사 이름"
            name="companyName"
            placeholder="회사 이름을 입력하세요"
            type="text"
            value={register}
            rules={{ required: true }}
            error={errors.companyName}
          />

          {/* 사업자 등록번호 검증 결과 */}
          {businessValidation.status !== 'idle' && (
            <div className="mt-2">
              {businessValidation.status === 'checking' && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>사업자 등록번호를 확인하는 중...</span>
                </div>
              )}

              {businessValidation.status === 'valid' && businessValidation.data && (
                <div className="p-3 text-sm bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>정상적인 사업자입니다</span>
                  </div>
                  {businessValidation.data.companyName && (
                    <p className="mt-1 text-green-600">
                      회사명:{' '}
                      <span className="font-semibold">{businessValidation.data.companyName}</span>
                    </p>
                  )}
                </div>
              )}

              {businessValidation.status === 'invalid' && businessValidation.data && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>사업자 등록번호 검증 실패</span>
                  </div>
                  <div className="mt-2 text-red-600">
                    {businessValidation.data.status && (
                      <p className="font-semibold">
                        사업 상태:{' '}
                        {businessValidation.data.status === '계속사업자'
                          ? '계속사업자'
                          : businessValidation.data.status === '휴업자'
                          ? '휴업자'
                          : businessValidation.data.status === '폐업자'
                          ? '폐업자'
                          : businessValidation.data.status}
                      </p>
                    )}
                    {businessValidation.data.message && (
                      <p className="mt-1">{businessValidation.data.message}</p>
                    )}
                    {!businessValidation.data.message && !businessValidation.data.status && (
                      <p>등록된 사업자 등록번호가 아니거나 유효하지 않습니다.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleNext}
              className="w-[150px] h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
              다음
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form className="flex flex-col">
          {/* 우편번호 + 버튼 */}
          <div className="flex gap-2">
            <div className="w-[210px]">
              <FormInput
                // TODO : readOnly 추가 필요
                label="우편번호"
                name="postcode"
                placeholder="우편번호"
                type="text"
                value={register}
                rules={{ required: true }}
                error={errors.postcode}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsPostOpen(true)}
              className="h-12 px-4 text-white bg-gray-700 rounded-lg mt-8 w-[155px]">
              우편번호 찾기
            </button>
          </div>

          <FormInput
            // TODO : readOnly 추가 필요
            label="주소"
            name="address"
            placeholder="주소 입력"
            type="text"
            value={register}
            rules={{ required: true }}
            error={errors.address}
          />

          <FormInput
            label="상세 주소"
            name="detailAddress"
            placeholder="상세 주소 입력"
            type="text"
            value={register}
            rules={{ required: true }}
            error={errors.detailAddress}
          />

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handlePrev}
              className="w-[120px] h-12 bg-gray-400 text-white rounded-lg">
              이전
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-[150px] h-12 bg-blue-500 text-white rounded-lg">
              제출
            </button>
          </div>

          {/* 다음 주소 팝업 */}
          {isPostOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setIsPostOpen(false)}>
              <div
                className="relative w-[500px] h-[600px] bg-white rounded-xl shadow-lg overflow-hidden"
                onClick={e => e.stopPropagation()}>
                {/* 닫기 버튼 */}
                <button
                  type="button"
                  onClick={() => setIsPostOpen(false)}
                  className="absolute text-gray-500 top-3 right-3 hover:text-black">
                  ✕
                </button>

                <DaumPostcode
                  style={{ width: '100%', height: '100%' }}
                  onComplete={data => {
                    setValue('postcode', data.zonecode) // 다음 우편번호는 zonecode 필드 사용
                    setValue('address', data.address)
                    setIsPostOpen(false)
                  }}
                />
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  )
}

export default CompanyOnBoardForm
