// src/pages/jobs/company/Contracts.tsx

import { useState } from "react";
import Header from "../../../components/Header";
import { DndContext, DragOverlay, type DragEndEvent, type DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import DepartmentList from "../../../components/contracts/DepartmentList";
import EmployeeDetail from "../../../components/contracts/EmployeeDetail";
import Modal from "../../../components/contracts/Modal";
import EmployeeCard from "../../../components/contracts/EmployeeCard";

import type { Department, Employee } from "../../../types/contracts";
import { companyApi } from "../../../api/companyApi";
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
        
        // 드래그 시작 시 부서가 닫혀있으면 자동으로 열기
        if (deptId && !expanded.includes(deptId)) {
          setExpanded((prev) => [...prev, deptId]);
        }
      }
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (!over) return;

    // 드래그 중인 카드가 부서 위에 올라가면 자동으로 열기
    let overDeptId = over.data.current?.deptId;
    
    // 부서 헤더에 올라간 경우도 처리
    if (!overDeptId && String(over.id).endsWith('-header')) {
      overDeptId = String(over.id).replace('-header', '');
    }
    
    if (overDeptId && !expanded.includes(overDeptId)) {
      setExpanded((prev) => {
        // 이미 열려있지 않으면 추가
        if (!prev.includes(overDeptId!)) {
          return [...prev, overDeptId!];
        }
        return prev;
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveEmployee(null);
    setActiveDeptId(null);

    const { active, over } = event;
    if (!over) return;

    const empId = String(active.id);
    const fromDept = active.data.current?.deptId;
    const overData = over.data.current;
    
    // 부서 헤더에 드롭한 경우도 처리
    let toDept = overData?.deptId;
    if (!toDept && String(over.id).endsWith('-header')) {
      toDept = String(over.id).replace('-header', '');
    }

    if (!fromDept || !toDept) return;

    // 같은 부서 내에서 순서 변경 (직원 위에 드롭한 경우)
    if (fromDept === toDept && overData?.type === "EMPLOYEE") {
      const dept = departments.find((d) => d.id === fromDept);
      if (!dept) return;

      const oldIndex = dept.employees.findIndex((e) => e.id === empId);
      const newIndex = dept.employees.findIndex((e) => e.id === String(over.id));

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setDepartments((prev) =>
          prev.map((d) =>
            d.id === fromDept
              ? { ...d, employees: arrayMove(d.employees, oldIndex, newIndex) }
              : d
          )
        );
      }
      return;
    }

    // 다른 부서로 이동 (부서 영역에 드롭한 경우)
    if (toDept && fromDept !== toDept) {
      const movingEmployee = departments
        .find((d) => d.id === fromDept)
        ?.employees.find((e) => e.id === empId);

      if (!movingEmployee) return;

      // employeeId와 teamId를 숫자로 변환
      const employeeIdNum = Number(empId);
      const toTeamIdNum = Number(toDept);

      // "unassigned" 같은 특수 ID는 숫자로 변환 불가
      if (isNaN(employeeIdNum) || isNaN(toTeamIdNum)) {
        // 로컬 처리만 수행
        setDepartments((prev) => {
          const next = prev.map((d) => ({ ...d, employees: [...d.employees] }));
          let moving: Employee | null = null;

          next.forEach((dept) => {
            if (dept.id === fromDept) {
              const index = dept.employees.findIndex((emp) => emp.id === empId);
              if (index !== -1) {
                moving = dept.employees[index];
                dept.employees.splice(index, 1);
              }
            }
          });

          if (moving) {
            next.forEach((dept) => {
              if (dept.id === toDept && moving) {
                if (overData?.type === "EMPLOYEE") {
                  const overIndex = dept.employees.findIndex((e) => e.id === String(over.id));
                  if (overIndex !== -1) {
                    dept.employees.splice(overIndex, 0, moving);
                  } else {
                    dept.employees.push(moving);
                  }
                } else {
                  dept.employees.push(moving);
                }
              }
            });
          }

          return next;
        });
        return;
      }

      // API 호출
      try {
        // fromDept가 "unassigned"가 아니면 change API 사용 (기존 부서가 있음)
        // fromDept가 "unassigned"면 assign API 사용 (최초 지정)
        if (fromDept !== "unassigned") {
          await companyApi.changeEmployeeTeam({
            employeeId: employeeIdNum,
            teamId: toTeamIdNum,
          });
        } else {
          await companyApi.assignEmployee({
            employeeId: employeeIdNum,
            teamId: toTeamIdNum,
          });
        }

        // 성공 시 로컬 상태 업데이트
        setDepartments((prev) => {
          const next = prev.map((d) => ({ ...d, employees: [...d.employees] }));
          let moving: Employee | null = null;

          next.forEach((dept) => {
            if (dept.id === fromDept) {
              const index = dept.employees.findIndex((emp) => emp.id === empId);
              if (index !== -1) {
                moving = dept.employees[index];
                dept.employees.splice(index, 1);
              }
            }
          });

          if (moving) {
            next.forEach((dept) => {
              if (dept.id === toDept && moving) {
                if (overData?.type === "EMPLOYEE") {
                  const overIndex = dept.employees.findIndex((e) => e.id === String(over.id));
                  if (overIndex !== -1) {
                    dept.employees.splice(overIndex, 0, moving);
                  } else {
                    dept.employees.push(moving);
                  }
                } else {
                  dept.employees.push(moving);
                }
              }
            });
          }

          return next;
        });
      } catch (e: unknown) {
        const error = e as { message?: string };
        alert(error?.message ?? "직원 부서 변경에 실패했습니다.");
        console.error("직원 부서 변경 실패:", e);
      }
    }
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

  const addDepartment = async () => {
    if (!newDeptName.trim()) return;

    try {
      const newTeam = await companyApi.createTeam({
        name: newDeptName.trim(),
        description: "",
      });

      // API 응답의 teamId를 문자열로 변환하여 사용
      setDepartments((prev) => [
        ...prev,
        { id: String(newTeam.teamId), name: newTeam.name, employees: [] },
      ]);

      setNewDeptName("");
      setNewDeptOpen(false);
      alert("부서가 추가되었습니다!");
    } catch (e: unknown) {
      const error = e as { message?: string };
      alert(error?.message ?? "부서 추가에 실패했습니다.");
      console.error("부서 추가 실패:", e);
    }
  };


  const confirmDeleteDept = async () => {
    if (!deleteDept) return;

    try {
      // teamId가 숫자인지 확인 (문자열로 저장되어 있을 수 있음)
      const teamId = Number(deleteDept.id);
      if (isNaN(teamId)) {
        // "unassigned" 같은 특수 ID는 로컬 처리
        setDepartments((prev) => prev.filter((d) => d.id !== deleteDept.id));
        setDeleteDept(null);
        return;
      }

      await companyApi.deleteTeam(teamId);

      // API에서 부서 삭제 시 직원들은 자동으로 부서 해제되므로, 미배정 부서로 이동
      setDepartments((prev) => {
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
              employees: [...deleteDept.employees],
            },
          ];
        } else {
          // 이미 미배정 부서 있음 → 기존 employees에 추가
          const old = updated[unassignedIndex];
          updated[unassignedIndex] = {
            ...old,
            employees: [...old.employees, ...deleteDept.employees],
          };
        }

        return updated;
      });

      setDeleteDept(null);
      alert("부서가 삭제되었습니다!");
    } catch (e: unknown) {
      const error = e as { message?: string };
      alert(error?.message ?? "부서 삭제에 실패했습니다.");
      console.error("부서 삭제 실패:", e);
    }
  };


  /* ============================
        UI
  ============================ */
  return (
    <DndContext onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
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
