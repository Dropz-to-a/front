
import { Link } from "react-router-dom";
import type{ Job } from "../../pages/Jobs";


/** ====== 헬퍼 ====== */
const isInternalDetail = (url?: string) => !!url && url.startsWith("/jobs/");

export const JobCard = ({ job }: { job: Job }) => {
    const internalDetailPath = `/jobs/${job.id}`; // 상세 라우트 고정
    const hasExternalApply = job.applyUrl && !isInternalDetail(job.applyUrl);

    return (
        <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
            {/* 썸네일 */}
            <div className="aspect-[16/9] w-full bg-gray-100">
                {job.imageUrl ? (
                    <img
                        src={job.imageUrl}
                        alt={job.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
            </div>

            {/* 본문 */}
            <div className="flex flex-1 flex-col gap-3 p-4">
                {/* 상단 (회사 + 제목 + Dday) */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <CompanyLogo src={job.logoUrl} alt={job.company} />
                            <p className="truncate text-sm text-gray-500">{job.company}</p>
                        </div>
                        <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">
                            {job.title}
                        </h3>
                    </div>
                    <Dday d={job.dday} />
                </div>

                {/* 설명 */}
                <p className="line-clamp-2 text-sm text-gray-600">{job.description}</p>

                {/* 배지/라벨 */}
                <div className="flex flex-wrap items-center gap-2">
                    {job.verified && <Badge>✅ 인증</Badge>}
                    {job.hot && <Badge>🔥 HOT</Badge>}
                    {job.new && <Badge>🆕 신규</Badge>}
                    {job.salaryNote && <Badge>💰 {job.salaryNote}</Badge>}
                    {job.badges?.map((b, i) => (
                        <Badge key={i}>{b}</Badge>
                    ))}
                </div>

                {/* 하단 고정 영역 */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <span className="text-xs text-gray-400">분야 · {job.category}</span>

                    <div className="flex items-center gap-2">
                        {/* 내부 상세 보기: 항상 제공 (state로 데이터 전달) */}
                        <Link
                            to={internalDetailPath}
                            state={{ job }} // DetailJobs에서 location.state.job으로 수신
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            상세 보기
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>

                        {/* 외부 공고 바로가기: 외부 링크가 있을 때만 노출 */}
                        {hasExternalApply && (
                            <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                title="공식 채용 공고 열기"
                            >
                                공고 바로가기
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};



/** ====== 작은 UI 유틸 ====== */
const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-gray-700 bg-white/80 border-gray-200">
        {children}
    </span>
);

const Dday = ({ d }: { d?: number }) => {
    if (d === undefined) return null;
    if (d < 0) return <span className="text-xs font-semibold text-gray-400">마감</span>;
    if (d === 0) return <span className="w-[60px] text-xs font-semibold text-rose-600">D-DAY</span>;
    return <span className=" w-[40px] text-xs font-semibold text-indigo-600">D-{d}</span>;
};

const CompanyLogo = ({ src, alt }: { src?: string; alt: string }) => (
    <div className="h-6 w-auto flex items-center gap-2">
        {src ? (
            <img src={src} alt={alt} className="h-6 w-auto object-contain" />
        ) : (
            <div className="h-6 w-6 rounded bg-gray-200" />
        )}
    </div>
);
