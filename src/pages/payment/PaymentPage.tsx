/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import PaymentForm from '@/components/payment/PaymentForm'

export default function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // URL 파라미터 또는 location.state에서 결제 정보 가져오기
  const searchParams = new URLSearchParams(location.search)
  const amountFromUrl = searchParams.get('amount')
  const orderNameFromUrl = searchParams.get('orderName')
  
  const paymentData = location.state as any
  const isSalaryPayment = paymentData?.type === 'salary' || paymentData?.type === 'batch_salary'
  
  const [amount, setAmount] = useState<number>(
    amountFromUrl ? Number(amountFromUrl) : paymentData?.amount || 10000
  )
  const [orderName, setOrderName] = useState<string>(
    orderNameFromUrl || paymentData?.orderName || '주문'
  )

  const handleSuccess = (paymentKey: string, orderId: string) => {
    console.log('결제 성공:', { paymentKey, orderId })
    // 성공 페이지로 리디렉션은 PaymentWidget에서 처리
  }

  const handleError = (error: Error) => {
    console.error('결제 에러:', error)
    alert(`결제 중 오류가 발생했습니다: ${error.message}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700">
            ← 이전으로
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isSalaryPayment ? '급여 지급' : '결제'}
          </h1>
          {isSalaryPayment && (
            <p className="mt-2 text-gray-600">
              {paymentData?.type === 'batch_salary'
                ? `${paymentData.employeeNames?.length || 0}명의 직원에게 급여를 지급합니다.`
                : `${paymentData?.employeeName || ''}님에게 급여를 지급합니다.`}
            </p>
          )}
        </div>

        {/* 급여 지급 정보 표시 */}
        {isSalaryPayment && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="mb-3 text-lg font-semibold text-blue-900">급여 지급 정보</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">지급 대상</span>
                <span className="font-semibold">
                  {paymentData?.type === 'batch_salary'
                    ? `${paymentData.employeeNames?.join(', ') || ''} (${paymentData.employeeNames?.length || 0}명)`
                    : paymentData?.employeeName || ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">지급 금액</span>
                <span className="font-bold text-blue-600">{amount.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        )}

        {/* 결제 정보 입력 (일반 결제일 때만 표시) */}
        {!isSalaryPayment && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="mb-4 text-lg font-semibold">결제 정보 입력</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  주문명
                </label>
                <input
                  type="text"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="주문명을 입력하세요"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  결제 금액 (원)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="결제 금액을 입력하세요"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* 결제 폼 */}
        <PaymentForm
          amount={amount}
          orderName={orderName}
          returnPath={paymentData?.returnPath}
          paymentData={paymentData}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  )
}

