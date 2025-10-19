// src/components/Auth/AuthGuard.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * 🔒 AuthGuard: 로그인 보호용 라우트
 *  - localStorage에 token이 없으면 로그인 페이지로 리다이렉트
 *  - 로그인 상태면 children 렌더링
 */
interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default AuthGuard;
