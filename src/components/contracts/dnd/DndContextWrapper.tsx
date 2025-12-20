// src/components/contracts/dnd/DndContextWrapper.tsx

import {
  DndContext,
  PointerSensor,
  useSensors,
  useSensor,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";

export default function DndContextWrapper({
  children,
  onDragEnd,
  activeOverlay,
}: {
  children: React.ReactNode;
  onDragEnd: (event: any) => void;
  activeOverlay?: React.ReactNode; // ← 추가
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={onDragEnd}
      collisionDetection={closestCenter}
    >
      {children}

      {/* 드래그 미러 */}
      <DragOverlay>
        {activeOverlay || null}
      </DragOverlay>
    </DndContext>
  );
}
