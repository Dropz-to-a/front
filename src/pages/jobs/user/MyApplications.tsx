import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import { Trash2, FileText, CalendarDays, Search } from 'lucide-react'
import type { AppliedJob } from '@/types/Application'
import { applicationApi, type Application } from '@/api/applicationApi'
import { jobPostingApi, type PublicJobPosting } from '@/api/jobPostingApi'
import type { Job } from './Jobs'

// API 응답을 Job 타입으로 변환
const convertToJob = (posting: PublicJobPosting): Job => {
  return {
    id: String(posting.postingId),
    company: posting.companyName,
    title: posting.title,
    description: '',
    location: posting.locationText,
    salaryNote: posting.salaryMin > 0 || posting.salaryMax > 0
      ? `${posting.salaryMin > 0 ? posting.salaryMin.toLocaleString() : '협의'} ~ ${posting.salaryMax > 0 ? posting.salaryMax.toLocaleString() : '협의'}만원`
      : undefined,
    status: '모집 중',
    category: '기타',
    applyUrl: `/jobs/${posting.postingId}`,
  }
}

// 상태 코드를 한글로 변환
const getStatusText = (status: Application['status']): AppliedJob['applicationStatus'] => {
  switch (status) {
    case 'PENDING':
      return '지원완료'
    case 'REVIEWING':
      return '검토중'
    case 'ACCEPTED':
      return '합격'
    case 'REJECTED':
      return '불합격'
    default:
      return '지원완료'
  }
}

type AppliedJobWithId = AppliedJob & { applicationId: number }

export default function MyApplications() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJobWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 지원 목록과 공고 목록을 병렬로 가져오기
      const [applications, jobPostings] = await Promise.all([
        applicationApi.getMyApplications(),
        jobPostingApi.getPublicList(),
      ])

      // 지원 목록과 공고 정보를 조합
      const combined = applications
        .map(app => {
          const posting = jobPostings.find(p => p.postingId === app.postingId)
          if (!posting) return null

          const job = convertToJob(posting)
          return {
            ...job,
            date: new Date(app.appliedAt).toLocaleDateString('ko-KR'),
            applicationStatus: getStatusText(app.status),
            note: app.note ?? '',
            applicationId: app.applicationId,
          } as AppliedJobWithId
        })
        .filter((job): job is AppliedJobWithId => job !== null)

      setAppliedJobs(combined)
    } catch (e: unknown) {
      console.error('[MyApplications] 지원 목록 조회 실패:', e)
      const error = e as { status?: number; code?: string; message?: string }
      
      // 500 에러인 경우 더 자세한 메시지 표시
      if (error?.status === 500) {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      } else {
        setError(error?.message ?? '지원 목록을 불러오는데 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  // 지원 삭제
  const handleRemove = async (applicationId: number) => {
    if (!confirm('정말로 이 지원을 삭제하시겠습니까?')) {
      return
    }

    try {
      await applicationApi.delete(applicationId)
      // 삭제 후 목록 새로고침
      await loadApplications()
    } catch (e: unknown) {
      const error = e as { message?: string }
      alert(error?.message ?? '지원 삭제에 실패했습니다.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="flex-1 w-full max-w-6xl px-4 py-10 mx-auto">
        <h1 className="mb-2 text-2xl font-bold">내 지원 목록</h1>
        <p className="mb-6 text-gray-500">언제 어떤 공고에 지원했는지 한눈에 확인할 수 있습니다.</p>

        {loading ? (
          <div className="py-20 text-center text-gray-500 border border-gray-300 border-dashed rounded-2xl">
            지원 목록을 불러오는 중...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 border border-red-300 border-dashed rounded-2xl">
            <p className="mb-2 font-semibold">지원 목록을 불러오는데 실패했습니다.</p>
            <p className="mb-4 text-sm">{error}</p>
            <button
              onClick={loadApplications}
              className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              다시 시도
            </button>
          </div>
        ) : appliedJobs.length === 0 ? (
          <div className="py-20 text-center text-gray-500 border border-gray-300 border-dashed rounded-2xl">
            아직 지원한 공고가 없습니다.{' '}
            <Link to="/jobs" className="font-semibold text-indigo-600 hover:underline">
              채용공고 보러가기 →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appliedJobs.map((job: AppliedJobWithId) => {
              return (
                <div
                  key={job.id}
                  className="flex flex-col w-full px-6 py-4 transition bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                  {/* 좌측 정보 */}
                  <div className="flex items-center gap-4">
                    {job.logoUrl && (
                      <img
                        src={job.logoUrl}
                        alt={job.company}
                        className="object-contain w-12 h-12 border border-gray-200 rounded-md"
                      />
                    )}
                    <div>
                      <h2 className="font-semibold text-gray-800">{job.company}</h2>
                      <p className="text-sm text-gray-500">{job.title}</p>
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                          job.applicationStatus === '합격'
                            ? 'bg-green-100 text-green-700'
                            : job.applicationStatus === '불합격'
                            ? 'bg-red-100 text-red-700'
                            : job.applicationStatus === '검토중'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                        {job.applicationStatus}
                      </span>
                    </div>
                  </div>

                  {/* 중앙: 지원일 */}
                  <div className="flex items-center gap-1 mt-3 text-sm text-gray-500 sm:mt-0 sm:ml-4">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span>지원일: {job.date}</span>
                  </div>

                  {/* 우측 버튼들 */}
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <Link
                      to={`/jobs/${job.id}`}
                      state={{ job }}
                      className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline">
                      <Search className="w-4 h-4" />
                      상세보기
                    </Link>
                    <Link
                      to={`/resume/${job.id}`}
                      state={{ job }}
                      className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline">
                      <FileText className="w-4 h-4" />
                      지원서 보기
                    </Link>

                    <button
                      onClick={() => handleRemove(job.applicationId)}
                      className="flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700">
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <footer className="py-6 text-sm text-center text-gray-400">
        © 2025 JOBIT — My Applications
      </footer>
    </div>
  )
}
