import { useEffect, useState } from "react";
import Header from "../../../components/Header";

interface AttendanceRecord {
    id: number;
    date: string;
    clockIn?: string;
    clockOut?: string;
    workTime?: string;
}

const STORAGE_KEY = "attendance_records";

export default function WorkDashboard() {
    const [status, setStatus] = useState<"before" | "working" | "done">("before");
    const [todayLog, setTodayLog] = useState<AttendanceRecord | null>(null);
    const [recentLogs, setRecentLogs] = useState<AttendanceRecord[]>([]);

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

    /** 📌 로컬스토리지 불러오기 */
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed: AttendanceRecord[] = JSON.parse(saved);

            setRecentLogs(parsed.slice(-5).reverse());

            const todayData = parsed.find((log) => log.date === todayStr);
            if (todayData) {
                setTodayLog(todayData);
                setStatus(todayData.clockOut ? "done" : "working");
            }
        }
    }, []);

    /** 📌 출근 */
    const handleClockIn = () => {
        if (todayLog?.clockIn) {
            alert("이미 출근하셨습니다.");
            return;
        }

        const now = new Date();
        const newRecord: AttendanceRecord = {
            id: Date.now(),
            date: todayStr,
            clockIn: formatTime(now)
        };

        const updated = [newRecord, ...recentLogs];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        setTodayLog(newRecord);
        setStatus("working");
        setRecentLogs(updated.slice(0, 5));
    };

    /** 📌 퇴근 */
    const handleClockOut = () => {
        if (!todayLog) return;

        const now = new Date();
        const updatedRecord = {
            ...todayLog,
            clockOut: formatTime(now),
        };

        // 근무시간 계산
        const start = new Date(`2025-01-01T${todayLog.clockIn}:00`);
        const end = new Date(`2025-01-01T${updatedRecord.clockOut}:00`);
        const diffMin = Math.floor((+end - +start) / 1000 / 60);
        const h = Math.floor(diffMin / 60);
        const m = diffMin % 60;

        updatedRecord.workTime = `${h}시간 ${m}분`;

        const updatedAll = recentLogs.map(log => log.id === todayLog.id ? updatedRecord : log);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));

        setTodayLog(updatedRecord);
        setRecentLogs(updatedAll);
        setStatus("done");
    };

    return (
        <div>
            <Header />
            <div className="max-w-4xl mx-auto p-6">

                <h1 className="text-2xl font-bold mb-6">근무 대시보드</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                    {/* 오늘 상태 */}
                    <div className="p-6 bg-white rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-2">
                            {todayStr} ({today.toLocaleDateString("ko-KR", { weekday: "long" })})
                        </h2>

                        <p className="text-gray-700 text-lg mt-2">
                            현재 상태:{" "}
                            <b className="text-indigo-600">
                                {status === "before"
                                    ? "출근 전"
                                    : status === "working"
                                        ? "근무 중"
                                        : "퇴근 완료"}
                            </b>
                        </p>

                        <div className="mt-4 flex gap-3">
                            {status === "before" && (
                                <button
                                    onClick={handleClockIn}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                                >
                                    출근하기
                                </button>
                            )}

                            {status === "working" && (
                                <button
                                    onClick={handleClockOut}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                >
                                    퇴근하기
                                </button>
                            )}
                        </div>

                        {todayLog && (
                            <div className="mt-4 text-gray-700">
                                <p>출근: {todayLog.clockIn}</p>
                                {todayLog.clockOut && <p>퇴근: {todayLog.clockOut}</p>}
                            </div>
                        )}
                    </div>

                    {/* 오늘 근무시간 */}
                    <div className="p-6 bg-white rounded-xl shadow">
                        <h2 className="text-xl font-semibold mb-3">오늘 근무 시간</h2>
                        <p className="text-gray-800 text-3xl font-bold mt-4">
                            {todayLog?.clockIn
                                ? todayLog.clockOut
                                    ? todayLog.workTime
                                    : "근무 중..."
                                : "출근 전"}
                        </p>
                    </div>
                </div>

                {/* 최근 기록 */}
                <div className="p-6 bg-white rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">최근 출퇴근 기록</h2>

                    {recentLogs.length === 0 ? (
                        <p className="text-gray-500">최근 기록이 없습니다.</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentLogs.map((log) => (
                                <li key={log.id} className="p-3 border rounded-md flex justify-between bg-gray-50">
                                    <b>{log.date}</b>
                                    <span className="text-gray-600">
                                        출근: {log.clockIn || "-"} / 퇴근: {log.clockOut || "-"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>

    );
}
