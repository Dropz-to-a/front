// src/pages/JobCompleted.tsx
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Briefcase, Home, FileText } from "lucide-react";
import Header from "../components/Header";
// import { motion } from "framer-motion";

const JobCompleted = () => {
    const { id } = useParams();

    // 🧠 임시 데이터 (나중에 API 연결)
    const job = {
        id,
        company: "카카오엔터프라이즈",
        title: "백엔드 개발자 (Spring Boot)",
        appliedAt: "2025.10.28 14:32",
        logoUrl: "/images/kakao.png",
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Header />

            {/* Main */}
            <main className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center">
                {/* ✅ 애니메이션 체크 아이콘 */}
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center"
                >
                    <CheckCircle2 className="text-green-500 w-20 h-20 mb-4" />
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold mb-3"
                    >
                        지원이 완료되었습니다 🎉
                    </motion.h1>
                    <p className="text-gray-600 max-w-md">
                        <strong>{job.company}</strong>의{" "}
                        <strong>{job.title}</strong> 공고에 대한 지원이 성공적으로 접수되었습니다.
                    </p>
                </motion.div>

                {/* 기업 정보 카드 */}
                <div className="mt-10 bg-white shadow-md rounded-2xl p-6 w-full max-w-md text-left border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={job.logoUrl}
                            alt={job.company}
                            className="w-14 h-14 rounded-lg border border-gray-200 object-contain bg-white"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{job.company}</h2>
                            <p className="text-gray-500 text-sm">{job.title}</p>
                        </div>
                    </div>
                    <p className="text-gray-700 text-sm">
                        <span className="font-semibold">지원 일시:</span> {job.appliedAt}
                    </p>
                </div>

                {/* 버튼 영역 */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <Link
                        to={`/jobs/${id}/application`}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                    >
                        <FileText className="w-5 h-5" />
                        내 지원서 보기
                    </Link>
                    <Link
                        to="/jobs"
                        className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Briefcase className="w-5 h-5" />
                        다른 채용공고 보기
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

            {/* Footer */}
            <footer className="py-6 text-center text-gray-400 text-sm">
                © 2025 JOBIT — All rights reserved.
            </footer>
        </div>
    );
};

export default JobCompleted;
