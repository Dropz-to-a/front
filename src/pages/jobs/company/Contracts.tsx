import { useState } from 'react'
import Header from '@/components/Header'
import { ChevronRight, ChevronDown, User, FileText, CheckCircle, FolderTree } from 'lucide-react'

type Employee = {
  id: string
  name: string
  position: string
  status: '요청 중' | '진행 중' | '완료'
  startDate: string
  endDate?: string
  fileUrl?: string
}

type Department = {
  id: string
  name: string
  employees: Employee[]
}

export default function DepartmentTreePage() {
  const [departments] = useState<Department[]>([
    {
      id: 'dev',
      name: '개발팀',
      employees: [
        {
          id: '1',
          name: '박지우',
          position: '프론트엔드 개발자',
          status: '진행 중',
          startDate: '2025-10-20',
          endDate: '2026-10-20',
          fileUrl: '/contracts/sample1.pdf',
        },
        {
          id: '2',
          name: '이민재',
          position: '백엔드 엔지니어',
          status: '요청 중',
          startDate: '2025-10-25',
        },
      ],
    },
    {
      id: 'design',
      name: '디자인팀',
      employees: [
        {
          id: '3',
          name: '김가은',
          position: 'UI 디자이너',
          status: '완료',
          startDate: '2024-09-01',
          endDate: '2025-09-01',
          fileUrl: '/contracts/sample2.pdf',
        },
      ],
    },
    { id: 'ops', name: '운영팀', employees: [] },
  ])

  const [expanded, setExpanded] = useState<string[]>(['dev'])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  const toggleExpand = (id: string) => {
    setExpanded(prev => (prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex flex-col flex-1 w-full gap-6 px-6 py-10 mx-auto md:flex-row max-w-7xl">
        {/* ===== 좌측 트리 ===== */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 w-full md:w-[320px] flex-shrink-0 overflow-y-auto max-h-[80vh]">
          <div className="flex items-center gap-2 mb-4">
            <FolderTree className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">부서별 재직자 관리</h2>
          </div>

          <div className="space-y-2">
            {departments.map(dept => (
              <div key={dept.id} className="relative group">
                <button
                  onClick={() => toggleExpand(dept.id)}
                  className="flex items-center w-full gap-2 px-3 py-2 font-semibold text-left text-gray-800 transition-all duration-150 rounded-md hover:bg-indigo-50">
                  {expanded.includes(dept.id) ? (
                    <ChevronDown className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-indigo-500" />
                  )}
                  {dept.name}
                  <span className="ml-auto text-sm text-gray-500">{dept.employees.length}명</span>
                </button>

                {expanded.includes(dept.id) && (
                  <div className="pl-4 mt-2 space-y-1 border-l border-gray-200 ml-7">
                    {dept.employees.length > 0 ? (
                      dept.employees.map(emp => (
                        <div
                          key={emp.id}
                          onClick={() => setSelectedEmployee(emp)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm transition-all ${
                            selectedEmployee?.id === emp.id
                              ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}>
                          <User className="w-4 h-4" />
                          <span>
                            {emp.name} <span className="text-gray-500">— {emp.position}</span>
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="ml-2 text-sm text-gray-400">인원이 없습니다.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===== 우측 상세 ===== */}
        <div className="flex-1 p-8 bg-white border border-gray-200 shadow-md rounded-2xl">
          {selectedEmployee ? (
            <>
              <div className="flex items-center justify-between pb-3 mb-4 border-b">
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                  <User className="w-5 h-5 text-indigo-600" />
                  {selectedEmployee.name}
                </h3>
                <StatusBadge status={selectedEmployee.status} />
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <b>직책:</b> {selectedEmployee.position}
                </p>
                <p>
                  <b>계약 기간:</b> {selectedEmployee.startDate}{' '}
                  {selectedEmployee.endDate && `~ ${selectedEmployee.endDate}`}
                </p>
              </div>

              {selectedEmployee.fileUrl ? (
                <a
                  href={selectedEmployee.fileUrl}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2 mt-6 text-sm font-semibold text-indigo-700 transition-all bg-indigo-100 rounded-md hover:bg-indigo-200">
                  <FileText className="w-4 h-4" />
                  계약서 다운로드
                </a>
              ) : (
                <p className="mt-3 text-xs text-gray-400">계약서 파일 없음</p>
              )}

              {selectedEmployee.status === '요청 중' && (
                <button
                  onClick={() => alert(`${selectedEmployee.name}님에게 계약 요청 전송됨`)}
                  className="px-5 py-2 mt-4 text-sm text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200">
                  계약 요청
                </button>
              )}

              {selectedEmployee.status === '진행 중' && (
                <button
                  onClick={() => alert(`${selectedEmployee.name}님 계약 완료 처리됨`)}
                  className="px-5 py-2 mt-4 text-sm text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                  완료 처리
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <CheckCircle className="w-10 h-10 mb-2 text-gray-300" />
              <p>직원을 선택하면 상세 계약 정보를 볼 수 있습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

/** ===== 상태 배지 ===== */
const StatusBadge = ({ status }: { status: Employee['status'] }) => {
  const color =
    status === '완료'
      ? 'bg-green-100 text-green-700'
      : status === '진행 중'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-yellow-100 text-yellow-700'

  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-semibold border ${color} border-opacity-50`}>
      {status}
    </span>
  )
}
