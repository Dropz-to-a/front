import { useState, useEffect, type FC } from 'react'
import { useLocation } from 'react-router-dom'

import AuthBackground from '@/components/AuthBackground'
import LoginForm from '@/components/LoginForm'
import AuthIntro from '@/components/AuthIntro'

const Login: FC = () => {
  const location = useLocation()
  const [isLoggedIn, setLoggedIn] = useState(location.state?.register ?? false)

  useEffect(() => {
    if (location.pathname === '/login') {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  }, [location.pathname])

  return (
    <AuthBackground>
      <AuthIntro
        img={'./public/logo(white).svg'}
        title={'만나서 반가워요!'}
        description={'당신이 누군지 저희에게 알려주세요!'}
      />
      <LoginForm isLoggedIn={isLoggedIn} />
    </AuthBackground>
  )
}

export default Login
