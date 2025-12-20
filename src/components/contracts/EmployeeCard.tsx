import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { User, GripVertical } from "lucide-react";
import type { Employee } from "../../types/contracts";
import { useRef } from "react";

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
    // useSortable은 부서 내 순서 변경과 부서 간 이동 모두 지원
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: employee.id,
        data: { type: "EMPLOYEE", deptId },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const startPos = useRef<{ x: number; y: number } | null>(null);
    const dragged = useRef(false);

    const handlePointerDown = (e: React.PointerEvent) => {
        startPos.current = { x: e.clientX, y: e.clientY };
        dragged.current = false;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!startPos.current) return;
        const dx = Math.abs(e.clientX - startPos.current.x);
        const dy = Math.abs(e.clientY - startPos.current.y);

        if (dx > 6 || dy > 6) {
            dragged.current = true;
        }
    };

    const handlePointerUp = () => {
        if (!dragged.current) {
            onSelect?.(employee);
        }
        startPos.current = null;
    };

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
            style={style}
            {...attributes}
            className="flex items-center justify-between px-3 py-2 bg-white rounded-md shadow-sm hover:bg-gray-100 text-sm"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <div className="flex items-center gap-2 cursor-pointer">
                <User className="w-4 h-4 text-gray-600" />
                <span>
                    {employee.name}<br />
                    <span className="text-gray-500">
                    {employee.position}
                    </span>
                </span>
            </div>

            {/* ⭐ 이 부분만 드래그 핸들 */}
            <button
                {...listeners}
                className="cursor-grab p-1 hover:bg-gray-200 rounded"
            >
                <GripVertical className="w-4 h-4 text-gray-500" />
            </button>
        </div>
    );
}
