// src/types/contracts

export type Employee = {
    id: string;
    name: string;
    position: string;
    status: "요청 중" | "진행 중" | "완료";
    startDate: string;
    endDate?: string;
    fileUrl?: string;
};

export type Department = {
    id: string;
    name: string;
    employees: Employee[];
};
