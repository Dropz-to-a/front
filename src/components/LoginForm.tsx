import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FormInput } from './FormInput'

import { loginUser } from '../api'

type LoginFormValue = {
  id: string
  password: string
}

const LoginForm: FC = () => {
  const navigate = useNavigate()

  const handleLogin = async () => {
    const { id, password } = getValues()
    const requestBody: LoginFormValue = {
      id,
      password,
    }

    try {
      const response = await loginUser(requestBody)
      console.log('로그인 성공:', response.data)
      navigate('/')
      alert('로그인에 성공했습니다!')
    } catch (err) {
      console.error('로그인 실패:', err)
      alert('아이디 또는 비밀번호를 확인해주세요.')
    }
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<LoginFormValue>({ mode: 'onChange' })

  return (
    <div className="flex flex-col justify-center w-3/5 text-center bg-gray-50 p-14 rounded-r-3xl">
      {/* 헤더 */}
      <div className={`mb-10`}>
        <h1 className="mb-4 text-5xl font-semibold">로그인</h1>
        <p className="text-gray-400">계정에 로그인하여 시작하세요</p>
      </div>

      {/* 폼 시작 */}
      <form className="flex flex-col" onSubmit={handleSubmit(handleLogin)}>
        {/* 로그인 폼 */}
        <FormInput
          label="아이디"
          name="id"
          placeholder="아이디를 입력하세요"
          type="text"
          register={register}
          rules={{
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: '아이디는 영문자와 숫자만 사용할 수 있습니다.',
            },
          }}
          error={errors.id}
        />

        {/* 비밀번호 */}
        <FormInput
          label="비밀번호"
          name="password"
          placeholder="비밀번호를 입력하세요"
          type="password"
          register={register}
          rules={{
            required: true,
            minLength: {
              value: 8,
              message: '비밀번호는 최소 8자 이상이어야 합니다.',
            },
          }}
          error={errors.password}
        />

        {/* 버튼 및 링크 */}
        <div className="mt-2">
          <input
            type="submit"
            value="로그인"
            className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          />
        </div>
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
