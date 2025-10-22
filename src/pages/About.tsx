import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

const About = () => {
  const [showValues, setShowValues] = useState(false);

  useEffect(() => {
    // 페이지 진입 시 0.3초 후 ValueCard 표시 (자연스러운 딜레이)
    const timer = setTimeout(() => setShowValues(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white">
      <Header />

      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
          <div className="max-w-6xl px-6 mx-auto text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              <span className="text-indigo-600">JobMatch Manager</span>란?
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
              공정한 계약과 안전한 협업을 위한 일자리 매칭 플랫폼입니다.<br />
              프리랜서와 고용주 모두가 신뢰할 수 있는 환경에서 성장할 수 있도록 지원합니다.
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
              className={`grid gap-8 mt-10 sm:grid-cols-3 transition-opacity duration-1000 ${
                showValues ? "opacity-100" : "opacity-0"
              }`}
            >
              <ValueCard icon="⚖️" title="누구나 공평하게," desc="모든 사용자에게 공정한 거래 환경 제공" />
              <ValueCard icon="🤝" title="서로가 신뢰하도록," desc="투명한 계약과 안정적인 시스템" />
              <ValueCard icon="🚀" title="모두가 성장하는," desc="경험을 통해 함께 발전하는 플랫폼" />
            </div>
          </div>
        </section>

        {/* 주요 기능 소개 부분 */}
        <section className="py-16 border-t border-gray-100 bg-gray-50">
          <div className="max-w-6xl px-6 mx-auto text-center">
            <h2 className="text-2xl font-bold">핵심 기능 한눈에 보기</h2>
            <div className="grid gap-6 mt-10 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard icon="🤖" title="AI 매칭" desc="이력서와 희망 조건 기반 자동 매칭" />
              <FeatureCard icon="💰" title="에스크로 정산" desc="안전한 임금 보호 시스템" />
              <FeatureCard icon="📄" title="계약 자동 검토" desc="AI가 위험 문구를 즉시 탐지" />
              <FeatureCard icon="📊" title="활동 로그" desc="근무 기록 및 산출물 자동 저장" />
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
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 rounded-2xl border border-transparent block"
              >
                <TeamCard
                  name="박건형"
                  role="Frontend Developer"
                  img="https://avatars.githubusercontent.com/u/162693556?v=4"
                />
              </a>

              <a
                href="https://github.com/alvin081105"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-green-500 rounded-2xl border border-transparent block"
              >
                <TeamCard
                  name="김채환"
                  role="Backend Developer"
                  img="https://avatars.githubusercontent.com/u/162595693?v=4"
                />
              </a>

              <a
                href="https://github.com/Qlellow"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 rounded-2xl border border-transparent block"
              >
                <TeamCard
                  name="박창연"
                  role="Frontend Developer"
                  img="https://avatars.githubusercontent.com/u/140193710?v=4"
                />
              </a>

              <a
                href="https://github.com/rlaxogh76"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 rounded-2xl border border-transparent block"
              >
                <TeamCard
                  name="김태호"
                  role="Frontend Developer"
                  img="https://avatars.githubusercontent.com/u/108007761?v=4"
                />
              </a>

              <a
                href="https://github.com/Juyoung0809"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-green-500 rounded-2xl border border-transparent block"
              >
                <TeamCard
                  name="송주영"
                  role="Backend Developer"
                  img="https://avatars.githubusercontent.com/u/162583068?v=4"
                />
              </a>

              <a
                href="https://github.com/janghyunje1223"
                target="_blank"
                className="transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] hover:border-indigo-500 rounded-2xl border border-transparent block"
              >
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
  );
};

export default About;

{/* 서브 컴포넌트들 */}
function ValueCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-6 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

{/* 주요 기능 카드 컴포넌트 */}
function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-6 transition bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

{/* 팀원 카드 컴포넌트 */}
function TeamCard({ name, role, img }: { name: string; role: string; img: string }) {
  return (
    <div className="p-6 text-center bg-white border border-gray-200 shadow-sm rounded-2xl">
      <img
        src={img}
        alt={name}
        className="object-cover w-24 h-24 mx-auto rounded-full"
      />
      <h4 className="mt-4 text-lg font-semibold">{name}</h4>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );
}
