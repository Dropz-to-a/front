// src/pages/MyApplications.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { JOBS_DATA } from './Jobs'
import { Trash2, FileText, CalendarDays } from 'lucide-react'
import type { AppliedJob } from '../types/Application'

type AppliedItem = { id: string; date: string }

export default function MyApplications() {
  const [appliedList, setAppliedList] = useState<AppliedItem[]>([])

  // ✅ 로컬스토리지에서 불러오기
  useEffect(() => {
    document.title = '내 지원 목록'
    const stored = JSON.parse(localStorage.getItem('appliedJobs') || '[]')
    setAppliedList(stored)
  }, [])

  // ✅ 지원 삭제
  const handleRemove = (id: string) => {
    const updated = appliedList.filter(x => x.id !== id)
    setAppliedList(updated)
    localStorage.setItem('appliedJobs', JSON.stringify(updated))
  }

  // ✅ JOBS_DATA에서 지원한 공고 필터링
  const appliedJobs = appliedList
    .map(item => {
      const job = JOBS_DATA.find(j => j.id === item.id)
      return job ? { ...job, date: item.date } : null
    })
    .filter((j): j is AppliedJob => j !== null)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <main className="flex-1 w-full max-w-6xl px-4 py-10 mx-auto">
        <h1 className="mb-2 text-2xl font-bold">내 지원 목록</h1>
        <p className="mb-6 text-gray-500">
          언제 어떤 공고에 지원했는지 한눈에 확인할 수 있습니다.
        </p>

        {appliedJobs.length === 0 ? (
          <div className="py-20 text-center text-gray-500 border border-gray-300 border-dashed rounded-2xl">
            아직 지원한 공고가 없습니다.{' '}
            <Link to="/jobs" className="font-semibold text-indigo-600 hover:underline">
              채용공고 보러가기 →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appliedJobs.map((job: AppliedJob) => (
              <div
                key={job.id} // ✅ 여기 수정!
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
                    <FileText className="w-4 h-4" />
                    상세보기
                  </Link>

                  <button
                    onClick={() => handleRemove(job.id)}
                    className="flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700">
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="py-6 text-sm text-center text-gray-400">
        © 2025 JOBIT — My Applications
      </footer>
    </div>
  )
}
