import { useDraggable } from "@dnd-kit/core";
import { User } from "lucide-react";
import type { Employee } from "../../types/contracts";


export default function EmployeeCard({
    employee,
    deptId,
    onSelect,
    isOverlay = false,
}: {
    employee: Employee;
    deptId: string;
    onSelect?: (emp: Employee) => void;
    isOverlay?: boolean;
    }) {
    
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: employee.id,
        data: { deptId },
    });

    if (isOverlay) {
        return (
            <div className="cursor-grab px-3 py-2 bg-white rounded-md shadow-xl border text-sm">
                <User className="w-4 h-4 inline-block mr-1 text-gray-600" />
                {employee.name} — {employee.position}
            </div>
        );
    }


    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onClick={() => onSelect?.(employee)}
            className="cursor-grab px-3 py-2 bg-white rounded-md shadow-sm hover:bg-gray-100 flex items-center gap-2 text-sm"
        >
            <User className="w-4 h-4 text-gray-600" />
            <span>
                {employee.name}
                <span className="text-gray-500"> — {employee.position}</span>
            </span>
        </div>
    );
}
