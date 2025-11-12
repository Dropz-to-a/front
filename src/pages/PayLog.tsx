import React, { useEffect, useState } from 'react'
import {
  Calendar,
  DollarSign,
  CreditCard,
  Download,
  Filter,
  TrendingUp,
} from 'lucide-react'
import Footer from '../components/Footer'
import Header from '../components/Header'
const PayLogPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all')

  const payLogs = [
    {
      id: 1,
      account: '우리은행 1002-***-****90',
      date: '2025-09-25',
      amount: 3200000,
      note: '9월 정규 급여',
      type: 'regular',
    },
    {
      id: 2,
      account: '우리은행 1002-***-****90',
      date: '2025-08-25',
      amount: 3000000,
      note: '8월 정규 급여',
      type: 'regular',
    },
    {
      id: 3,
      account: '우리은행 1002-***-****90',
      date: '2025-07-31',
      amount: 500000,
      note: '성과급',
      type: 'bonus',
    },
    {
      id: 4,
      account: '우리은행 1002-***-****90',
      date: '2025-07-25',
      amount: 3000000,
      note: '7월 정규 급여',
      type: 'regular',
    },
  ]

  const totalAmount = payLogs.reduce((sum, log) => sum + log.amount, 0)
  const averageAmount = totalAmount / payLogs.length

  useEffect(() => {
    document.title = '급여내역'
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <div className="px-6 py-8 mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-4xl font-bold text-gray-800">급여사항</h2>
          <p className="text-gray-600">나의 급여 내역을 확인하세요</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 transition-shadow bg-white shadow-md rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-600">총 입금액</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ₩{totalAmount.toLocaleString()}
            </p>
          </div>

          <div className="p-6 transition-shadow bg-white shadow-md rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-600">평균 급여</span>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              ₩{Math.round(averageAmount).toLocaleString()}
            </p>
          </div>

          <div className="p-6 transition-shadow bg-white shadow-md rounded-2xl hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-600">총 지급 횟수</span>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{payLogs.length}회</p>
          </div>
        </div>

        {/* Filter & Export Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white shadow-md rounded-2xl">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value)}>
              <option value="all">전체 내역</option>
              <option value="regular">정규 급여</option>
              <option value="bonus">성과급/보너스</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            내보내기
          </button>
        </div>

        {/* Pay Log List */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 p-4 font-semibold text-center text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" />
              입금계좌
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              입금일
            </div>
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-4 h-4" />
              입금금액
            </div>
          </div>

          {payLogs.map((log, index) => (
            <div
              key={log.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center md:text-left">
                  <p className="mb-1 text-xs text-gray-500 md:hidden">입금계좌</p>
                  <p className="font-medium text-gray-800">{log.account}</p>
                  <p className="mt-1 text-xs text-gray-500">{log.note}</p>
                </div>

                <div className="text-center">
                  <p className="mb-1 text-xs text-gray-500 md:hidden">입금일</p>
                  <p className="font-medium text-gray-800">{log.date}</p>
                </div>

                <div className="text-center md:text-right">
                  <p className="mb-1 text-xs text-gray-500 md:hidden">입금금액</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ₩{log.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no logs) */}
        {payLogs.length === 0 && (
          <div className="p-12 text-center bg-white shadow-md rounded-2xl">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-600">
              급여 내역이 없습니다
            </h3>
            <p className="text-gray-500">첫 급여가 입금되면 여기에 표시됩니다</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default PayLogPage
