import type { FC } from 'react'

import AuthBackground from '@/components/AuthBackground'
import AuthIntro from '@/components/AuthIntro'
import UserOnBoardForm from '@/pages/auth/user/UserOnBoardForm'

const UserOnBoard: FC = () => {
  return (
    <AuthBackground>
      <AuthIntro
        img={'/Survey.png'}
        title={'사용자님에 대해서 알려주세요!'}
        description={'사용자님 정보는 저희가 안전하게 보관할게요.'}
      />
      <UserOnBoardForm />
    </AuthBackground>
  )
}

export default UserOnBoard
