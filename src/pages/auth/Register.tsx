import type { FC } from 'react'

import AuthBackground from '@/components/AuthBackground'
import RegisterForm from '@/components/RegisterForm'
import AuthIntro from '@/components/AuthIntro'
import JobitLogo from '@/../public/logo(white).svg'

const Register: FC = () => {
  return (
    <AuthBackground>
      <AuthIntro
        img={JobitLogo}
        title={'만나서 반가워요!'}
        description={'당신이 누군지 저희에게 알려주세요!'}
      />
      <RegisterForm />
    </AuthBackground>
  )
}

export default Register
