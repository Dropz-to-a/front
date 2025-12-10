import type { Job } from "@/pages/jobs/user/Jobs";


export type AppliedJob = Job & {
    date: string;
    applicationStatus: "지원완료" | "검토중" | "합격" | "불합격";
    note: string;
};
