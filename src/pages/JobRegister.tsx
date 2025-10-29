// src/pages/JobRegister.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import type { Job } from "./Jobs";

export default function JobRegister() {
    const navigate = useNavigate();
    const [form, setForm] = useState<Partial<Job>>({
        company: "",
        title: "",
        description: "",
        category: "개발",
        location: "",
        salaryNote: "",
        imageUrl: "",
        logoUrl: "",
        dday: 0, // ✅ 여전히 dday 필드 사용
    });

    const [selectedDate, setSelectedDate] = useState<string>(""); // ✅ 달력에서 선택된 날짜

    // ✅ D-day 계산 함수
    const calculateDday = (targetDate: string) => {
        const today = new Date();
        const target = new Date(targetDate);
        const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 ? diff : 0; // 마감 지난 날짜는 0 처리
    };

    // ✅ 입력 변경
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ 파일 업로드 (공고 이미지 / 로고)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files?.length) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm((prev) => ({ ...prev, [name]: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    // ✅ 마감일 선택 → D-day 자동 계산
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        const ddayValue = calculateDday(date);
        setForm((prev) => ({ ...prev, dday: ddayValue }));
    };

    // ✅ 제출
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.company || !form.title || !form.description) {
            alert("회사명, 제목, 설명은 필수 입력 항목입니다.");
            return;
        }

        const stored = JSON.parse(localStorage.getItem("customJobs") || "[]");

        const newJob: Job = {
            id: `${form.company?.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            company: form.company!,
            title: form.title!,
            description: form.description!,
            location: form.location,
            salaryNote: form.salaryNote,
            category: form.category as Job["category"],
            dday: form.dday ?? 0, // ✅ 계산된 D-day 저장
            verified: true,
            imageUrl: form.imageUrl || "/images/jobs/default.jpg",
            logoUrl: form.logoUrl || "/images/jobs/default_logo.png",
            applyUrl: `/jobs/${form.company?.toLowerCase()}-${Date.now()}`,
        };

        localStorage.setItem("customJobs", JSON.stringify([...stored, newJob]));
        alert(`채용공고가 등록되었습니다 ✅ (남은 ${form.dday}일)`);
        navigate("/jobs");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
            <Header />
            <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">채용공고 등록</h1>
                <p className="text-gray-500 mb-8">기업 전용 공고 등록 페이지입니다.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 회사명 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">회사명 *</label>
                        <input
                            type="text"
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                            placeholder="예: NAVER"
                            required
                        />
                    </div>

                    {/* 공고 제목 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">공고 제목 *</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                            placeholder="예: 프론트엔드 개발자 채용"
                            required
                        />
                    </div>

                    {/* 설명 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">공고 설명 *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={5}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                            placeholder="담당 업무, 자격 요건 등을 자세히 작성해주세요."
                            required
                        />
                    </div>

                    {/* 분야 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">분야</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                        >
                            <option value="개발">개발</option>
                            <option value="디자인">디자인</option>
                            <option value="마케팅">마케팅</option>
                            <option value="운영">운영</option>
                            <option value="영업">영업</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>

                    {/* 지역 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">근무 지역</label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                            placeholder="예: 서울특별시 강남구"
                        />
                    </div>

                    {/* 급여 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">급여/조건 참고 문구</label>
                        <input
                            type="text"
                            name="salaryNote"
                            value={form.salaryNote}
                            onChange={handleChange}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                            placeholder="예: 연봉 4,000만원 이상 / 경력별 협의"
                        />
                    </div>

                    {/* ✅ 캘린더 기반 D-day 계산 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">마감일 선택</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="mt-1 w-60 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500"
                        />
                        {selectedDate && (
                            <p className="mt-1 text-sm text-gray-500">
                                D-{form.dday} ({selectedDate})
                            </p>
                        )}
                    </div>

                    {/* 이미지 & 로고 업로드 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">공고 이미지 업로드</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="imageUrl"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                            />
                            {form.imageUrl && (
                                <img
                                    src={form.imageUrl}
                                    alt="공고 미리보기"
                                    className="mt-3 w-full h-40 object-cover rounded-lg border border-gray-200"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">회사 로고 업로드</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="logoUrl"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                            />
                            {form.logoUrl && (
                                <img
                                    src={form.logoUrl}
                                    alt="로고 미리보기"
                                    className="mt-3 w-24 h-24 object-contain rounded-lg border border-gray-200"
                                />
                            )}
                        </div>
                    </div>

                    {/* 버튼 */}
                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 text-white px-6 py-2 font-semibold hover:bg-indigo-700 transition"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            </main>

            <footer className="text-center text-gray-400 py-6 text-sm">
                © 2025 JOBIT — 기업용 채용공고 등록
            </footer>
        </div>
    );
}
