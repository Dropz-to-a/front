import axios, { AxiosError } from "axios";

type ApiErrorRes = { code?: string; message?: string };

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
    withCredentials: true,
});

// 요청 인터셉터: JWT 토큰을 헤더에 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401/403 에러 처리
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('인증 실패! 로그인 페이지로 리디렉션...');
            localStorage.removeItem('jwtToken');
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            console.error('권한 없음: 회사 계정으로 로그인해야 합니다.');
        }
        return Promise.reject(error);
    }
);

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
            const { data } = await api.get<PublicJobPosting[]>("/api/job-postings");
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },

    /** 내 공고 목록 조회 (회사용) */
    async getList() {
        try {
            const { data } = await api.get<JobPosting[]>("/api/company/job-postings");
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },

    /** 채용 공고 등록 */
    async create(body: CreateJobPostingRequest) {
        try {
            const { data } = await api.post("/api/company/job-postings", body);
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },

    /** 채용 공고 수정 */
    async update(postingId: number, body: UpdateJobPostingRequest) {
        try {
            const { data } = await api.patch(`/api/company/job-postings/${postingId}`, body);
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },

    /** 채용 공고 삭제(마감) */
    async close(postingId: number) {
        try {
            const { data } = await api.patch(`/api/company/job-postings/${postingId}/close`);
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },

    /** 공고 기록 조회 (마감된 공고만) */
    async getHistory() {
        try {
            const { data } = await api.get<JobPostingHistory[]>("/api/company/job-postings/history");
            return data;
        } catch (e) {
            throw parseAxiosError(e);
        }
    },
};

