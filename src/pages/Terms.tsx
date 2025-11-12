import { useEffect } from 'react'

const sections = [
  { id: 'intro', title: '소개' },
  { id: 'account', title: '계정 관련' },
  { id: 'dosdonts', title: '사용 시 주의사항' },
  { id: 'privacy', title: '개인정보 보호' },
  { id: 'database', title: '데이터베이스 보호' },
  { id: 'copyright', title: '게시물의 저작권' },
  { id: 'post-mgmt', title: '게시물의 관리' },
  { id: 'license', title: '사용 권리(라이선스)' },
  { id: 'notices', title: '서비스 고지 및 홍보' },
  { id: 'lbs', title: '위치기반서비스' },
  { id: 'offline', title: '오프라인 서비스' },
  { id: 'paid', title: '유료서비스' },
  { id: 'jobs', title: '당근알바 서비스' },
  { id: 'dispute', title: '분쟁 조정' },
  { id: 'downtime', title: '서비스 중단' },
  { id: 'termination', title: '이용계약 해지(서비스 탈퇴)' },
  { id: 'disclaimer', title: '책임 제한' },
  { id: 'damages', title: '손해배상' },
  { id: 'amendments', title: '약관 수정' },
  { id: 'feedback', title: '사용자 의견 및 통지' },
  { id: 'governing-law', title: '준거법' },
  { id: 'dates', title: '공고/시행일' },
]

