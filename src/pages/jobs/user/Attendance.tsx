import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Header from "../../../components/Header";

type RecordItem = {
    id: number;
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    workTime: string | "0h 0m" ;
};

const STORAGE_KEY = "attendance_records";

/** ✅ 로컬(KST) 기준 날짜 문자열로 변환 */
const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const Attendance = () => {
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);

    const todayStr = formatLocalDate(new Date()); // ← 수정 완료

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed: RecordItem[] = JSON.parse(saved);
            setRecords(parsed);
        }
    }, []);

    /** 📌 날짜 클릭 시 */
    const handleDateSelect = (value: Date) => {
        const dateStr = formatLocalDate(value); // ← 핵심 수정!
        setSelectedDate(dateStr);

        const record = records.find((r) => r.date === dateStr) ?? null;
        setSelectedRecord(record);
    };

    /** 📌 달력 날짜 표시용 dot */
    const tileContent = ({ date, view }: any) => {
        if (view !== "month") return null;

        const dateStr = formatLocalDate(date); // ← 수정

        const log = records.find((r) => r.date === dateStr);
        if (!log) return null;

        return (
            <div className="text-center mt-1">
                {/* 출근만 */}
                {log.clockIn && !log.clockOut && (
                    <span className="w-2 h-2 inline-block bg-yellow-500 rounded-full"></span>
                )}

                {/* 출근 + 퇴근 */}
                {log.clockOut && (
                    <span className="w-2 h-2 inline-block bg-green-600 rounded-full"></span>
                )}
            </div>
        );
    };

    return (
        <div>
            <Header />
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">출퇴근 기록</h1>

            {/* ✔ 달력 */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">
                <Calendar
                    onClickDay={handleDateSelect}
                    tileContent={tileContent}
                    calendarType="gregory"
                />
            </div>

            {/* ✔ 가운데 선택된 날짜 박스 */}
            <div className="bg-white shadow rounded p-5 mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    {selectedDate ?? "날짜를 선택하세요"}
                </h2>

                {selectedRecord ? (
                    <>
                        <p>출근: {selectedRecord.clockIn ?? "-"}</p>
                        <p>퇴근: {selectedRecord.clockOut ?? "-"}</p>
                        <p>근무시간: {selectedRecord.workTime ?? "-"}</p>
                    </>
                ) : (
                    <p className="text-gray-500">기록이 없습니다.</p>
                )}
            </div>

            {/* ✔ 전체 기록 테이블 */}
            <div className="bg-white shadow rounded p-5">
                <h2 className="text-xl font-semibold mb-3">전체 출퇴근 기록</h2>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="p-2">날짜</th>
                            <th className="p-2">출근</th>
                            <th className="p-2">퇴근</th>
                            <th className="p-2">근무시간</th>
                        </tr>
                    </thead>

                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center p-4 text-gray-500">
                                    출퇴근 기록이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            records
                                .sort((a, b) => (a.date < b.date ? 1 : -1))
                                .map((r) => (
                                    <tr key={r.id} className="border-b">
                                        <td className="p-2">{r.date}</td>
                                        <td className="p-2">{r.clockIn ?? "-"}</td>
                                        <td className="p-2">{r.clockOut ?? "-"}</td>
                                        <td className="p-2">{r.workTime ?? "-"}</td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    </div>
    );
};

export default Attendance;
