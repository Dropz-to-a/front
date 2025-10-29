import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { JOBS_DATA } from "./Jobs";

// 더미 지원자 데이터
const ALL_APPLICANTS_DATA = [
    { name: "박지우", status: "합격", jobId: "1", companyId: "dropz" },
    { name: "이민재", status: "불합격", jobId: "1", companyId: "dropz" },
    { name: "김가은", status: "검토 중", jobId: "2", companyId: "dropz" },
    { name: "최영훈", status: "검토 중", jobId: "2", companyId: "dropz" },
];

const JobCompletedAdmin = () => {
    const companyId = localStorage.getItem("companyId") || "dropz"; // 로그인 기업 ID (예: dropz)
    const [selectedJob, setSelectedJob] = useState<string>("all");

    // 로그인한 기업의 공고만 필터
    const jobs = JOBS_DATA.filter((j) => j.company === companyId);

    // 지원자 목록 필터링
    const filteredApplicants =
        selectedJob === "all"
            ? ALL_APPLICANTS_DATA.filter((a) => a.companyId === companyId)
            : ALL_APPLICANTS_DATA.filter(
                (a) => a.companyId === companyId && a.jobId === selectedJob
            );

    // 상태 색상
    const statusColor = {
        합격: "bg-green-100 text-green-700",
        불합격: "bg-red-100 text-red-700",
        "검토 중": "bg-yellow-100 text-yellow-700",
    } as Record<string, string>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-6xl mx-auto py-10 px-6">
                {/* 상단 제목 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            📋 지원자 관리(공고로 지원한 사람)
                        </h1>
                        <p className="text-gray-500">
                            로그인된 기업:{" "}
                            <span className="font-semibold text-indigo-600">
                                {companyId}
                            </span>
                        </p>
                    </div>

                    <Link
                        to="/contracts"
                        className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                        계약 관리로 이동
                    </Link>
                </div>

                {/* 공고 선택 */}
                <div className="mb-8 flex items-center gap-3">
                    <label className="text-sm text-gray-600 font-medium">
                        공고 선택:
                    </label>
                    <select
                        value={selectedJob}
                        onChange={(e) => setSelectedJob(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="all">전체 공고</option>
                        {jobs.map((job) => (
                            <option key={job.id} value={job.id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 지원자 목록 */}
                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700">
                                <th className="p-3 font-semibold text-sm">이름</th>
                                <th className="p-3 font-semibold text-sm">공고명</th>
                                <th className="p-3 font-semibold text-sm">지원 상태</th>
                                <th className="p-3 text-right font-semibold text-sm">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplicants.map((a, i) => {
                                const job = jobs.find((j) => j.id === a.jobId);
                                return (
                                    <tr key={i} className="border-t hover:bg-gray-50 transition">
                                        <td className="p-3 text-gray-800 font-medium">{a.name}</td>
                                        <td className="p-3 text-gray-600 text-sm">
                                            {job ? job.title : "알 수 없음"}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColor[a.status]}`}
                                            >
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            <button className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                                상태 변경
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredApplicants.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-6 text-center text-gray-500 text-sm"
                                    >
                                        선택된 공고의 지원자가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default JobCompletedAdmin;
