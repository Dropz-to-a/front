import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface CurrentUser {
    id: string;
    email: string;
    name: string;
    userType: "personal" | "company";
}

const Header = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<CurrentUser | null>(null);

    // ✔ 실제 로그인 정보 불러오기
    useEffect(() => {
        try {
            const stored = localStorage.getItem("currentUser");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            setUser(null);
        }
    }, []);

    // ✔ 로그아웃 처리 (실제 로직)
    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token"); // JWT 제거
        setUser(null);

        navigate("/");
    };

    return (
        <header
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "#2E80FF",
                borderBottom: "1px solid #ddd",
            }}
        >
            {/* 로고 */}
            <div
                style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                onClick={() => navigate("/")}
            >
                <img src="/logo.svg" alt="Logo" style={{ width: "150px", height: "40px" }} />
            </div>

            {/* 메뉴 */}
            <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <Link to="/" style={{ color: "white" }}>홈</Link>
                <Link to="/about" style={{ color: "white" }}>소개</Link>
                <Link to="/jobs" style={{ color: "white" }}>공고</Link>

                {/* 개인회원 메뉴 */}
                {user?.userType === "personal" && (
                    <>
                        <Link to="/my-applications" style={{ color: "white" }}>
                            지원목록
                        </Link>
                        <Link to="/paylog" style={{ color: "white" }}>
                            급여내역
                        </Link>
                        <Link to="/profile" style={{ color: "white" }}>
                            프로필
                        </Link>
                        <Link to="/profile-edit" style={{ color: "white" }}>
                            프로필수정
                        </Link>
                    </>
                )}

                {/* 기업회원 메뉴 */}
                {user?.userType === "company" && (
                    <>
                        <Link to="/jobmanage" style={{ color: "white" }}>
                            공고관리
                        </Link>
                        <Link to="/contracts" style={{ color: "white" }}>
                            계약관리
                        </Link>
                        <Link to="/payroll" style={{ color: "white" }}>
                            급여관리
                        </Link>
                        <Link to="/jobs/completed/admin" style={{ color: "white" }}>
                            지원자관리
                        </Link>
                    </>
                )}
            </nav>

            {/* 로그인/회원가입/로그아웃 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {user ? (
                    <>
                        <span style={{ color: "white", fontSize: "14px" }}>
                            {user.name}님 환영합니다.
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                backgroundColor: "#ff4d4d",
                                color: "white",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={{
                                backgroundColor: "white",
                                color: "#2E80FF",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                fontWeight: 600,
                            }}
                        >
                            로그인
                        </Link>

                        <Link
                            to="/start"
                            style={{
                                backgroundColor: "#0051C4",
                                color: "white",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                fontWeight: 600,
                            }}
                        >
                            회원가입
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
