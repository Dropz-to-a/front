// src/components/contracts/DepartmentItem.tsx

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Employee, Department } from "../../types/contracts";
import EmployeeItem from "./EmployeeItem";
import {
    ChevronDown,
    ChevronRight,
    Pencil,
    Trash2,
} from "lucide-react";

export default function DepartmentItem({
    dept,
    expanded,
    onToggle,
    onEdit,
    onDelete,
    onSelectEmp,
}: {
    dept: Department;
    expanded: boolean;
    onToggle: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onSelectEmp: (emp: Employee) => void;
}) {
    return (
        <div className="mb-2">
            {/* ===== 부서 헤더 영역 ===== */}
            <div className="flex items-center">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-2 w-full text-left font-semibold text-gray-800 hover:bg-indigo-50 px-3 py-2 rounded-md transition-all duration-150"
                >
                    {expanded ? (
                        <ChevronDown className="w-5 h-5 text-indigo-500" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-indigo-500" />
                    )}

                    {dept.name}

                    <span className="ml-auto text-sm text-gray-500">
                        {dept.employees.length}명
                    </span>
                </button>

                {/* 수정 */}
                <button
                    onClick={onEdit}
                    className="p-1 hover:bg-gray-200 rounded-md ml-2"
                >
                    <Pencil className="w-4 h-4 text-gray-600" />
                </button>

                {/* 삭제 (미배정 부서는 삭제 불가) */}
                {dept.id !== "unassigned" && (
                    <button
                        onClick={onDelete}
                        className="p-1 hover:bg-red-200 rounded-md ml-1"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                )}
            </div>

            {/* ===== 직원 목록 ===== */}
            {expanded && (
                <div className="ml-7 mt-2 border-l border-gray-200 pl-4 space-y-1">
                    <SortableContext
                        items={dept.employees.map((e) => e.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {dept.employees.length > 0 ? (
                            dept.employees.map((emp) => (
                                <EmployeeItem
                                    key={emp.id}
                                    emp={emp}
                                    deptId={dept.id}
                                    onSelect={() => onSelectEmp(emp)}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 ml-2">인원이 없습니다.</p>
                        )}
                    </SortableContext>
                </div>
            )}
        </div>
    );
}
