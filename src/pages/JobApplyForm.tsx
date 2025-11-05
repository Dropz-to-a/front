import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Send } from "lucide-react";
import Header from "../components/Header";
import { JOBS_DATA } from "./Jobs";

const ApplyFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const job = JOBS_DATA.find((j) => j.id === id);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        motivation: "",
        portfolio: "",
    });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            setForm((prev) => ({
                ...prev,
                name: currentUser.name || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
            }));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, jobId: id }),
            });

            navigate(`/jobs/${id}/completed`);
        } catch (err) {
            alert("지원 중 오류가 발생했습니다.");
        }
    };

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
                <p className="text-lg">존재하지 않는 공고입니다.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
            <Header />

            {/* 뒤로가기 버튼 */}
            <div className="max-w-2xl mx-auto w-full mt-6 px-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition mb-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">이전 페이지로</span>
                </button>
            </div>

            {/* 메인 */}
            <main className="flex flex-col items-center flex-1 px-6 py-6">
                <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-8 border border-gray-200">
                    {/* 상단 공고 정보 */}
                    <div className="flex items-center gap-4 mb-6">
                        {job.logoUrl && (
                            <img
                                src={job.logoUrl}
                                alt={job.company}
                                className="w-14 h-14 object-contain rounded-lg border"
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">{job.company}</h2>
                            <p className="text-gray-500 text-sm">{job.title}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        지원서 작성
                    </h3>

                    {/* 폼 */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="name"
                                value={form.name}
                                disabled
                                className="border border-gray-300 rounded-lg p-3 bg-gray-100"
                                placeholder="이름"
                            />
                            <input
                                name="email"
                                value={form.email}
                                disabled
                                className="border border-gray-300 rounded-lg p-3 bg-gray-100"
                                placeholder="이메일"
                            />
                            <input
                                name="phone"
                                value={form.phone}
                                disabled
                                className="border border-gray-300 rounded-lg p-3 bg-gray-100 md:col-span-2"
                                placeholder="연락처"
                            />
                        </div>

                        <textarea
                            name="motivation"
                            value={form.motivation}
                            onChange={handleChange}
                            required
                            placeholder="지원 동기를 입력하세요"
                            className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />

                        <input
                            name="portfolio"
                            value={form.portfolio}
                            onChange={handleChange}
                            placeholder="포트폴리오 링크 (선택)"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                            >
                                <Send className="w-5 h-5" />
                                지원서 제출
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="py-6 text-center text-gray-400 text-sm">
                © 2025 JOBIT — All rights reserved.
            </footer>
        </div>
    );
};

export default ApplyFormPage;
