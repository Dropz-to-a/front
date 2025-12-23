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

export type JobPosting = {
    postingId: number;
    title: string;
    description: string;
    locationText: string;
    salaryMin: number;
    salaryMax: number;
    status: "DRAFT" | "OPEN" | "CLOSED";
    applicantCount: number;
};

// 공개 공고 조회 응답 타입 (companyName 포함)
export type PublicJobPosting = {
    postingId: number;
    title: string;
    companyName: string;
    employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
    locationText: string;
    salaryMin: number;
    salaryMax: number;
};

export type JobPostingHistory = {
    postingId: number;
    title: string;
    closedAt: string;
    totalApplicants: number;
};

export type CreateJobPostingRequest = {
    title: string;
    description: string;
    employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
    locationText: string;
    salaryMin: number;
    salaryMax: number;
};

export type UpdateJobPostingRequest = {
    title: string;
    description: string;
    employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
    locationText: string;
    salaryMin: number;
    salaryMax: number;
};

export const jobPostingApi = {
    /** 공개 공고 목록 조회 (사용자용) */
    async getPublicList() {
        try {
            const { data } = await apiClient.get<PublicJobPosting[]>("/api/job-postings");
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[jobPostingApi.getPublicList]', error);
            throw error;
        }
    },

    /** 내 공고 목록 조회 (회사용) */
    async getList() {
        try {
            const { data } = await apiClient.get<JobPosting[]>("/api/company/job-postings");
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[jobPostingApi.getList]', error);
            throw error;
        }
    },

    /** 채용 공고 등록 */
    async create(body: CreateJobPostingRequest) {
        try {
            const { data } = await apiClient.post("/api/company/job-postings", body);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[jobPostingApi.create]', error);
            throw error;
        }
    },

    /** 채용 공고 수정 */
    async update(postingId: number, body: UpdateJobPostingRequest) {
        try {
            const { data } = await apiClient.patch(`/api/company/job-postings/${postingId}`, body);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[jobPostingApi.update]', error);
            throw error;
        }
    },

    /** 채용 공고 삭제(마감) */
    async close(postingId: number) {
        try {
            const { data } = await apiClient.patch(`/api/company/job-postings/${postingId}/close`);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[jobPostingApi.close]', error);
            throw error;
        }
    },

    /** 공고 기록 조회 (마감된 공고만) */
    async getHistory() {
        try {
            const { data } = await apiClient.get<JobPostingHistory[]>("/api/company/job-postings/history");
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[jobPostingApi.getHistory]', error);
            throw error;
        }
    },
};

