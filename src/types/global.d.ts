/** ==== 회사 데이터 타입입 ==== */
type JobDetail = {
    id: string;
    company: string;
    title: string;
    description?: string;
    overview?: string;            // 소개
    responsibilities?: string[];  // 주요업무
    requirements?: string[];      // 자격요건
    preferred?: string[];         // 우대사항
    benefits?: string[];          // 복지/혜택
    process?: string[];           // 채용절차
    location?: string;
    employmentType?: string;      // 정규직/계약직/프리랜스 등
    salaryNote?: string;
    badges?: string[];
    dday?: number;
    verified?: boolean;
    hot?: boolean;
    new?: boolean;
    category?: string;
    imageUrl?: string;
    logoUrl?: string;
    applyUrl?: string;
    postedAt?: string;            // ISO
};


/** ==== 회사 데이터 타입입 ==== */
type job = {
    id: string;
    company: string;
    title: string;
    description?: string;
    overview?: string;            // 소개
    responsibilities?: string[];  // 주요업무
    requirements?: string[];      // 자격요건
    preferred?: string[];         // 우대사항
    benefits?: string[];          // 복지/혜택
    process?: string[];           // 채용절차
    location?: string;
    employmentType?: string;      // 정규직/계약직/프리랜스 등
    salaryNote?: string;
    badges?: string[];
    dday?: number;
    verified?: boolean;
    hot?: boolean;
    new?: boolean;
    category?: string;
    imageUrl?: string;
    logoUrl?: string;
    applyUrl?: string;
    postedAt?: string;            // ISO
};

/** ==== 글로벌 사용자 타입 ==== */

    type GBUser = {
        role: "company" | "user";
        form: {
            name: string;
            email: string;
            phone: string;
            birth: string;
            address: string;
            height: string;
            weight: string;
            blood: string;
            education: string;
            military: string;
            license: string;
            foreignLang: string;
            activity: string;
            family: string;
            hobby: string;
            motivation: string;
        };
        profile: {
            name: string;
            role: string;
            email: string;
            phone: string;
            location: string;
            joinDate: string;
            bio: string;
            trustScore: number;
            experience: {
                company: string;
                role: string;
                years: string;
                summary: string;
            }[];
            skills: string[];
            preferences: {
                jobType: string;
                salary: string;
                workStyle: string;
                startDate: string;
            };
        };
    };
