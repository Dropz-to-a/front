/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/jobs/user/WorkDashboard.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../../components/Header";
import { attendanceApi } from "../../../api/attendanceApi";

interface AttendanceRecord {
  id: number; // 해당 날짜 기록 대표 ID(가장 빠른 IN 또는 가장 늦은 OUT의 attendanceId로 지정)
  date: string; // yyyy-MM-dd (로컬 기준)
  clockIn?: string; // HH:mm
  clockOut?: string; // HH:mm
  workTime?: string; // "x시간 y분"
}

/** 로컬 기준 yyyy-MM-dd */
const formatYMDLocal = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** 로컬 기준 HH:mm */
const formatHMLocal = (d: Date) =>
  d.toLocaleTimeString("ko-KR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

/** HH:MM 형식 두 개에서 근무시간 문자열 계산 */
const computeWorkTime = (clockIn?: string, clockOut?: string): string | undefined => {
  if (!clockIn || !clockOut) return undefined;

  const start = new Date(`2000-01-01T${clockIn}:00`);
  const end = new Date(`2000-01-01T${clockOut}:00`);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return undefined;

  const diffMin = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
  if (diffMin < 0) return undefined;

  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `${h}시간 ${m}분`;
};

type AttendanceItem = {
  attendanceId: number;
  employeeAccountId: number;
  companyAccountId: number;
  checkType: "IN" | "OUT";
  checkedAt: string;
  status: string;
};

/**
 * history(IN/OUT row) -> 날짜별 1개 레코드로 합치기
 * - clockIn: 해당 날짜 IN 중 가장 이른 시간
 * - clockOut: 해당 날짜 OUT 중 가장 늦은 시간
 */
const buildDailyRecords = (items: AttendanceItem[]): AttendanceRecord[] => {
  const map = new Map<
    string,
    {
      ins: { at: Date; id: number }[];
      outs: { at: Date; id: number }[];
    }
  >();

  for (const it of items) {
    const dt = new Date(it.checkedAt); // 로컬 타임으로 파싱
    const date = formatYMDLocal(dt);

    if (!map.has(date)) map.set(date, { ins: [], outs: [] });
    const bucket = map.get(date)!;

    if (it.checkType === "IN") bucket.ins.push({ at: dt, id: it.attendanceId });
    else bucket.outs.push({ at: dt, id: it.attendanceId });
  }

  const out: AttendanceRecord[] = [];

  for (const [date, bucket] of map.entries()) {
    bucket.ins.sort((a, b) => a.at.getTime() - b.at.getTime());
    bucket.outs.sort((a, b) => a.at.getTime() - b.at.getTime());

    const inPick = bucket.ins[0];
    const outPick = bucket.outs[bucket.outs.length - 1];

    const clockIn = inPick ? formatHMLocal(inPick.at) : undefined;
    const clockOut = outPick ? formatHMLocal(outPick.at) : undefined;

    // id는 “대표”용이라, 있으면 IN id 우선, 없으면 OUT id 사용
    const id = inPick?.id ?? outPick?.id ?? Number(date.replaceAll("-", ""));

    out.push({
      id,
      date,
      clockIn,
      clockOut,
      workTime: computeWorkTime(clockIn, clockOut),
    });
  }

  // 최신 날짜가 위로 오게
  out.sort((a, b) => (a.date < b.date ? 1 : -1));
  return out;
};

export default function WorkDashboard() {
  const [status, setStatus] = useState<"before" | "working" | "done">("before");
  const [todayLog, setTodayLog] = useState<AttendanceRecord | null>(null);
  const [recentLogs, setRecentLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ 실제론 로그인/Redux에서 가져오세요
  const employeeAccountId = 1;
  const companyAccountId = 8;

  const today = new Date();
  const todayStr = formatYMDLocal(today);
  const weekday = today.toLocaleDateString("ko-KR", { weekday: "long" });

  // 최근 2주치 조회(원하면 30일/1개월로 변경)
  const range = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 14);
    return { fromDate: formatYMDLocal(from), toDate: todayStr };
  }, [todayStr]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const items = (await attendanceApi.getHistory({
        companyId: companyAccountId,      // API 문서 파라미터: companyId
        employeeId: employeeAccountId,    // 대시보드가 "내 기록"이면 employeeId 넣기
        fromDate: range.fromDate,
        toDate: range.toDate,
      })) as AttendanceItem[];

      const daily = buildDailyRecords(items);

      const todayData = daily.find((d) => d.date === todayStr) ?? null;
      setTodayLog(todayData);

      if (!todayData?.clockIn) setStatus("before");
      else if (!todayData.clockOut) setStatus("working");
      else setStatus("done");

      setRecentLogs(daily.slice(0, 5)); // 최신 5개
    } catch (e: any) {
      alert(e?.message ?? "근태 기록 조회에 실패했습니다.");
      // 실패 시 UI가 이상해지지 않게 최소 초기화
      setTodayLog(null);
      setRecentLogs([]);
      setStatus("before");
    } finally {
      setLoading(false);
    }
  }, [companyAccountId, employeeAccountId, range.fromDate, range.toDate, todayStr]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** 📌 출근(서버) */
  const handleClockIn = async () => {
    if (status !== "before") {
      alert("이미 출근하셨습니다.");
      return;
    }

    setLoading(true);
    try {
      await attendanceApi.clockIn({ employeeAccountId, companyAccountId });
      await refresh();
    } catch (e: any) {
      alert(e?.message ?? "출근 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  /** 📌 퇴근(서버) */
  const handleClockOut = async () => {
    if (status !== "working") {
      alert(status === "before" ? "먼저 출근 기록이 필요합니다." : "이미 퇴근 처리되었습니다.");
      return;
    }

    setLoading(true);
    try {
      await attendanceApi.clockOut({ employeeAccountId, companyAccountId });
      await refresh();
    } catch (e: any) {
      alert(e?.message ?? "퇴근 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
                  disabled={loading}
                  onClick={handleClockIn}
                  className="rounded-xl border border-transparent bg-gradient-to-br from-indigo-600 to-indigo-500 px-3 py-2 font-bold text-white shadow-xl transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "처리 중..." : "출근하기"}
                </button>
              )}

              {status === "working" && (
                <button
                  disabled={loading}
                  onClick={handleClockOut}
                  className="rounded-xl border border-transparent bg-gradient-to-br from-red-500 via-red-500 to-orange-400 px-3 py-2 font-bold text-white shadow-xl transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? "처리 중..." : "퇴근하기"}
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
                : loading
                  ? "불러오는 중..."
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
              <h2 className="text-lg font-semibold text-slate-900">오늘 기록</h2>
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
                  <p className="text-lg font-semibold">{todayLog.clockIn ?? "-"}</p>
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-gray-500">퇴근</p>
                  <p className="text-lg font-semibold">{todayLog.clockOut ?? "-"}</p>
                </div>
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-gray-500">근무시간</p>
                  <p className="text-lg font-semibold">{todayLog.workTime ?? "-"}</p>
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
                {loading
                  ? "기록을 불러오는 중입니다..."
                  : "아직 오늘 기록이 없습니다. 출근을 눌러 기록을 시작하세요."}
              </p>
            )}
          </div>

          {/* 최근 기록 카드 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              최근 출퇴근 기록
            </h2>

            {recentLogs.length === 0 ? (
              <p className="text-sm text-gray-500">
                {loading ? "불러오는 중..." : "최근 기록이 없습니다."}
              </p>
            ) : (
              <ul className="space-y-2">
                {recentLogs.map((log) => (
                  <li
                    key={log.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{log.date}</p>
                      <p className="text-xs text-gray-500">
                        출근 {log.clockIn || "-"} · 퇴근 {log.clockOut || "-"}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {log.workTime || "-"}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-3 text-xs text-gray-400">
              조회 기간: {range.fromDate} ~ {range.toDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
