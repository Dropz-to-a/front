import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/Header'
import type { JobDetail } from '@/pages/jobs/user/Jobs'

/** ==== 유틸 컴포넌트 ==== */
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-gray-700 bg-white border-gray-200">
    {children}
  </span>
)

const Dday = ({ d }: { d?: number }) => {
  if (d === undefined) return null
  if (d < 0) return <span className="text-xs font-semibold text-gray-400">마감</span>
  if (d === 0) return <span className="text-xs font-semibold text-rose-600">D-DAY</span>
  return <span className="text-xs font-semibold text-indigo-600">D-{d}</span>
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="p-6 bg-white border border-gray-200 rounded-2xl">
    <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>
    <div className="prose-sm prose text-gray-700 max-w-none">{children}</div>
  </section>
)

const List = ({ items }: { items?: string[] }) =>
  !items || items.length === 0 ? null : (
    <ul className="pl-5 space-y-1 list-disc">
      {items.map((li, i) => (
        <li key={i}>{li}</li>
      ))}
    </ul>
  )

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="w-48 h-6 bg-gray-200 rounded" />
    <div className="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="h-64 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
      </div>
      <div className="bg-gray-200 h-80 rounded-2xl" />
    </div>
  </div>
)

/** ==== 페이지 ==== */
export default function DetailJobs() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { job?: JobDetail } }

  const [job, setJob] = useState<JobDetail | null>(location.state?.job ?? null)
  const [loading, setLoading] = useState<boolean>(!location.state?.job)
  const [error, setError] = useState<string | null>(null)

  // companyId 상태 추가
  const [companyId, setCompanyId] = useState<string | null>(null)

  // 데이터 로드: 우선 API 시도, 실패 시 state/fallback 사용
  useEffect(() => {
    let ignore = false
    const run = async () => {
      if (!id || location.state?.job) {
        // state에서 온 경우 companyId 추출 시도
        const stateJob = location.state?.job as JobDetail & { companyId?: number | string }
        if (stateJob?.companyId) {
          setCompanyId(String(stateJob.companyId))
        }
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/job-postings/${id}`)
        if (!res.ok) throw new Error('failed')
        const data = await res.json() as JobDetail & { companyId?: number | string }
        if (!ignore) {
          setJob(data)
          // API 응답에서 companyId 추출
          if (data.companyId) {
            setCompanyId(String(data.companyId))
          }
        }
      } catch {
        // PublicJobPosting API로 재시도
        try {
          const { jobPostingApi } = await import('@/api/jobPostingApi')
          const publicList = await jobPostingApi.getPublicList()
          const found = publicList.find(p => String(p.postingId) === id)
          if (found && !ignore) {
            setJob({
              id: String(found.postingId),
              company: found.companyName,
              title: found.title,
              description: '',
              location: found.locationText,
              salaryNote: found.salaryMin > 0 || found.salaryMax > 0
                ? `${found.salaryMin > 0 ? found.salaryMin.toLocaleString() : '협의'} ~ ${found.salaryMax > 0 ? found.salaryMax.toLocaleString() : '협의'}만원`
                : undefined,
              status: '모집 중',
              category: '기타',
              applyUrl: `/jobs/${found.postingId}`,
              employmentType: found.employmentType,
            })
            // PublicJobPosting에는 companyId가 없으므로 null로 설정
            setCompanyId(null)
          }
        } catch {
          if (!ignore) {
            setError('공고 정보를 불러오지 못했습니다.')
          }
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => {
      ignore = true
    }
  }, [id, location.state?.job])

  const dateText = useMemo(() => {
    if (!job?.postedAt) return null
    try {
      const d = new Date(job.postedAt)
      return d.toLocaleDateString()
    } catch {
      return job.postedAt
    }
  }, [job?.postedAt])

  if (loading) {
    return (
      <main className="w-full max-w-6xl px-4 py-8 mx-auto">
        <Skeleton />
      </main>
    )
  }

  if (!job) {
    return (
      <div>
        <Header />
        <main className="w-full max-w-6xl px-4 py-16 mx-auto text-center">
          <p className="text-gray-600">공고 정보를 찾을 수 없어요.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 mt-4 text-sm font-semibold text-white bg-gray-900 rounded-lg">
            돌아가기
          </button>
        </main>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      {/* 헤더 / 브레드크럼 */}
      <div className="w-full max-w-6xl px-4 pt-8 pb-6 mx-auto">
        <nav className="text-sm text-gray-500">
          <Link to="/jobs" className="hover:underline">
            채용
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{job.company}</span>
        </nav>

        <div className="flex items-start justify-between gap-4 mt-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              {job.logoUrl ? (
                <img src={job.logoUrl} alt={job.company} className="object-contain w-auto h-8" />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded" />
              )}
              <p className="text-sm text-gray-500 truncate">{job.company}</p>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {job.verified && <Badge>✅ 인증</Badge>}
              {job.hot && <Badge>🔥 HOT</Badge>}
              {job.new && <Badge>🆕 신규</Badge>}
              {job.salaryNote && <Badge>💰 {job.salaryNote}</Badge>}
              {job.badges?.map((b, i) => (
                <Badge key={i}>{b}</Badge>
              ))}
              <Dday d={job.dday} />
              {dateText && <span className="text-xs text-gray-400">게시일 {dateText}</span>}
            </div>
          </div>

          {/* 공유/저장(선택) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              링크복사
            </button>
            <button className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              북마크
            </button>
            <button
              onClick={() => {
                if (companyId) {
                  navigate(`/company/${companyId}`)
                } else {
                  // companyId가 없으면 회사명으로 검색 시도 또는 안내
                  alert(`기업 정보를 불러올 수 없습니다.\n회사명: ${job.company}\n\n회사명으로 검색 기능은 준비 중입니다.`)
                }
              }}
              className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 transition">
              기업정보 보기
            </button>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-12 mx-auto lg:grid-cols-3">
        {/* 좌측: 상세 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 썸네일/배너 */}
          {job.imageUrl && (
            <div className="overflow-hidden border border-gray-200 rounded-2xl">
              <img src={job.imageUrl} alt={job.title} className="object-cover w-full" />
            </div>
          )}

          {/* 소개 */}
          {(job.overview || job.description) && (
            <Section title="회사/포지션 소개">
              <p className="whitespace-pre-wrap">{job.overview || job.description}</p>
            </Section>
          )}

          {/* 주요업무 */}
          <Section title="주요업무">
            <List items={job.responsibilities ?? ['담당 업무는 상세 페이지에서 안내됩니다.']} />
          </Section>

          {/* 자격요건 */}
          <Section title="자격요건">
            <List items={job.requirements ?? ['관련 분야 기본 지식 보유']} />
          </Section>

          {/* 우대사항 */}
          {job.preferred && job.preferred.length > 0 && (
            <Section title="우대사항">
              <List items={job.preferred} />
            </Section>
          )}

          {/* 복지/혜택 */}
          {job.benefits && job.benefits.length > 0 && (
            <Section title="복지 및 혜택">
              <List items={job.benefits} />
            </Section>
          )}

          {/* 채용절차 */}
          {job.process && job.process.length > 0 && (
            <Section title="채용 절차">
              <ol className="pl-5 space-y-1 list-decimal">
                {job.process.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ol>
            </Section>
          )}
        </div>

        {/* 우측: 고정 지원 박스 */}
        {/* 우측: 고정 지원 박스 */}
        <aside className="space-y-4 lg:sticky lg:top-6 h-max">
          <div className="p-5 bg-white border border-gray-200 rounded-2xl">
            <div className="space-y-2 text-sm text-gray-600">
              {job.location && (
                <p>
                  <span className="mr-2 text-gray-400">근무지</span>
                  {job.location}
                </p>
              )}
              {job.employmentType && (
                <p>
                  <span className="mr-2 text-gray-400">고용형태</span>
                  {job.employmentType}
                </p>
              )}
              {job.salaryNote && (
                <p>
                  <span className="mr-2 text-gray-400">급여</span>
                  {job.salaryNote}
                </p>
              )}
              {job.category && (
                <p>
                  <span className="mr-2 text-gray-400">분야</span>
                  {job.category}
                </p>
              )}
              {job.dday !== undefined && (
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">마감</span>
                  <Dday d={job.dday} />
                </p>
              )}
            </div>

            {/*지원 버튼 */}
            <div className="mt-5">
              {job.applyUrl ? (
                <Link
                  to={`/jobs/${id}/applyform`}
                  onClick={() => {
                    // 기존 데이터 불러오기
                    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]')

                    // 이미 지원한 공고인지 확인
                    const already = appliedJobs.find(
                      (item: { id: string; date: string }) => item.id === id,
                    )
                    if (!already) {
                      appliedJobs.push({
                        id,
                        date: new Date().toLocaleString('ko-KR'), // ✅ 지원 시각 저장
                      })
                      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs))
                    }
                  }}
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700">
                  지원하기
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl opacity-70">
                  상세 준비중
                </button>
              )}
            </div>
          </div>

          {/* 고객센터 박스 */}
          <div className="p-5 text-sm text-gray-600 bg-white border border-gray-200 rounded-2xl">
            지원 관련 문의:{' '}
            <a className="text-indigo-600 hover:underline" href="mailto:hr@jobmatch.local">
              hr@jobmatch.local
            </a>
          </div>
        </aside>
      </div>

      {/* 오류 안내 */}
      {error && (
        <div className="w-full max-w-6xl px-4 pb-10 mx-auto">
          <div className="p-4 text-sm border rounded-2xl border-rose-200 bg-rose-50 text-rose-700">
            {error} (테스트 데이터로 표시 중)
          </div>
        </div>
      )}
    </main>
  )
}
