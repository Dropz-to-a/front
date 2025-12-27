import { useSearchParams, useNavigate } from 'react-router-dom'
import Header from '@/components/Header'
import { XCircle } from 'lucide-react'

export default function PaymentFail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const orderId = searchParams.get('orderId')
  const errorCode = searchParams.get('code')
  const errorMessage = searchParams.get('message')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="mb-4 text-2xl font-bold text-gray-900">결제 실패</h2>
          <p className="mb-2 text-gray-600">
            {errorMessage || '결제 처리 중 오류가 발생했습니다.'}
          </p>
          {errorCode && (
            <p className="mb-6 text-sm text-gray-500">에러 코드: {errorCode}</p>
          )}
          {orderId && (
            <p className="mb-6 text-sm text-gray-500">주문번호: {orderId}</p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              이전으로
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              홈으로
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

