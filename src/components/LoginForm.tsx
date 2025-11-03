import type { FC } from 'react'
import { useLocation } from 'react-router-dom'

import CompanyRegister from '../pages/CompanyRegister'

type LoginFormProps = {
  isLogin: boolean
}

const LoginForm: FC<LoginFormProps> = ({ isLogin }) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type') || 'personal' // 기본값: personal

  const inputMarginStyle = `flex flex-col items-start w-full mb-${!isLogin ? '4' : '6'}`

  const headerTitle =
    type === 'company' ? (isLogin ? '기업-로그인' : '') : isLogin ? '로그인' : '회원가입'

  const headerDesc = isLogin
    ? '계정에 로그인하여 시작하세요'
    : type === 'company'
    ? '지원자 모집부터 재직자 관리까지 한번에!'
    : '회원가입하여 JOBIT을 시작하세요'

  return (
    <div className="w-3/5 text-center bg-gray-200 p-14 rounded-r-3xl">
      {/* 헤더 */}
      <div className={`mb-${isLogin ? '10' : '4'}`}>
        <h1 className="mb-4 text-5xl font-semibold">{headerTitle}</h1>
        <p className="text-gray-400">{headerDesc}</p>
      </div>

      {/* 폼 시작 */}
      <div className="flex flex-col">
        {!isLogin && (
          <>
            {type === 'company' ? (
              <>
                {/* 기업 회원가입 입력란 */}
                <CompanyRegister />
              </>
            ) : (
              <>
                {/* 개인 회원가입 입력란 */}
                <div className={inputMarginStyle}>
                  <label className="mb-2" htmlFor="name">
                    이름
                  </label>
                  <input
                    className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                    id="name"
                    type="text"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                <div className={inputMarginStyle}>
                  <label className="mb-2" htmlFor="id">
                    아이디
                  </label>
                  <input
                    className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                    id="id"
                    type="text"
                    placeholder="아이디를 입력하세요"
                  />
                </div>

                <div className={inputMarginStyle}>
                  <label className="mb-2" htmlFor="pw">
                    비밀번호
                  </label>
                  <input
                    className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                    id="pw"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
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
                    placeholder="이메일을 입력하세요"
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* 로그인 폼 */}
        {isLogin && (
          <>
            {type === 'company' ? (
              <div className={inputMarginStyle}>
                <label className="mb-2" htmlFor="biznum">
                  사업자등록번호
                </label>
                <input
                  className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                  id="biznum"
                  type="text"
                  placeholder="사업자등록번호를 입력하세요"
                />
              </div>
            ) : (
              <div className={inputMarginStyle}>
                <label className="mb-2" htmlFor="id">
                  아이디
                </label>
                <input
                  className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                  id="id"
                  type="text"
                  placeholder="아이디를 입력하세요"
                />
              </div>
            )}

            <div className={inputMarginStyle}>
              <label className="mb-2" htmlFor="pw">
                비밀번호
              </label>
              <input
                className="w-full h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                id="pw"
                type="password"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
          </>
        )}

        {/* 버튼 및 링크 */}
        {isLogin ? (
          <>
            {/* 로그인 상태 유지 */}
            <div className="flex justify-between mt-4 mb-4">
              <div>
                <input type="checkbox" id="remember" className="mr-1" />
                <label htmlFor="remember" className="text-gray-400">
                  로그인 상태 유지
                </label>
              </div>
              <a href="#" className="text-blue-500">
                비밀번호 찾기
              </a>
            </div>
            <div className="mt-6">
              <button className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
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
        ) : (
          <>
            <div className="mt-6">
              <button className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
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
        )}
      </div>
    </div>
  )
}

export default LoginForm
