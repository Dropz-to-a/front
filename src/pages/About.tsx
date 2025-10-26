import Footer from '../components/Footer'
import Header from '../components/Header'

const About = () => {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white">
      <Header />

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
          <div className="max-w-6xl px-6 mx-auto text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              <span className="text-indigo-600">JOBIT</span>이란?
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
              공정한 계약과 안전한 협업을 위한 일자리 매칭 플랫폼입니다.
              <br />
              프리랜서와 고용주 모두가 신뢰할 수 있는 환경에서 성장할 수 있도록
              지원합니다.
            </p>
          </div>
        </section>

        {/* 서비스 사용에 대한 설명 */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-6xl px-6 mx-auto text-center">
            <h2 className="text-2xl font-bold">
              어떤 식으로 <span className="text-indigo-600">서비스를</span> 제공하나요? 🤔
            </h2>
            <div
              className={`grid gap-8 mt-10 sm:grid-cols-3 transition-opacity duration-1000
              }`}>
              <ValueCard
                icon="⚖️"
                title="누구나 공평하게,"
                desc="모든 사용자에게 공정한 거래 환경을 제공하도록 노력합니다."
              />
              <ValueCard
                icon="🤝"
                title="서로가 신뢰하도록,"
                desc="투명한 절차와 책임 있는 시스템으로 신뢰를 쌓습니다."
              />
              <ValueCard
                icon="🚀"
                title="모두가 성장하는,"
                desc="함께 일하며 배우고, 함께 성장하는 경험을 제공합니다."
              />
            </div>
          </div>
        </section>

        {/* 주요 기능 소개 부분 */}
        <section className="py-20 border-t border-gray-100 bg-gray-50">
          <div className="max-w-6xl px-6 mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold">핵심 기능 한눈에 보기</h2>
            <p className="mb-12 text-gray-600">
              구직자와 기업 모두가 신뢰할 수 있는 시스템으로, 안전하고 효율적인 일 경험을
              제공합니다.
            </p>

            <div className="space-y-16">
              {/* AI 매칭 */}
              <FeatureBlock
                img="https://plus.unsplash.com/premium_photo-1661284828052-ea25d6ea94cd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                title="AI 매칭"
                desc="AI가 사용자의 이력서와 희망 조건을 분석하여 가장 적합한 일자리를 자동으로 추천합니다. 복잡한 검색 없이, 나에게 꼭 맞는 기회를 빠르게 만나보세요."
              />

              {/* 에스크로 정산 */}
              <FeatureBlock
                img="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8JUVDJTlEJUJDfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500"
                title="에스크로 정산"
                desc="급여는 계약 시 미리 에스크로 계좌에 안전하게 보관됩니다. 업무 완료 후 자동 정산되어, 프리랜서와 기업 모두 안심할 수 있습니다."
                reverse
              />

              {/* 계약 자동 검토 */}
              <FeatureBlock
                img="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8JUVDJTlEJUJDfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500"
                title="계약 자동 검토"
                desc="AI가 계약서 내 위험 문구를 자동 탐지하고, 불리한 조건이 포함되어 있을 경우 즉시 경고합니다. 복잡한 법률 지식이 없어도 안심하세요."
              />

              {/* 활동 로그 */}
              <FeatureBlock
                img="https://plus.unsplash.com/premium_photo-1661313626999-90d230cabf8d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8JUVCJUFDJUI4JUVDJTg0JTlDfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500"
                title="활동 로그"
                desc="근무 시간, 업무 기록, 제출한 산출물이 자동으로 저장됩니다. 모든 근무 이력을 한눈에 관리하고, 투명한 협업 환경을 유지할 수 있습니다."
                reverse
              />
            </div>
          </div>
        </section>

        {/* 팀원 소개 섹션 */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-6xl px-6 mx-auto">
            <h2 className="text-2xl font-bold text-center">
              함께 만드는 <span className="text-indigo-600">사람들</span>
            </h2>
            <p className="m-4 font-bold text-center border-r-gray-500">
              질 좋은 서비스를 제공하기 위해, 노력 중인 팀원들입니다.
            </p>
            <div className="grid gap-6 mt-10 sm:grid-cols-2 md:grid-cols-3">
              <a
                href="https://github.com/rjsgud49"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 rounded-2xl border border-transparent block">
                <TeamCard
                  name="박건형"
                  role="Frontend Developer"
                  img="https://avatars.githubusercontent.com/u/162693556?v=4"
                />
              </a>

              <a
                href="https://github.com/alvin081105"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-green-500 rounded-2xl border border-transparent block">
                <TeamCard
                  name="김채환"
                  role="Backend Developer"
                  img="https://avatars.githubusercontent.com/u/162595693?v=4"
                />
              </a>

              <a
                href="https://github.com/Qlellow"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 rounded-2xl border border-transparent block">
                <TeamCard
                  name="박창연"
                  role="Frontend Developer"
                  img="https://avatars.githubusercontent.com/u/140193710?v=4"
                />
              </a>

              <a
                href="https://github.com/rlaxogh76"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 rounded-2xl border border-transparent block">
                <TeamCard
                  name="김태호"
                  role="Frontend Developer"
                  img="https://avatars.githubusercontent.com/u/108007761?v=4"
                />
              </a>

              <a
                href="https://github.com/Juyoung0809"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-green-500 rounded-2xl border border-transparent block">
                <TeamCard
                  name="송주영"
                  role="Backend Developer"
                  img="https://avatars.githubusercontent.com/u/162583068?v=4"
                />
              </a>

              <a
                href="https://github.com/janghyunje1223"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 rounded-2xl border border-transparent block">
                <TeamCard
                  name="장현제"
                  role="Frontend Developer"
                  img="https://avatars.githubusercontent.com/u/189828818?s=130&v=4"
                />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About

{
  /* 서브 컴포넌트들 */
}
function ValueCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-6 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  )
}

{
  /* 주요 기능 카드 컴포넌트 */
}
function FeatureBlock({
  img,
  title,
  desc,
  reverse = false,
}: {
  img: string
  title: string
  desc: string
  reverse?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center gap-10 md:flex-row ${
        reverse ? 'md:flex-row-reverse' : ''
      }`}>
      <img
        src={img}
        alt={title}
        className="object-cover w-full shadow-md md:w-1/2 rounded-2xl"
      />
      <div className="text-left md:w-1/2">
        <h3 className="text-2xl font-semibold text-indigo-600">{title}</h3>
        <p className="mt-4 leading-relaxed text-gray-700">{desc}</p>
      </div>
    </div>
  )
}

{
  /* 팀원 카드 컴포넌트 */
}
function TeamCard({ name, role, img }: { name: string; role: string; img: string }) {
  return (
    <div className="p-6 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
      <img src={img} alt={name} className="object-cover w-24 h-24 mx-auto rounded-full" />
      <h4 className="mt-4 text-lg font-semibold">{name}</h4>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  )
}
