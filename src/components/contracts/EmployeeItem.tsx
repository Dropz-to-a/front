// src/components/contracts/EmployeeItem.tsx

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { User } from "lucide-react";
import type { Employee } from "../../types/contracts";


export default function EmployeeItem({
    emp,
    deptId,
    onSelect,
}: {
    emp: Employee;
    deptId: string;
    onSelect: () => void;
}) {
    const {
        setNodeRef,
        listeners,
        attributes,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: emp.id,
        data: { deptId },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onClick={onSelect}
            style={style}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm border
        ${isDragging
                    ? "bg-indigo-300 text-white shadow-lg"
                    : "hover:bg-gray-100 bg-white text-gray-800"
                }
      `}
        >
            <User className="w-4 h-4" />
            <span className="font-medium">{emp.name}</span>
            <span className="text-gray-500">— {emp.position}</span>
        </div>
    );
}
