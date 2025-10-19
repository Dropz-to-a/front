import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import AuthGuard from "../components/Auth/AuthGuard";
import Start from "../pages/Start";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

/**
 * 라우팅 경로 배열 정의
 * - publicRoutes: 로그인 없이 접근 가능한 페이지
 * - privateRoutes: 로그인 필요 페이지
 * -개발시에는 전부 프라이빗으로로 넣어놓고 나중에 테스트시에는  퍼블릭으로 옮기는 방식으로 사용할것
 */
const publicRoutes = [
    { path: "/", element: <Start /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
];

const privateRoutes = [
    { path: "/home", element: <Home /> },
];

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* 공개 라우트 */}
                {publicRoutes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}

                {/* 보호 라우트 */}
                {privateRoutes.map(({ path, element }) => (
                    <Route
                        key={path}
                        path={path}
                        element={<AuthGuard>{element}</AuthGuard>}
                    />
                ))}

                {/* 없는 경로 → 404 */}
                <Route path="*" element={<NotFound />} />

                {/* 기본 리다이렉트 (예: 로그인된 사용자가 /로 접근 시 /about으로 이동) */}
                <Route
                    path="/"
                    element={
                        localStorage.getItem("token") ? (
                            <Navigate to="/about" replace />
                        ) : (
                            <Start />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;
