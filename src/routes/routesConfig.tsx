import React from "react";
import Start from "../pages/Start";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import About from "../pages/About";
import Jobs from "../pages/Jobs";
import DetailJobs from "../pages/DetailJobs";
import Profile from "../pages/Profile";
import Pay from "../pages/Pay";
import Profileedit from "../pages/Profilleedit";

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
    { path: "/jobs", element: <Jobs /> },
    { path: "/jobs/:id", element: <DetailJobs /> },
    { path: "/profile", element: <Profile /> },
    { path: "/Profilleedit", element: <Profileedit /> },
    { path: "/pay", element: <Pay /> },
];

export const privateRoutes: RouteItem[] = [
    { path: "/", element: <Home /> },
];