import type { FC } from 'react'

import AuthBackground from '@/components/AuthBackground'
import LoginForm from '@/components/LoginForm'
import AuthIntro from '@/components/AuthIntro'
import JobitLogo from '@/../public/logo(white).svg'

const Login: FC = () => {
  return (
    <AuthBackground>
      <AuthIntro
        img={JobitLogo}
        title={'만나서 반가워요!'}
        description={'당신이 누군지 저희에게 알려주세요!'}
      />
      <LoginForm />
    </AuthBackground>
  )
}

export default Login
