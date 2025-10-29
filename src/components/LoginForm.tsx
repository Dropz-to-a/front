import type { FC } from 'react'

type LoginFormProps = {
  isLogin: boolean
}

const LoginForm: FC<LoginFormProps> = ({ isLogin }) => {
  return (
    <div className="w-3/5 text-center bg-gray-200 p-14 rounded-r-3xl">
      {/* 로그인 헤더 */}
      <div className="mb-10">
        <h1 className="mb-4 text-5xl font-semibold">{isLogin ? '로그인' : '회원가입'}</h1>
        <p className="text-gray-400">
          {isLogin ? '계정에 로그인하여 시작하세요' : '회원가입하여 JOBIT을 시작하세요'}
        </p>
      </div>
      {/* 로그인 폼 */}
      <div className="flex flex-col">
        {/* 아이디 입력란 */}
        <div className="flex flex-col items-start w-full mb-6">
          <label className="mb-4" htmlFor="id">
            아이디
          </label>
          <div className="flex justify-center w-full">
            <input
              className="h-12 p-2 bg-white border-2 border-gray-300 rounded-lg w-12/13"
              type="text"
              id="id"
              placeholder="아이디를 입력하세요"
            />
          </div>
        </div>
        {/* 비밀번호 입력란 */}
        <div className="flex flex-col items-start w-full mb-6">
          <label className="mb-4" htmlFor="pw">
            비밀번호
          </label>
          <div className="flex justify-center w-full">
            <input
              className="h-12 p-2 bg-white border-2 border-gray-300 rounded-lg w-12/13"
              type="text"
              id="pw"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
        </div>
        {/* 이메일 입력란 */}
        {!isLogin && (
          <div className="flex flex-col items-start w-full mb-12">
            <label className="mb-4" htmlFor="email">
              이메일
            </label>
            <div className="flex justify-center w-full">
              <input
                className="h-12 p-2 bg-white border-2 border-gray-300 rounded-lg w-12/13"
                type="email"
                id="email"
                placeholder="아이디를 입력하세요"
              />
            </div>
          </div>
        )}
        {/* 로그인 상태 유지 및 비밀번호 찾기 */}
        {isLogin && (
          <div className="flex justify-between mb-10">
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
        )}
        {/* 로그인 버튼 및 회원가입 / 로그인 링크 */}
        {isLogin ? (
          <>
            <div className="mb-6">
              <button className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                로그인
              </button>
            </div>
            <span>
              계정이 없으신가요?{' '}
              <a href="/register" className="text-blue-500">
                회원가입
              </a>
            </span>
          </>
        ) : (
          <>
            <div className="mb-6">
              <button className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                회원가입
              </button>
            </div>
            <span>
              계정이 있으신가요?{' '}
              <a href="/login" className="text-blue-500">
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
