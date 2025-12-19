import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'

interface GuestGuardProps {
  children: React.ReactNode
}

/*
 * 비로그인 전용 페이지 보호 (로그인 상태면 접근 불가 → 이전 페이지로 이동)
 * 단, 온보딩 페이지는 로그인된 사용자가 온보딩 미완료 상태일 때만 접근 가능
 */
const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const token = useAppSelector(s => s.auth.token)
  const onboarded = useAppSelector(s => s.auth.onboarded)
  const userType = useAppSelector(s => s.auth.userType)

  useEffect(() => {
    if (!token) return

    // 1️⃣ 온보딩 완료 → 홈
    if (onboarded === true) {
      if (location.pathname !== '/') {
        navigate('/', { replace: true })
      }
      return
    }

    // 2️⃣ 온보딩 미완료 → 온보딩
    if (onboarded === false) {
      const onboardingPath = userType === 'company' ? '/company/onboarding' : '/user/onboarding'

      if (location.pathname !== onboardingPath) {
        navigate(onboardingPath, { replace: true })
      }
    }
  }, [token, onboarded, userType, location.pathname, navigate])

  return <>{children}</>
}

export default GuestGuard
