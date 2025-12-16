import axios, { AxiosError } from "axios";

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

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
    withCredentials: true,
});

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
    async clockIn(body: ClockReq) {
        try {
            const { data } = await api.post("/api/attendance/clock-in", body);
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },

    async clockOut(body: ClockReq) {
        try {
            const { data } = await api.post("/api/attendance/clock-out", body);
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },

    async getHistory(params: {
        companyId: number;
        fromDate: string;
        toDate: string;
        employeeId?: number;
    }) {
        try {
            const { data } = await api.get<AttendanceItem[]>("/api/attendance/history", { params });
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },
};
