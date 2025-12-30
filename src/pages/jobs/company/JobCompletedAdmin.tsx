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
  const [error, setError] = useState<string | null>(null)

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobPostingApi.getList()
      // 회사 계정의 공고만 필터링 (실제로는 API에서 자동으로 필터링됨)
      setJobs(data)
    } catch (e: unknown) {
      console.error('[JobCompletedAdmin] 공고 목록 조회 실패:', e)
      setError('공고 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadApplications = useCallback(async () => {
    if (jobs.length === 0) return

    try {
      // 모든 공고의 지원서를 병렬로 가져오기
      const allApplicationsPromises = jobs.map(async (job) => {
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

  const filteredApplicants =
    selectedJob === 'all'
      ? applications
      : applications.filter(app => app.postingId === Number(selectedJob))

  const statusColor: Record<string, string> = {
    '지원 완료': 'bg-blue-100 text-blue-700',
    '대기 중': 'bg-gray-100 text-gray-700',
    '검토 중': 'bg-yellow-100 text-yellow-700',
    '합격': 'bg-green-100 text-green-700',
    '불합격': 'bg-red-100 text-red-700',
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-sm text-center text-gray-500">
                    지원서 목록을 불러오는 중...
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-sm text-center text-gray-500">
                    선택된 공고의 지원자가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => {
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
                  return (
                    <tr key={app.applicationId} className="transition border-t hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{app.name}</td>
                      <td className="p-3 text-sm text-gray-600">{job ? job.title : '알 수 없음'}</td>
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
                        <button className="px-4 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                          상태 변경
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default JobCompletedAdmin
