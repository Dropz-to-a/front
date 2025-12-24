import { useAppSelector, useAppDispatch } from '@/store'
import { useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { decodeJwt } from '@/utils/jwt'
import type { JobitJwtPayload } from '@/utils/jwt'
import { setToken } from '@/features/auth/authSlice'

import api from '@/api/Api'

interface RefreshGuardProps {
  children: React.ReactNode
}

const RefreshGuard: FC<RefreshGuardProps> = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const token = useAppSelector(s => s.auth.token)
  const refreshToken = useAppSelector(s => s.auth.refreshToken)

  // accessToken이 만료되었는지 검증하는 함수
  const isTokenExpired = (accessToken: string | null): boolean => {
    if (!accessToken) return true

    try {
      const payload = decodeJwt<JobitJwtPayload>(accessToken)
      if (!payload || !payload.exp) return true

      // exp는 Unix timestamp (초 단위)
      const currentTime = Math.floor(Date.now() / 1000)
      const isExpired = payload.exp < currentTime

      if (isExpired) {
        console.log('[RefreshGuard] accessToken이 만료되었습니다.')
      } else {
        console.log('[RefreshGuard] accessToken이 유효합니다.')
      }

      return isExpired
    } catch (error) {
      console.error('[RefreshGuard] 토큰 검증 중 오류:', error)
      return true
    }
  }

  useEffect(() => {
    // refreshToken이 없으면 로그인 페이지로 이동
    if (!refreshToken) {
      navigate('/login', { replace: true })
      return
    }

    // accessToken이 있고 만료되지 않았으면 아무것도 하지 않음
    if (token && !isTokenExpired(token)) {
      return
    }

    // accessToken이 없거나 만료되었으면 재발급
    const refreshSession = async () => {
      try {
        const previousToken = token || localStorage.getItem('jwtToken')

        const response = await api.post('/auth/refresh', {
          refreshToken: refreshToken,
        })
        const newToken = response.data?.accessToken

        if (!newToken) {
          throw new Error('새로운 accessToken을 받지 못했습니다.')
        }

        // localStorage와 Redux store 업데이트
        localStorage.setItem('jwtToken', newToken)
        dispatch(setToken(newToken))

        console.log('[RefreshGuard] 토큰 재발급 성공')
        console.log('[RefreshGuard] 이전 accessToken:', previousToken)
        console.log('[RefreshGuard] 재발급 받은 accessToken:', newToken)

        // 페이지 새로고침 없이 상태 업데이트를 위해 강제 리로드
        window.location.reload()
      } catch (error) {
        console.error('[RefreshGuard] 토큰 재발급 실패:', error)
        navigate('/login', { replace: true })
      }
    }

    refreshSession()
  }, [token, refreshToken, navigate, dispatch])

  return <>{children}</>
}

export default RefreshGuard
