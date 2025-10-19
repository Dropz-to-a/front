import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store";

interface GuestGuardProps {
    children: React.ReactNode;
}

/**
 * 비로그인 전용 페이지 보호 (로그인 상태면 접근 불가 → /about 리다이렉트)
 */
const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
    const token = useAppSelector((s) => s.auth.token);
    if (token) return <Navigate to="/about" replace />;
    return <>{children}</>;
};

export default GuestGuard;
