import type { FC } from 'react'

import AuthBackground from '@/components/AuthBackground'
import LoginForm from '@/components/LoginForm'
import AuthIntro from '@/components/AuthIntro'

const Register: FC = () => {
  return (
    <AuthBackground>
      <AuthIntro
        img={'./public/logo(white).svg'}
        title={'만나서 반가워요!'}
        description={'당신이 누군지 저희에게 알려주세요!'}
      />
      <LoginForm isLoggedIn={false} />
    </AuthBackground>
  )
}

export default Register
