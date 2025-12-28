// ============================================
// 테스트 카드 정보 (코드 최상단에서 변수로 입력)
// ============================================
const TEST_CARD_INFO = {
  cardNumber: '1234-5678-1234-5678',
  expiry: '12/26',
  birth: '900101',
  password: '12',
}

// Toss Payments 클라이언트 키 (환경 변수에서 가져오기)
// .env 파일에 VITE_TOSS_CLIENT_KEY=test_ck_... 형태로 설정 필요
const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY

// 클라이언트 키 검증
const isValidClientKey = (key: string | undefined): boolean => {
  if (!key) return false
  // Toss Payments 클라이언트 키는 test_ck_ 또는 live_ck_ 로 시작
  return key.startsWith('test_ck_') || key.startsWith('live_ck_')
}

if (!TOSS_CLIENT_KEY) {
  console.error(
    '⚠️ Toss Payments 클라이언트 키가 설정되지 않았습니다.\n' +
    '.env 파일에 VITE_TOSS_CLIENT_KEY를 설정해주세요.\n' +
    '예: VITE_TOSS_CLIENT_KEY=test_ck_DpexMgkW36w4qN7k3V8L0X9bzQ6y\n' +
    '환경 변수 설정 후 개발 서버를 재시작해주세요.'
  )
} else if (!isValidClientKey(TOSS_CLIENT_KEY)) {
  console.error(
    '⚠️ Toss Payments 클라이언트 키 형식이 올바르지 않습니다.\n' +
    `현재 값: ${TOSS_CLIENT_KEY.substring(0, 20)}...\n` +
    '클라이언트 키는 test_ck_ 또는 live_ck_ 로 시작해야 합니다.'
  )
} else {
  console.log('✅ Toss Payments 클라이언트 키가 설정되었습니다.')
}

import { useEffect, useRef, useState } from 'react'
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk'
import { paymentApi } from '@/api/paymentApi'

// loadPaymentWidget의 반환 타입을 추론
type PaymentWidget = Awaited<ReturnType<typeof loadPaymentWidget>>

interface PaymentWidgetProps {
  amount: number
  orderName: string
  customerKey?: string
  returnPath?: string
  paymentData?: any // 급여 지급 정보 등 추가 데이터
  onError?: (error: Error) => void
}

