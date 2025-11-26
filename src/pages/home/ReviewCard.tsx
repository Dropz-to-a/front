import React from 'react'

type Review = { name: string; text: string }

function ReviewCard({ name, text }: { name: string; text: string }) {
  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm w-72 md:w-80 shrink-0 rounded-2xl">
      <div className="flex items-center gap-2">
        <span className="text-yellow-500" aria-label="5 stars">
          ★ ★ ★ ★ ★
        </span>
      </div>
      <p className="mt-3 text-gray-700">{text}</p>
      <p className="mt-3 text-sm text-gray-500">— {name}</p>
    </div>
  )
}

const REVIEWS: Review[] = [
  {
    name: '박** (프론트엔드)',
    text: '프로젝트 대금이 제때 들어와서 마음 편하게 일했어요. 매칭 정확도가 높았고 계약 검토도 큰 도움!',
  },
  {
    name: '김** (디자이너)',
    text: '작업물 업로드와 시간 기록이 자동으로 정리되어 포트폴리오 관리까지 쉬워졌어요.',
  },
  {
    name: '이** (백엔드)',
    text: '분쟁 걱정 없이 협업할 수 있었습니다. 에스크로 정산 체계가 특히 좋았어요.',
  },
  {
    name: '정** (PM)',
    text: '타임라인/이슈 관리가 깔끔해 커뮤니케이션 비용이 크게 줄었습니다.',
  },
  {
    name: '최** (데브옵스)',
    text: '배포 기록/로그가 연동돼서 인수인계가 엄청 편했어요.',
  },
  {
    name: '윤** (퍼블리셔)',
    text: '디자인 가이드—개발 산출물 매칭이 잘 맞아 수정 요청이 줄었어요.',
  },
  {
    name: '한** (기획자)',
    text: '계약-결제-정산이 하나의 흐름으로 묶여 실무 스트레스가 확 줄었습니다.',
  },
  {
    name: '서** (AI/ML)',
    text: '리소스 공유랑 버전 관리가 체계적이라 실험 반복이 빨랐어요.',
  },
  {
    name: '오** (풀스택)',
    text: '리뷰/피드백 히스토리가 남아 다음 프로젝트에도 레퍼런스로 딱!',
  },
]

export default function ReviewSection() {
  // 무한 루프용으로 2세트
  const loop = [...REVIEWS, ...REVIEWS]

  return (
    <div className="relative w-full py-6 overflow-hidden">
      {/* 흐르는 트랙 */}
      <div
        className="flex w-max gap-6 animate-[marquee_var(--dur)_linear_infinite]"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ ['--dur' as any]: '28s' } as React.CSSProperties}>
        {/* 두 덩어리를 연달아 배치 (폭의 50%씩) */}
        <div className="flex gap-6">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={`a-${i}`} name={r.name} text={r.text} />
          ))}
        </div>
        <div className="flex gap-6">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={`b-${i}`} name={r.name} text={r.text} />
          ))}
        </div>
      </div>

      {/* 좌/우 페이드 마스크 (배경이 흰색일 때) */}
      <div className="absolute inset-y-0 left-0 w-16 pointer-events-none bg-gradient-to-r from-white to-transparent" />
      <div className="absolute inset-y-0 right-0 w-16 pointer-events-none bg-gradient-to-l from-white to-transparent" />

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); } /* 앞 절반만큼 이동 */
        }
        @media (max-width: 480px) { :root { --dur: 20s; } }
        @media (min-width: 1024px) { :root { --dur: 35s; } }
      `}</style>
    </div>
  )
}
