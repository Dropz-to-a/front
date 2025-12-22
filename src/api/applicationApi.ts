import { AxiosError } from "axios";
import apiClient from "./Api";

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

export type Application = {
    applicationId: number;
    postingId: number;
    appliedAt: string;
    status: "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";
    note?: string;
};

export const applicationApi = {
    /** 내 지원 목록 조회 */
    async getMyApplications() {
        try {
            const { data } = await apiClient.get<Application[]>("/api/applications/me");
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[applicationApi.getMyApplications]', error);
            throw error;
        }
    },

    /** 지원 삭제 */
    async delete(applicationId: number) {
        try {
            const { data } = await apiClient.delete(`/api/applications/${applicationId}`);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[applicationApi.delete]', error);
            throw error;
        }
    },
};

