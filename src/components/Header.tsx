

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  userType: "personal" | "company";
  mode?: "job-seeker" | "employee";
}

const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [openTestPanel, setOpenTestPanel] = useState(false); // ⭐ 테스트 패널 열림 상태


  //배포 테스트4

  // 로그인 정보 불러오기
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.mode) parsed.mode = "job-seeker";
        setUser(parsed);
      }
    } catch {
      setUser(null);
    }
  }, []);

  /** ⭐ 테스트용: 개인회원 로그인 */
  const testLoginPersonal = () => {
    const fakeUser: CurrentUser = {
      id: "123",
      email: "test@personal.com",
      name: "테스트개인",
      userType: "personal",
      mode: "job-seeker",
    };
    localStorage.setItem("currentUser", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  /** ⭐ 테스트용: 기업회원 로그인 */
  const testLoginCompany = () => {
    const fakeUser: CurrentUser = {
      id: "999",
      email: "test@company.com",
      name: "테스트기업",
      userType: "company",
      mode: "job-seeker",
    };
    localStorage.setItem("currentUser", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  /** ⭐ 개인회원 모드 전환 */
  const toggleMode = () => {
    if (!user || user.userType !== "personal") return;

    const updated: CurrentUser = {
      ...user,
      mode: user.mode === "job-seeker" ? "employee" : "job-seeker",
    };

    localStorage.setItem("currentUser", JSON.stringify(updated));
    setUser(updated);
  };

  /** ⭐ 로그아웃 */
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
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
        position: "relative",
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

        {/* 개인회원 구직자 모드 */}
        {user?.userType === "personal" && user.mode === "job-seeker" && (
          <>
            <Link to="/my-applications" style={{ color: "white" }}>지원목록</Link>
            <Link to="/paylog" style={{ color: "white" }}>급여내역</Link>
            <Link to="/profile" style={{ color: "white" }}>프로필</Link>
            <Link to="/profile-edit" style={{ color: "white" }}>프로필수정</Link>
          </>
        )}

        {/* 개인회원 재직자 모드 */}
        {user?.userType === "personal" && user.mode === "employee" && (
          <>
            <Link to="/work-dashboard" style={{ color: "white" }}>근무 대시보드</Link>
            <Link to="/paylog" style={{ color: "white" }}>급여조회</Link>
            <Link to="/attendance" style={{ color: "white" }}>출퇴근 기록</Link>
            <Link to="/profile" style={{ color: "white" }}>내 정보</Link>
          </>
        )}

        {/* 기업회원 메뉴 */}
        {user?.userType === "company" && (
          <>
            <Link to="/jobmanage" style={{ color: "white" }}>공고관리</Link>
            <Link to="/contracts" style={{ color: "white" }}>계약관리</Link>
            <Link to="/payroll" style={{ color: "white" }}>급여관리</Link>
            <Link to="/jobs/completed/admin" style={{ color: "white" }}>
              지원자관리
            </Link>
          </>
        )}
      </nav>

      {/* 우측 영역 (로그인 + 테스트 패널) */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {/* 로그인 / 로그아웃 */}
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

        {/* ⭐ 테스트 패널 열기 버튼 */}
        <button
          onClick={() => setOpenTestPanel((prev) => !prev)}
          style={{
            backgroundColor: "#444",
            color: "white",
            borderRadius: "6px",
            padding: "4px 10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          테스트
        </button>
      </div>

      {/* ⭐ 테스트 패널 UI */}
      {openTestPanel && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            background: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 100,
            width: "220px",
          }}
        >
          <h4 style={{ fontWeight: 700, marginBottom: "10px" }}>테스트 로그인</h4>

          <button
            onClick={testLoginPersonal}
            style={{
              width: "100%",
              marginBottom: "8px",
              background: "#2E80FF",
              color: "white",
              padding: "6px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            개인회원 로그인
          </button>

          <button
            onClick={testLoginCompany}
            style={{
              width: "100%",
              marginBottom: "8px",
              background: "#00C49A",
              color: "white",
              padding: "6px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            기업회원 로그인
          </button>

          {user?.userType === "personal" && (
            <button
              onClick={toggleMode}
              style={{
                width: "100%",
                marginBottom: "10px",
                background: "#FFD43B",
                color: "#333",
                padding: "6px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              모드 전환 ({user.mode})
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "#FF5555",
              color: "white",
              padding: "6px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
