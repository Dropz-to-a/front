import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store'

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const token = useAppSelector(s => s.auth.token) || localStorage.getItem('jwtToken')
  if (token) return <Navigate to="/" replace />  // 로그인 했으면 홈으로
  return <>{children}</>                         // ✅ 핵심: children 렌더
}
