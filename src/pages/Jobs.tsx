// src/pages/Jobs.tsx
import { useMemo, useState } from "react";
import Header from "../components/Header";
import {JobCard} from "../components/Jobs/JobCard";

/** ====== 타입 ====== */
export type Job = {
    id: string;
    company: string;
    title: string;
    description: string;
    location?: string;
    salaryNote?: string;
    badges?: string[];
    dday?: number;
    verified?: boolean;
    hot?: boolean;
    new?: boolean;
    category: "개발" | "디자인" | "마케팅" | "운영" | "영업" | "기타";
    imageUrl?: string;
    logoUrl?: string;
    applyUrl?: string; // 외부/내부 혼용 가능
};

/** ====== 샘플 데이터 (원하는 대로 교체) ====== */
// eslint-disable-next-line react-refresh/only-export-components
export const JOBS_DATA : Job[] = [
    {
        id: "tving-1",
        company: "TVING",
        title: "Tech&Product 대규모 경력 채용",
        description: "NO.1 K-CULTURE PLATFORM TVING과 함께 성장할 당신을 기다립니다.",
        salaryNote: "인기 급상승 채용중",
        badges: ["인기 급상승 채용중"],
        dday: 7,
        hot: true,
        category: "개발",
        imageUrl: "/images/jobs/tving.jpg",
        logoUrl: "/images/jobs/tving_logo.png",
        applyUrl: "/jobs/tving-1"
    },
    {
        id: "gucci-1",
        company: "GUCCI",
        title: "구찌코리아 신입/경력 공개 채용",
        description: "럭셔리 리테일 분야에서 커리어를 시작/성장시킬 분을 찾습니다.",
        badges: ["인정된 최우수 기업"],
        verified: true,
        dday: 44,
        category: "운영",
        imageUrl: "/images/jobs/gucci.jpg",
        logoUrl: "/images/jobs/gucci_logo.png",
        applyUrl: "https://careers.gucci.com/jobs/retail-manager" // 외부 링크 예시
    },
    {
        id: "mbc-1",
        company: "MBC C&I",
        title: "MBC 씨앤아이 (신입/경력) 사원 채용",
        description: "방송/콘텐츠 제작 환경에서 함께 성장할 인재를 모십니다.",
        badges: ["공영방송의 자회사"],
        dday: 8,
        category: "기타",
        imageUrl: "/images/jobs/mbc.jpg",
        logoUrl: "/images/jobs/mbc_logo.png",
        applyUrl: "/jobs/mbc-1"
    },
    {
        id: "oasis-1",
        company: "오아시스 마켓",
        title: "[취업보너스 200] 인센티브 최대 240! 의왕 물류센터",
        description: "친환경 새벽배송 플랫폼 물류 파트 인재 채용.",
        salaryNote: "매출액 5000억 이상",
        badges: ["매출액 5000억 이상"],
        dday: 11,
        category: "운영",
        imageUrl: "/images/jobs/oasis.jpg",
        logoUrl: "/images/jobs/oasis_logo.png",
        applyUrl: "/jobs/oasis-1"
    },
    {
        id: "kpmg-1",
        company: "KPMG 삼정",
        title: "[취업연계] ESG 데이터 활용 개발자 과정 모집",
        description: "교육 후 채용 연계 트랙으로 ESG/데이터/개발 역량 강화.",
        badges: ["인기 급상승 채용중"],
        dday: 2,
        new: true,
        category: "개발",
        imageUrl: "/images/jobs/kpmg.jpg",
        logoUrl: "/images/jobs/kpmg_logo.png",
        applyUrl: "/jobs/kpmg-1"
    },
    {
        id: "coupang-cls-1",
        company: "Coupang CLS",
        title: "[연최대 5030만 가능] 물류관리 채용(현장운영관리)",
        description: "쿠팡 CLS와 함께 성장할 현장 운영 관리자 채용",
        salaryNote: "매출액 5000억 이상",
        badges: ["상시채용"],
        dday: 0,
        category: "운영",
        imageUrl: "/images/jobs/coupang.jpg",
        logoUrl: "/images/jobs/coupang_logo.png",
        applyUrl: "/jobs/coupang-cls-1"
    }
];
/** ====== 페이지 구성 ====== */
const categories = ["전체", "개발", "디자인", "마케팅", "운영", "영업", "기타"] as const;
type CategoryFilter = typeof categories[number];

type SortKey = "최근등록" | "마감임박" | "인기";

export default function Jobs() {
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState<CategoryFilter>("전체");
    const [sort, setSort] = useState<SortKey>("최근등록");

    const filtered = useMemo(() => {
        let list = JOBS_DATA.filter((j) => {
            const byCategory = category === "전체" ? true : j.category === category;
            const byKeyword =
                !keyword.trim() ||
                [j.company, j.title, j.description].some((t) =>
                    t.toLowerCase().includes(keyword.toLowerCase())
                );
            return byCategory && byKeyword;
        });

        // 정렬
        if (sort === "마감임박") {
            list = [...list].sort((a, b) => (a.dday ?? 9999) - (b.dday ?? 9999));
        } else if (sort === "인기") {
            list = [...list].sort((a, b) => Number(b.hot ?? 0) - Number(a.hot ?? 0));
        } else {
            // 최근등록: 여기서는 샘플이므로 id 기준 (실서비스는 createdAt 사용)
            list = [...list].sort((a, b) => (a.id < b.id ? 1 : -1));
        }
        return list;
    }, [keyword, category, sort]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            {/* 헤더 영역 (페이지 타이틀) */}
            <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6">
                <h1 className="text-2xl font-bold text-gray-900">지금 가장 주목받는 공고예요!</h1>
                <p className="mt-2 text-sm text-gray-500">
                    AI 매칭과 신뢰도 지표를 기반으로 선별된 최신 채용 정보를 확인해보세요.
                </p>
            </section>

            {/* 필터바 */}
            <section className="sticky top-0 z-10 border-y border-gray-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
                    {/* 검색 */}
                    <div className="flex flex-1 items-center gap-2">
                        <div className="relative w-full md:max-w-md">
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="회사, 공고 제목, 키워드 검색"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none ring-0 transition focus:border-indigo-500"
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                🔎
                            </span>
                        </div>
                    </div>

                    {/* 카테고리/정렬 */}
                    <div className="flex items-center gap-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as CategoryFilter)}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500"
                        >
                            <option value="최근등록">최근 등록순</option>
                            <option value="마감임박">마감 임박순</option>
                            <option value="인기">인기순</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 카드 그리드 */}
            <section className="mx-auto w-full max-w-6xl px-4 py-8">
                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                        조건에 맞는 공고가 없어요. 필터를 변경해보세요.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
