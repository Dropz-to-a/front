// src/pages/Home.tsx
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import ReviewCard from './Card/ReviewCard'

const Home = () => {
  const [keyword, setKeyword] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 검색 페이지로 이동하거나 쿼리 파라미터 전달
    // 예: navigate(`/jobs?kw=${encodeURIComponent(keyword)}`);
    alert(`검색어: ${keyword}`)
  }

  // 검색바 자동 포커스
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="min-h-screen text-gray-900 bg-white">
      <Header />

      {/* Hero + 빠른 진입 (병합 섹션) */}
      <section className="w-full bg-white">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            {/* 좌측: Hero */}
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                🔒 임금 보호 · 공정 계약 · AI 매칭
              </p>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                실패 없는 매칭,
                <span className="text-indigo-600"> 안전한 계약</span>
              </h1>

              <p className="mt-3 text-base text-gray-600 sm:text-lg">
                AI 추천과 에스크로 정산으로, 공정한 일자리를 경험하세요.
              </p>

              {/* 검색바 */}
              <form
                onSubmit={handleSearch}
                className="mt-6 flex w-full max-w-xl border rounded-xl transition-all duration-300 focus-within:shadow-lg focus-within:scale-[1.01] focus-within:border-indigo-500">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="예) 프론트엔드 인턴, 주 3일, 원격"
                  className="flex-1 px-4 py-3 transition-all outline-none rounded-l-xl"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-r-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition translate-x-[1px]">
                  검색
                </button>
              </form>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mt-5">
                <Link
                  to="/jobs"
                  className="px-5 py-3 font-semibold text-white transition bg-gray-900 rounded-xl hover:bg-black">
                  일자리 둘러보기
                </Link>
                <Link
                  to="/profile"
                  className="px-5 py-3 font-semibold transition border border-gray-300 rounded-xl hover:bg-gray-50">
                  내 프로필 등록
                </Link>
              </div>

              {/* 신뢰 문구 */}
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-500">
                <span>🛡️ 에스크로 임금 보호</span>
                <span>📄 표준 계약 + AI 검토</span>
                <span>⭐ 신뢰 기반 리뷰 시스템</span>
              </div>
            </div>

            {/* 우측: 빠른 진입 패널 */}
            <aside className="w-full p-6 bg-white border border-gray-200 rounded-2xl">
              <h2 className="text-lg font-bold sm:text-xl">무엇을 하시겠어요?</h2>
              <p className="mt-1 text-gray-600">당신의 목적에 맞춰 빠르게 시작해요.</p>

              <div className="grid gap-4 mt-5 sm:grid-cols-2">
                <MiniCard
                  to="/jobs"
                  icon="🔎"
                  title="일자리 찾기"
                  desc="AI가 성향과 경력으로 맞춤 추천"
                />
                <MiniCard
                  to="/profile"
                  icon="👤"
                  title="프로필 완성"
                  desc="역량·경력·희망근무 입력하고 노출"
                />
                <MiniCard
                  to="/contracts"
                  icon="📄"
                  title="표준 계약 체결"
                  desc="AI가 위험 문구를 자동 검토"
                />
                <MiniCard
                  to="/activity"
                  icon="📊"
                  title="근무·산출물 기록"
                  desc="근무시간/산출물 로그로 분쟁 예방"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 핵심 기능 */}
      <section className="border-gray-100 bg-gray-50 border-y">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">핵심 기능</h2>
              <p className="mt-1 text-gray-600">
                안전한 매칭을 위해 꼭 필요한 것만 담았습니다.
              </p>
            </div>
            <Link to="/about" className="font-semibold text-indigo-600 hover:underline">
              자세히 보기 →
            </Link>
          </div>

          <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Icon />}
              title="AI 스마트 매칭"
              desc="이력/기술/선호 조건을 분석해 적합도 추천"
            />
            <FeatureCard
              icon={<AuditIcon />}
              title="AI 계약 검토"
              desc="불리한 조항 탐지, 대체 문구 제안"
            />
            <FeatureCard
              icon={<EscrowIcon />}
              title="에스크로 임금 보호"
              desc="작업 완료 시 자동 정산으로 체불 방지"
            />
            <FeatureCard
              icon={<ShieldLogIcon />}
              title="활동 로그 & 증빙"
              desc="근무 시간·산출물 기록으로 분쟁 예방"
            />
          </div>
        </div>
      </section>

      {/* 리뷰 / 신뢰 */}
      <section className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold sm:text-2xl">사용자 후기</h2>
        <p className="mt-1 text-gray-600">실제 사용자들의 경험이 신뢰를 만듭니다.</p>

        <ReviewCard />
      </section>

      {/* FAQ */}
      <section className="border-gray-100 bg-gray-50 border-y">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl">자주 묻는 질문</h2>
          <div className="grid gap-6 mt-6 md:grid-cols-2">
            <FAQItem
              q="에스크로는 어떻게 작동하나요?"
              a="기업이 예치한 금액이 계약 조건 충족 시 자동 정산됩니다. 기한·분쟁 상황별 시나리오가 시스템에 반영돼요."
            />
            <FAQItem
              q="AI 계약 검토가 실제로 도움이 되나요?"
              a="위험 문구·불리한 조건을 하이라이트하고 대체 문구를 제안해 초보자도 안전한 계약을 체결할 수 있습니다."
            />
            <FAQItem
              q="수수료는 어떻게 되나요?"
              a="기본 이용은 무료, 매칭 성공 또는 에스크로 정산 시 합리적 수수료가 부과됩니다."
            />
            <FAQItem
              q="해외 프로젝트도 가능한가요?"
              a="다국어 계약 템플릿과 통화 표기를 지원합니다. (베타)"
            />
          </div>
        </div>
      </section>

      {/* 마지막 CTA */}
      <section className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-8 text-center bg-white border border-gray-200 shadow-sm rounded-3xl lg:p-12">
          <h3 className="text-2xl font-extrabold">
            지금, 공정한 일자리 환경을 경험해보세요.
          </h3>
          <p className="mt-2 text-gray-600">
            구직자와 기업 모두에게 안전하고 투명한 매칭을 제공합니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              to="/start"
              className="px-6 py-3 font-semibold text-white transition bg-indigo-600 rounded-xl hover:bg-indigo-700">
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 (간단) */}
      <Footer />
    </div>
  )
}

/* ----------------------- 작은 UI 컴포넌트들 ----------------------- */

function MiniCard({
  icon,
  title,
  desc,
  to,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="p-5 transition bg-white border border-gray-200 group rounded-2xl hover:shadow-md">
      <div className="text-2xl">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
      <div className="mt-3 text-sm font-semibold text-indigo-600 group-hover:underline">
        바로가기 →
      </div>
    </Link>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="p-6 transition bg-white border border-gray-200 rounded-2xl hover:shadow-sm">
      <div className="text-2xl">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  )
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="p-5 bg-white border border-gray-200 rounded-xl">
      <summary className="font-semibold cursor-pointer">{q}</summary>
      <p className="mt-2 text-sm text-gray-600">{a}</p>
    </details>
  )
}

/* ----------------------- 간단 아이콘 (SVG/이모지) ----------------------- */

function Icon() {
  return (
    <span role="img" aria-label="ai">
      🤖
    </span>
  )
}
function AuditIcon() {
  return (
    <span role="img" aria-label="audit">
      🧐
    </span>
  )
}
function EscrowIcon() {
  return (
    <span role="img" aria-label="escrow">
      💰
    </span>
  )
}
function ShieldLogIcon() {
  return (
    <span role="img" aria-label="shield-log">
      🛡️📑
    </span>
  )
}

export default Home
