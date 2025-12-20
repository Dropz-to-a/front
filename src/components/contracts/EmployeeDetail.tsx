// src/components/contracts/EmployeeDetail.tsx

import { FileText, CheckCircle, User } from "lucide-react";
import AttendanceCalendar from "./AttendanceCalendar";
import type{ Employee } from "../../types/contracts";

export default function EmployeeDetail({
    employee,
    onClockIn,
    onClockOut,
}: {
    employee: Employee | null;
    onClockIn: () => void;
    onClockOut: () => void;
}) {
    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <CheckCircle className="w-10 h-10 mb-2 text-gray-300" />
                <p>직원을 선택하면 상세 정보를 볼 수 있습니다.</p>
            </div>
        );
    }

    return (
        <>
            {/* 제목 */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    {employee.name}
                </h3>

                <StatusBadge status={employee.status} />
            </div>

            {/* 정보 */}
            <div className="space-y-3 text-sm text-gray-700 mb-6">
                <p>
                    <b>직책:</b> {employee.position}
                </p>
                <p>
                    <b>계약 기간:</b> {employee.startDate}{" "}
                    {employee.endDate && `~ ${employee.endDate}`}
                </p>
            </div>

            {/* 출근 / 퇴근 */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={onClockIn}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm shadow"
                >
                    출근하기
                </button>
                <button
                    onClick={onClockOut}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm shadow"
                >
                    퇴근하기
                </button>
            </div>

            {/* 출석 캘린더 */}
            <AttendanceCalendar employeeId={employee.id} />

            {/* 파일 */}
            {employee.fileUrl ? (
                <a
                    href={employee.fileUrl}
                    download
                    className="inline-flex items-center gap-2 mt-6 px-5 py-2 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-all"
                >
                    <FileText className="w-4 h-4" />
                    계약서 다운로드
                </a>
            ) : (
                <p className="text-xs text-gray-400 mt-3">계약서 파일 없음</p>
            )}
        </>
    );
}

/* ===========================
   상태 배지
=========================== */
const StatusBadge = ({ status }: { status: Employee["status"] }) => {
    const color =
        status === "완료"
            ? "bg-green-100 text-green-700"
            : status === "진행 중"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700";

    return (
        <span
            className={`px-2 py-1 rounded-md text-xs font-semibold border ${color} border-opacity-50`}
        >
            {status}
        </span>
    );
};
