import React from "react";
import Start from "../pages/Start";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import About from "../pages/About";

export type RouteItem = {
    path: string;
    element: React.ReactNode;
};

export const publicRoutes: RouteItem[] = [
    { path: "/", element: <Home /> },
    { path: "/start", element: <Start /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/about", element: <About /> },
];

export const privateRoutes: RouteItem[] = [
    { path: "/", element: <Home /> },
];