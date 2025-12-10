import type { FC } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { FormInput } from './FormInput'
import { registerUser } from '../api'

type RegisterFormValue = {
  username: string
  email: string
  phone: string
  password: string
  roleCode: string
}

const RegisterForm: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type') || 'personal'

  const handleRegister = async () => {
    const { username, email, phone, password } = getValues()
    const requestBody: RegisterFormValue = {
      username,
      email,
      phone,
      password,
      roleCode: type === 'company' ? 'ROLE_COMPANY' : 'ROLE_USER',
    }

    console.log('회원가입 요청 본문:', requestBody)

    try {
      const response = await registerUser(requestBody)
      console.log('회원가입 성공:', response.data)
      navigate(`/login?type=${type}`)
      alert('회원가입에 성공했습니다! 로그인해주세요.')
    } catch (err) {
      console.error('회원가입 실패:', err)
      alert('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormValue>({ mode: 'onChange' })

  return (
    <div className="flex flex-col justify-center w-3/5 text-center bg-gray-50 p-14 rounded-r-3xl">
      {/* 헤더 */}
      <div className="mb-4">
        <h1 className="mb-4 text-5xl font-semibold">회원가입</h1>
        <p className="text-gray-400">회원가입을 통해 서비스를 시작하세요</p>
      </div>

      {/* 폼 시작 */}
      <form className="flex flex-col" onSubmit={handleSubmit(handleRegister)}>
        <FormInput
          label="아이디"
          name="username"
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
          error={errors.username}
        />

        <FormInput
          label="이메일"
          name="email"
          placeholder="이메일을 입력하세요"
          type="email"
          register={register}
          rules={{
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '유효한 이메일 주소를 입력하세요.',
            },
          }}
          error={errors.email}
        />

        <FormInput
          label="전화번호"
          name="phone"
          placeholder="전화번호를 입력하세요"
          type="tel"
          register={register}
          rules={{
            required: true,
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: '유효한 전화번호를 입력하세요.',
            },
          }}
          error={errors.phone}
        />

        <FormInput
          label="비밀번호"
          name="password"
          placeholder="비밀번호를 입력하세요"
          type="password"
          register={register}
          rules={{
            required: true,
            minLength: {
              value: 2,
              message: '비밀번호는 최소 2자 이상이어야 합니다.',
            },
          }}
          error={errors.password}
        />

        {/* 버튼 및 링크 */}
        <div className="mt-6">
          <input
            type="submit"
            value="회원가입"
            className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          />
        </div>
        <span className="mt-6">
          계정이 있으신가요?{' '}
          <a href={`/login?type=${type}`} className="text-blue-500 hover:underline">
            로그인
          </a>
        </span>
      </form>
    </div>
  )
}

export default RegisterForm
