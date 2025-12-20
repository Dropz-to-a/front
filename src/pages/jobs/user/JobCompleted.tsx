import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Briefcase, Home, FileText, AlertCircle } from 'lucide-react'
import Header from '@/components/Header'
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

export default function JobCompleted() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadJob = useCallback(async () => {
    if (!id) {
      setError('공고 ID가 없습니다.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await jobPostingApi.getPublicList()
      const foundPosting = data.find(p => String(p.postingId) === id)
      
      if (!foundPosting) {
        setError('해당 공고를 찾을 수 없습니다.')
        return
      }

      const convertedJob = convertToJob(foundPosting)
      setJob(convertedJob)
    } catch (e: unknown) {
      console.error('[JobCompleted] 공고 조회 실패:', e)
      const error = e as { message?: string }
      setError(error?.message ?? '공고 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadJob()
  }, [loadJob])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
          <div className="w-16 h-16 mb-4 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">공고 정보를 불러오는 중...</p>
        </main>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
          <AlertCircle className="w-16 h-16 mb-4 text-gray-400" />
          <h2 className="mb-2 text-2xl font-bold text-gray-700">
            {error || '해당 공고를 찾을 수 없습니다.'}
          </h2>
          <p className="mb-6 text-gray-500">링크가 잘못되었거나 공고가 삭제되었을 수 있어요.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-semibold hover:bg-indigo-700">
            채용공고 목록으로 돌아가기
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen text-gray-800 bg-gray-50">
      <Header />

      {/* ✅ 메인 */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
        {/* 🎉 아이콘 + 문구 */}
        <div className="flex flex-col items-center animate-fadeIn">
          <CheckCircle2 className="w-20 h-20 mb-4 text-green-500 animate-pop" />

          <h1 className="mb-3 text-3xl font-bold md:text-4xl animate-fadeUp">
            지원이 완료되었습니다 🎉
          </h1>

          <p className="max-w-md text-gray-600">
            <strong>{job.company}</strong>의 <strong>{job.title}</strong> 공고에 대한 지원이
            성공적으로 접수되었습니다.
          </p>
        </div>

        {/* 🧾 회사 정보 카드 */}
        <div className="w-full max-w-md p-6 mt-10 text-left bg-white border border-gray-200 shadow-md rounded-2xl animate-fadeUp">
          <div className="flex items-center gap-4 mb-4">
            {job.logoUrl && (
              <img
                src={job.logoUrl}
                alt={job.company}
                className="object-contain bg-white border border-gray-200 rounded-lg w-14 h-14"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{job.company}</h2>
              <p className="text-sm text-gray-500">{job.title}</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">지원 일시:</span> {new Date().toLocaleString('ko-KR')}
          </p>
        </div>

        {/* 🎯 버튼 섹션 */}
        <div className="flex flex-col gap-4 mt-10 sm:flex-row animate-fadeInDelay">
          <Link
            to={`/jobs/${id}`}
            state={{ job }}
            className="flex items-center justify-center gap-2 px-6 py-3 text-white transition bg-green-600 rounded-lg hover:bg-green-700">
            <FileText className="w-5 h-5" />
            상세 공고 보기
          </Link>
          <Link
            to="/jobs"
            className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-100">
            <Briefcase className="w-5 h-5" />
            다른 공고 보기
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-100">
            <Home className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
        </div>
      </main>

      {/* 하단 */}
      <footer className="py-6 text-sm text-center text-gray-400">
        © 2025 JOBIT — All rights reserved.
      </footer>
    </div>
  )
}

/* ===== 추가 애니메이션 스타일 (Tailwind 확장) =====
Tailwind CSS의 `@layer utilities`에 다음을 추가하면 자연스러운 효과 가능
(예: index.css 또는 global.css 아래쪽에 추가)
*/
