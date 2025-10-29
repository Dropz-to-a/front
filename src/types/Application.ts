// src/types/Application.ts
import type { Job } from "../pages/Jobs";

export type AppliedJob = Job & {
    date: string;
    status: "지원완료" | "검토중" | "합격" | "불합격";
    note?: string;
};
