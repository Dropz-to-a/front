import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/Header'
import { jobPostingApi, type JobPosting, type JobPostingHistory } from '@/api/jobPostingApi'

const JobManage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [history, setHistory] = useState<JobPostingHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (activeTab === 'active') {
      loadJobs()
    } else {
      loadHistory()
    }
  }, [activeTab])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const data = await jobPostingApi.getList()
      setJobs(data)
    } catch (e: any) {
      alert(e?.message ?? '공고 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      setLoading(true)
      const data = await jobPostingApi.getHistory()
      setHistory(data)
    } catch (e: any) {
      alert(e?.message ?? '공고 기록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ 삭제(마감)
  const handleClose = async (postingId: number, title: string) => {
    if (!confirm(`"${title}" 공고를 마감하시겠습니까?\n지원자가 있으면 마감할 수 없습니다.`)) {
      return
    }

    try {
      await jobPostingApi.close(postingId)
      alert('공고가 마감되었습니다.')
      if (activeTab === 'active') {
        await loadJobs()
      }
    } catch (e: any) {
      alert(e?.message ?? '공고 마감에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="px-6 py-12 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📋 내 공고 관리</h1>
          <Link
            to="/jobregister"
            className="px-5 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700">
            + 새 공고 등록
          </Link>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'active'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            모집 중 / 임시저장
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'history'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            마감된 공고 기록
          </button>
        </div>

        {/* ✅ 카드 리스트 */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">불러오는 중...</div>
        ) : activeTab === 'active' ? (
          jobs.length === 0 ? (
            <div className="py-20 text-center text-gray-500">등록된 공고가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map(job => (
              <div
                key={job.postingId}
                className="relative flex flex-col overflow-hidden transition bg-white border border-gray-200 shadow-sm group rounded-2xl hover:shadow-md">
                {/* 썸네일 */}
                <div className="aspect-[16/9] w-full bg-gray-100">
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-blue-200" />
                </div>

                {/* 본문 */}
                <div className="flex flex-col flex-1 gap-3 p-4">
                  {/* 상단 (제목 + 상태) */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                        {job.title}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${
                        job.status === 'OPEN'
                          ? 'bg-green-100 text-green-700'
                          : job.status === 'CLOSED'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {job.status === 'OPEN' ? '모집 중' : job.status === 'CLOSED' ? '마감됨' : '임시저장'}
                    </span>
                  </div>

                  {/* 설명 */}
                  <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

                  {/* 위치/급여 */}
                  <div className="text-xs text-gray-400">
                    📍 {job.locationText || '미지정'} · 💰 {job.salaryMin > 0 || job.salaryMax > 0 
                      ? `${job.salaryMin > 0 ? job.salaryMin.toLocaleString() : '협의'} ~ ${job.salaryMax > 0 ? job.salaryMax.toLocaleString() : '협의'}만원`
                      : '협의'}
                  </div>

                  {/* 하단 버튼 */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t">
                    <span className="text-xs text-gray-400">지원자 {job.applicantCount}명</span>
                    <div className="flex items-center gap-2">
                      {job.status === 'OPEN' && (
                        <>
                          <Link
                            to={`/jobmanage/${job.postingId}`}
                            onClick={e => e.stopPropagation()}
                            className="px-2 py-1 text-xs text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                            수정
                          </Link>
                          <Link
                            to={`/jobs/${job.postingId}/completed/admin`}
                            onClick={e => e.stopPropagation()}
                            className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                            지원자 보기
                          </Link>
                          <button
                            type="button"
                            onClick={e => {
                              e.preventDefault()
                              handleClose(job.postingId, job.title)
                            }}
                            className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                            마감
                          </button>
                        </>
                      )}
                      {job.status === 'CLOSED' && (
                        <span className="text-xs text-gray-400">마감된 공고</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )
        ) : (
          history.length === 0 ? (
            <div className="py-20 text-center text-gray-500">마감된 공고 기록이 없습니다.</div>
          ) : (
            <div className="overflow-hidden bg-white shadow rounded-xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-gray-700 bg-gray-100">
                    <th className="p-3 text-sm font-semibold">공고 제목</th>
                    <th className="p-3 text-sm font-semibold">마감일</th>
                    <th className="p-3 text-sm font-semibold text-right">총 지원자 수</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.postingId} className="transition border-t hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{item.title}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(item.closedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-3 text-sm text-gray-600 text-right">
                        {item.totalApplicants}명
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>
    </div>
  )
}

export default JobManage
