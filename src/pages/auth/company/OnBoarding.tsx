import type { FC } from 'react'

import AuthBackground from '@/components/AuthBackground'
import AuthIntro from '@/components/AuthIntro'
import CompanyOnBoardForm from './CompanyOnBoardForm'

const CompanyOnBoard: FC = () => {
  return (
    <AuthBackground>
      <AuthIntro
        img={'/Company.png'}
        title={'기업에 대해서 알려주세요!'}
        description={'기업 정보는 저희가 안전하게 보관할게요.'}
      />
      <CompanyOnBoardForm />
    </AuthBackground>
  )
}

export default CompanyOnBoard
