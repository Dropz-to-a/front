import { useState, useEffect, type FC } from 'react'
import { useLocation } from 'react-router-dom'
import HighLight from '../assets/highlight.png'
import HighLight2 from '../assets/highlight2.png'

import LoginForm from '../components/LoginForm'

const Login: FC = () => {
  const location = useLocation()
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
  }, [location.pathname])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex w-6/9 rounded-3xl h-5/7">
        {/* 왼쪽 섹션 */}
        <div className="overflow-hidden text-white w-5/7">
          <div className="w-full h-full flex flex-col items-start justify-center rounded-l-3xl p-12 bg-[linear-gradient(30deg,#0000FF,#A3A3ED)]">
            <h1 className="mb-16 mr-10 italic font-bold text-7xl">Welcome</h1>
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-semibold leading-8">
                기업{' '}
                <span className="relative inline-block">
                  <img
                    className="absolute inset-0 z-0 object-contain w-full h-full"
                    src={HighLight}
                    alt=""
                  />
                  <span className="relative z-10 text-3xl text-blue-500">정보</span>
                </span>
                부터
              </p>
              <p className="text-3xl font-semibold leading-8">
                취업 후{' '}
                <span className="relative inline-block">
                  <img
                    className="absolute inset-0 z-0 object-contain w-full h-full"
                    src={HighLight2}
                    alt=""
                  />
                  <span className="relative z-10 text-3xl text-blue-500">관리</span>
                </span>
                까지 한 번에!
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <LoginForm isLogin={isLogin} />
      </div>
    </div>
  )
}

export default Login
