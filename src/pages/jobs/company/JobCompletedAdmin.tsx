import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import { jobPostingApi, type JobPosting } from '@/api/jobPostingApi'
import { applicationApi, type CompanyApplicationListItem } from '@/api/applicationApi'

// 지원서 타입에 postingId 추가
type ApplicationWithPosting = CompanyApplicationListItem & {
  postingId: number
}

// 상태 텍스트 매핑
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    APPLIED: '지원 완료',
    PENDING: '대기 중',
    REVIEWING: '검토 중',
    ACCEPTED: '합격',
    REJECTED: '불합격',
    HIRED: '채용 완료',
  }
  return statusMap[status] || status
}

const JobCompletedAdmin = () => {
  const companyId = localStorage.getItem('companyId') || 'dropz'
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [applications, setApplications] = useState<ApplicationWithPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registeringEmployeeId, setRegisteringEmployeeId] = useState<number | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null)
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean
    applicationId: number
    applicantName: string
    currentStatus: string
  } | null>(null)

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobPostingApi.getList()
      setJobs(data)
    } catch (e: unknown) {
      console.error('[JobCompletedAdmin] 공고 목록 조회 실패:', e)
      setError('공고 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadApplications = useCallback(async () => {
    if (jobs.length === 0) {
      setApplications([])
      return
    }

    try {
      setApplicationsLoading(true)
      // 모든 공고의 지원서를 병렬로 가져오기
      const allApplicationsPromises = jobs.map(async job => {
        try {
          const apps = await applicationApi.getCompanyApplicationsByPosting(job.postingId)
          return apps.map(app => ({
            ...app,
            postingId: job.postingId,
          }))
        } catch (e) {
          console.error(`[JobCompletedAdmin] 공고 ${job.postingId} 지원서 조회 실패:`, e)
          return []
        }
      })

      const allApplicationsArrays = await Promise.all(allApplicationsPromises)
      const allApplications = allApplicationsArrays.flat()
      setApplications(allApplications)
    } catch (e: unknown) {
      console.error('[JobCompletedAdmin] 지원서 목록 조회 실패:', e)
    } finally {
      setApplicationsLoading(false)
    }
  }, [jobs])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  useEffect(() => {
    if (jobs.length > 0) {
      loadApplications()
    }
  }, [jobs, loadApplications])

  // 직원 등록 (취업) 핸들러
  const handleRegisterEmployee = async (employeeId: number, applicantName: string) => {
    if (!confirm(`${applicantName}님을 직원으로 등록하시겠습니까?`)) {
      return
    }

    try {
      setRegisteringEmployeeId(employeeId)
      await applicationApi.registerEmployee(employeeId)
      alert(`${applicantName}님이 직원으로 등록되었습니다! ✅`)
      // 지원서 목록 새로고침
      await loadApplications()
    } catch (e: unknown) {
      console.error('[JobCompletedAdmin] 직원 등록 실패:', e)
      const error = e as { message?: string }
      alert(error?.message ?? '직원 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setRegisteringEmployeeId(null)
    }
  }

  // 상태 변경 모달 열기
  const openStatusModal = (applicationId: number, applicantName: string, currentStatus: string) => {
    // 이미 최종 결정이 완료된 경우 처리하지 않음
    if (currentStatus === 'HIRED' || currentStatus === 'REJECTED') {
      alert('이미 최종 결정이 완료된 지원서입니다.')
      return
    }
    setStatusModal({ isOpen: true, applicationId, applicantName, currentStatus })
  }

  // 상태 변경 모달 닫기
  const closeStatusModal = () => {
    setStatusModal(null)
  }

  // 지원 결과 변경 핸들러
  const handleUpdateStatus = async (status: 'HIRED' | 'REJECTED') => {
    if (!statusModal) return

    const { applicationId, applicantName } = statusModal

    const confirmMessage =
      status === 'HIRED'
        ? `${applicantName}님을 합격 처리하시겠습니까?`
        : `${applicantName}님을 불합격 처리하시겠습니까?`

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setUpdatingStatusId(applicationId)
      await applicationApi.updateApplicationResult(applicationId, status)
      alert(
        `${applicantName}님의 지원 결과가 ${
          status === 'HIRED' ? '합격' : '불합격'
        }으로 변경되었습니다.`
      )
      // 지원서 목록 새로고침
      await loadApplications()
      closeStatusModal()
    } catch (e: unknown) {
      console.error('[JobCompletedAdmin] 지원 결과 변경 실패:', e)
      const error = e as { message?: string }
      alert(error?.message ?? '지원 결과 변경에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUpdatingStatusId(null)
    }
  }

  const filteredApplicants =
    selectedJob === 'all'
      ? applications
      : applications.filter(app => app.postingId === Number(selectedJob))

  const statusColor: Record<string, string> = {
    '지원 완료': 'bg-blue-100 text-blue-700',
    '대기 중': 'bg-gray-100 text-gray-700',
    '검토 중': 'bg-yellow-100 text-yellow-700',
    합격: 'bg-green-100 text-green-700',
    불합격: 'bg-red-100 text-red-700',
    '채용 완료': 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl px-6 py-10 mx-auto">
        {/* 상단 제목 */}
        <div className="flex flex-col mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-bold text-gray-900">
              📋 지원자 관리 (공고별 지원 현황)
            </h1>
            <p className="text-gray-500">
              로그인된 기업: <span className="font-semibold text-indigo-600">{companyId}</span>
            </p>
          </div>

          <Link
            to="/contracts"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition">
            계약 관리로 이동
          </Link>
        </div>

        {/* 공고 선택 */}
        <div className="flex items-center gap-3 mb-8">
          <label className="text-sm font-medium text-gray-600">공고 선택:</label>
          {loading ? (
            <p className="text-sm text-gray-500">공고 목록을 불러오는 중...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <select
              value={selectedJob}
              onChange={e => setSelectedJob(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">전체 공고</option>
              {jobs.map(job => (
                <option key={job.postingId} value={String(job.postingId)}>
                  {job.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 지원자 목록 */}
        <div className="overflow-hidden bg-white shadow rounded-xl">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-gray-700 bg-gray-100">
                <th className="p-3 text-sm font-semibold">이름</th>
                <th className="p-3 text-sm font-semibold">공고명</th>
                <th className="p-3 text-sm font-semibold">지원 상태</th>
                <th className="p-3 text-sm font-semibold">지원 일시</th>
                <th className="p-3 text-sm font-semibold text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {loading || applicationsLoading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-sm text-center text-gray-500">
                    {loading ? '공고 목록을 불러오는 중...' : '지원서 목록을 불러오는 중...'}
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-sm text-center text-gray-500">
                    선택된 공고의 지원자가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map(app => {
                  const job = jobs.find(j => j.postingId === app.postingId)
                  const statusText = getStatusText(app.status)
                  const appliedDate = app.appliedAt
                    ? new Date(app.appliedAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'
                  const isAccepted = app.status === 'ACCEPTED'
                  const isHired = app.status === 'HIRED'
                  const isRejected = app.status === 'REJECTED'
                  const isRegistering = registeringEmployeeId === app.writerId
                  const isUpdatingStatus = updatingStatusId === app.applicationId
                  const canChangeStatus = !isHired && !isRejected

                  return (
                    <tr key={app.applicationId} className="transition border-t hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{app.name}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {job ? job.title : '알 수 없음'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColor[statusText] || 'bg-gray-100 text-gray-700'
                          }`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{appliedDate}</td>
                      <td className="p-3 space-x-2 text-right">
                        <Link
                          to={`/applications/resume/${app.applicationId}`}
                          className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                          이력서 보기
                        </Link>
                        <button
                          onClick={() => openStatusModal(app.applicationId, app.name, app.status)}
                          disabled={isUpdatingStatus || !canChangeStatus}
                          className="px-4 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                          {isUpdatingStatus ? '변경 중...' : '상태 변경'}
                        </button>
                        {isAccepted && !isHired && (
                          <button
                            onClick={() => handleRegisterEmployee(app.writerId, app.name)}
                            disabled={isRegistering}
                            className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {isRegistering ? '등록 중...' : '채용'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 상태 변경 모달 */}
        {statusModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">지원 결과 결정</h2>
              <p className="text-gray-600 mb-6">
                <span className="font-semibold">{statusModal.applicantName}</span>님의 지원 결과를
                선택해주세요.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeStatusModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                  취소
                </button>
                <button
                  onClick={() => handleUpdateStatus('REJECTED')}
                  disabled={updatingStatusId === statusModal.applicationId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  불합격
                </button>
                <button
                  onClick={() => handleUpdateStatus('HIRED')}
                  disabled={updatingStatusId === statusModal.applicationId}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  합격
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default JobCompletedAdmin
