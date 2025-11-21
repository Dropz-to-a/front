import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";

/** ===== 유틸 컴포넌트 ===== */
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

/** ===== 페이지 ===== */
export default function DetailJobManage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation() as { state?: { job?: Job } };

    const [job, setJob] = useState<Job | null>(location.state?.job ?? null);

    useEffect(() => {
        if (!location.state?.job) {
            // 실제 서비스라면 fetch(`/api/company/jobs/${id}`)로 교체
            setJob({
                id: id || "1",
                title: "프론트엔드 개발자 채용",
                company: "드롭즈 주식회사",
                logoUrl: "/logo.svg",
                imageUrl: "https://source.unsplash.com/featured/?office",
                location: "서울 강남구",
                salary: "연 4,000~6,000만 원",
                description:
                    "React 및 TypeScript 기반의 프론트엔드 서비스 개발. 유지보수 및 퍼포먼스 개선 담당.",
                category: "개발",
                status: "모집 중",
                applicants: 5,
                date: "2025-10-15",
            });
        }
    }, [id, location.state?.job]);

    const handleStatusChange = () => {
        if (!job) return;
        setJob({
            ...job,
            status: job.status === "모집 중" ? "마감됨" : "모집 중",
        });
    };

    const handleDelete = () => {
        if (confirm("정말 이 공고를 삭제하시겠습니까?")) {
            alert("공고가 삭제되었습니다.");
            navigate("/jobmanage");
        }
    };

    if (!job) return <div className="text-center py-40 text-gray-500">로딩 중...</div>;

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <Header />

            {/* 헤더 영역 */}
            <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-6">
                <nav className="text-sm text-gray-500">
                    <Link to="/jobmanage" className="hover:underline">
                        공고 관리
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-700">{job.title}</span>
                </nav>

                <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            {job.logoUrl && (
                                <img
                                    src={job.logoUrl}
                                    alt={job.company}
                                    className="h-8 w-auto object-contain"
                                />
                            )}
                            <p className="truncate text-sm text-gray-500">{job.company}</p>
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900">{job.title}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge>💰 {job.salary}</Badge>
                            <Badge>📍 {job.location}</Badge>
                            <Dday d={3} />
                        </div>
                    </div>

                    {/* 상단 버튼 */}
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            onClick={handleStatusChange}
                            className="rounded-lg border border-yellow-300 bg-yellow-100 px-3 py-2 text-sm font-semibold text-yellow-700 hover:bg-yellow-200"
                        >
                            상태 변경 ({job.status})
                        </button>
                        <Link
                            to="/jobedit"
                            state={{ job }} 
                            className="rounded-lg border border-blue-300 bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                        >
                            수정
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="rounded-lg border border-red-300 bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </div>

            {/* 본문 */}
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 pb-12 lg:grid-cols-3">
                {/* 왼쪽 상세 */}
                <div className="lg:col-span-2 space-y-6">
                    {job.imageUrl && (
                        <div className="overflow-hidden rounded-2xl border border-gray-200">
                            <img src={job.imageUrl} alt={job.title} className="w-full object-cover" />
                        </div>
                    )}

                    <Section title="포지션 소개">
                        <p className="whitespace-pre-wrap">{job.description}</p>
                    </Section>

                    {/* ✅ 지원자 관리로 이동 버튼 */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between">
                        <div>
                            <p className="text-gray-700 font-medium mb-1">
                                지원자 관리 페이지에서 지원 현황을 확인할 수 있습니다.
                            </p>
                            <p className="text-sm text-gray-500">
                                현재 지원자 수: <span className="font-semibold">{job.applicants}</span>명
                            </p>
                        </div>
                        <Link
                            to={`/jobs/${job.id}/completed/admin`}
                            className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            지원자 관리로 이동 →
                        </Link>
                    </div>
                </div>

                {/* 우측 요약 */}
                <aside className="lg:sticky lg:top-6 h-max space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>
                                <span className="mr-2 text-gray-400">상태</span>
                                <span
                                    className={`font-semibold ${job.status === "모집 중" ? "text-green-600" : "text-gray-500"
                                        }`}
                                >
                                    {job.status}
                                </span>
                            </p>
                            <p>
                                <span className="mr-2 text-gray-400">등록일</span>
                                {job.date}
                            </p>
                            <p>
                                <span className="mr-2 text-gray-400">분야</span>
                                {job.category}
                            </p>
                        </div>

                        <div className="mt-5 flex flex-col gap-2">
                            <Link
                                to="/contracts"
                                className="w-full text-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                계약 관리로 이동
                            </Link>
                            <button
                                onClick={() => navigate("/jobmanage")}
                                className="w-full text-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                            >
                                목록으로 돌아가기
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

/** ===== 타입 정의 ===== */
type Job = {
    id: string;
    title: string;
    company: string;
    logoUrl?: string;
    imageUrl?: string;
    location: string;
    salary: string;
    description: string;
    category: string;
    status: "모집 중" | "마감됨";
    applicants: number;
    date: string;
};
