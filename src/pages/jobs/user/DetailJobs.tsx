// src/pages/DetailJobs.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";


/** ==== 유틸 컴포넌트 ==== */
const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-gray-700 bg-white border-gray-200">
        {children}
    </span>
);

const Dday = ({ d }: { d?: number }) => {
    if (d === undefined) return null;
    if (d < 0) return <span className="text-xs font-semibold text-gray-400">마감</span>;
    if (d === 0) return <span className="text-xs font-semibold text-rose-600">D-DAY</span>;
    return <span className="text-xs font-semibold text-indigo-600">D-{d}</span>;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>
        <div className="prose prose-sm max-w-none text-gray-700">{children}</div>
    </section>
);

const List = ({ items }: { items?: string[] }) =>
    !items || items.length === 0 ? null : (
        <ul className="list-disc pl-5 space-y-1">
            {items.map((li, i) => (
                <li key={i}>{li}</li>
            ))}
        </ul>
    );

const Skeleton = () => (
    <div className="animate-pulse">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                <div className="h-64 rounded-2xl bg-gray-200" />
                <div className="h-40 rounded-2xl bg-gray-200" />
                <div className="h-40 rounded-2xl bg-gray-200" />
            </div>
            <div className="h-80 rounded-2xl bg-gray-200" />
        </div>
    </div>
);

/** ==== 페이지 ==== */
export default function DetailJobs() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation() as { state?: { job?: JobDetail } };

    const [job, setJob] = useState<JobDetail | null>(location.state?.job ?? null);
    const [loading, setLoading] = useState<boolean>(!location.state?.job);
    const [error, setError] = useState<string | null>(null);

    // 데이터 로드: 우선 API 시도, 실패 시 state/fallback 사용
    useEffect(() => {
        let ignore = false;
        const run = async () => {
            if (!id || location.state?.job) return; // 이미 state로 있으면 fetch 생략
            setLoading(true);
            try {
                const res = await fetch(`/api/jobs/${id}`);
                if (!res.ok) throw new Error("failed");
                const data: JobDetail = await res.json();
                if (!ignore) setJob(data);
            } catch {
                // 간단한 fallback (실서비스에서는 404 처리 권장)
                if (!ignore) {
                    setError("공고 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };
        run();
        return () => {
            ignore = true;
        };
    }, [id, location.state?.job]);

    const dateText = useMemo(() => {
        if (!job?.postedAt) return null;
        try {
            const d = new Date(job.postedAt);
            return d.toLocaleDateString();
        } catch {
            return job.postedAt;
        }
    }, [job?.postedAt]);

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-6xl px-4 py-8">
                <Skeleton />
            </main>
        );
    }

    if (!job) {
        return (
            <div>
            <Header/>
            <main className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
                <p className="text-gray-600">공고 정보를 찾을 수 없어요.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
                >
                    돌아가기
                </button>
            </main>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header/>
            {/* 헤더 / 브레드크럼 */}
            <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6">
                <nav className="text-sm text-gray-500">
                    <Link to="/jobs" className="hover:underline">
                        채용
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-700">{job.company}</span>
                </nav>

                <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            {job.logoUrl ? (
                                <img src={job.logoUrl} alt={job.company} className="h-8 w-auto object-contain" />
                            ) : (
                                <div className="h-8 w-8 rounded bg-gray-200" />
                            )}
                            <p className="truncate text-sm text-gray-500">{job.company}</p>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900">{job.title}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
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
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            링크복사
                        </button>
                        <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            북마크
                        </button>
                    </div>
                </div>
            </div>

            {/* 본문 */}
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-12 lg:grid-cols-3">
                {/* 좌측: 상세 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 썸네일/배너 */}
                    {job.imageUrl && (
                        <div className="overflow-hidden rounded-2xl border border-gray-200">
                            <img src={job.imageUrl} alt={job.title} className="w-full object-cover" />
                        </div>
                    )}

                    {/* 소개 */}
                    {(job.overview || job.description) && (
                        <Section title="회사/포지션 소개">
                            <p className="whitespace-pre-wrap">
                                {job.overview || job.description}
                            </p>
                        </Section>
                    )}

                    {/* 주요업무 */}
                    <Section title="주요업무">
                        <List items={job.responsibilities ?? ["담당 업무는 상세 페이지에서 안내됩니다."]} />
                    </Section>

                    {/* 자격요건 */}
                    <Section title="자격요건">
                        <List items={job.requirements ?? ["관련 분야 기본 지식 보유"]} />
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
                            <ol className="list-decimal pl-5 space-y-1">
                                {job.process.map((p, i) => (
                                    <li key={i}>{p}</li>
                                ))}
                            </ol>
                        </Section>
                    )}
                </div>

                {/* 우측: 고정 지원 박스 */}
                {/* 우측: 고정 지원 박스 */}
                <aside className="lg:sticky lg:top-6 h-max space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
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
                                        const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");

                                        // 이미 지원한 공고인지 확인
                                        const already = appliedJobs.find((item: { id: string; date: string }) => item.id === id);
                                        if (!already) {
                                            appliedJobs.push({
                                                id,
                                                date: new Date().toLocaleString("ko-KR"), // ✅ 지원 시각 저장
                                            });
                                            localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
                                        }
                                    }}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition"
                                >
                                    지원하기
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

                            ) : (
                                <button
                                    disabled
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white opacity-70"
                                >
                                    상세 준비중
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 고객센터 박스 */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
                        지원 관련 문의:{" "}
                        <a
                            className="text-indigo-600 hover:underline"
                            href="mailto:hr@jobmatch.local"
                        >
                            hr@jobmatch.local
                        </a>
                    </div>
                </aside>

            </div>

            {/* 오류 안내 */}
            {error && (
                <div className="mx-auto w-full max-w-6xl px-4 pb-10">
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                        {error} (테스트 데이터로 표시 중)
                    </div>
                </div>
            )}
        </main>
    );
}
