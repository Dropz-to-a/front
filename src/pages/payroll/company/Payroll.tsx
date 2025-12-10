/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'

interface Employee {
  id: number
  name: string
  position: string
  salary: number
  paid: boolean
}

const clientKey = 'test_ck_26DlbXAaV0MLW0MKNXmqrqY50Q9R'

const PayrollPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: '김민수', position: '개발팀', salary: 4200000, paid: false },
    { id: 2, name: '이서연', position: '디자인팀', salary: 3900000, paid: false },
    { id: 3, name: '박지훈', position: '마케팅팀', salary: 3500000, paid: true },
  ])

  // 직원별 결제창 인스턴스
  const [payments, setPayments] = useState<{ [key: number]: any }>({})

  const totalPayroll = employees.reduce((acc, e) => acc + e.salary, 0)

  /** 1️⃣ 카드 등록용 SDK 초기화 */
  useEffect(() => {
    async function initPayments() {
      try {
        const tossPayments = await loadTossPayments(clientKey)

        const paymentInstances: { [key: number]: any } = {}
        employees.forEach(emp => {
          paymentInstances[emp.id] = tossPayments.payment({
            customerKey: `user_${emp.id}`, // 직원별 customerKey
          })
        })

        setPayments(paymentInstances)
      } catch (error) {
        console.error('Toss SDK 초기화 실패:', error)
      }
    }

    initPayments()
  }, [employees])

  /** 2️⃣ 직원별 카드 등록 (빌링 카드 등록창) */
  const handleBillingAuth = async (employee: Employee) => {
    const payment = payments[employee.id]

    if (!payment) {
      alert('결제 준비가 아직 완료되지 않았습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    try {
      await payment.requestBillingAuth({
        method: 'CARD', // 자동결제(빌링)는 카드만 지원
        successUrl: window.location.origin + '/payroll/success', // 리다이렉트 URL은 라우트에 맞게 수정 가능
        failUrl: window.location.origin + '/payroll/fail',
        customerEmail: `user${employee.id}@example.com`,
        customerName: employee.name,
      })

      // 리다이렉트 후에는 success 페이지에서 빌링키 발급 API 호출하면 됨(백엔드 작업)
      // 여기서는 프론트 테스트용이라 alert만 간단히 사용
      console.log('requestBillingAuth 요청 완료')
    } catch (error) {
      console.error('빌링 인증 실패:', error)
      alert('카드 등록(빌링 인증) 중 오류가 발생했습니다.')
    }
  }

  /** 3️⃣ 직원별 지급 (지금은 UI용 토글) */
  const handlePayEmployee = (employee: Employee) => {
    setEmployees(prev => prev.map(e => (e.id === employee.id ? { ...e, paid: true } : e)))
    alert(`${employee.name}에게 급여 지급 완료! (테스트용 표시)`)
  }

  /** 4️⃣ 월별 일괄 지급 */
  const handlePayAll = () => {
    setEmployees(prev => prev.map(e => ({ ...e, paid: true })))
    alert('모든 직원 급여 일괄 지급 완료! (테스트용 표시)')
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen p-8 bg-gray-50">
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">급여 관리</h1>
          <p className="text-gray-500">기업용 정기결제 테스트 시스템 (Toss Payments)</p>
        </header>

        <div className="p-6 bg-white shadow rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">직원 목록</h2>
            <div className="flex gap-2">
              <select className="p-2 text-gray-700 border rounded-md">
                <option>2025년 11월</option>
                <option>2025년 10월</option>
                <option>2025년 9월</option>
              </select>
              <button
                onClick={handlePayAll}
                className="px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700">
                월별 일괄 지급
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-700 bg-gray-100">
                <th className="p-3 border-b">이름</th>
                <th className="p-3 border-b">부서</th>
                <th className="p-3 border-b">월 급여</th>
                <th className="p-3 text-center border-b">지급 상태</th>
                <th className="p-3 text-center border-b">액션</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{e.name}</td>
                  <td className="p-3 border-b">{e.position}</td>
                  <td className="p-3 border-b">{e.salary.toLocaleString()}원</td>
                  <td className="p-3 text-center border-b">
                    {e.paid ? (
                      <span className="font-semibold text-green-600">지급 완료</span>
                    ) : (
                      <span className="text-red-500">미지급</span>
                    )}
                  </td>
                  <td className="flex justify-center gap-2 p-3 text-center border-b">
                    {/* 카드 등록 (Toss Billing Auth) */}
                    <button
                      type="button"
                      onClick={() => handleBillingAuth(e)}
                      className="px-3 py-2 text-sm text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                      카드 등록
                    </button>

                    {/* 개별 지급 (지금은 UI 토글 + 알림용) */}
                    {!e.paid ? (
                      <button
                        onClick={() => handlePayEmployee(e)}
                        className="px-4 py-2 text-white transition bg-yellow-500 rounded-lg hover:bg-yellow-600">
                        개별 지급
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 text-gray-600 bg-gray-300 rounded-lg cursor-not-allowed">
                        완료
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 font-medium text-right text-gray-700">
            총 급여액:{' '}
            <span className="font-bold text-blue-600">{totalPayroll.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayrollPage
