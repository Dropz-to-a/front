import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const token = useAppSelector(s => s.auth.token)
  const navigate = useNavigate()
  const location = useLocation()

  // 로그인 안 되어 있음 → 모달 + 리다이렉트 UI
  if (!token) {
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="p-6 text-center bg-white shadow-xl w-80 rounded-xl">
            <h2 className="mb-3 text-lg font-semibold">로그인이 필요합니다</h2>
            <p className="mb-6 text-sm text-gray-600">해당 기능은 로그인 후 이용할 수 있습니다.</p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                돌아가기
              </button>

              <button
                onClick={() => navigate('/login', { state: { from: location } })}
                className="flex-1 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                로그인
              </button>
            </div>
          </div>
        </div>

        {/* 페이지는 그대로 렌더링 */}
        {children}
      </>
    )
  }

  return <>{children}</>
}

export default AuthGuard
