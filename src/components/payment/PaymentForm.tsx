import { useState } from 'react'
import { paymentApi } from '@/api/paymentApi'

interface PaymentFormProps {
  amount: number
  orderName: string
  returnPath?: string
  paymentData?: any // 급여 지급 정보 등 추가 데이터
  onSuccess?: (paymentKey: string, orderId: string) => void
  onError?: (error: Error) => void
}

export default function PaymentForm({
  amount,
  orderName,
  returnPath,
  paymentData,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [birth, setBirth] = useState('')
  const [password, setPassword] = useState('')
  const [installment, setInstallment] = useState('0')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 카드번호 포맷팅 (하이픈 추가)
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const formatted = numbers.match(/.{1,4}/g)?.join('-') || numbers
    return formatted.substring(0, 19) // 최대 16자리 + 하이픈 3개
  }

  // 유효기간 포맷팅 (MM/YY)
  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    return `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`
  }

  // 생년월일 포맷팅 (YYMMDD)
  const formatBirth = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.substring(0, 6)
  }

  // 카드 비밀번호 포맷팅 (2자리)
  const formatPassword = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.substring(0, 2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 입력값 검증
    if (!cardNumber || !expiry || !birth || !password) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    // 카드번호 검증 (하이픈 제거 후 16자리)
    const cardNumberOnly = cardNumber.replace(/-/g, '')
    if (cardNumberOnly.length !== 16) {
      setError('카드번호는 16자리여야 합니다.')
      return
    }

    // 유효기간 검증 (MM/YY 형식)
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError('유효기간은 MM/YY 형식으로 입력해주세요.')
      return
    }

    // 생년월일 검증 (6자리)
    if (birth.length !== 6) {
      setError('생년월일은 6자리로 입력해주세요.')
      return
    }

    // 카드 비밀번호 검증 (2자리)
    if (password.length !== 2) {
      setError('카드 비밀번호는 2자리로 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // 1. orderId 생성
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      const amountString = String(amount)

      console.log('[PaymentForm] 결제 요청 시작:', {
        orderId,
        orderName,
        amount: amountString,
        cardNumberLength: cardNumberOnly.length,
        expiry,
        birthLength: birth.length,
        passwordLength: password.length,
      })

      // 2. 결제 금액 임시 저장
      await paymentApi.saveAmount({
        orderId,
        amount: amountString,
      })

      // 3. 백엔드로 결제 요청 (카드 정보 포함)
      // 백엔드에서 Toss Payments API를 호출하여 paymentKey 받기
      const processResult = await paymentApi.processPayment({
        orderId,
        orderName,
        amount: amountString,
        cardNumber: cardNumberOnly,
        expiry,
        birth,
        password,
        installment: installment !== '0' ? installment : undefined,
        customerKey: paymentData?.employeeId ? `employee_${paymentData.employeeId}` : undefined,
      })

      console.log('[PaymentForm] 결제 처리 결과:', processResult)

      // 4. paymentKey가 있으면 confirm API 호출하여 최종 승인
      if (!processResult.paymentKey) {
        throw new Error('결제 처리 중 paymentKey를 받지 못했습니다.')
      }

      const paymentKey = processResult.paymentKey
      const backendOrderId = `BACKEND_${orderId}`

      // 5. 결제 승인 요청 (백엔드에서 Toss Payments API 호출)
      await paymentApi.confirm({
        paymentKey,
        orderId,
        amount: amountString,
        backendOrderId,
      })

      console.log('[PaymentForm] 결제 승인 완료')

      // 6. 결제 성공 시 successUrl로 리디렉션
      const successParams = new URLSearchParams({ orderId, paymentKey })
      if (returnPath) successParams.set('returnPath', returnPath)
      if (paymentData) {
        successParams.set('paymentType', paymentData.type || '')
        if (paymentData.employeeId) successParams.set('employeeId', String(paymentData.employeeId))
        if (paymentData.employeeIds) successParams.set('employeeIds', JSON.stringify(paymentData.employeeIds))
      }

      window.location.href = `/payment/success?${successParams.toString()}`
    } catch (error) {
      console.error('[PaymentForm] 결제 요청 실패:', error)
      setIsLoading(false)
      
      const err = error as { status?: number; code?: string; message?: string; response?: any }
      
      // 500 에러 상세 정보 표시
      if (err.status === 500) {
        const errorMessage = 
          '서버 오류가 발생했습니다 (500 Internal Server Error).\n\n' +
          '가능한 원인:\n' +
          '1. 백엔드 서버가 실행 중이지 않음\n' +
          '2. /api/payments/process 엔드포인트가 구현되지 않음\n' +
          '3. Toss Payments API 연동 오류 (시크릿 키 확인 필요)\n' +
          '4. 카드 정보 처리 중 서버 오류\n' +
          '5. 카드 정보 형식 오류\n\n' +
          `에러 코드: ${err.code || 'N/A'}\n` +
          `에러 메시지: ${err.message || '서버 내부 오류'}\n\n` +
          '브라우저 개발자 도구의 Network 탭에서 상세 에러를 확인하세요.'
        
        setError(errorMessage)
        console.error('[PaymentForm] 500 에러 상세:', {
          status: err.status,
          code: err.code,
          message: err.message,
          response: err.response,
        })
      } else if (err.status === 400) {
        setError(`잘못된 요청입니다: ${err.message || '입력 정보를 확인해주세요.'}`)
      } else if (err.status === 401 || err.status === 403) {
        setError(`인증 오류가 발생했습니다: ${err.message || '권한이 없습니다.'}`)
      } else {
        setError(err?.message || '결제 요청에 실패했습니다.')
      }
      
      onError?.(error as Error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">결제 정보</h2>

      {/* 결제 정보 요약 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700">주문명</span>
          <span className="font-semibold">{orderName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">결제 금액</span>
          <span className="text-xl font-bold text-blue-600">{amount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-800 mb-2">❌ 오류 발생</p>
          <p className="text-xs text-red-700 whitespace-pre-line">{error}</p>
        </div>
      )}

      {/* 카드 정보 입력 폼 */}
      <div className="space-y-4">
        {/* 카드번호 */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            카드번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="카드번호를 입력하세요"
            maxLength={19}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* 유효기간 */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            유효기간 (MM/YY) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="12/26"
            maxLength={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            생년월일 (YYMMDD) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={birth}
            onChange={(e) => setBirth(formatBirth(e.target.value))}
            placeholder="900101"
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* 카드 비밀번호 */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            카드 비밀번호 앞 2자리 <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(formatPassword(e.target.value))}
            placeholder="12"
            maxLength={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* 할부 개월 */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">할부 개월</label>
          <select
            value={installment}
            onChange={(e) => setInstallment(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="0">일시불</option>
            <option value="2">2개월</option>
            <option value="3">3개월</option>
            <option value="4">4개월</option>
            <option value="5">5개월</option>
            <option value="6">6개월</option>
            <option value="7">7개월</option>
            <option value="8">8개월</option>
            <option value="9">9개월</option>
            <option value="10">10개월</option>
            <option value="11">11개월</option>
            <option value="12">12개월</option>
          </select>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white transition ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}>
        {isLoading ? '처리 중...' : `${amount.toLocaleString()}원 결제하기`}
      </button>
    </form>
  )
}

