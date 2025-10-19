import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store";

interface AuthGuardProps {
    children: React.ReactNode;
}

/**
 * 로그인 필요 페이지 보호
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const token = useAppSelector((s) => s.auth.token);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <>{children}</>;
};

export default AuthGuard;
