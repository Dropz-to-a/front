import { AxiosError } from "axios";
import apiClient from "./Api";

type ClockReq = { employeeAccountId: number; companyAccountId: number };

export type AttendanceItem = {
    attendanceId: number;
    employeeAccountId: number;
    companyAccountId: number;
    checkType: "IN" | "OUT";
    checkedAt: string;
    status: "SUCCESS" | string;
};

type ApiErrorRes = { code?: string; message?: string };

const parseAxiosError = (e: unknown) => {
    const err = e as AxiosError<ApiErrorRes>;
    return {
        status: err.response?.status,
        code: err.response?.data?.code,
        message:
            err.response?.data?.message || err.message || "요청 중 오류가 발생했습니다.",
    };
};

export const attendanceApi = {
    /** 출근 기록 생성 */
    async clockIn(body: ClockReq) {
        try {
            const { data } = await apiClient.post<AttendanceItem>("/api/attendance/clock-in", body);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[attendanceApi.clockIn]', error);
            throw error;
        }
    },

    /** 퇴근 기록 생성 */
    async clockOut(body: ClockReq) {
        try {
            const { data } = await apiClient.post<AttendanceItem>("/api/attendance/clock-out", body);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[attendanceApi.clockOut]', error);
            throw error;
        }
    },

    /** 근태 기록 조회 */
    async getHistory(params: {
        companyId: number;
        fromDate: string;
        toDate: string;
        employeeId?: number;
    }) {
        try {
            const { data } = await apiClient.get<AttendanceItem[]>("/api/attendance/history", { params });
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[attendanceApi.getHistory]', error);
            throw error;
        }
    },
};
