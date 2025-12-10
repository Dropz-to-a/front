import { useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FormInput } from './FormInput'
import { OnBoardUser } from '../api'

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

  const {
    register,
    formState: { errors },
    getValues,
  } = useForm<OnBoardFormValue>({ mode: 'onChange' })

  /** STEP 1 -> STEP 2 이동 */
  const handleNext = () => {
    const { realName, birth } = getValues()

    if (!realName || !birth) {
      alert('이름과 생년월일을 입력하세요.')
      return
    }

    setStep(2)
  }

  /** STEP 2 -> STEP 1 이동 */
  const handlePrev = () => {
    setStep(1)
  }

  /** 최종 제출 요청 */
  const handleSubmit = async () => {
    const values = getValues()

    try {
      await OnBoardUser(values)
      alert('온보딩이 완료되었습니다!')
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('요청에 실패했습니다.')
    }
  }

  return (
    <div className="flex flex-col justify-center w-3/5 text-center bg-gray-50 p-14 rounded-r-3xl">
      <div className="mb-10">
        <h1 className="mb-4 text-5xl font-semibold">정보 입력</h1>
      </div>

      {/* STEP 1 --------------------------- */}
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
            placeholder="생년월일을 입력하세요"
            value={register}
            rules={{ required: true }}
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

      {/* STEP 2 --------------------------- */}
      {step === 2 && (
        <form className="flex flex-col">
          <FormInput
            label="우편번호"
            name="zonecode"
            placeholder="우편번호"
            type="text"
            value={register}
            rules={{ required: true }}
            error={errors.zonecode}
          />

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
        </form>
      )}
    </div>
  )
}

export default UserOnBoardForm
