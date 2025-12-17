import type { FC } from 'react'
import { useLocation } from 'react-router'

import AuthBackground from '@/components/AuthBackground'
import RegisterForm from '@/components/RegisterForm'
import AuthIntro from '@/components/AuthIntro'
import JobitLogo from '@/../public/logo_white.svg'

const Register: FC = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type') || 'personal'

  return (
    <AuthBackground>
      <AuthIntro
        img={JobitLogo}
        title={'만나서 반가워요!'}
        description={'당신이 누군지 저희에게 알려주세요!'}
      />
      <RegisterForm type={type} />
    </AuthBackground>
  )
}

export default Register
