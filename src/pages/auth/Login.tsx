import type { FC } from 'react'
import { useLocation } from 'react-router-dom'

import AuthBackground from '@/components/AuthBackground'
import LoginForm from '@/components/LoginForm'
import AuthIntro from '@/components/AuthIntro'

const Login: FC = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type') || 'personal'

  return (
    <AuthBackground>
      <AuthIntro
        img={'/logo_white.svg'}
        title={'만나서 반가워요!'}
        description={'당신이 누군지 저희에게 알려주세요!'}
      />
      <LoginForm type={type} />
    </AuthBackground>
  )
}

export default Login
