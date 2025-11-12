import { useForm, type SubmitHandler } from 'react-hook-form'

type salaryNumber =
  | '2000만원'
  | '2500만원'
  | '3000만원'
  | '3500만원'
  | '4000만원'
  | '4500만원'
  | '5000만원 이상'

type career = '신입' | '1~3년' | '4~6년' | '7년 이상'

interface IFormInput {
  ageRequired: number
  salary: salaryNumber
  career: career
}

export default function TestUserOnboarding() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: 'onBlur',
    defaultValues: {
      career: '신입',
      salary: '3000만원',
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = data => {
    console.log(data)
    alert('제출이 완료되었습니다!')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          사용자 온보딩
        </h2>

        {/* 나이 */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">나이</label>
          <input
            type="number"
            placeholder="예: 25"
            {...register('ageRequired', { required: true, valueAsNumber: true, min: 15 })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {errors.ageRequired && (
            <p className="mt-1 text-sm text-red-500">이 입력칸은 비울 수 없습니다.</p>
          )}
        </div>

        {/* 경력 */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">경력</label>
          <select
            {...register('career', { required: true })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <option value="신입">신입</option>
            <option value="1~3년">1~3년</option>
            <option value="4~6년">4~6년</option>
            <option value="7년 이상">7년 이상</option>
          </select>
        </div>

        {/* 희망 연봉 */}
        <div>
          <label className="block mb-1 font-medium text-gray-600">희망 연봉</label>
          <select
            {...register('salary', { required: true })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <option value="2000만원">2000만원</option>
            <option value="2500만원">2500만원</option>
            <option value="3000만원">3000만원</option>
            <option value="3500만원">3500만원</option>
            <option value="4000만원">4000만원</option>
            <option value="4500만원">4500만원</option>
            <option value="5000만원 이상">5000만원 이상</option>
          </select>
        </div>

        {/* 제출 */}
        <button
          type="submit"
          className="w-full py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
          제출
        </button>
      </form>
    </div>
  )
}
