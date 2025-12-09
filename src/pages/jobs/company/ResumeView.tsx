// src/pages/jobs/company/ResumeViewPage.tsx

import { useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from "../../../components/Header";
import { JOBS_DATA } from "../user/Jobs";



const ResumeViewPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const job = location.state?.job || JOBS_DATA.find((j) => j.id === id);

    // ⭐ 실제 전달된 지원서 데이터
    const application = location.state?.application;
    /* ============================
       job 데이터 추출 (안전 처리)
       1) location.state 로 전달된 경우
       2) URL /jobs/:id 기반 조회
============================ */ 

    const resumeRef = useRef<HTMLDivElement>(null);

    /* ============================
        Tailwind oklch → 안전 색상 변환
============================ */
    const sanitizeColors = () => {
        document.querySelectorAll("*").forEach((el) => {
            const style = window.getComputedStyle(el as HTMLElement);
            const element = el as HTMLElement;

            if (style.backgroundColor.includes("oklch")) {
                element.style.backgroundColor = "#ffffff";
            }
            if (style.color.includes("oklch")) {
                element.style.color = "#000000";
            }
            if (style.borderColor.includes("oklch")) {
                element.style.borderColor = "#dddddd";
            }
        });
    };

    /* ============================
         PDF 다운로드
============================ */
    const handleDownloadPDF = async () => {
        const element = resumeRef.current;
        if (!element) return;

        sanitizeColors();

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            pdf.addPage();
            position = heightLeft - imgHeight;
            pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${application.name}_이력서.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
            <Header />

            <div className="max-w-4xl mx-auto w-full mt-6 px-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">이전 페이지로</span>
                </button>
            </div>

            <main className="flex flex-col items-center flex-1 px-6 py-6">
                <div
                    ref={resumeRef}
                    className="bg-white shadow-lg rounded-2xl w-full max-w-4xl p-8 border border-gray-300"
                >
                    {/* ============================
                        회사 데이터
                    ============================= */}
                    <div className="flex items-center gap-4 mb-8">
                        {job?.logoUrl && (
                            <img
                                src={job.logoUrl}
                                alt={job.company}
                                className="w-14 h-14 rounded-lg object-contain border"
                            />
                        )}

                        <div>
                            <h2 className="text-xl font-semibold">
                                {job?.company || "회사명"}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {job?.title || "지원한 공고"}
                            </p>
                        </div>
                    </div>

                    {/* ============================
                        지원자 데이터
                    ============================ */}
                    <div className="space-y-6 text-[15px] leading-relaxed">

                        <section>
                            <h4 className="border-b pb-1 font-semibold">기본 정보</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <p><b>이름:</b> {application.name}</p>
                                <p><b>생년월일:</b> {application.birth}</p>
                                <p><b>연락처:</b> {application.phone}</p>
                                <p><b>이메일:</b> {application.email}</p>
                                <p className="col-span-2">
                                    <b>주소:</b> {application.address}
                                </p>
                            </div>
                        </section>

                        <section>
                            <h4 className="border-b pb-1 font-semibold">신체사항</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <p><b>신장:</b> {application.height} cm</p>
                                <p><b>체중:</b> {application.weight} kg</p>
                                <p><b>혈액형:</b> {application.blood}</p>
                            </div>
                        </section>

                        <section>
                            <h4 className="border-b pb-1 font-semibold">학력 및 병역</h4>
                            <p>{application.education}</p>
                        </section>

                        <section>
                            <h4 className="border-b pb-1 font-semibold">자격증 및 외국어</h4>
                            <p>
                                {application.license}
                                <br />
                                {application.foreignLang}
                            </p>
                        </section>

                        <section>
                            <h4 className="border-b pb-1 font-semibold">연수 및 활동</h4>
                            <p>{application.activity}</p>
                        </section>

                        <section>
                            <h4 className="border-b pb-1 font-semibold">가족 및 취미</h4>
                            <p>
                                <b>가족:</b> {application.family}
                                <br />
                                <b>취미:</b> {application.hobby}
                            </p>
                        </section>

                        <section>
                            <h4 className="border-b pb-1 font-semibold">지원 동기</h4>
                            <p>{application.motivation}</p>
                        </section>
                    </div>
                </div>

                <button
                    onClick={handleDownloadPDF}
                    className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    <Download className="w-5 h-5" />
                    PDF로 저장하기
                </button>
            </main>

            <footer className="py-6 text-center text-gray-400 text-sm">
                © 2025 JOBIT — All rights reserved.
            </footer>
        </div>
    );
}
export default ResumeViewPage;
