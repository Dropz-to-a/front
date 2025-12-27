import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import { Settings, Plus, Filter, Calendar, TrendingUp, AlertCircle, CreditCard } from 'lucide-react'
import { companyApi, type EmployeeInfo } from '@/api/companyApi'

// 급여 항목 타입
interface Deduction {
  name: string
  amount: number
  rate?: number // 비율 기반 계산 시 사용
}

interface Addition {
  name: string
  amount: number
  reason?: string
}

interface Employee {
  id: number
  name: string
  position: string
  baseSalary: number // 기본급
  deductions: Deduction[] // 공제 항목
  additions: Addition[] // 추가 항목 (보너스, 성과금 등)
  paid: boolean
  paidDate?: string // 지급일
  dueDate: string // 지급 예정일
  isDelayed?: boolean // 지급 지연 여부
}

type FilterType = 'all' | 'paid' | 'unpaid' | 'delayed'

// 급여 계산 함수
const calculatePayroll = (employee: Employee) => {
  const totalDeductions = employee.deductions.reduce((sum, d) => sum + d.amount, 0)
  const totalAdditions = employee.additions.reduce((sum, a) => sum + a.amount, 0)
  const netSalary = employee.baseSalary - totalDeductions + totalAdditions
  return {
    baseSalary: employee.baseSalary,
    totalDeductions,
    totalAdditions,
    netSalary,
  }
}

// 기본 공제 항목 생성 함수
const createDefaultDeductions = (baseSalary: number): Deduction[] => {
  // 국민연금 4.5%, 건강보험 3.545%, 장기요양보험 12.27% (건강보험의), 고용보험 0.9%, 산재보험 0.85%
  // 소득세는 간이세액표 기준으로 대략 계산 (실제로는 더 복잡)
  const nationalPension = Math.floor(baseSalary * 0.045)
  const healthInsurance = Math.floor(baseSalary * 0.03545)
  const longTermCare = Math.floor(healthInsurance * 0.1227)
  const employmentInsurance = Math.floor(baseSalary * 0.009)
  const industrialAccident = Math.floor(baseSalary * 0.0085)
  
  // 소득세 간이 계산 (실제로는 더 복잡한 계산 필요)
  const incomeTax = Math.floor(baseSalary * 0.01) // 대략 1%로 가정
  const localIncomeTax = Math.floor(incomeTax * 0.1) // 지방소득세는 소득세의 10%

  return [
    { name: '국민연금', amount: nationalPension, rate: 4.5 },
    { name: '건강보험', amount: healthInsurance, rate: 3.545 },
    { name: '장기요양보험', amount: longTermCare },
    { name: '고용보험', amount: employmentInsurance, rate: 0.9 },
    { name: '산재보험', amount: industrialAccident, rate: 0.85 },
    { name: '소득세', amount: incomeTax },
    { name: '지방소득세', amount: localIncomeTax },
  ]
}

const PayrollPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM 형식
  )
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null)

  /* ============================
      초기 데이터 로드
  ============================ */
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true)
        
        // 직원 목록 가져오기
        const employeeList = await companyApi.getEmployees()
        
        // API 응답을 Employee 타입으로 변환
        const convertedEmployees: Employee[] = employeeList.map((empInfo: EmployeeInfo) => {
          // 기본 급여는 0으로 시작 (사용자가 설정해야 함)
          const defaultBaseSalary = 0
          
          return {
            id: empInfo.employeeAccountId,
            name: `직원 ${empInfo.employeeAccountId}`, // API에 name이 없으므로 임시로 사용
            position: empInfo.teamName || '미배정', // 부서명 또는 미배정
            baseSalary: defaultBaseSalary,
            deductions: createDefaultDeductions(defaultBaseSalary),
            additions: [],
            paid: false,
            dueDate: new Date().toISOString().split('T')[0], // 기본값: 오늘 날짜
          }
        })
        
        setEmployees(convertedEmployees)
      } catch (e: unknown) {
        const error = e as { message?: string }
        alert(error?.message ?? '직원 목록을 불러오는데 실패했습니다.')
        console.error('직원 목록 로드 실패:', e)
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  // 결제 성공 후 돌아왔을 때 처리
  useEffect(() => {
    const paymentResult = (location.state as { paymentResult?: { employeeId?: number; employeeIds?: number[] } })?.paymentResult
    if (paymentResult) {
      const { employeeId, employeeIds } = paymentResult
      
      const today = new Date().toISOString().split('T')[0]
      
      if (employeeId) {
        // 개별 지급 완료 처리
        setEmployees(prev =>
          prev.map(e =>
            e.id === employeeId
              ? { ...e, paid: true, paidDate: today, isDelayed: false }
              : e
          )
        )
        alert('급여 지급이 완료되었습니다!')
      } else if (employeeIds && employeeIds.length > 0) {
        // 일괄 지급 완료 처리
        setEmployees(prev =>
          prev.map(e =>
            employeeIds.includes(e.id)
              ? { ...e, paid: true, paidDate: today, isDelayed: false }
              : e
          )
        )
        alert(`${employeeIds.length}명의 직원에게 급여 지급이 완료되었습니다!`)
      }
      
      // state 초기화
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, navigate, location.pathname])

  // 필터링된 직원 목록
  const filteredEmployees = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    
    return employees.filter(emp => {
      // 지급 지연 체크
      if (!emp.paid && new Date(emp.dueDate) < new Date(today)) {
        emp.isDelayed = true
      } else {
        emp.isDelayed = false
      }

      switch (filter) {
        case 'paid':
          return emp.paid
        case 'unpaid':
          return !emp.paid
        case 'delayed':
          return emp.isDelayed
        default:
          return true
      }
    })
  }, [employees, filter])

  // 총 급여액 계산
  const totalPayroll = useMemo(() => {
    return filteredEmployees.reduce((sum, emp) => {
      const calc = calculatePayroll(emp)
      return sum + calc.netSalary
    }, 0)
  }, [filteredEmployees])

  // 월급 설정 모달 열기
  const handleOpenSalaryModal = (employee?: Employee) => {
    if (employee) {
      setSelectedEmployee(employee)
    } else {
      // 새 직원 추가
      setSelectedEmployee({
        id: Date.now(),
        name: '',
        position: '',
        baseSalary: 0,
        deductions: [],
        additions: [],
        paid: false,
        dueDate: new Date().toISOString().split('T')[0],
      })
    }
    setIsSalaryModalOpen(true)
  }

  // 급여 상세 보기
  const handleViewDetail = (employee: Employee) => {
    setDetailEmployee(employee)
    setIsDetailModalOpen(true)
  }

  // 급여 저장
  const handleSaveSalary = (formData: {
    name: string
    position: string
    baseSalary: number
    additions: Addition[]
    dueDate: string
  }) => {
    if (selectedEmployee) {
      const newDeductions = createDefaultDeductions(formData.baseSalary)
      
      if (selectedEmployee.id && employees.find(e => e.id === selectedEmployee.id)) {
        // 기존 직원 수정
        setEmployees(prev =>
          prev.map(e =>
            e.id === selectedEmployee.id
              ? {
                  ...e,
                  name: formData.name,
                  position: formData.position,
                  baseSalary: formData.baseSalary,
                  deductions: newDeductions,
                  additions: formData.additions,
                  dueDate: formData.dueDate,
                }
              : e
          )
        )
      } else {
        // 새 직원 추가
        setEmployees(prev => [
          ...prev,
          {
            ...selectedEmployee,
            name: formData.name,
            position: formData.position,
            baseSalary: formData.baseSalary,
            deductions: newDeductions,
            additions: formData.additions,
            dueDate: formData.dueDate,
          },
        ])
      }
    }
    setIsSalaryModalOpen(false)
    setSelectedEmployee(null)
  }

  // 개별 지급 (결제 플로우로 이동)
  const handlePayEmployee = (employee: Employee) => {
    const calc = calculatePayroll(employee)
    const netSalary = calc.netSalary

    if (netSalary <= 0) {
      alert('지급할 금액이 없습니다. 급여를 설정해주세요.')
      return
    }

    // 결제 페이지로 이동 (급여 정보 전달)
    navigate('/payment', {
      state: {
        type: 'salary',
        employeeId: employee.id,
        employeeName: employee.name,
        amount: netSalary,
        orderName: `${employee.name}님 ${selectedMonth} 급여`,
        returnPath: '/payroll',
      },
    })
  }

  // 월별 일괄 지급 (결제 플로우로 이동)
  const handlePayAll = () => {
    const unpaidEmployees = employees.filter(e => !e.paid)
    
    if (unpaidEmployees.length === 0) {
      alert('지급할 직원이 없습니다.')
      return
    }

    const totalAmount = unpaidEmployees.reduce((sum, emp) => {
      const calc = calculatePayroll(emp)
      return sum + calc.netSalary
    }, 0)

    if (totalAmount <= 0) {
      alert('지급할 총 금액이 없습니다.')
      return
    }

    // 결제 페이지로 이동 (일괄 지급 정보 전달)
    navigate('/payment', {
      state: {
        type: 'batch_salary',
        employeeIds: unpaidEmployees.map(e => e.id),
        employeeNames: unpaidEmployees.map(e => e.name),
        amount: totalAmount,
        orderName: `${selectedMonth} 급여 일괄 지급 (${unpaidEmployees.length}명)`,
        returnPath: '/payroll',
      },
    })
  }

  // 보너스 추가
  const handleAddBonus = (employee: Employee) => {
    const bonusAmount = prompt('보너스 금액을 입력하세요:')
    const reason = prompt('보너스 사유를 입력하세요:')
    
    if (bonusAmount && !isNaN(Number(bonusAmount))) {
      setEmployees(prev =>
        prev.map(e =>
          e.id === employee.id
            ? {
                ...e,
                additions: [
                  ...e.additions,
                  {
                    name: '보너스',
                    amount: Number(bonusAmount),
                    reason: reason || undefined,
                  },
                ],
              }
            : e
        )
      )
    }
  }

  // 월 선택 옵션 생성
  const monthOptions = useMemo(() => {
    const options = []
    const today = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const value = date.toISOString().slice(0, 7)
      const label = `${date.getFullYear()}년 ${date.getMonth() + 1}월`
      options.push({ value, label })
    }
    return options
  }, [])

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen p-8 bg-gray-50">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">직원 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen p-8 bg-gray-50">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-800">급여 관리</h1>
              <p className="text-gray-500">직원별 급여 설정 및 지급 관리</p>
            </div>
            <button
              onClick={() => handleOpenSalaryModal()}
              className="flex items-center gap-2 px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700">
              <Plus className="w-4 h-4" />
              직원 추가
            </button>
          </div>
        </header>

        <div className="p-6 bg-white shadow rounded-2xl">
          {/* 필터 및 월 선택 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  전체
                </button>
                <button
                  onClick={() => setFilter('paid')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === 'paid'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  지급완료
                </button>
                <button
                  onClick={() => setFilter('unpaid')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === 'unpaid'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  미지급
                </button>
                <button
                  onClick={() => setFilter('delayed')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filter === 'delayed'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  지급지연
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="p-2 text-gray-700 border rounded-md">
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handlePayAll}
                className="flex items-center gap-2 px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700">
                <CreditCard className="w-4 h-4" />
                월별 일괄 지급
              </button>
            </div>
          </div>

          {/* 직원 목록 테이블 */}
          {filteredEmployees.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              {employees.length === 0
                ? '등록된 직원이 없습니다. 직원을 추가해주세요.'
                : '해당 조건에 맞는 직원이 없습니다.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-700 bg-gray-100">
                    <th className="p-3 border-b">이름</th>
                    <th className="p-3 border-b">부서</th>
                    <th className="p-3 border-b">기본급</th>
                    <th className="p-3 border-b">공제액</th>
                    <th className="p-3 border-b">추가액</th>
                    <th className="p-3 border-b">실지급액</th>
                    <th className="p-3 text-center border-b">지급 상태</th>
                    <th className="p-3 text-center border-b">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map(e => {
                  const calc = calculatePayroll(e)
                  return (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b font-medium">{e.name}</td>
                      <td className="p-3 border-b text-gray-600">{e.position}</td>
                      <td className="p-3 border-b">{calc.baseSalary.toLocaleString()}원</td>
                      <td className="p-3 border-b text-red-600">
                        -{calc.totalDeductions.toLocaleString()}원
                      </td>
                      <td className="p-3 border-b text-green-600">
                        {calc.totalAdditions > 0 ? '+' : ''}
                        {calc.totalAdditions.toLocaleString()}원
                      </td>
                      <td className="p-3 border-b font-semibold text-blue-600">
                        {calc.netSalary.toLocaleString()}원
                      </td>
                      <td className="p-3 text-center border-b">
                        {e.paid ? (
                          <span className="font-semibold text-green-600">지급 완료</span>
                        ) : e.isDelayed ? (
                          <span className="flex items-center justify-center gap-1 font-semibold text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            지급 지연
                          </span>
                        ) : (
                          <span className="text-yellow-600">미지급</span>
                        )}
                      </td>
                      <td className="flex justify-center gap-2 p-3 text-center border-b">
                        <button
                          onClick={() => handleViewDetail(e)}
                          className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                          상세보기
                        </button>
                        <button
                          onClick={() => handleOpenSalaryModal(e)}
                          className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                          <Settings className="w-4 h-4 inline mr-1" />
                          설정
                        </button>
                        {!e.paid && (
                          <>
                            <button
                              onClick={() => handleAddBonus(e)}
                              className="px-3 py-1.5 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition">
                              <TrendingUp className="w-4 h-4 inline mr-1" />
                              보너스
                            </button>
                            <button
                              onClick={() => handlePayEmployee(e)}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition">
                              <CreditCard className="w-3 h-3" />
                              지급
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
          )}

          {/* 총 급여액 */}
          <div className="mt-6 font-medium text-right text-gray-700">
            총 실지급액:{' '}
            <span className="font-bold text-blue-600">{totalPayroll.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 급여 설정 모달 */}
      {isSalaryModalOpen && selectedEmployee && (
        <SalaryModal
          employee={selectedEmployee}
          onClose={() => {
            setIsSalaryModalOpen(false)
            setSelectedEmployee(null)
          }}
          onSave={handleSaveSalary}
        />
      )}

      {/* 급여 상세 모달 */}
      {isDetailModalOpen && detailEmployee && (
        <DetailModal
          employee={detailEmployee}
          onClose={() => {
            setIsDetailModalOpen(false)
            setDetailEmployee(null)
          }}
        />
      )}
    </div>
  )
}

// 급여 설정 모달 컴포넌트
interface SalaryModalProps {
  employee: Employee
  onClose: () => void
  onSave: (data: {
    name: string
    position: string
    baseSalary: number
    additions: Addition[]
    dueDate: string
  }) => void
}

const SalaryModal: React.FC<SalaryModalProps> = ({ employee, onClose, onSave }) => {
  const [name, setName] = useState(employee.name)
  const [position, setPosition] = useState(employee.position)
  const [baseSalary, setBaseSalary] = useState(employee.baseSalary)
  const [additions, setAdditions] = useState<Addition[]>(employee.additions)
  const [dueDate, setDueDate] = useState(employee.dueDate)

  const [newAdditionName, setNewAdditionName] = useState('')
  const [newAdditionAmount, setNewAdditionAmount] = useState('')
  const [newAdditionReason, setNewAdditionReason] = useState('')

  const deductions = createDefaultDeductions(baseSalary)
  const calc = {
    baseSalary,
    totalDeductions: deductions.reduce((sum, d) => sum + d.amount, 0),
    totalAdditions: additions.reduce((sum, a) => sum + a.amount, 0),
    netSalary: baseSalary - deductions.reduce((sum, d) => sum + d.amount, 0) + additions.reduce((sum, a) => sum + a.amount, 0),
  }

  const handleAddAddition = () => {
    if (newAdditionName && newAdditionAmount && !isNaN(Number(newAdditionAmount))) {
      setAdditions(prev => [
        ...prev,
        {
          name: newAdditionName,
          amount: Number(newAdditionAmount),
          reason: newAdditionReason || undefined,
        },
      ])
      setNewAdditionName('')
      setNewAdditionAmount('')
      setNewAdditionReason('')
    }
  }

  const handleRemoveAddition = (index: number) => {
    setAdditions(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!name || !position || baseSalary <= 0) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }
    onSave({ name, position, baseSalary, additions, dueDate })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">급여 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">부서</label>
                <input
                  type="text"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="부서를 입력하세요"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">기본급</label>
                <input
                  type="number"
                  value={baseSalary || ''}
                  onChange={e => setBaseSalary(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="기본급을 입력하세요"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">지급 예정일</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 공제 항목 (자동 계산) */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">공제 항목</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {deductions.map((ded, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{ded.name}</span>
                    {ded.rate && (
                      <span className="text-xs text-gray-500">({ded.rate}%)</span>
                    )}
                  </div>
                  <span className="font-medium text-red-600">
                    -{ded.amount.toLocaleString()}원
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-300">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-gray-900">총 공제액</span>
                  <span className="text-red-600">-{calc.totalDeductions.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>

          {/* 추가 항목 (보너스, 성과금 등) */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">추가 항목</h3>
            <div className="space-y-3">
              {additions.map((add, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{add.name}</span>
                    {add.reason && (
                      <p className="text-sm text-gray-600">사유: {add.reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-600">
                      +{add.amount.toLocaleString()}원
                    </span>
                    <button
                      onClick={() => handleRemoveAddition(idx)}
                      className="px-2 py-1 text-sm text-red-600 hover:bg-red-100 rounded">
                      삭제
                    </button>
                  </div>
                </div>
              ))}

              {/* 추가 항목 입력 */}
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    value={newAdditionName}
                    onChange={e => setNewAdditionName(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="항목명 (예: 보너스)"
                  />
                  <input
                    type="number"
                    value={newAdditionAmount}
                    onChange={e => setNewAdditionAmount(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="금액"
                  />
                  <input
                    type="text"
                    value={newAdditionReason}
                    onChange={e => setNewAdditionReason(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="사유 (선택)"
                  />
                </div>
                <button
                  onClick={handleAddAddition}
                  className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
                  추가 항목 추가
                </button>
              </div>
            </div>
          </div>

          {/* 급여 요약 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">급여 요약</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">기본급</span>
                <span className="font-medium">{calc.baseSalary.toLocaleString()}원</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">공제액</span>
                <span className="font-medium text-red-600">
                  -{calc.totalDeductions.toLocaleString()}원
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">추가액</span>
                <span className="font-medium text-green-600">
                  +{calc.totalAdditions.toLocaleString()}원
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-blue-300">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">실지급액</span>
                  <span className="text-xl font-bold text-blue-600">
                    {calc.netSalary.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 급여 상세 모달 컴포넌트
interface DetailModalProps {
  employee: Employee
  onClose: () => void
}

const DetailModal: React.FC<DetailModalProps> = ({ employee, onClose }) => {
  const calc = calculatePayroll(employee)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{employee.name} 급여 상세</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">부서</span>
                <p className="font-medium text-gray-900">{employee.position}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">지급 예정일</span>
                <p className="font-medium text-gray-900">
                  {new Date(employee.dueDate).toLocaleDateString('ko-KR')}
                </p>
              </div>
              {employee.paidDate && (
                <div>
                  <span className="text-sm text-gray-500">지급일</span>
                  <p className="font-medium text-green-600">
                    {new Date(employee.paidDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 급여 구성 */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">급여 구성</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">기본급</span>
                <span className="font-medium">{calc.baseSalary.toLocaleString()}원</span>
              </div>

              {/* 공제 항목 */}
              <div className="pt-3 border-t border-gray-300">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">공제 항목</h4>
                {employee.deductions.map((ded, idx) => (
                  <div key={idx} className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{ded.name}</span>
                      {ded.rate && (
                        <span className="text-xs text-gray-500">({ded.rate}%)</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      -{ded.amount.toLocaleString()}원
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-300">
                  <span className="font-semibold text-gray-900">총 공제액</span>
                  <span className="font-semibold text-red-600">
                    -{calc.totalDeductions.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 추가 항목 */}
              {employee.additions.length > 0 && (
                <div className="pt-3 border-t border-gray-300">
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">추가 항목</h4>
                  {employee.additions.map((add, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{add.name}</span>
                        <span className="text-sm font-medium text-green-600">
                          +{add.amount.toLocaleString()}원
                        </span>
                      </div>
                      {add.reason && (
                        <p className="text-xs text-gray-500 mt-1">사유: {add.reason}</p>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-300">
                    <span className="font-semibold text-gray-900">총 추가액</span>
                    <span className="font-semibold text-green-600">
                      +{calc.totalAdditions.toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}

              {/* 실지급액 */}
              <div className="pt-3 mt-3 border-t-2 border-blue-300">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">실지급액</span>
                  <span className="text-xl font-bold text-blue-600">
                    {calc.netSalary.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayrollPage
