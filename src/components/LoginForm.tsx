import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FormInput } from './FormInput'
import { useAppDispatch, useAppSelector } from '@/store'
import { loginThunk } from '@/features/auth/authSlice'
//api 호출 대신 thunk 사용해서 값 불러옴 
type LoginFormValue = {
  id: string
  password: string
}

const LoginForm: FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // (선택) auth 상태로 로딩/에러 표시하고 싶을 때
  const { loading, error } = useAppSelector(state => state.auth)

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<LoginFormValue>({ mode: 'onChange' })

  const handleLogin = async () => {
    const { id, password } = getValues()
    const result = await dispatch(loginThunk({ id, password }))

    if (loginThunk.fulfilled.match(result)) {
      const userType = result.payload.userType
      navigate(userType === 'company' ? '/company/onboarding' : '/user/onboarding', { replace: true })
    } else {
      alert(error ?? '로그인 실패')
    }
  }

  return (
    <div className="flex flex-col justify-center w-3/5 text-center bg-gray-50 p-14 rounded-r-3xl">
      <div className="mb-10">
        <h1 className="mb-4 text-5xl font-semibold">로그인</h1>
        <p className="text-gray-400">계정에 로그인하여 시작하세요</p>
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit(handleLogin)}>
        <FormInput
          label="아이디"
          name="id"
          placeholder="아이디를 입력하세요"
          type="text"
          value={register}
          rules={{
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: '아이디는 영문자와 숫자만 사용할 수 있습니다.',
            },
          }}
          error={errors.id}
        />

        <FormInput
          label="비밀번호"
          name="password"
          placeholder="비밀번호를 입력하세요"
          type="password"
          value={register}
          rules={{
            required: true,
            minLength: { value: 2, message: '비밀번호는 최소 2자 이상이어야 합니다.' },
          }}
          error={errors.password}
        />

        <div className="mt-2">
          <input
            type="submit"
            value={loading ? '로그인 중...' : '로그인'}
            disabled={loading}
            className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-60"
          />
        </div>

        {/* (선택) 에러 문구 */}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <span className="mt-6">
          계정이 없으신가요?{' '}
          <a href={`/register`} className="text-blue-500 hover:underline">
            회원가입
          </a>
        </span>
      </form>
    </div>
  )
}

export default LoginForm