export default function PaymentWidget({
  amount,
  orderName,
  customerKey,
  returnPath,
  paymentData,
  onError,
}: PaymentWidgetProps) {
  const paymentWidgetRef = useRef<PaymentWidget | null>(null)
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidget['renderPaymentMethods']> | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => {
    // 클라이언트 키 검증
    if (!TOSS_CLIENT_KEY) {
      const errorMsg = 'Toss Payments 클라이언트 키가 설정되지 않았습니다.\n.env 파일에 VITE_TOSS_CLIENT_KEY를 설정하고 개발 서버를 재시작해주세요.'
      console.error(errorMsg)
      onError?.(new Error(errorMsg))
      return
    }

    if (!isValidClientKey(TOSS_CLIENT_KEY)) {
      const errorMsg = `Toss Payments 클라이언트 키 형식이 올바르지 않습니다.\n현재 값: ${TOSS_CLIENT_KEY.substring(0, 20)}...\n클라이언트 키는 test_ck_ 또는 live_ck_ 로 시작해야 합니다.`
      console.error(errorMsg)
      onError?.(new Error(errorMsg))
      return
    }

    const initPaymentWidget = async () => {
      try {
        setIsReady(false)
        setInitError(null)
        
        console.log('[PaymentWidget] 위젯 초기화 시작...', {
          clientKeyPrefix: TOSS_CLIENT_KEY.substring(0, 15) + '...',
          clientKeyLength: TOSS_CLIENT_KEY.length,
          clientKeyFormat: TOSS_CLIENT_KEY.startsWith('test_ck_') ? 'test_ck_' : TOSS_CLIENT_KEY.startsWith('live_ck_') ? 'live_ck_' : 'invalid',
          customerKey: customerKey || 'customer-key',
          amount,
        })
        
        // 클라이언트 키에 공백이나 특수문자가 있는지 확인
        if (TOSS_CLIENT_KEY.includes(' ') || TOSS_CLIENT_KEY.includes('\n') || TOSS_CLIENT_KEY.includes('\r')) {
          const errorMsg = '클라이언트 키에 공백이나 줄바꿈이 포함되어 있습니다.\n.env 파일에서 공백을 제거해주세요.'
          console.error('[PaymentWidget]', errorMsg)
          setInitError(errorMsg)
          throw new Error(errorMsg)
        }
        
        // PaymentWidget 인스턴스 생성
        const paymentWidget = await loadPaymentWidget(TOSS_CLIENT_KEY, customerKey || 'customer-key')
        paymentWidgetRef.current = paymentWidget

        console.log('[PaymentWidget] 위젯 인스턴스 생성 완료')

        // 결제 수단 UI 렌더링 (Promise 반환 가능)
        try {
          const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
            '#payment-widget',
            { value: amount },
            { variantKey: 'DEFAULT' }
          )
          paymentMethodsWidgetRef.current = paymentMethodsWidget

          // renderPaymentMethods가 Promise를 반환하는 경우 대기
          if (paymentMethodsWidget && typeof (paymentMethodsWidget as any).then === 'function') {
            await (paymentMethodsWidget as unknown as Promise<any>)
          }

          console.log('[PaymentWidget] 결제 수단 UI 렌더링 완료')
        } catch (renderError) {
          console.error('[PaymentWidget] 결제 수단 UI 렌더링 실패:', renderError)
          const err = renderError as { message?: string }
          if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
            throw new Error('클라이언트 키 인증에 실패했습니다. 클라이언트 키를 확인해주세요.')
          }
          throw new Error('결제 수단 UI 렌더링에 실패했습니다. 클라이언트 키를 확인해주세요.')
        }

        // 약관 UI 렌더링 (Promise 반환 가능)
        try {
          const agreementWidget = paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' })
          
          // renderAgreement가 Promise를 반환하는 경우 대기
          if (agreementWidget && typeof (agreementWidget as any).then === 'function') {
            await (agreementWidget as unknown as Promise<any>)
          }

          console.log('[PaymentWidget] 약관 UI 렌더링 완료')
        } catch (renderError) {
          console.error('[PaymentWidget] 약관 UI 렌더링 실패:', renderError)
          // 약관 렌더링 실패는 치명적이지 않을 수 있음
        }

        // DOM에 실제로 렌더링되었는지 확인하는 함수
        const checkWidgetReady = (): boolean => {
          const paymentWidgetElement = document.querySelector('#payment-widget')
          const agreementElement = document.querySelector('#agreement')
          
          // 위젯이 DOM에 렌더링되었는지 확인
          // Toss Payments 위젯은 iframe이나 shadow DOM을 사용할 수 있으므로
          // children이 있거나 내부에 콘텐츠가 있는지 확인
          const isPaymentWidgetReady = paymentWidgetElement && (
            paymentWidgetElement.children.length > 0 ||
            paymentWidgetElement.innerHTML.trim().length > 0 ||
            paymentWidgetElement.querySelector('iframe') !== null
          )
          
          const isAgreementReady = agreementElement && (
            agreementElement.children.length > 0 ||
            agreementElement.innerHTML.trim().length > 0 ||
            agreementElement.querySelector('iframe') !== null
          )
          
          return (isPaymentWidgetReady ?? false) && (isAgreementReady ?? false)
        }

        // 위젯이 실제로 렌더링될 때까지 대기 (최대 5초)
        let attempts = 0
        const maxAttempts = 50 // 5초 (100ms * 50)
        
        while (!checkWidgetReady() && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }

        // 추가 대기 후 렌더링 확인 (위젯이 API 호출을 완료할 시간 제공)
        // Toss Payments 위젯이 내부적으로 API를 호출하므로 충분한 대기 시간 필요
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        const widgetState = {
          paymentWidget: document.querySelector('#payment-widget')?.children.length || 0,
          agreement: document.querySelector('#agreement')?.children.length || 0,
        }
        
        if (checkWidgetReady()) {
          console.log('[PaymentWidget] 위젯 DOM 렌더링 확인 완료', widgetState)
          setIsReady(true)
        } else {
          console.warn('[PaymentWidget] 위젯 DOM 렌더링 확인 실패', widgetState)
          
          // 결제 위젯이 렌더링되지 않은 경우 (약관만 렌더링된 경우)
          // 이는 보통 401 에러로 인한 것
          if (widgetState.paymentWidget === 0 && widgetState.agreement > 0) {
            const errorMsg = 
              'Toss Payments 클라이언트 키 인증에 실패했습니다 (401 Unauthorized).\n\n' +
              '확인 사항:\n' +
              '1. .env 파일의 VITE_TOSS_CLIENT_KEY가 올바른지 확인\n' +
              '2. 클라이언트 키가 Toss Payments 관리자 페이지에서 활성화되어 있는지 확인\n' +
              '3. 테스트 환경에서는 test_ck_ 로 시작하는 키를 사용해야 합니다\n' +
              '4. 개발 서버를 재시작했는지 확인\n' +
              '5. 브라우저 개발자 도구의 Network 탭에서 401 에러를 확인하세요\n\n' +
              '현재 클라이언트 키: ' + TOSS_CLIENT_KEY.substring(0, 20) + '...'
            
            setInitError(errorMsg)
            setIsReady(false)
            throw new Error(errorMsg)
          } else {
            // 위젯이 아직 로딩 중일 수 있으므로 계속 진행
            console.warn('[PaymentWidget] 위젯이 아직 렌더링되지 않았지만 계속 진행')
            setIsReady(true)
          }
        }
        
        console.log('[PaymentWidget] 위젯 초기화 완료, isReady:', true)
      } catch (error) {
        console.error('[PaymentWidget] 초기화 실패:', error)
        const err = error as { message?: string; code?: string }
        const errorMessage = err?.message || '결제 위젯 초기화에 실패했습니다.'
        
        let userMessage = errorMessage
        
        if (errorMessage.includes('클라이언트 키') || 
            errorMessage.includes('clientKey') || 
            errorMessage.includes('401') ||
            errorMessage.includes('인증')) {
          userMessage = 
            'Toss Payments 클라이언트 키 인증에 실패했습니다.\n\n' +
            '확인 사항:\n' +
            '1. .env 파일에 VITE_TOSS_CLIENT_KEY가 설정되어 있는지 확인\n' +
            '2. 클라이언트 키가 test_ck_ 또는 live_ck_ 로 시작하는지 확인\n' +
            '3. 개발 서버를 재시작했는지 확인\n' +
            '4. Toss Payments 관리자 페이지에서 클라이언트 키가 활성화되어 있는지 확인'
        } else if (errorMessage.includes('알 수 없는 에러')) {
          userMessage = 
            '결제 위젯 초기화 중 오류가 발생했습니다.\n\n' +
            '가능한 원인:\n' +
            '1. 클라이언트 키가 올바르지 않음\n' +
            '2. 네트워크 연결 문제\n' +
            '3. Toss Payments 서비스 일시 중단\n\n' +
            '브라우저 콘솔을 확인하거나 잠시 후 다시 시도해주세요.'
        }
        
        alert(userMessage)
        onError?.(error as Error)
      }
    }

    initPaymentWidget()

    return () => {
      // 정리 작업
      if (paymentMethodsWidgetRef.current) {
        paymentMethodsWidgetRef.current = null
      }
    }
  }, [customerKey, amount, onError])

  const handlePayment = async () => {
    if (!TOSS_CLIENT_KEY) {
      alert('Toss Payments 클라이언트 키가 설정되지 않았습니다.\n환경 변수 VITE_TOSS_CLIENT_KEY를 확인해주세요.')
      return
    }

    if (!paymentWidgetRef.current) {
      alert('결제 위젯이 초기화되지 않았습니다. 페이지를 새로고침해주세요.')
      return
    }

    if (!isReady) {
      alert('결제 위젯이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    // 위젯이 실제로 DOM에 렌더링되었는지 재확인
    const paymentWidgetElement = document.querySelector('#payment-widget')
    const agreementElement = document.querySelector('#agreement')
    
    const isWidgetRendered = paymentWidgetElement && (
      paymentWidgetElement.children.length > 0 ||
      paymentWidgetElement.innerHTML.trim().length > 0 ||
      paymentWidgetElement.querySelector('iframe') !== null
    )
    
    const isAgreementRendered = agreementElement && (
      agreementElement.children.length > 0 ||
      agreementElement.innerHTML.trim().length > 0 ||
      agreementElement.querySelector('iframe') !== null
    )
    
    if (!isWidgetRendered || !isAgreementRendered) {
      console.warn('[PaymentWidget] 위젯이 아직 렌더링되지 않음', {
        paymentWidget: paymentWidgetElement?.children.length,
        agreement: agreementElement?.children.length,
      })
      alert('결제 위젯이 아직 화면에 표시되지 않았습니다. 잠시 후 다시 시도해주세요.')
      return
    }
    
    console.log('[PaymentWidget] 위젯 렌더링 확인 완료, 결제 요청 진행')

    try {
      setIsLoading(true)

      // 1. orderId 생성
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
      const amountString = String(amount)

      // 2. 결제 금액 임시 저장
      await paymentApi.saveAmount({
        orderId,
        amount: amountString,
      })

      console.log('[PaymentWidget] 결제 요청 시작...', { orderId, amount: amountString })

      // 3. 결제 위젯에서 결제 요청
      const paymentWidget = paymentWidgetRef.current
      
      // successUrl에 추가 정보 포함 (급여 지급 정보 등)
      const successParams = new URLSearchParams({ orderId })
      if (returnPath) successParams.set('returnPath', returnPath)
      if (paymentData) {
        successParams.set('paymentType', paymentData.type || '')
        if (paymentData.employeeId) successParams.set('employeeId', String(paymentData.employeeId))
        if (paymentData.employeeIds) successParams.set('employeeIds', JSON.stringify(paymentData.employeeIds))
      }
      
      console.log('[PaymentWidget] requestPayment 호출...')
      
      await paymentWidget.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success?${successParams.toString()}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${orderId}`,
        customerEmail: 'customer@example.com',
        customerName: '고객명',
      })
      
      console.log('[PaymentWidget] requestPayment 호출 완료')
    } catch (error: unknown) {
      console.error('결제 요청 실패:', error)
      setIsLoading(false)
      
      const err = error as { message?: string }
      const errorMessage = err?.message || '결제 요청에 실패했습니다.'
      
      if (errorMessage.includes('사용자가 결제를 취소했습니다')) {
        alert('결제가 취소되었습니다.')
      } else if (errorMessage.includes('렌더링되지 않았습니다')) {
        alert('결제 UI가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.')
      } else {
        alert(errorMessage)
        onError?.(error as Error)
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">결제 정보</h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700">주문명</span>
          <span className="font-semibold">{orderName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">결제 금액</span>
          <span className="text-xl font-bold text-blue-600">{amount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 클라이언트 키 없을 때 에러 메시지 */}
      {!TOSS_CLIENT_KEY && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-800 mb-2">⚠️ 설정 오류</p>
          <div className="text-xs text-red-700 space-y-2">
            <p>Toss Payments 클라이언트 키가 설정되지 않았습니다.</p>
            <div className="bg-red-100 p-2 rounded">
              <p className="font-semibold mb-1">설정 방법:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>프로젝트 루트에 <code className="bg-white px-1 rounded">.env</code> 파일 생성</li>
                <li>다음 내용 추가: <code className="bg-white px-1 rounded">VITE_TOSS_CLIENT_KEY=test_ck_여기에_키_입력</code></li>
                <li>개발 서버 재시작 (<code className="bg-white px-1 rounded">npm run dev</code>)</li>
              </ol>
            </div>
            <p className="text-xs text-red-600 mt-2">
              💡 Toss Payments 관리자 페이지에서 클라이언트 키를 발급받으세요.
            </p>
          </div>
        </div>
      )}

      {/* 클라이언트 키 형식이 잘못되었을 때 */}
      {TOSS_CLIENT_KEY && !isValidClientKey(TOSS_CLIENT_KEY) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-semibold text-yellow-800 mb-2">⚠️ 클라이언트 키 형식 오류</p>
          <p className="text-xs text-yellow-700">
            클라이언트 키는 <code className="bg-yellow-100 px-1 rounded">test_ck_</code> 또는{' '}
            <code className="bg-yellow-100 px-1 rounded">live_ck_</code>로 시작해야 합니다.
            <br />
            현재 값: <code className="bg-yellow-100 px-1 rounded">{TOSS_CLIENT_KEY.substring(0, 30)}...</code>
          </p>
        </div>
      )}

      {/* 초기화 에러 표시 */}
      {initError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm font-semibold text-red-800 mb-2">❌ 결제 위젯 초기화 실패 (401 Unauthorized)</p>
          <p className="text-xs text-red-700 whitespace-pre-line mb-4">{initError}</p>
          
          <div className="mb-4 p-3 bg-red-100 rounded">
            <p className="text-xs font-semibold text-red-900 mb-2">🔍 디버깅 정보:</p>
            <div className="text-xs text-red-800 space-y-1">
              <p>• 현재 클라이언트 키: <code className="bg-white px-1 rounded">{TOSS_CLIENT_KEY?.substring(0, 30)}...</code></p>
              <p>• 클라이언트 키 길이: {TOSS_CLIENT_KEY?.length || 0}자</p>
              <p>• 클라이언트 키 형식: {TOSS_CLIENT_KEY?.startsWith('test_ck_') ? '✅ test_ck_' : TOSS_CLIENT_KEY?.startsWith('live_ck_') ? '✅ live_ck_' : '❌ 잘못된 형식'}</p>
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs font-semibold text-yellow-900 mb-2">💡 해결 방법:</p>
            <ol className="text-xs text-yellow-800 list-decimal list-inside space-y-1">
              <li>Toss Payments 관리자 페이지에서 클라이언트 키 확인: <a href="https://developers.tosspayments.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://developers.tosspayments.com/</a></li>
              <li>.env 파일에서 클라이언트 키가 올바르게 설정되었는지 확인 (공백, 따옴표 없이)</li>
              <li>클라이언트 키가 활성화되어 있는지 확인</li>
              <li>테스트 환경에서는 test_ck_ 로 시작하는 키만 사용 가능</li>
              <li>개발 서버를 완전히 재시작 (환경 변수 변경 후 필수)</li>
            </ol>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
              페이지 새로고침
            </button>
            <button
              onClick={() => {
                console.log('현재 클라이언트 키:', TOSS_CLIENT_KEY)
                console.log('클라이언트 키 전체:', TOSS_CLIENT_KEY)
                alert(`클라이언트 키 (콘솔 확인):\n${TOSS_CLIENT_KEY?.substring(0, 50)}...`)
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
              클라이언트 키 확인
            </button>
          </div>
        </div>
      )}

      {/* 결제 수단 UI */}
      <div id="payment-widget" className="mb-6 min-h-[200px]">
        {!isReady && TOSS_CLIENT_KEY && (
          <div className="flex items-center justify-center h-48 text-gray-500">
            결제 위젯을 불러오는 중...
          </div>
        )}
      </div>

      {/* 약관 UI */}
      <div id="agreement" className="mb-6 min-h-[100px]" />

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={!isReady || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition ${
          !isReady || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}>
        {isLoading ? '처리 중...' : `${amount.toLocaleString()}원 결제하기`}
      </button>

      {/* 테스트 카드 정보 안내 */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm font-semibold text-yellow-800 mb-2">테스트 카드 정보</p>
        <div className="text-xs text-yellow-700 space-y-1">
          <p>카드번호: {TEST_CARD_INFO.cardNumber}</p>
          <p>유효기간: {TEST_CARD_INFO.expiry}</p>
          <p>생년월일: {TEST_CARD_INFO.birth}</p>
          <p>카드 비밀번호: {TEST_CARD_INFO.password}</p>
        </div>
      </div>
    </div>
  )
}

