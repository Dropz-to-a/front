// src/pages/jobs/company/Contracts.tsx

import { useState } from "react";
import Header from "../../../components/Header";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import DepartmentList from "../../../components/contracts/DepartmentList";
import EmployeeDetail from "../../../components/contracts/EmployeeDetail";
import Modal from "../../../components/contracts/Modal";
import EmployeeCard from "../../../components/contracts/EmployeeCard";

import type { Department, Employee } from "../../../types/contracts";
import { Plus } from "lucide-react";

export default function Contracts() {
  /* ============================
      초기 데이터
  ============================ */
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 'dev',
      name: '개발팀',
      employees: [
        {
          id: '1',
          name: '박지우',
          position: '프론트엔드 개발자',
          status: '진행 중',
          startDate: '2025-10-20',
          endDate: '2026-10-20',
          fileUrl: '/contracts/sample1.pdf',
        },
        {
          id: '2',
          name: '이민재',
          position: '백엔드 엔지니어',
          status: '요청 중',
          startDate: '2025-10-25',
        },
      ],
    },
    {
      id: 'design',
      name: '디자인팀',
      employees: [
        {
          id: '3',
          name: '김가은',
          position: 'UI 디자이너',
          status: '완료',
          startDate: '2024-09-01',
          endDate: '2025-09-01',
          fileUrl: '/contracts/sample2.pdf',
        },
      ],
    },
    { id: 'ops', name: '운영팀', employees: [] },
  ])

  const [expanded, setExpanded] = useState<string[]>(['dev'])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null)
  const [activeDeptId, setActiveDeptId] = useState<string | null>(null)

  const onDragStart = (event: { active: { id: string | number; data: { current?: { deptId?: string } } } }) => {
    const { active } = event;
    const empId = String(active.id);
    const deptId = active.data.current?.deptId;
    
    // active employee 찾기
    departments.forEach((dept) => {
      const emp = dept.employees.find((e) => e.id === empId);
      if (emp) {
        setActiveEmployee(emp);
        setActiveDeptId(deptId || null);
      }
    });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveEmployee(null);
    setActiveDeptId(null);

    const { active, over } = event;
    if (!over) return;

    const empId = String(active.id);
    const fromDept = active.data.current?.deptId;
    const toDept = over.data.current?.deptId;

    if (!fromDept || !toDept || fromDept === toDept) return;

    setDepartments((prev) => {
      const next = [...prev];
      let moving: Employee | null = null;

      next.forEach((dept) => {
        if (dept.id === fromDept) {
          dept.employees = dept.employees.filter((emp) => {
            if (emp.id === empId) moving = emp;
            return emp.id !== empId;
          });
        }
      });

      next.forEach((dept) => {
        if (dept.id === toDept && moving) dept.employees.push(moving);
      });

      return next;
    });
  };

  /* ============================
      출근 / 퇴근 API
  ============================ */
  const handleClockIn = async () => {
    if (!selectedEmployee) return;

    const res = await fetch("/api/attendance/clock-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeAccountId: selectedEmployee.id,
        companyAccountId: 8,
      }),
    });

    if (res.ok) {
      alert("출근 완료!");
    } else {
      alert("이미 출근 기록 있음");
    }
  };

  const handleClockOut = async () => {
    if (!selectedEmployee) return;

    const res = await fetch("/api/attendance/clock-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeAccountId: selectedEmployee.id,
        companyAccountId: 8,
      }),
    });

    if (res.ok) {
      alert("퇴근 완료!");
    } else {
      alert("출근 기록 없음 또는 이미 퇴근됨");
    }
  };

  /* ============================
      부서 추가 / 수정 / 삭제
  ============================ */
  const [newDeptOpen, setNewDeptOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");

  const [deleteDept, setDeleteDept] = useState<Department | null>(null);

  const addDepartment = () => {
    if (!newDeptName.trim()) return;

    const id = Date.now().toString();
    setDepartments((prev) => [...prev, { id, name: newDeptName, employees: [] }]);

    setNewDeptName("");
    setNewDeptOpen(false);
  };


  const confirmDeleteDept = () => {
    if (!deleteDept) return;

    setDepartments((prev) => {
      // 기존 구조 복사
      let updated = prev.filter((d) => d.id !== deleteDept.id);

      // 미배정 부서 찾기
      const unassignedIndex = updated.findIndex((d) => d.id === "unassigned");

      if (unassignedIndex === -1) {
        // 미배정 부서 없으면 생성
        updated = [
          ...updated,
          {
            id: "unassigned",
            name: "미배정 부서",
            employees: [...deleteDept.employees], // ⭐ 새 배열로 생성
          },
        ];
      } else {
        // 이미 미배정 부서 있음 → 기존 employees에 추가
        const old = updated[unassignedIndex];
        updated[unassignedIndex] = {
          ...old,
          employees: [...old.employees, ...deleteDept.employees], // ⭐ push 금지
        };
      }

      return updated;
    });

    setDeleteDept(null);
  };


  /* ============================
        UI
  ============================ */
  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <DragOverlay>
        {activeEmployee ? (
          <EmployeeCard employee={activeEmployee} deptId={activeDeptId!} isOverlay />
        ) : null}
      </DragOverlay>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="flex max-w-7xl mx-auto p-6 gap-6">
          {/* 좌측 패널 */}
          <div className="bg-white rounded-2xl shadow p-6 w-[320px] h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">부서별 재직자 관리</h2>

              <button
                onClick={() => setNewDeptOpen(true)}
                className="p-2 bg-indigo-100 rounded-md"
              >
                <Plus className="w-4 h-4 text-indigo-700" />
              </button>
            </div>

            <DepartmentList
              departments={departments.filter(
                (d) => !(d.id === "unassigned" && d.employees.length === 0)
              )}
              expanded={expanded}
              toggleExpand={(id) =>
                setExpanded((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                )
              }
              onEditDept={() => {
                // 부서 수정 기능은 추후 구현 예정
              }}
              onDeleteDept={setDeleteDept}
              setSelectedEmployee={setSelectedEmployee}
            />

          </div>

          {/* 우측 패널 */}
          <div className="flex-1 bg-white rounded-2xl shadow p-8">
            <EmployeeDetail
              employee={selectedEmployee}
              onClockIn={handleClockIn}
              onClockOut={handleClockOut}
            />
          </div>
        </main>

        {/* ======== 모달: 부서 추가 ======== */}
        {newDeptOpen && (
          <Modal onClose={() => setNewDeptOpen(false)}>
            <h3 className="text-lg font-semibold mb-3">새 부서 추가</h3>

            <input
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="예: 연구개발팀"
              className="w-full px-3 py-2 border rounded-md"
            />

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setNewDeptOpen(false)}
                className="px-3 py-1.5 bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={addDepartment}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md"
              >
                추가
              </button>
            </div>
          </Modal>
        )}

        {/* ======== 모달: 부서 삭제 ======== */}
        {deleteDept && (
          <Modal onClose={() => setDeleteDept(null)}>
            <h3 className="text-lg font-semibold mb-3 text-red-700">
              부서 삭제
            </h3>

            <p className="text-sm text-gray-700 mb-4">
              "{deleteDept.name}" 부서를 삭제하면 <br />
              <b>소속 직원은 '미배정 부서'로 이동합니다.</b>
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteDept(null)}
                className="px-3 py-1.5 bg-gray-200 rounded-md"
              >
                취소
              </button>
              <button
                onClick={confirmDeleteDept}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md"
              >
                삭제
              </button>
            </div>
          </Modal>
        )}
      </div>
    </DndContext>
  );
}
