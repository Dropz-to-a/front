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

// 회사용: 공고별 지원서 목록 조회 응답 타입
export type CompanyApplicationListItem = {
    applicationId: number;
    writerId: number;
    name: string;
    status: "APPLIED" | "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "HIRED";
    appliedAt: string;
};

// 회사용: 지원서 상세 조회 응답 타입
export type CompanyApplicationDetail = {
    applicationId: number;
    postingId: number;
    writerId: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    activities?: string;
    introduction?: string;
    motivation?: string;
    personality?: string;
    futureGoal?: string;
    height?: number;
    weight?: number;
    blood?: string;
    militaryStatus?: string;
    militaryBranch?: string;
    militaryType?: string;
    militaryRank?: string;
    militaryStartDate?: string;
    militaryEndDate?: string;
    militaryExemptReason?: string;
    awardName1?: string;
    awardDate1?: string;
    awardIssuer1?: string;
    awardName2?: string;
    awardDate2?: string;
    awardIssuer2?: string;
    awardName3?: string;
    awardDate3?: string;
    awardIssuer3?: string;
    foreignLangAbility1?: string;
    foreignLangTest1?: string;
    foreignLangScore1?: string;
    foreignLangAbility2?: string;
    foreignLangTest2?: string;
    foreignLangScore2?: string;
    familyRelation1?: string;
    familyName1?: string;
    familyAge1?: string;
    familyJob1?: string;
    familyRelation2?: string;
    familyName2?: string;
    familyAge2?: string;
    familyJob2?: string;
    familyRelation3?: string;
    familyName3?: string;
    familyAge3?: string;
    familyJob3?: string;
    familyRelation4?: string;
    familyName4?: string;
    familyAge4?: string;
    familyJob4?: string;
    licenseType1?: string;
    licenseLevel1?: string;
    licenseDate1?: string;
    licenseIssuer1?: string;
    licenseType2?: string;
    licenseLevel2?: string;
    licenseDate2?: string;
    licenseIssuer2?: string;
    licenseType3?: string;
    licenseLevel3?: string;
    licenseDate3?: string;
    licenseIssuer3?: string;
    middleSchoolName?: string;
    middleSchoolStartDate?: string;
    middleSchoolEndDate?: string;
    middleSchoolGraduated?: boolean;
    highSchoolName?: string;
    highSchoolMajor?: string;
    highSchoolStartDate?: string;
    highSchoolEndDate?: string;
    highSchoolGraduated?: boolean;
    universityName?: string;
    universityMajor?: string;
    universityStartDate?: string;
    universityEndDate?: string;
    universityGraduated?: boolean;
    hobby?: string;
    specialty?: string;
    portfolioUrl?: string;
    status: "APPLIED" | "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED" | "HIRED";
    appliedAt: string;
};

export type CreateApplicationRequest = {
    postingId: number;
    name: string;
    birth: string;
    email: string;
    phone: string;
    address: string;
    profileImageUrl?: string;
    activities?: string;
    introduction?: string;
    motivation?: string;
    personality?: string;
    futureGoal?: string;
    height?: number;
    weight?: number;
    blood?: string;
    militaryStatus?: string;
    militaryBranch?: string;
    militaryType?: string;
    militaryRank?: string;
    militaryStartDate?: string;
    militaryEndDate?: string;
    militaryExemptReason?: string;
    awardName1?: string;
    awardDate1?: string;
    awardIssuer1?: string;
    awardName2?: string;
    awardDate2?: string;
    awardIssuer2?: string;
    awardName3?: string;
    awardDate3?: string;
    awardIssuer3?: string;
    foreignLangAbility1?: string;
    foreignLangTest1?: string;
    foreignLangScore1?: string;
    foreignLangAbility2?: string;
    foreignLangTest2?: string;
    foreignLangScore2?: string;
    familyRelation1?: string;
    familyName1?: string;
    familyAge1?: string;
    familyJob1?: string;
    familyRelation2?: string;
    familyName2?: string;
    familyAge2?: string;
    familyJob2?: string;
    familyRelation3?: string;
    familyName3?: string;
    familyAge3?: string;
    familyJob3?: string;
    familyRelation4?: string;
    familyName4?: string;
    familyAge4?: string;
    familyJob4?: string;
    licenseType1?: string;
    licenseLevel1?: string;
    licenseDate1?: string;
    licenseIssuer1?: string;
    licenseType2?: string;
    licenseLevel2?: string;
    licenseDate2?: string;
    licenseIssuer2?: string;
    licenseType3?: string;
    licenseLevel3?: string;
    licenseDate3?: string;
    licenseIssuer3?: string;
    middleSchoolName?: string;
    middleSchoolStartDate?: string;
    middleSchoolEndDate?: string;
    middleSchoolGraduated?: boolean;
    highSchoolName?: string;
    highSchoolMajor?: string;
    highSchoolStartDate?: string;
    highSchoolEndDate?: string;
    highSchoolGraduated?: boolean;
    universityName?: string;
    universityMajor?: string;
    universityStartDate?: string;
    universityEndDate?: string;
    universityGraduated?: boolean;
    hobby?: string;
    specialty?: string;
    portfolioUrl?: string;
};


export const applicationApi = {
    /** 지원 제출 */
    async create(body: CreateApplicationRequest) {
        try {
            const { data } = await apiClient.post<Application>("/api/applications", body);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[applicationApi.create]', error);
            throw error;
        }
    },

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

    /** 회사용: 공고별 지원서 목록 조회 */
    async getCompanyApplicationsByPosting(postingId: number) {
        try {
            const { data } = await apiClient.get<CompanyApplicationListItem[]>(`/api/company/applications/posting/${postingId}`);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[applicationApi.getCompanyApplicationsByPosting]', error);
            throw error;
        }
    },

    /** 회사용: 지원서 상세 조회 */
    async getCompanyApplicationDetail(applicationId: number) {
        try {
            const { data } = await apiClient.get<CompanyApplicationDetail>(`/api/company/applications/${applicationId}`);
            return data;
        } catch (e) {
            const error = parseAxiosError(e);
            console.error('[applicationApi.getCompanyApplicationDetail]', error);
            throw error;
        }
    },
};

