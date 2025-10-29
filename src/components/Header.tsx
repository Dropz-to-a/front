import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
    const navigate = useNavigate();

    //  로그인 상태 & 권한 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState<"personal" | "company" | null>(null);

    //  초기 로드 시 localStorage 값 불러오기
    useEffect(() => {
        const storedLogin = localStorage.getItem("isLoggedIn");
        const storedType = localStorage.getItem("userType") as
            | "personal"
            | "company"
            | null;

        setIsLoggedIn(storedLogin === "true");
        setUserType(storedType);
    }, []);

    //  로그인/로그아웃 처리
    const handleLoginToggle = () => {
        if (isLoggedIn) {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userType");
            setIsLoggedIn(false);
            setUserType(null);
            navigate("/");
        } else {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userType", "personal");
            setIsLoggedIn(true);
            setUserType("personal");
        }
    };

    //  개인 ↔ 기업 전환 버튼
    const handleRoleToggle = () => {
        if (!isLoggedIn) {
            alert("먼저 로그인해야 전환할 수 있습니다.");
            return;
        }
        const nextType = userType === "personal" ? "company" : "personal";
        localStorage.setItem("userType", nextType);
        setUserType(nextType);
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
            {/*  로고 */}
            <div
                style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                onClick={() => navigate("/")}
            >
                <img src="/logo.svg" alt="Logo" style={{ width: "150px", height: "40px" }} />
            </div>

            {/*  메뉴 */}
            <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <Link to="/" style={{ color: "white" }}>
                    홈
                </Link>
                <Link to="/about" style={{ color: "white" }}>
                    소개
                </Link>

                {/* 개인회원 메뉴 */}
                {isLoggedIn && userType === "personal" && (
                    <>
                        <Link to="/jobs" style={{ color: "white" }}>
                            공고
                        </Link>
                        <Link to="/my-applications" style={{ color: "white" }}>
                            지원목록
                        </Link>
                        <Link to="/profile" style={{ color: "white" }}>
                            프로필
                        </Link>
                        <Link to="/Profilleedit" style={{ color: "white" }}>
                            프로필수정
                        </Link>
                    </>
                )}

                {/* 기업회원 메뉴 */}
                {isLoggedIn && userType === "company" && (
                    <>
                        <Link to="/jobregister" style={{ color: "white" }}>
                            공고등록
                        </Link>
                        <Link to="/jobmanage" style={{ color: "white" }}>
                            공고관리
                        </Link>
                        <Link to="/contracts" style={{ color: "white" }}>
                            계약관리
                        </Link>
                        <Link to="/jobs/completed/admin" style={{ color: "white" }}>
                            지원자관리
                        </Link>
                    </>
                )}
            </nav>

            {/* 로그인/전환 버튼 영역 */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isLoggedIn ? (
                    <>
                        <span style={{ color: "white", fontSize: "14px" }}>
                            {userType === "personal" ? "👤 개인회원" : "🏢 기업회원"}
                        </span>
                        <button
                            onClick={handleRoleToggle}
                            style={{
                                backgroundColor: "white",
                                color: "#2E80FF",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            전환
                        </button>
                        <button
                            onClick={handleLoginToggle}
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
                        <button
                            onClick={handleLoginToggle}
                            style={{
                                backgroundColor: "white",
                                color: "#2E80FF",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: 600,
                            }}
                        >
                            로그인
                        </button>
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
