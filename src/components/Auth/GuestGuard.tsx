import React from 'react'
import { useNavigate } from 'react-router-dom'
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
  const token = useAppSelector(s => s.auth.token)
  const onboarded = useAppSelector(s => s.auth.onboarded)
  const userType = useAppSelector(s => s.auth.userType)
  
  // 로그인 페이지나 회원가입 페이지는 로그인된 사용자 접근 불가
  if (token) {
    console.log('[GuestGuard] 로그인된 사용자 접근 차단, 온보딩 상태:', onboarded)
    
    // 온보딩 완료된 사용자는 홈으로
    if (onboarded === true) {
      console.log('[GuestGuard] 온보딩 완료 → 홈으로 리디렉션')
      navigate('/', { replace: true })
      return null
    }
    
    // 온보딩 미완료 사용자는 온보딩 페이지로 (현재 온보딩 페이지에 있으면 통과)
    const currentPath = window.location.pathname
    const isOnboardingPage = currentPath === '/user/onboarding' || currentPath === '/company/onboarding'
    
    if (!isOnboardingPage) {
      const onboardingPath = userType === 'company' ? '/company/onboarding' : '/user/onboarding'
      console.log('[GuestGuard] 온보딩 미완료 → 온보딩 페이지로 리디렉션:', onboardingPath)
      navigate(onboardingPath, { replace: true })
      return null
    }
  }
  
  return <>{children}</>
}

export default GuestGuard