export default function Terms() {
  useEffect(() => {
    document.title = '이용약관';
    // 스크롤 시 앵커로 바로 이동 시 헤더가 가리는 경우를 대비해 약간의 오프셋
    const handler = () => {
      if (location.hash) {
        const el = document.getElementById(location.hash.replace('#', ''))
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 88 // 헤더 높이 가정
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }
    }
    handler()
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur">
        <div className="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">이용약관</h1>
            <p className="text-sm text-gray-500">
              본 약관은 당근 서비스 이용에 관한 권리와 의무를 규정합니다.
            </p>
          </div>
          <a
            href="#dates"
            className="text-sm text-gray-600 underline hover:text-gray-900 underline-offset-2">
            최근 개정 정보 보기
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-[1fr_280px]">
        {/* 본문 */}
        <article className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl md:p-8">
          {/* 소개 */}
          <section id="intro" className="scroll-mt-28">
            <h2 className="text-xl font-semibold">소개</h2>
            <p className="mt-3 leading-7 text-gray-700">
              안녕하세요? (주)당근마켓(이하 “당근”이라고 합니다) 서비스를 이용해 주셔서
              감사합니다. 지역 정보 모바일 서비스를 제공하는 당근이 아래 준비한 약관을
              읽어주시면 감사드리겠습니다.
            </p>
          </section>

          {/* 계정 관련 */}
          <section id="account" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">계정 관련</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                당근은 모바일 서비스 특성상 별도의 비밀번호 없이 휴대폰 본인인증 절차를
                통해 계정을 생성하실 수 있습니다. 다른 모바일 기기에서 서비스를 연속
                사용하려면 기존에 인증했던 휴대폰 번호와 고유한 사용자 식별 값(CI)으로
                다시 인증해야 합니다.
              </p>
              <p>
                한 개의 휴대폰 번호로 계정 1개만 생성할 수 있으며, CI 기준으로는 최대
                3개의 계정을 만들 수 있습니다. 다음의 경우에는 계정 생성 및 로그인이
                승인되지 않을 수 있습니다.
              </p>
              <ul className="pl-5 space-y-1 list-disc">
                <li>
                  타인의 명의나 휴대전화 번호 등 개인정보를 이용하여 계정을 생성하려는
                  경우
                </li>
                <li>CI당 계정 생성 허용 개수(최대 3개) 초과</li>
                <li>계정 생성 시 필요한 정보를 입력하지 않거나 허위 정보 입력</li>
                <li>
                  과거 운영원칙 또는 법률 위반 등 정당한 사유로 삭제·징계된 계정과
                  동일/유사 사용자로 판단되는 경우
                </li>
                <li>사기 이력이 확인된 휴대전화 번호로 확인된 경우</li>
                <li>기존 인증된 CI와 다른 CI로 본인인증을 시도하는 경우</li>
              </ul>
              <p>
                계정은 본인만 사용할 수 있으며 타인에게 이용을 허락하거나 양도할 수
                없습니다. 사용자는 프로필 사진, 별명 등 계정 정보를 수정할 수 있으며,
                휴대폰 번호 변경 시 서비스 내 설정 또는 고객센터를 통해 재인증 후 수정
                가능합니다.
              </p>
            </div>
          </section>

          {/* 사용 시 주의사항 */}
          <section id="dosdonts" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">사용 시 주의사항</h2>
            <p className="mt-3 leading-7 text-gray-700">
              아래와 같은 잘못된 방법이나 행위로 서비스를 이용할 경우, 당근은 이용정지,
              강제탈퇴 등 제재를 가할 수 있습니다.
            </p>
            <ul className="pl-5 mt-3 space-y-1 leading-7 text-gray-700 list-disc">
              <li>
                부정한 방법으로 서비스 제공을 방해하거나 비정상적 접근을 시도하는 행위
              </li>
              <li>다른 이용자의 정보를 무단 수집·이용·제공하는 행위</li>
              <li>서비스를 영리나 홍보 목적으로 이용하는 행위</li>
              <li>음란물, 저작권 침해 등 법령 및 공서양속에 위반되는 정보 게시/전송</li>
              <li>
                당근의 동의 없이 소프트웨어를 복사·수정·배포·대여하거나 역설계·변형하는
                행위
              </li>
              <li>관련 법령, 당근 약관 및 운영원칙을 준수하지 않는 행위</li>
            </ul>
          </section>

          {/* 개인정보 보호 */}
          <section id="privacy" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">개인정보 보호</h2>
            <p className="mt-3 leading-7 text-gray-700">
              개인정보는 당근 서비스의 원활한 제공을 위해 사용자가 동의한 목적과 범위
              내에서만 이용됩니다. 기타 상세한 사항은 당근의 개인정보처리방침을 참고하시기
              바랍니다.
            </p>
          </section>

          {/* 데이터베이스 보호 */}
          <section id="database" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">데이터베이스 보호</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                서비스 내 생성된 모든 콘텐츠 및 데이터에 대하여 다음 행위는
                금지됩니다(사전 서면 동의 없는 자동화 수집, 복제, 저장, 배포, 분석,
                색인화, 수정, 파생물 생성 등).
              </p>
              <p>
                또한 대형 언어 모델(LLMs)과 생성형 AI 시스템 등 기계 학습, 데이터 마이닝
                목적의 이용 역시 당근의 명시적 사전 서면 동의 없이 허용되지 않습니다.
                robots.txt 우회, 제3자 지원/유도 등의 행위도 금지됩니다. 위반 시 관련 법령
                위반으로 간주될 수 있으며 법적 조치가 이루어질 수 있습니다.
              </p>
            </div>
          </section>

          {/* 저작권 */}
          <section id="copyright" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">게시물의 저작권</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                사용자가 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게
                귀속됩니다. 게시물은 검색결과, 서비스 및 관련 프로모션/광고 등에 노출될 수
                있으며, 서비스 제공을 위해 필요한 범위 내에서 일부 수정·복제·편집될 수
                있습니다.
              </p>
              <p>
                신규 서비스 개발, 기존 서비스 개선, 관련 기술 연구 개발 목적으로도 이용될
                수 있습니다. 이 경우 당근은 저작권법을 준수하며, 사용자는 고객센터를 통해
                삭제, 검색결과 제외, 비공개 조치를 요청할 수 있습니다. 그 외의 이용은 사전
                동의를 받습니다.
              </p>
            </div>
          </section>

          {/* 게시물의 관리 */}
          <section id="post-mgmt" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">게시물의 관리</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                게시물이 정보통신망법, 저작권법 등 관련법에 위반되는 내용을 포함하는 경우
                권리자는 법정 절차에 따라 게시중단 및 삭제 등을 요청할 수 있으며, 당근은
                관련법에 따라 조치합니다.
              </p>
              <p>
                권리자 요청이 없는 경우라도 권리침해가 인정되거나 회사 정책/법령 위반의
                우려가 있으면 임시조치(삭제, 노출제한, 게시중단) 등을 취할 수 있으며,
                원칙적으로 전자적 방식 등으로 지체 없이 통지합니다(필요 시 일부 절차 생략
                가능).
              </p>
              <p>
                민원/분쟁 조정, 질서 유지, 기능 강화, 이용자 경험 개선, 약관/법령 위반
                확인 등의 필요한 경우에 한해 게시글·채팅 내용을 저장·보관·열람할 수
                있으며, 법령에서 정한 경우 및 거래 당사자 제공을 제외하고 제3자 제공은
                하지 않습니다.
              </p>
            </div>
          </section>

          {/* 사용 권리 */}
          <section id="license" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">사용 권리(라이선스)</h2>
            <p className="mt-3 leading-7 text-gray-700">
              당근은 서비스 이용을 위해 양도불가능하고 무상의 라이선스를 제공합니다. 단,
              당근의 상표 및 로고 사용 권리는 부여되지 않습니다.
            </p>
          </section>

          {/* 서비스 고지 및 홍보 */}
          <section id="notices" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">서비스 고지 및 홍보</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                당근은 서비스 이용과 관련된 각종 고지 및 홍보 정보를 서비스 내 표시하거나
                문자, 알림 메시지 등으로 발송할 수 있습니다. 이 경우 통신환경/요금구조에
                따라 데이터 요금이 발생할 수 있습니다.
              </p>
              <p>
                수신 거절은 관련 법령상 필요한 내용을 제외하고 언제든지 가능합니다. 수신
                거절 시 해당 정보 발송은 즉시 중단됩니다.
              </p>
            </div>
          </section>

          {/* 위치기반서비스 */}
          <section id="lbs" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">위치기반서비스</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                당근은 위치정보사업자로부터 전달받은 위치정보를 활용해 지역 커뮤니티 가입
                자격 부여, 지역 관련 게시물 작성, 생활 정보/광고 제공 등의 서비스를 무료로
                제공합니다.
              </p>
              <p>
                14세 미만 이용자의 경우 법정대리인 동의가 필요하며, 동의 없는 이용이
                확인되면 이용을 제한할 수 있습니다. 동의 유보·철회·일시중지 요구권과
                열람/정정 요구권이 보장되며, 관련 확인자료는 6개월 이상 보관됩니다.
              </p>
              <p>
                위치정보관리책임자: 정창훈 이사 (privacy@daangnservice.com). 분쟁 시
                개인정보 분쟁조정위원회 등을 통한 조정 신청이 가능합니다.
              </p>
            </div>
          </section>

          {/* 오프라인 서비스 */}
          <section id="offline" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">오프라인 서비스</h2>
            <p className="mt-3 leading-7 text-gray-700">
              배송 등 온라인 커뮤니티 이외의 서비스(“오프라인 서비스”)를 요청받아 직접
              또는 제3자에게 맡겨 수행할 수 있으며, 관련 세부 사항은 별도 운영정책 및
              약관에 따릅니다.
            </p>
          </section>

          {/* 유료서비스 */}
          <section id="paid" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">유료서비스</h2>
            <p className="mt-3 leading-7 text-gray-700">
              일부 서비스/기능은 유상으로 제공될 수 있으며, 구체적 이용 조건 및 절차는
              별도 약관/정책에 따릅니다.
            </p>
          </section>

          {/* 당근알바 */}
          <section id="jobs" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">당근알바 서비스</h2>
            <p className="mt-3 leading-7 text-gray-700">
              직업안정법에 근거하여 지역 내 구인·구직 정보 제공을 위한 서비스를 운영하며,
              세부 사항은 별도 정책에 따릅니다.
            </p>
          </section>

          {/* 분쟁 조정 */}
          <section id="dispute" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">분쟁 조정</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                이용자 간 분쟁 접수 및 해결을 위해 분쟁조정센터를 운영하며, 절차와 기준은
                운영정책에 따릅니다. 관계기관이 적법하게 정보 제공을 요청하는 경우 관련
                자료를 제출할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 서비스 중단 */}
          <section id="downtime" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">서비스 중단</h2>
            <p className="mt-3 leading-7 text-gray-700">
              정기/임시 점검 등 상당한 이유로 서비스 제공이 일시 중단될 수 있으며, 사전
              공지 또는 가능한 한 신속한 통지를 진행합니다.
            </p>
          </section>

          {/* 이용계약 해지 */}
          <section id="termination" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">이용계약 해지(서비스 탈퇴)</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                사용자는 언제든지 서비스 내 메뉴를 통해 이용계약 해지를 신청할 수 있으며,
                당근은 법령이 정하는 바에 따라 신속히 처리합니다. 거래 진행 중이거나 분쟁
                발생 시 일정 기간 제한될 수 있습니다.
              </p>
              <p>
                해지 시 법령 및 개인정보처리방침에 따른 보유를 제외하고 사용자 정보 및
                데이터는 삭제가 원칙입니다. 다만 타인의 서비스 이용에 영향을 미치는
                게시물·댓글 등은 자동 삭제되지 않을 수 있으므로 사전에 비공개/삭제를
                권장합니다.
              </p>
            </div>
          </section>

          {/* 책임 제한 */}
          <section id="disclaimer" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">책임 제한</h2>
            <p className="mt-3 leading-7 text-gray-700">
              법령상 허용되는 범위 내에서 당근은 구체적 성능, 이용가능성 등에 대한 보증을
              하지 않으며, 서비스는 있는 그대로 제공됩니다.
            </p>
          </section>

          {/* 손해배상 */}
          <section id="damages" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">손해배상</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                당근의 과실로 사용자가 손해를 입은 경우 법령에 따라 배상합니다. 다만 불법
                접속, 전송 방해, 악성 프로그램 유포, 데이터 생략/누락/파괴, 제3자가 야기한
                손해 등에 대해서는 책임을 부담하지 않습니다. 간접·특별·결과적·징계적
                손해에 대한 책임도 법률상 허용되는 범위 내에서 부담하지 않습니다.
              </p>
            </div>
          </section>

          {/* 약관 수정 */}
          <section id="amendments" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">약관 수정</h2>
            <div className="mt-3 space-y-3 leading-7 text-gray-700">
              <p>
                법률이나 서비스 변경사항을 반영하기 위해 본 약관 및 안내/고지사항이 수정될
                수 있습니다. 변경 사항은 개별 서비스 초기화면에 게시되며, 일반 변경은 게시
                후 7일, 불리한 변경은 30일 경과 후 효력이 발생합니다.
              </p>
              <p>
                효력 발생일까지 이용자의 의견을 기다리며, 미제출 시 변경 약관에 동의한
                것으로 봅니다. 동의하지 않는 경우 해당 서비스 제공이 불가할 수 있습니다.
              </p>
            </div>
          </section>

          {/* 사용자 의견 및 통지 */}
          <section id="feedback" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">사용자 의견 및 통지</h2>
            <p className="mt-3 leading-7 text-gray-700">
              사용자는 서비스 내 운영자 문의를 통해 의견을 개진할 수 있습니다. 전체 통지는
              서비스 초기화면 또는 공지사항 란에 게시함으로써 효력이 발생합니다.
            </p>
          </section>

          {/* 준거법 */}
          <section id="governing-law" className="mt-10 scroll-mt-28">
            <h2 className="text-xl font-semibold">준거법</h2>
            <p className="mt-3 leading-7 text-gray-700">
              본 약관 및 서비스와 관련해서는 대한민국 법률이 적용됩니다.
            </p>
          </section>

          {/* 공고/시행일 */}
          <section id="dates" className="pt-8 mt-10 border-t scroll-mt-28">
            <h2 className="text-xl font-semibold">공고/시행일</h2>
            <dl className="grid grid-cols-1 gap-3 mt-3 text-gray-700 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">공고일자</dt>
                <dd className="font-medium">2025년 6월 2일</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">시행일자</dt>
                <dd className="font-medium">2025년 6월 9일</dd>
              </div>
            </dl>
          </section>
        </article>

        {/* 목차 사이드바 */}
        <aside className="hidden md:block">
          <div className="sticky space-y-4 top-24">
            <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
              <p className="text-sm font-semibold text-gray-700">목차</p>
              <nav className="mt-2">
                <ul className="space-y-1 text-sm">
                  {sections.map(s => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block px-2 py-1 text-gray-700 rounded hover:bg-gray-50 hover:text-gray-950 hover:font-extrabold">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <a
              href="#intro"
              className="inline-flex items-center justify-center w-full py-2 text-sm font-medium bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50">
              맨 위로
            </a>
          </div>
        </aside>
      </main>

      <footer className="py-10 text-xs text-center text-gray-500">
        © {new Date().getFullYear()} 당근. All rights reserved.
      </footer>
    </div>
  )
}
