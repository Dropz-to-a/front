// src/pages/JobCompletedAdmin.tsx
import { useParams } from "react-router-dom";
import Header from "../components/Header";

const JobCompletedAdmin = () => {
    const { id } = useParams();

    const applicants = [
        { name: "박지우", status: "합격" },
        { name: "이민재", status: "불합격" },
        { name: "김가은", status: "검토 중" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-4xl mx-auto py-10 px-6">
                <h1 className="text-2xl font-bold mb-6">
                    공고 #{id} 지원자 현황
                </h1>

                <div className="bg-white shadow rounded-xl overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-700">
                                <th className="p-3">이름</th>
                                <th className="p-3">지원 상태</th>
                                <th className="p-3 text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((a, i) => (
                                <tr key={i} className="border-t">
                                    <td className="p-3">{a.name}</td>
                                    <td className="p-3">{a.status}</td>
                                    <td className="p-3 text-right">
                                        <button className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            상태 변경
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-10 flex justify-end gap-3">
                    <button className="px-5 py-2 bg-gray-200 rounded-lg">공고 삭제</button>
                    <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        공고 재게시
                    </button>
                </div>
            </main>
        </div>
    );
};

export default JobCompletedAdmin;
