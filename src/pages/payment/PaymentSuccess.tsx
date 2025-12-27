import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { paymentApi } from '@/api/paymentApi'
import Header from '@/components/Header'
import { CheckCircle, XCircle } from 'lucide-react'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const orderId = searchParams.get('orderId')
  const paymentKey = searchParams.get('paymentKey')
  const amount = searchParams.get('amount')
  const returnPath = searchParams.get('returnPath')
  const paymentType = searchParams.get('paymentType')
  const employeeId = searchParams.get('employeeId')
  const employeeIdsStr = searchParams.get('employeeIds')
  
  const isSalaryPayment = paymentType === 'salary' || paymentType === 'batch_salary'

  useEffect(() => {
    const processPayment = async () => {
      if (!orderId || !paymentKey || !amount) {
        setError('결제 정보가 올바르지 않습니다.')
        setLoading(false)
        return
      }

      try {
        // 1. 결제 금액 검증 (세션에 저장된 금액과 비교)
        await paymentApi.verifyAmount({
          orderId,
          amount,
        })

        // 2. 결제 승인 요청 (백엔드에서 Toss Payments API 호출)
        const backendOrderId = `BACKEND_${orderId}`
        await paymentApi.confirm({
          paymentKey,
          orderId,
          amount,
          backendOrderId,
        })

        // 3. 결제 정보 조회
        const paymentData = await paymentApi.getPayment(orderId)
        setPaymentInfo(paymentData)
      } catch (e: unknown) {
        const err = e as { message?: string; code?: string }
        setError(err?.message || '결제 처리 중 오류가 발생했습니다.')
        console.error('결제 처리 실패:', e)
      } finally {
        setLoading(false)
      }
    }

    processPayment()
  }, [orderId, paymentKey, amount])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="mb-4 text-gray-500">결제를 처리하는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="mb-4 text-2xl font-bold text-gray-900">결제 실패</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            {isSalaryPayment ? '급여 지급 완료' : '결제 완료'}
          </h2>
          <p className="mb-6 text-gray-600">
            {isSalaryPayment
              ? '급여 지급이 성공적으로 완료되었습니다.'
              : '결제가 성공적으로 완료되었습니다.'}
          </p>
          
          {paymentInfo && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-semibold">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제 금액</span>
                  <span className="font-semibold text-blue-600">
                    {Number(amount).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            {isSalaryPayment && returnPath ? (
              <button
                onClick={() => {
                  // 급여 지급 완료 정보를 전달
                  const paymentResult: {
                    employeeId?: number
                    employeeIds?: number[]
                    orderId: string
                    amount: number
                  } = {
                    orderId: orderId || '',
                    amount: Number(amount),
                  }
                  
                  if (employeeId) {
                    paymentResult.employeeId = Number(employeeId)
                  }
                  
                  if (employeeIdsStr) {
                    try {
                      paymentResult.employeeIds = JSON.parse(employeeIdsStr)
                    } catch (e) {
                      console.error('employeeIds 파싱 실패:', e)
                    }
                  }
                  
                  navigate(returnPath, {
                    state: { paymentResult },
                  })
                }}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                급여 관리로 돌아가기
              </button>
            ) : (
              <button
                onClick={() => navigate(returnPath || '/')}
                className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                {returnPath ? '이전 페이지로' : '홈으로 돌아가기'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

