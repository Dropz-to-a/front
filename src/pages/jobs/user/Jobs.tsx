/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { useMemo, useState, useEffect } from 'react'
import Header from '@/components/Header'
import { JobCard } from '@/components/Jobs/JobCard'
import { jobPostingApi, type PublicJobPosting } from '@/api/jobPostingApi'

/** ====== 타입 ====== */
 export type Job = {
     id: string;
     company: string;
     title: string;
     description: string;
     location?: string;
     salaryNote?: string;
     salary?: string;
     badges?: string[];
     dday?: number;
   verified?: boolean;
   status?: "모집 중" | "마감됨";
     hot?: boolean;
   new?: boolean;
   date?: string;
   applicants?: number;
     category: "개발" | "디자인" | "마케팅" | "운영" | "영업" | "기타";
     imageUrl?: string;
     logoUrl?: string;
     applyUrl?: string; // 외부/내부 혼용 가능
};
 
export type JobDetail = Job & {
  postedAt?: string;          // 게시일
  overview?: string;          // 회사/포지션 소개
  responsibilities?: string[]; // 주요업무
  requirements?: string[];     // 자격요건
  preferred?: string[];        // 우대사항
  benefits?: string[];         // 복지 및 혜택
  process?: string[];          // 채용 절차
  employmentType?: string;     // 고용형태 (정규직, 인턴 등)
}

/** ====== 페이지 구성 ====== */
const categories = ['전체', '개발', '디자인', '마케팅', '운영', '영업', '기타'] as const
type CategoryFilter = (typeof categories)[number]

type SortKey = '최근등록' | '마감임박' | '인기'

// API 응답을 Job 타입으로 변환
const convertToJob = (posting: PublicJobPosting): Job => {
  return {
    id: String(posting.postingId),
    company: posting.companyName,
    title: posting.title,
    description: '', // 공개 API에는 description이 없을 수 있음
    location: posting.locationText,
    salaryNote: posting.salaryMin > 0 || posting.salaryMax > 0
      ? `${posting.salaryMin > 0 ? posting.salaryMin.toLocaleString() : '협의'} ~ ${posting.salaryMax > 0 ? posting.salaryMax.toLocaleString() : '협의'}만원`
      : undefined,
    status: '모집 중', // 공개 API는 모집 중인 공고만 반환
    category: '기타', // API에 카테고리가 없으면 기본값
    applyUrl: `/jobs/${posting.postingId}`,
  }
}

export default function Jobs() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('전체')
  const [sort, setSort] = useState<SortKey>('최근등록')
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobPostingApi.getPublicList()
      // 공개 API는 이미 모집 중인 공고만 반환하므로 필터링 불필요
      const convertedJobs = data.map(convertToJob)
      setJobs(convertedJobs)
    } catch (e: any) {
      console.error('[Jobs] 공고 목록 조회 실패:', e)
      setError(e?.message ?? '공고 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    let list = jobs.filter(j => {
      const byCategory = category === '전체' ? true : j.category === category
      const byKeyword =
        !keyword.trim() ||
        [j.company, j.title, j.description].some(t =>
          (t ?? '').toLowerCase().includes(keyword.toLowerCase()),
        )
      return byCategory && byKeyword
    })

    // 정렬
    if (sort === '마감임박') {
      list = [...list].sort((a, b) => (a.dday ?? 9999) - (b.dday ?? 9999))
    } else if (sort === '인기') {
      list = [...list].sort((a, b) => Number(b.hot ?? 0) - Number(a.hot ?? 0))
    } else {
      // 최근등록: postingId 기준 내림차순
      list = [...list].sort((a, b) => Number(b.id) - Number(a.id))
    }
    return list
  }, [jobs, keyword, category, sort])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* 헤더 영역 (페이지 타이틀) */}
      <section className="w-full max-w-6xl px-4 pt-10 pb-6 mx-auto">
        <h1 className="text-2xl font-bold text-gray-900">지금 가장 주목받는 공고예요!</h1>
        <p className="mt-2 text-sm text-gray-500">
          AI 매칭과 신뢰도 지표를 기반으로 선별된 최신 채용 정보를 확인해보세요.
        </p>
      </section>

      {/* 필터바 */}
      <section className="sticky top-0 z-10 border-gray-200 border-y bg-white/80 backdrop-blur">
        <div className="flex flex-col w-full max-w-6xl gap-3 px-4 py-3 mx-auto md:flex-row md:items-center md:justify-between">
          {/* 검색 */}
          <div className="flex items-center flex-1 gap-2">
            <div className="relative w-full md:max-w-md">
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="회사, 공고 제목, 키워드 검색"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-indigo-500"
              />
              <span className="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
                🔎
              </span>
            </div>
          </div>

          {/* 카테고리/정렬 */}
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CategoryFilter)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:border-indigo-500">
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl focus:border-indigo-500">
              <option value="최근등록">최근 등록순</option>
              <option value="마감임박">마감 임박순</option>
              <option value="인기">인기순</option>
            </select>
          </div>
        </div>
      </section>

      {/* 카드 그리드 */}
      <section className="w-full max-w-6xl px-4 py-8 mx-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-500 border border-gray-300 border-dashed rounded-2xl">
            공고를 불러오는 중...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 border border-red-300 border-dashed rounded-2xl">
            <p className="mb-2 font-semibold">공고를 불러오는데 실패했습니다.</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={loadJobs}
              className="mt-4 px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              다시 시도
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500 border border-gray-300 border-dashed rounded-2xl">
            조건에 맞는 공고가 없어요. 필터를 변경해보세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
