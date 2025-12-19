import { useEffect } from 'react'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'

import AuthBackground from '@/components/AuthBackground'
import AuthIntro from '@/components/AuthIntro'
import CompanyOnBoardForm from './CompanyOnBoardForm'

const CompanyOnBoard: FC = () => {
  const navigate = useNavigate()
  const onboarded = useAppSelector((s) => s.auth.onboarded)

  // 뒤로가기 방지
  useEffect(() => {
    // 브라우저 뒤로가기 버튼 방지
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      // 히스토리에 현재 페이지를 다시 추가하여 뒤로가기 무효화
      window.history.pushState(null, '', window.location.href)
    }

    // 히스토리에 현재 상태 추가
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  // 온보딩 완료 시 홈으로 리디렉션
  useEffect(() => {
    if (onboarded === true) {
      navigate('/', { replace: true })
    }
  }, [onboarded, navigate])

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
