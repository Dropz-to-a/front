// src/pages/jobs/user/Attendance.tsx
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 라이브러리 기본 스타일만
import Header from "../../../components/Header";

type RecordItem = {
  id: number;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  workTime: string | "0h 0m";
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

  /** 현재 날짜를 기본 선택으로 설정 */
  useEffect(() => {
    const todayStr = formatLocalDate(new Date());
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed: RecordItem[] = JSON.parse(saved);
      setRecords(parsed);
      const todayRecord = parsed.find((r) => r.date === todayStr) ?? null;
      setSelectedRecord(todayRecord);
    } else {
      setSelectedRecord(null);
    }

    setSelectedDate(todayStr);
  }, []);

  /** 📌 선택된 날짜의 상태 계산 */
  const getStatus = (record: RecordItem | null) => {
    if (!record) return "기록 없음";
    if (record.clockIn && record.clockOut) return "출퇴근 완료";
    if (record.clockIn && !record.clockOut) return "퇴근 미기록";
    return "기록 없음";
  };

  /** 📌 날짜 클릭 시 */
  const handleDateSelect = (value: Date) => {
    const dateStr = formatLocalDate(value);
    setSelectedDate(dateStr);

    const record = records.find((r) => r.date === dateStr) ?? null;
    setSelectedRecord(record);
  };

  /** 📌 달력 날짜 표시용 dot (크기 고정) */
  const tileContent = ({
    date,
    view,
  }: {
    date: Date;
    view: "month" | "year" | "decade" | "century";
  }) => {
    if (view !== "month") return null;

    const dateStr = formatLocalDate(date);
    const log = records.find((r) => r.date === dateStr);

    const hasOnlyClockIn = !!(log?.clockIn && !log?.clockOut);
    const hasClockOut = !!log?.clockOut;

    return (
      // ✅ 항상 같은 높이 영역 확보 (점이 없어도 높이 유지)
      <div className="mt-1 flex justify-center h-3">
        {hasOnlyClockIn && (
          <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
        )}

        {hasClockOut && (
          <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
        )}

        {!hasOnlyClockIn && !hasClockOut && (
          <span className="inline-block h-2 w-2 rounded-full opacity-0" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <h1 className="mb-2 text-2xl font-bold">출퇴근 기록</h1>

        {/* ✔ 상단: 달력 + 상세 카드 */}
        <div className="grid gap-6 lg:grid-cols-[1.9fr_1.1fr]">
          {/* 캘린더 카드 */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">출퇴근 캘린더</p>
                <p className="font-semibold">
                  날짜를 눌러 상세 기록을 확인하세요
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-yellow-500" />
                  출근
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
                  출퇴근
                </span>
              </div>
            </div>

        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
                <Calendar
                    onClickDay={handleDateSelect}
                    tileContent={tileContent}
                    calendarType="gregory"
                    locale="ko-KR"
                    prev2Label="«"
                    next2Label="»"
                    prevLabel="‹"
                    nextLabel="›"
                    showNeighboringMonth={false}
                    className="
                    !w-full !border-0 !bg-transparent text-sm

                    /* 네비게이션 영역 */
                    [&_.react-calendar__navigation]:flex
                    [&_.react-calendar__navigation]:items-center
                    [&_.react-calendar__navigation]:mb-4
                    [&_.react-calendar__navigation__label]:text-slate-900
                    [&_.react-calendar__navigation__label]:font-semibold
                    [&_.react-calendar__navigation__label]:text-base
                    [&_.react-calendar__navigation button]:!bg-transparent
                    [&_.react-calendar__navigation button]:rounded-lg
                    [&_.react-calendar__navigation button]:text-slate-500
                    [&_.react-calendar__navigation button]:hover:bg-slate-100

                    /* 요일 헤더 */
                    [&_.react-calendar__month-view__weekdays]:text-[11px]
                    [&_.react-calendar__month-view__weekdays]:text-slate-400
                    [&_.react-calendar__month-view__weekdays_abbr]:no-underline

                    /* 날짜 타일 공통 */
                    [&_.react-calendar__tile]:h-12
                    [&_.react-calendar__tile]:rounded-xl
                    [&_.react-calendar__tile]:transition
                    [&_.react-calendar__tile]:duration-150
                    [&_.react-calendar__tile]:ease-out
                    [&_.react-calendar__tile]:text-sm
                    [&_.react-calendar__tile:enabled:hover]:bg-slate-100

                    /* 오늘 날짜 기본 스타일 */
                    [&_.react-calendar__tile--now]:border
                    [&_.react-calendar__tile--now]:border-indigo-200
                    [&_.react-calendar__tile--now]:bg-indigo-50

                    /* 기본 active(선택) 스타일은 우리가 tileClassName에서 덮어씀 */
                    "
                tileClassName={({ date }: { date: Date }) => {
                    const todayStr = formatLocalDate(new Date());
                    const dateStr = formatLocalDate(date);

                    const isSelected = selectedDate === dateStr;
                    const isToday = todayStr === dateStr;
                    const day = date.getDay(); // 0:일, 6:토

                    const classes: string[] = [];

                    // 주말 색상
                    if (day === 0) classes.push("text-red-500");
                    if (day === 6) classes.push("text-blue-500");

                    // 선택된 날짜
                    if (isSelected) {
                        classes.push(
                        "bg-indigo-500 text-white font-semibold shadow-sm hover:!bg-indigo-600"
                        );
                    } else if (isToday) {
                        // 오늘인데 선택은 안 된 경우
                        classes.push("border border-indigo-300");
                    }

                    return classes.join(" ");
                    }}
                />
            </div>
          </div>

          {/* 상세 카드 */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-lg">
            <div>
              <p className="text-sm text-gray-500">선택한 날짜</p>
              <div className="mt-1 flex items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {selectedDate ?? "날짜를 선택하세요"}
                </h2>
                <span
                  className={[
                    "text-xs px-2 py-1 rounded-full",
                    getStatus(selectedRecord) === "출퇴근 완료"
                      ? "bg-green-100 text-green-700"
                      : getStatus(selectedRecord) === "퇴근 미기록"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  {getStatus(selectedRecord)}
                </span>
              </div>

              {selectedRecord ? (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">출근</span>
                    <span className="font-semibold">
                      {selectedRecord.clockIn ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">퇴근</span>
                    <span className="font-semibold">
                      {selectedRecord.clockOut ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">근무시간</span>
                    <span className="font-semibold">
                      {selectedRecord.workTime ?? "-"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-sm text-gray-500">
                  선택한 날짜의 출퇴근 기록이 없습니다.
                </p>
              )}
            </div>

            <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
              꿀팁: 출근만 찍혀 있으면 노랑 점, 출퇴근 모두 찍히면 초록 점이
              표시돼요.
            </div>
          </div>
        </div>

        {/* ✔ 전체 기록 테이블 */}
        <div className="rounded-2xl bg-white p-5 shadow-lg">
          <h2 className="mb-3 text-xl font-semibold">전체 출퇴근 기록</h2>

          <table className="w-full border-collapse text-left text-sm">
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
                  <td
                    colSpan={4}
                    className="p-4 text-center text-gray-500"
                  >
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
