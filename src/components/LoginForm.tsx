import type { FC } from 'react'

type LoginFormProps = {
  isLogin: boolean
}

const LoginForm: FC<LoginFormProps> = ({ isLogin }) => {
  const inputMarginStyle: string = `flex flex-col items-start w-full mb-${!isLogin ? '4' : '6'}`

  return (
    <div className="w-3/5 text-center bg-gray-200 p-14 rounded-r-3xl">
      {/* 로그인 헤더 */}
      <div className={`mb-${isLogin ? '10' : '4'}`}>
        <h1 className="mb-4 text-5xl font-semibold">{isLogin ? '로그인' : '회원가입'}</h1>
        <p className="text-gray-400">
          {isLogin ? '계정에 로그인하여 시작하세요' : '회원가입하여 JOBIT을 시작하세요'}
        </p>
      </div>
      {/* 로그인 폼 */}
      <div className="flex flex-col">
        {/* 이름 입력란 */}
        {!isLogin && (
          <div className={`${inputMarginStyle}`}>
            <label className="mb-2" htmlFor="name">
              이름
            </label>
            <div className="flex justify-center w-full">
              <input
                className="w-[calc(100%-1rem)] h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                type="text"
                id="name"
                placeholder="이름을 입력하세요"
              />
            </div>
          </div>
        )}
        {/* 아이디 입력란 */}
        <div className={`${inputMarginStyle}`}>
          <label className="mb-2" htmlFor="id">
            아이디
          </label>
          <div className="flex justify-center w-full">
            <input
              className="w-[calc(100%-1rem)] h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
              type="text"
              id="id"
              placeholder="아이디를 입력하세요"
            />
          </div>
        </div>
        {/* 비밀번호 입력란 */}
        <div className={`${inputMarginStyle}`}>
          <label className="mb-2" htmlFor="pw">
            비밀번호
          </label>
          <div className="flex justify-center w-full">
            <input
              className="w-[calc(100%-1rem)] h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
              type="text"
              id="pw"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
        </div>
        {/* 이메일 입력란 */}
        {!isLogin && (
          <div className={`${inputMarginStyle}`}>
            <label className="mb-2" htmlFor="email">
              이메일
            </label>
            <div className="flex justify-center w-full">
              <input
                className="w-[calc(100%-1rem)] h-12 p-2 bg-white border-2 border-gray-300 rounded-lg"
                type="email"
                id="email"
                placeholder="이메일을 입력하세요"
              />
            </div>
          </div>
        )}
        {/* 로그인 상태 유지 및 비밀번호 찾기 */}
        {isLogin && (
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
        )}
        {/* 로그인 버튼 및 회원가입 / 로그인 링크 */}
        {isLogin ? (
          <>
            <div className="mt-6">
              <button className="w-full h-12 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                로그인
              </button>
            </div>
            <span className="mt-6">
              계정이 없으신가요?{' '}
              <a href="/register" className="text-blue-500">
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
