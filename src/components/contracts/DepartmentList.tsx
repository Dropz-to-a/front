import { useDroppable } from "@dnd-kit/core";
import EmployeeCard from "./EmployeeCard";
import type { Department, Employee } from "../../types/contracts";
import { ChevronRight, ChevronDown,  Trash2 } from "lucide-react";

export default function DepartmentList({
    departments,
    expanded,
    toggleExpand,
    onEditDept,
    onDeleteDept,
    setSelectedEmployee,
}: {
    departments: Department[];
    expanded: string[];
    toggleExpand: (id: string) => void;
    onEditDept: (dept: Department) => void;
    onDeleteDept: (dept: Department) => void;
    setSelectedEmployee: (emp: Employee) => void;
}) {
    return (
        <>
            {departments.map((dept) => (
                <DepartmentItem
                    key={dept.id}
                    dept={dept}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    onEditDept={onEditDept}
                    onDeleteDept={onDeleteDept}
                    setSelectedEmployee={setSelectedEmployee}
                />
            ))}
        </>
    );
}

function DepartmentItem({
    dept,
    expanded,
    toggleExpand,
    onDeleteDept,
    setSelectedEmployee,
}: {
    dept: Department;
    expanded: string[];
    toggleExpand: (id: string) => void;
    onEditDept: (dept: Department) => void;
    onDeleteDept: (dept: Department) => void;
    setSelectedEmployee: (emp: Employee) => void;
}) {
    const { setNodeRef } = useDroppable({
        id: dept.id,
        data: { deptId: dept.id },
    });

    return (
        <div className="mb-3">
            <div className="flex items-center">
                <button
                    onClick={() => toggleExpand(dept.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-md hover:bg-indigo-50"
                >
                    {expanded.includes(dept.id) ? (
                        <ChevronDown className="w-5 h-5 text-indigo-500" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-indigo-500" />
                    )}
                    {dept.name}
                    <span className="ml-auto text-sm text-gray-500">
                        {dept.employees.length}명
                    </span>
                </button>

                {dept.id !== "unassigned" && (
                    <button
                        onClick={() => onDeleteDept(dept)}
                        className="p-1 hover:bg-red-200 rounded-md"
                    >
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                )}
            </div>

            {expanded.includes(dept.id) && (
                <div
                    ref={setNodeRef}
                    className="ml-6 mt-2 pl-4 border-l space-y-2 min-h-[50px] py-2"
                >
                    {dept.employees.length > 0 ? (
                        dept.employees.map((emp) => (
                            <EmployeeCard
                                key={emp.id}
                                employee={emp}
                                deptId={dept.id}
                                onSelect={setSelectedEmployee}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">인원이 없습니다.</p>
                    )}
                </div>
            )}
        </div>
    );
}
