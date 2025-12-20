import { useRef, type FC } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { FormInput } from './FormInput'
import { registerUser } from '../api'

import { showSuccessToast, showErrorToast } from '@/components/Toast/toast'

type RegisterFormValue = {
  username: string
  email: string
  phone: string // 화면에 보이는 값은 010-xxxx-xxxx 형태
  password: string
  roleCode: string
}

// 숫자만 남기기
const onlyDigits = (v: string) => v.replace(/\D/g, '')

// 자동 하이픈 포맷 (010-1234-5678 / 010-123-4567 모두 대응)
const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11) //  최대 11자리 제한

  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const RegisterForm: FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type') || 'personal'

  const toastShownRef = useRef(false)

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<RegisterFormValue>({ mode: 'onChange' })

  //  phone 입력값이 바뀔 때마다 하이픈 자동 적용
  const phoneWatch = watch('phone')
  useEffect(() => {
    if (phoneWatch == null) return
    const formatted = formatPhone(phoneWatch)
    if (phoneWatch !== formatted) {
      setValue('phone', formatted, { shouldValidate: true, shouldDirty: true })
    }
  }, [phoneWatch, setValue])

  const handleRegister = async () => {
    const { username, email, phone, password } = getValues()

    if (toastShownRef.current) return

    const requestBody: RegisterFormValue = {
      username,
      email,
      phone: onlyDigits(phone), //  백엔드로는 숫자만 보냄
      password,
      roleCode: type === 'company' ? 'ROLE_COMPANY' : 'ROLE_USER',
    }

    console.log('회원가입 요청 본문:', requestBody)

    try {
      const response = await registerUser(requestBody)
      console.log('회원가입 성공:', response.data)
      toastShownRef.current = true
      showSuccessToast('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.')
      navigate(`/login?type=${type}`)
    } catch (err) {
      console.error('회원가입 실패:', err)
      toastShownRef.current = true
      showErrorToast('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="flex flex-col justify-center w-3/5 text-center bg-gray-50 p-14 rounded-r-3xl">
      <div className="mb-4">
        <h1 className="mb-4 text-5xl font-semibold">회원가입</h1>
        <p className="text-gray-400">회원가입을 통해 서비스를 시작하세요</p>
      </div>

      <form className="flex flex-col" onSubmit={handleSubmit(handleRegister)}>
        <FormInput
          label="아이디"
          name="username"
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
          error={errors.username}
        />

        <FormInput
          label="이메일"
          name="email"
          placeholder="이메일을 입력하세요"
          type="email"
          value={register}
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
          placeholder="010-1234-5678"
          type="tel"
          value={register}
          rules={{
            required: true,
            // ✅ 하이픈 포함한 길이 제한 (최대: 010-1234-5678 = 13)
            maxLength: { value: 13, message: '전화번호가 너무 깁니다.' },
            // ✅ 숫자만 10~11자리여야 함 (전송용 기준)
            validate: (v: string) => {
              const digits = onlyDigits(v)
              return (
                digits.length === 10 ||
                digits.length === 11 ||
                '유효한 전화번호(10~11자리)를 입력하세요.'
              )
            },
          }}
          error={errors.phone}
        />

        <FormInput
          label="비밀번호"
          name="password"
          placeholder="비밀번호를 입력하세요"
          type="password"
          value={register}
          rules={{
            required: true,
            minLength: {
              value: 2,
              message: '비밀번호는 최소 2자 이상이어야 합니다.',
            },
          }}
          error={errors.password}
        />

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
