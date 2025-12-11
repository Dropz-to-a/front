// src/pages/jobs/user/WorkDashboard.tsx
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

/** HH:MM 형식 두 개에서 근무시간 문자열 계산 */
const computeWorkTime = (
  clockIn?: string,
  clockOut?: string
): string | undefined => {
  if (!clockIn || !clockOut) return undefined;

  // 동일한 날짜로 맞춰서 시간 차이만 계산
  const start = new Date(`2000-01-01T${clockIn}:00`);
  const end = new Date(`2000-01-01T${clockOut}:00`);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return undefined;
  }

  const diffMin = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
  if (diffMin < 0) return undefined; // 이상한 경우 방어

  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;

  return `${h}시간 ${m}분`;
};

export default function WorkDashboard() {
  const [status, setStatus] = useState<"before" | "working" | "done">("before");
  const [todayLog, setTodayLog] = useState<AttendanceRecord | null>(null);
  const [recentLogs, setRecentLogs] = useState<AttendanceRecord[]>([]);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekday = today.toLocaleDateString("ko-KR", { weekday: "long" });

  // ✅ HH:MM (24시간제)로 저장 -> 계산에 쓰기 좋음
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("ko-KR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

  /** 📌 로컬스토리지 불러오기 */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: AttendanceRecord[] = JSON.parse(saved);

      // 과거 기록 중 workTime이 비어 있고 출퇴근 시간이 있으면 여기서 채워줌
      const enriched = parsed.map((log) => {
        if (!log.workTime && log.clockIn && log.clockOut) {
          const wt = computeWorkTime(log.clockIn, log.clockOut);
          return wt ? { ...log, workTime: wt } : log;
        }
        return log;
      });

      // 필요하면 스토리지도 최신 형태로 다시 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enriched));

      setRecentLogs(enriched.slice(-5).reverse());

      const todayData = enriched.find((log) => log.date === todayStr);
      if (todayData) {
        setTodayLog(todayData);
        setStatus(todayData.clockOut ? "done" : "working");
      }
    }
  }, [todayStr]);

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
      clockIn: formatTime(now),
    };

    const updatedAll = [...recentLogs, newRecord]; // 최근 5개 기준 배열
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));

    setTodayLog(newRecord);
    setStatus("working");
    setRecentLogs(updatedAll.slice(-5));
  };

  /** 📌 퇴근 */
  const handleClockOut = () => {
    if (!todayLog) return;

    const now = new Date();
    const clockOut = formatTime(now);

    const workTime = computeWorkTime(todayLog.clockIn, clockOut);

    const updatedRecord: AttendanceRecord = {
      ...todayLog,
      clockOut,
      workTime,
    };

    const updatedAll = recentLogs.map((log) =>
      log.id === todayLog.id ? updatedRecord : log
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));

    setTodayLog(updatedRecord);
    setRecentLogs(updatedAll);
    setStatus("done");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* 상단 헤더 */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">근무 대시보드</p>
            <h1 className="mt-1 text-3xl font-bold">오늘의 출퇴근</h1>
          </div>
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-900">
            {todayStr} · {weekday}
          </div>
        </div>

        {/* 히어로 영역 */}
        <div
          className="
            grid gap-4 items-stretch
            rounded-2xl border border-slate-200
            bg-gradient-to-br from-indigo-50 to-slate-50
            p-5
            shadow-[0_12px_28px_rgba(15,23,42,0.06)]
            lg:grid-cols-[1.5fr_1fr]
          "
        >
          {/* 왼쪽: 상태/버튼 */}
          <div>
            <p className="mb-1 text-sm text-gray-600">현재 상태</p>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              {status === "before"
                ? "출근 전이에요"
                : status === "working"
                ? "근무 중이에요"
                : "오늘 근무 완료!"}
            </h2>
            <p className="text-gray-600">
              출근/퇴근 버튼을 눌러 오늘 기록을 업데이트하세요.
            </p>

            <div className="mt-5 flex gap-3">
              {status === "before" && (
                <button
                  onClick={handleClockIn}
                  className="rounded-xl border border-transparent bg-gradient-to-br from-indigo-600 to-indigo-500 px-3 py-2 font-bold text-white shadow-xl transition-all duration-150 hover:-translate-y-0.5"
                >
                  출근하기
                </button>
              )}

              {status === "working" && (
                <button
                  onClick={handleClockOut}
                  className="rounded-xl border border-transparent bg-gradient-to-br from-red-500 via-red-500 to-orange-400 px-3 py-2 font-bold text-white shadow-xl transition-all duration-150 hover:-translate-y-0.5"
                >
                  퇴근하기
                </button>
              )}

              {status === "done" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  오늘 근무 완료
                </span>
              )}
            </div>
          </div>

          {/* 오른쪽: 오늘 근무 시간 카드 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
            <p className="text-sm text-gray-500">오늘 근무 시간</p>
            <h3 className="mt-2 text-4xl font-bold text-slate-900">
              {todayLog?.clockIn
                ? todayLog.clockOut
                  ? todayLog.workTime || "-"
                  : "근무 중..."
                : "출근 전"}
            </h3>
            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>출근: {todayLog?.clockIn ?? "-"}</p>
              <p>퇴근: {todayLog?.clockOut ?? "-"}</p>
            </div>
          </div>
        </div>

        {/* 하단: 오늘 기록 + 최근 기록 */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1.1fr]">
          {/* 오늘 기록 카드 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                오늘 기록
              </h2>
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                  status === "working"
                    ? "border border-orange-200 bg-orange-50 text-orange-700"
                    : status === "done"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-indigo-200 bg-indigo-50 text-indigo-700",
                ].join(" ")}
              >
                {status === "before"
                  ? "출근 전"
                  : status === "working"
                  ? "근무 중"
                  : "퇴근 완료"}
              </span>
            </div>

            {todayLog ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-gray-500">출근</p>
                  <p className="text-lg font-semibold">
                    {todayLog.clockIn ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-gray-500">퇴근</p>
                  <p className="text-lg font-semibold">
                    {todayLog.clockOut ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-gray-500">근무시간</p>
                  <p className="text-lg font-semibold">
                    {todayLog.workTime ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-gray-500">상태</p>
                  <p className="text-lg font-semibold">
                    {status === "before"
                      ? "출근 전"
                      : status === "working"
                      ? "근무 중"
                      : "퇴근 완료"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                아직 오늘 기록이 없습니다. 출근을 눌러 기록을 시작하세요.
              </p>
            )}
          </div>

          {/* 최근 기록 카드 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              최근 출퇴근 기록
            </h2>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-gray-500">최근 기록이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {recentLogs.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {log.date}
                      </p>
                      <p className="text-xs text-gray-500">
                        출근 {log.clockIn || "-"} · 퇴근{" "}
                        {log.clockOut || "-"}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {log.workTime || "-"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
