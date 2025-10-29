import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

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

const JobManage = () => {
    const [jobs, setJobs] = useState<Job[]>([
        {
            id: "1",
            title: "프론트엔드 개발자 채용",
            company: "드롭즈 주식회사",
            logoUrl: "/logo.svg",
            imageUrl: "https://source.unsplash.com/featured/?office",
            location: "서울 강남구",
            salary: "연 4,000~6,000만 원",
            description: "React 기반의 웹 애플리케이션을 개발하고 유지보수합니다.",
            category: "개발",
            status: "모집 중",
            applicants: 5,
            date: "2025-10-15",
        },
        {
            id: "2",
            title: "백엔드 엔지니어 채용",
            company: "드롭즈 주식회사",
            logoUrl: "/logo.svg",
            imageUrl: "https://source.unsplash.com/featured/?server",
            location: "부산 해운대구",
            salary: "연 4,500~7,000만 원",
            description: "Spring Boot와 MySQL을 활용한 백엔드 시스템을 구축합니다.",
            category: "개발",
            status: "마감됨",
            applicants: 12,
            date: "2025-09-30",
        },
    ]);

    // ✅ 상태 변경
    const toggleStatus = (id: string) => {
        setJobs((prev) =>
            prev.map((job) =>
                job.id === id
                    ? { ...job, status: job.status === "모집 중" ? "마감됨" : "모집 중" }
                    : job
            )
        );
    };

    // ✅ 삭제
    const handleDelete = (id: string) => {
        if (confirm("정말로 삭제하시겠습니까?")) {
            setJobs((prev) => prev.filter((j) => j.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">📋 내 공고 관리</h1>
                    <Link
                        to="/jobregister"
                        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        + 새 공고 등록
                    </Link>
                </div>

                {/* ✅ 카드 리스트 */}
                {jobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        등록된 공고가 없습니다.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <Link
                                key={job.id}
                                to={`/jobmanage/${job.id}`} // 상세페이지 이동
                                state={{ job }} // ✅ props로 job 데이터 전달
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                {/* 썸네일 */}
                                <div className="aspect-[16/9] w-full bg-gray-100">
                                    {job.imageUrl ? (
                                        <img
                                            src={job.imageUrl}
                                            alt={job.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                                    )}
                                </div>

                                {/* 본문 */}
                                <div className="flex flex-1 flex-col gap-3 p-4">
                                    {/* 상단 (회사 + 제목 + 상태) */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                {job.logoUrl && (
                                                    <img
                                                        src={job.logoUrl}
                                                        alt={job.company}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                )}
                                                <p className="truncate text-sm text-gray-500">
                                                    {job.company}
                                                </p>
                                            </div>
                                            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900">
                                                {job.title}
                                            </h3>
                                        </div>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-md ${job.status === "모집 중"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                                }`}
                                        >
                                            {job.status}
                                        </span>
                                    </div>

                                    {/* 설명 */}
                                    <p className="line-clamp-2 text-sm text-gray-600">
                                        {job.description}
                                    </p>

                                    {/* 위치/급여 */}
                                    <div className="text-xs text-gray-400">
                                        📍 {job.location} · 💰 {job.salary}
                                    </div>

                                    {/* 하단 버튼 */}
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t">
                                        <span className="text-xs text-gray-400">
                                            분야 · {job.category}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault(); // 카드 이동 방지
                                                    toggleStatus(job.id);
                                                }}
                                                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md hover:bg-yellow-200"
                                            >
                                                상태 변경
                                            </button>
                                            <Link
                                                to={`/jobs/${job.id}/completed/admin`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200"
                                            >
                                                지원자 {job.applicants}명
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDelete(job.id);
                                                }}
                                                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default JobManage;
