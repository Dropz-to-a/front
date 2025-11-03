// src/pages/JobCompleted.tsx
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Briefcase, Home, FileText, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import { JOBS_DATA } from "./Jobs"; // ✅ 기존 데이터 import

export default function JobCompleted() {
    const { id } = useParams();

    // ✅ JOBS_DATA에서 현재 id에 맞는 공고 찾기
    const job = JOBS_DATA.find((j) => j.id === id);

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex flex-col items-center justify-center flex-1 text-center px-6">
                    <AlertCircle className="text-gray-400 w-16 h-16 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                        해당 공고를 찾을 수 없습니다.
                    </h2>
                    <p className="text-gray-500 mb-6">
                        링크가 잘못되었거나 공고가 삭제되었을 수 있어요.
                    </p>
                    <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-semibold hover:bg-indigo-700"
                    >
                        채용공고 목록으로 돌아가기
                    </Link>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Header />

            {/* ✅ 메인 */}
            <main className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
                {/* 🎉 아이콘 + 문구 */}
                <div className="flex flex-col items-center animate-fadeIn">
                    <CheckCircle2 className="text-green-500 w-20 h-20 mb-4 animate-pop" />

                    <h1 className="text-3xl md:text-4xl font-bold mb-3 animate-fadeUp">
                        지원이 완료되었습니다 🎉
                    </h1>

                    <p className="text-gray-600 max-w-md">
                        <strong>{job.company}</strong>의{" "}
                        <strong>{job.title}</strong> 공고에 대한 지원이 성공적으로 접수되었습니다.
                    </p>
                </div>

                {/* 🧾 회사 정보 카드 */}
                <div className="mt-10 bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-left border border-gray-200 animate-fadeUp">
                    <div className="flex items-center gap-4 mb-4">
                        {job.logoUrl && (
                            <img
                                src={job.logoUrl}
                                alt={job.company}
                                className="w-14 h-14 rounded-lg border border-gray-200 object-contain bg-white"
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">{job.company}</h2>
                            <p className="text-gray-500 text-sm">{job.title}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                        <span className="font-semibold">지원 일시:</span>{" "}
                        {new Date().toLocaleString("ko-KR")}
                    </p>
                </div>

                {/* 🎯 버튼 섹션 */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fadeInDelay">
                    <Link
                        to={`/jobs/${id}`}
                        state={{ job }}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        <FileText className="w-5 h-5" />
                        상세 공고 보기
                    </Link>
                    <Link
                        to="/jobs"
                        className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Briefcase className="w-5 h-5" />
                        다른 공고 보기
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Home className="w-5 h-5" />
                        홈으로 돌아가기
                    </Link>
                </div>
            </main>

            {/* 하단 */}
            <footer className="py-6 text-center text-gray-400 text-sm">
                © 2025 JOBIT — All rights reserved.
            </footer>
        </div>
    );
}

/* ===== 추가 애니메이션 스타일 (Tailwind 확장) =====
Tailwind CSS의 `@layer utilities`에 다음을 추가하면 자연스러운 효과 가능
(예: index.css 또는 global.css 아래쪽에 추가)
*/
