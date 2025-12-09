// src/pages/MyApplications.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/Header";
import { JOBS_DATA } from "./Jobs";
import { Trash2, FileText, CalendarDays } from "lucide-react";

type AppliedItem = {
    id: string;                 // 공고 ID
    date: string;               // 지원 날짜
    form: any;                  // 지원자가 작성한 실제 입력
};

export default function MyApplications() {
    const [appliedList, setAppliedList] = useState<AppliedItem[]>([]);

    /* ============================================
       1) localStorage 불러오기
    ============================================ */
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
        setAppliedList(stored);
    }, []);

    /* ============================================
       2) 지원 삭제 기능
    ============================================ */
    const handleRemove = (id: string) => {
        const updated = appliedList.filter((x) => x.id !== id);
        setAppliedList(updated);
        localStorage.setItem("appliedJobs", JSON.stringify(updated));
    };

    /* ============================================
       3) JOBS_DATA와 합쳐서 화면에 표시
          appliedList.form = 지원자가 입력한 이력서
    ============================================ */
    const appliedJobs = appliedList
        .map((item) => {
            const job = JOBS_DATA.find((j) => j.id === item.id);
            if (!job) return null;

            return {
                job,                  // 회사/공고 정보
                application: item.form, // 지원자가 작성한 이력서
                date: item.date,       // 지원 날짜
            };
        })
        .filter(Boolean); // null 제거

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <Header />

            <main className="mx-auto w-full max-w-6xl px-4 py-10 flex-1">
                <h1 className="text-2xl font-bold mb-2">내 지원 목록</h1>
                <p className="text-gray-500 mb-6">
                    언제 어떤 공고에 지원했는지 한눈에 확인할 수 있습니다.
                </p>

                {appliedJobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 border border-dashed border-gray-300 rounded-2xl">
                        아직 지원한 공고가 없습니다.{" "}
                        <Link
                            to="/jobs"
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            채용공고 보러가기 →
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {appliedJobs.map(({ job, application, date }) => (
                            <div
                                key={job.id}
                                className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between"
                            >
                                {/* 좌측 공고 정보 */}
                                <div className="flex items-center gap-4">
                                    {job.logoUrl && (
                                        <img
                                            src={job.logoUrl}
                                            alt={job.company}
                                            className="w-12 h-12 rounded-md object-contain border border-gray-200"
                                        />
                                    )}
                                    <div>
                                        <h2 className="font-semibold text-gray-800">{job.company}</h2>
                                        <p className="text-sm text-gray-500">{job.title}</p>
                                    </div>
                                </div>

                                {/* 지원 날짜 */}
                                <div className="flex items-center text-sm text-gray-500 gap-1 mt-3 sm:mt-0 sm:ml-4">
                                    <CalendarDays className="w-4 h-4 text-gray-400" />
                                    <span>지원일: {date}</span>
                                </div>

                                {/* 우측 버튼 영역 */}
                                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                                    {/* 서류 확인 */}
                                    <Link
                                        to={`/applications/resume/${job.id}`}
                                        state={{ job, application, date }}
                                        className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline"
                                    >
                                        <FileText className="w-4 h-4" />
                                        서류 확인하기
                                    </Link>

                                    {/* 상세보기 */}
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        state={{ job }}
                                        className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                                    >
                                        <FileText className="w-4 h-4" />
                                        상세보기
                                    </Link>

                                    {/* 삭제 버튼 */}
                                    <button
                                        onClick={() => handleRemove(job.id)}
                                        className="flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="text-center text-gray-400 py-6 text-sm">
                © 2025 JOBIT — My Applications
            </footer>
        </div>
    );
}
