import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

interface Employee {
    id: number;
    name: string;
    position: string;
    salary: number;
    paid: boolean;
}

const clientKey = "test_ck_26DlbXAaV0MLW0MKNXmqrqY50Q9R";

const PayrollPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([
        { id: 1, name: "김민수", position: "개발팀", salary: 4200000, paid: false },
        { id: 2, name: "이서연", position: "디자인팀", salary: 3900000, paid: false },
        { id: 3, name: "박지훈", position: "마케팅팀", salary: 3500000, paid: true },
    ]);

    const [payments, setPayments] = useState<{ [key: string]: any }>({});

    const totalPayroll = employees.reduce((acc, e) => acc + e.salary, 0);

    /** 1️⃣ 카드 등록용 SDK 초기화 */
    useEffect(() => {
        async function initPayments() {
            try {
                const tossPayments = await loadTossPayments(clientKey);
                const paymentInstances: { [key: string]: any } = {};
                employees.forEach((emp) => {
                    paymentInstances[emp.id] = tossPayments.payment({
                        customerKey: `user_${emp.id}`,
                    });
                });
                setPayments(paymentInstances);
            } catch (error) {
                console.error("Toss SDK 초기화 실패:", error);
            }
        }
        initPayments();
    }, [employees]);

    /** 2️⃣ 카드 등록 */
    const handleBillingAuth = async (employee: Employee) => {
        const payment = payments[employee.id];
        if (!payment) {
            alert("결제 준비가 아직 완료되지 않았습니다.");
            return;
        }

        try {
            await payment.requestBillingAuth({
                method: "CARD",
                successUrl: window.location.origin + "/success",
                failUrl: window.location.origin + "/fail",
                customerEmail: `user${employee.id}@example.com`,
                customerName: employee.name,
            });
            alert(`${employee.name} 결제수단 등록 완료!`);
        } catch (error) {
            console.error("빌링 인증 실패:", error);
            alert("빌링 인증 중 오류가 발생했습니다.");
        }
    };

    /** 3️⃣ 직원별 지급 */
    const handlePayEmployee = (employee: Employee) => {
        setEmployees((prev) =>
            prev.map((e) => (e.id === employee.id ? { ...e, paid: true } : e))
        );
        alert(`${employee.name}에게 급여 지급 완료!`);
    };

    /** 4️⃣ 월별 일괄 지급 */
    const handlePayAll = () => {
        setEmployees((prev) => prev.map((e) => ({ ...e, paid: true })));
        alert("모든 직원 급여 일괄 지급 완료!");
    };

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-gray-50 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">급여 관리</h1>
                    <p className="text-gray-500">기업용 정기결제 테스트 시스템</p>
                </header>

                <div className="bg-white rounded-2xl shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">직원 목록</h2>
                        <div className="flex gap-2">
                            <select className="border rounded-md p-2 text-gray-700">
                                <option>2025년 11월</option>
                                <option>2025년 10월</option>
                                <option>2025년 9월</option>
                            </select>
                            <button
                                onClick={handlePayAll}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                월별 일괄 지급
                            </button>
                        </div>
                    </div>

                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-3 border-b">이름</th>
                                <th className="p-3 border-b">부서</th>
                                <th className="p-3 border-b">월 급여</th>
                                <th className="p-3 border-b text-center">지급 상태</th>
                                <th className="p-3 border-b text-center">액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((e) => (
                                <tr key={e.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b">{e.name}</td>
                                    <td className="p-3 border-b">{e.position}</td>
                                    <td className="p-3 border-b">{e.salary.toLocaleString()}원</td>
                                    <td className="p-3 border-b text-center">
                                        {e.paid ? (
                                            <span className="text-green-600 font-semibold">지급 완료</span>
                                        ) : (
                                            <span className="text-red-500">미지급</span>
                                        )}
                                    </td>
                                    <td className="p-3 border-b text-center flex justify-center gap-2">
                                        {!e.paid ? (
                                            <>
                                                <button
                                                    onClick={() => handlePayEmployee(e)}
                                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                                >
                                                    개별 지급
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                disabled
                                                className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
                                            >
                                                완료
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-6 text-right text-gray-700 font-medium">
                        총 급여액:{" "}
                        <span className="text-blue-600 font-bold">{totalPayroll.toLocaleString()}원</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollPage;
