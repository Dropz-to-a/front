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
import Contracts from "../pages/Contracts";
import Profileedit from "../pages/Profilleedit";
import JobCompleted from "../pages/JobCompleted";
import JobCompletedAdmin from "../pages/JobCompletedAdmin";
import MyApplications from "../pages/MyApplications";

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
    { path: "/contracts", element: <Contracts /> },
    { path: "/jobs/:id/completed", element: <JobCompleted /> },
    { path: "/jobs/:id/completed/admin", element: <JobCompletedAdmin /> },
    { path: "/my-applications", element: <MyApplications /> },
];

export const privateRoutes: RouteItem[] = [
    { path: "/", element: <Home /> },
];