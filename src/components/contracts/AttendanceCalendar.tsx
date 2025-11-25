// src/components/contracts/AttendanceCalendar.tsx

import { useState, useEffect } from "react";

export default function AttendanceCalendar({
    employeeId,
}: {
    employeeId: string;
}) {
    const [records, setRecords] = useState<any[]>([]);

    // 실제 API 연동 가능
    useEffect(() => {
        // 임시 데이터 → 추후 API로 대체 가능
        setRecords([
            { date: "2025-11-01", type: "in" },
            { date: "2025-11-02", type: "out" },
            { date: "2025-11-05", type: "in" },
        ]);
    }, [employeeId]);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = ["일", "월", "화", "수", "목", "금", "토"];

    const dateCells = Array.from({ length: firstDay }).map(() => null).concat(
        Array.from({ length: lastDate }, (_, i) => i + 1)
    );

    const getStatusDot = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
        )}-${String(day).padStart(2, "0")}`;

        const rec = records.find((r) => r.date === dateStr);

        if (!rec) return null;

        return rec.type === "in" ? (
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1"></span>
        ) : (
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
        );
    };

    return (
        <div className="mt-6 p-5 border rounded-xl bg-gray-50">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
                출석 현황
            </h4>

            {/* 요일 */}
            <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-600 mb-2">
                {days.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* 날짜 */}
            <div className="grid grid-cols-7 gap-2">
                {dateCells.map((day, idx) =>
                    day ? (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center p-2 bg-white rounded-md shadow-sm"
                        >
                            <span className="text-gray-700">{day}</span>
                            {getStatusDot(day)}
                        </div>
                    ) : (
                        <div key={idx}></div>
                    )
                )}
            </div>
        </div>
    );
}
