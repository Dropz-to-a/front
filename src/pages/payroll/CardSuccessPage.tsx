import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const CardSuccessPage: React.FC = () => {
  const query = useQuery()
  const navigate = useNavigate()

  const [customerKey, setCustomerKey] = useState<string | null>(null)
  const [authKey, setAuthKey] = useState<string | null>(null)

  useEffect(() => {
    const cKey = query.get('customerKey')
    const aKey = query.get('authKey')

    if (!cKey || !aKey) {
      alert('잘못된 접근입니다.')
      navigate('/') // 홈으로 이동
      return
    }

    setCustomerKey(cKey)
    setAuthKey(aKey)
  }, [query, navigate])

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="p-8 text-center bg-white shadow-md rounded-2xl">
          <h1 className="mb-4 text-3xl font-bold text-green-600">카드 등록 완료 🎉</h1>
          <p className="mb-2 text-gray-700">
            등록된 고객키: <span className="font-medium">{customerKey}</span>
          </p>
          <p className="mb-4 text-gray-700">
            인증키(Auth Key): <span className="font-medium">{authKey}</span>
          </p>
          <p className="mb-6 text-gray-600">
            이제 해당 카드를 이용해 정기결제를 진행할 수 있습니다.
          </p>
          <button
            onClick={() => navigate('/payroll')}
            className="px-6 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
            급여 정기결제 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardSuccessPage
