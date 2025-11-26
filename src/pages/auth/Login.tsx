import { useState, useEffect, type FC } from 'react'
import { useLocation } from 'react-router-dom'

import LoginIntro from '@/components/LoginIntro'
import LoginForm from '@/components/LoginForm'

const Login: FC = () => {
  const location = useLocation()
  const [isActive, setIsActive] = useState(location.state?.register ?? false)

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [location.pathname])

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gray-200">
      <div className="z-10 flex shadow-2xl/40 w-6/9 rounded-3xl h-6/7">
        {/* 왼쪽 섹션 */}
        <LoginIntro />

        {/* 오른쪽 섹션 */}
        <LoginForm isActive={isActive} />
      </div>
      <div className="absolute z-0 rotate-45 bg-purple-600 -bottom-80 -left-100 w-200 aspect-square" />
      <div className="absolute z-0 rotate-45 rounded-full bg-turquoise -top-80 -right-100 w-200 aspect-square" />
    </div>
  )
}

export default Login
