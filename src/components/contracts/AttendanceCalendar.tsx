/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/contracts/AttendanceCalendar.tsx

import { useState, useEffect } from "react";

export default function AttendanceCalendar({
    employeeId,
}: {
    employeeId: string;
}) {
    const [records, setRecords] = useState<any[]>([]);
    //  현재 보고 있는 달
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth()); // 0~11

    // API 연동 가능
    useEffect(() => {
        // 실제 API에서 employeeId & year & month 기준으로 가져올 수 있음
        setRecords([
            { date: "2025-11-01", type: "in" },
            { date: "2025-11-02", type: "out" },
            { date: "2025-11-05", type: "in" },
        ]);
    }, [employeeId, year, month]);

    // 캘린더 구성
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = ["일", "월", "화", "수", "목", "금", "토"];

    const dateCells: (number | null)[] = [
        ...Array.from({ length: firstDay }, () => null),
        ...Array.from({ length: lastDate }, (_, i) => i + 1)
    ];

    // 출석 기록 점 색 표시
    const getStatusDot = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
        ).padStart(2, "0")}`;

        const rec = records.find((r) => r.date === dateStr);
        if (!rec) return null;

        return rec.type === "in" ? (
            <span className="w-2 h-2 bg-green-500 rounded-full mt-1"></span>
        ) : (
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
        );
    };

    //  이전달
    const prevMonth = () => {
        setMonth((m) => {
            if (m === 0) {
                setYear((y) => y - 1);
                return 11;
            }
            return m - 1;
        });
    };

    //  다음달
    const nextMonth = () => {
        setMonth((m) => {
            if (m === 11) {
                setYear((y) => y + 1);
                return 0;
            }
            return m + 1;
        });
    };

    return (
        <div className="mt-6 p-5 border rounded-xl bg-gray-50">
            {/* 헤더 */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    className="px-2 py-1 rounded hover:bg-gray-200"
                >
                    ◀
                </button>

                <h4 className="text-lg font-semibold text-gray-700">
                    {year}년 {month + 1}월
                </h4>

                <button
                    onClick={nextMonth}
                    className="px-2 py-1 rounded hover:bg-gray-200"
                >
                    ▶
                </button>
            </div>

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
