import React from 'react'
import { useAppSelector } from '@/store'

interface GuestGuardProps {
  children: React.ReactNode
}

/*
 * 비로그인 전용 페이지 보호 (로그인 상태면 접근 불가 → 이전 페이지로 이동)
*/
const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const token = useAppSelector(s => s.auth.token)
  if (token) {
    window.history.back()
    return null
  }
  return <>{children}</>
}

export default GuestGuard
