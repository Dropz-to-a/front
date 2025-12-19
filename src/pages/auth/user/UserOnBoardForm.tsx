/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FormInput } from '../../../components/FormInput'
import { OnBoardUser } from '../../../api'

import DaumPostcode from 'react-daum-postcode'
import { showSuccessToast, showErrorToast } from '@/components/Toast/toast'
type OnBoardFormValue = {
  realName: string
  birth: string
  address: string
  detailAddress: string
  zonecode: string
}

const UserOnBoardForm: FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isPostOpen, setIsPostOpen] = useState(false)

  const toastShownRef = useRef(false)

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<OnBoardFormValue>({ mode: 'onChange' })

  // 다음 단계로 이동
  const handleNext = () => {
    const { realName, birth } = getValues()

    if (!realName || !birth) {
      alert('이름과 생년월일을 입력하세요.')
      return
    }
    setStep(2)
  }

  // 이전 단계로 이동
  const handlePrev = () => {
    setStep(1)
  }

  // 최종 제출 요청
  const handleSubmit = async () => {
    const values = getValues()

    if (toastShownRef.current) return

    try {
      await OnBoardUser(values)

      toastShownRef.current = true

      showSuccessToast('온보딩이 완료되었습니다!') // main 페이지로 이동해도 onboared 여부는 false로 유지됨.

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err: any) {
      const status = err.response?.status

      if (status === 409) {
        toastShownRef.current = true
        showErrorToast('이미 온보딩이 완료된 사용자입니다!\n잠시 뒤 홈으로 이동합니다.')

        setTimeout(() => {
          navigate('/')
        }, 2000)
        return
      } else {
        toastShownRef.current = true
        showErrorToast('온보딩 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }
  }

  return (
    <>
      {/* ===== 기존 화면 ===== */}
      <div className="flex flex-col justify-center w-3/5 text-center bg-gray-50 p-14 rounded-r-3xl">
        <div className="mb-10">
          <h1 className="mb-4 text-5xl font-semibold">정보 입력</h1>
        </div>

        {step === 1 && (
          <form className="flex flex-col">
            <FormInput
              label="사용자 이름"
              name="realName"
              placeholder="실명을 입력하세요"
              type="text"
              value={register}
              rules={{ required: true }}
              error={errors.realName}
            />

            <FormInput
              label="생년월일"
              name="birth"
              type="date"
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
              value={register}
              rules={{ required: '생년월일을 입력하세요.' }}
              error={errors.birth}
            />

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
                  label="우편번호"
                  name="zonecode"
                  placeholder="우편번호"
                  type="text"
                  value={register}
                  rules={{ required: true }}
                  error={errors.zonecode}
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="relative w-[500px] h-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsPostOpen(false)}
                    className="absolute text-gray-500 top-3 right-3 hover:text-black">
                    ✕
                  </button>

                  <DaumPostcode
                    style={{ width: '100%', height: '100%' }}
                    onComplete={data => {
                      setValue('zonecode', data.zonecode)
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
    </>
  )
}

export default UserOnBoardForm
