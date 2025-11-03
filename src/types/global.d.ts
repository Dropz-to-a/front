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