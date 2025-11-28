import type { FC } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { registerUser, loginUser } from '../api'
// import { register } from 'module'

type LoginFormProps = {
  isLoggedIn: boolean
}

const LoginForm: FC<LoginFormProps> = ({ isLoggedIn }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type') || 'personal'
  const [registerFormData, setRegisterFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    roleCode: `${type === 'company' ? '2' : '1'}`,
  })
  const [loginFormData, setLoginFormData] = useState({
    id: '',
    password: '',
  })

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setRegisterFormData(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setLoginFormData(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const requestBody = registerFormData
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const requestBody = loginFormData
    console.log('로그인 요청 본문:', requestBody)

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

  const inputMarginStyle = `flex flex-col items-start w-full mb-${!isLoggedIn ? '4' : '6'}`

  const headerTitle =
    type === 'company'
      ? isLoggedIn
        ? '기업-로그인'
        : '기업-회원가입'
      : isLoggedIn
      ? '로그인'
      : '회원가입'

  const headerDesc = isLoggedIn
    ? '계정에 로그인하여 시작하세요'
    : '회원가입을 통해 서비스를 시작하세요'

  return (
    <div className="flex flex-col justify-center w-3/5 text-center bg-gray-50 p-14 rounded-r-3xl">
      {/* 헤더 */}
      <div className={`mb-${isLoggedIn ? '10' : '4'}`}>
        <h1 className="mb-4 text-5xl font-semibold">{headerTitle}</h1>
        <p className="text-gray-400">{headerDesc}</p>
      </div>

      {/* 폼 시작 */}
      <div className="flex flex-col">
        {!isLoggedIn && (
          <>
            {/* 회원가입 입력란 */}
            <div className={inputMarginStyle}>
              <label className="mb-2" htmlFor="username">
                아이디
              </label>
              <input
                className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                id="username"
                type="text"
                value={registerFormData.username}
                placeholder="아이디를 입력하세요"
                onChange={handleRegisterChange}
              />
            </div>

            <div className={inputMarginStyle}>
              <label className="mb-2" htmlFor="email">
                이메일
              </label>
              <input
                className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                id="email"
                type="email"
                value={registerFormData.email}
                placeholder="이메일을 입력하세요"
                onChange={handleRegisterChange}
              />
            </div>

            <div className={inputMarginStyle}>
              <label className="mb-2" htmlFor="phone">
                전화번호
              </label>
              <input
                className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                id="phone"
                type="text"
                value={registerFormData.phone}
                placeholder="전화번호를 입력하세요"
                onChange={handleRegisterChange}
              />
            </div>

            <div className={inputMarginStyle}>
              <label className="mb-2" htmlFor="password">
                비밀번호
              </label>
              <input
                className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                id="password"
                type="password"
                value={registerFormData.password}
                placeholder="비밀번호를 입력하세요"
                onChange={handleRegisterChange}
              />
            </div>
          </>
        )}

        {/* 로그인 폼 */}
        {isLoggedIn && (
          <>
            <div className={inputMarginStyle}>
              <label className="mb-2" htmlFor="id">
                아이디
              </label>
              <input
                className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                id="id"
                type="text"
                value={loginFormData.id}
                placeholder="아이디를 입력하세요"
                onChange={handleLoginChange}
              />
            </div>
            <div className={inputMarginStyle}>
              <label className="mb-2" htmlFor="password">
                비밀번호
              </label>
              <input
                className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                id="password"
                type="password"
                value={loginFormData.password}
                placeholder="비밀번호를 입력하세요"
                onChange={handleLoginChange}
              />
            </div>
          </>
        )}

        {/* 버튼 및 링크 */}
        {!isLoggedIn ? (
          <>
            <div className="mt-6">
              <button
                onClick={handleRegister}
                className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                회원가입
              </button>
            </div>
            <span className="mt-6">
              계정이 있으신가요?{' '}
              <a href={`/login?type=${type}`} className="text-blue-500 hover:underline">
                로그인
              </a>
            </span>
          </>
        ) : (
          <>
            {/* 로그인 영역 */}
            <div className="mt-6">
              <button
                onClick={handleLogin}
                className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                로그인
              </button>
            </div>
            <span className="mt-6">
              계정이 없으신가요?{' '}
              <a href={`/register?type=${type}`} className="text-blue-500 hover:underline">
                회원가입
              </a>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginForm
