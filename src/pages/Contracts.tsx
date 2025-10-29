import { useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";

type Contract = {
  id: string;
  jobTitle: string;
  applicant: string;
  company: string;
  status: "요청 중" | "진행 중" | "완료";
  startDate: string;
  endDate?: string;
  fileUrl?: string;
};

export default function Contracts() {
  const [contracts] = useState<Contract[]>([
    {
      id: "1",
      jobTitle: "프론트엔드 개발자 채용",
      applicant: "박지우",
      company: "드롭즈 주식회사",
      status: "진행 중",
      startDate: "2025-10-20",
      endDate: "2026-10-20",
      fileUrl: "/contracts/sample1.pdf",
    },
    {
      id: "2",
      jobTitle: "백엔드 엔지니어 채용",
      applicant: "이민재",
      company: "드롭즈 주식회사",
      status: "요청 중",
      startDate: "2025-10-25",
    },
    {
      id: "3",
      jobTitle: "디자이너 채용",
      applicant: "김가은",
      company: "드롭즈 주식회사",
      status: "완료",
      startDate: "2024-09-01",
      endDate: "2025-09-01",
      fileUrl: "/contracts/sample2.pdf",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* ===== 제목 ===== */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📑 계약 관리(이미 재직중)</h1>
          <Link
            to="/jobmanage"
            className="text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            ← 공고 관리로 돌아가기
          </Link>
        </div>

        {/* ===== 요약 섹션 ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <SummaryCard
            title="진행 중"
            count={contracts.filter((c) => c.status === "진행 중").length}
            color="bg-blue-100 text-blue-700"
          />
          <SummaryCard
            title="요청 중"
            count={contracts.filter((c) => c.status === "요청 중").length}
            color="bg-yellow-100 text-yellow-700"
          />
          <SummaryCard
            title="완료"
            count={contracts.filter((c) => c.status === "완료").length}
            color="bg-green-100 text-green-700"
          />
        </div>

        {/* ===== 계약 테이블 ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800 border-b">
              <tr>
                <th className="py-3 px-4 text-left w-[25%]">공고명</th>
                <th className="py-3 px-4 text-left w-[15%]">지원자</th>
                <th className="py-3 px-4 text-left w-[15%]">상태</th>
                <th className="py-3 px-4 text-left w-[20%]">기간</th>
                <th className="py-3 px-4 text-center w-[25%]">관리</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {contract.jobTitle}
                  </td>
                  <td className="py-3 px-4">{contract.applicant}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={contract.status} />
                  </td>
                  <td className="py-3 px-4">
                    {contract.startDate}{" "}
                    {contract.endDate && `~ ${contract.endDate}`}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    {contract.fileUrl ? (
                      <a
                        href={contract.fileUrl}
                        download
                        className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition"
                      >
                        계약서 다운로드
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">
                        파일 없음
                      </span>
                    )}

                    {contract.status === "요청 중" && (
                      <button
                        onClick={() =>
                          alert(`${contract.applicant}님에게 계약 요청 전송됨`)
                        }
                        className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200"
                      >
                        계약 요청 전송
                      </button>
                    )}

                    {contract.status === "진행 중" && (
                      <button
                        onClick={() =>
                          alert(`${contract.applicant}님과의 계약이 완료 처리되었습니다.`)
                        }
                        className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-md hover:bg-green-200"
                      >
                        완료 처리
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {contracts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-gray-500 text-sm"
                  >
                    현재 등록된 계약이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/** ===== 서브 컴포넌트 ===== */
const SummaryCard = ({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) => (
  <div
    className={`rounded-xl p-5 text-center font-semibold ${color} border border-gray-200 shadow-sm`}
  >
    <p className="text-sm">{title}</p>
    <p className="text-2xl font-bold mt-1">{count}</p>
  </div>
);

const StatusBadge = ({ status }: { status: Contract["status"] }) => {
  const color =
    status === "완료"
      ? "bg-green-100 text-green-700"
      : status === "진행 중"
        ? "bg-blue-100 text-blue-700"
        : "bg-yellow-100 text-yellow-700";
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${color}`}>
      {status}
    </span>
  );
}
