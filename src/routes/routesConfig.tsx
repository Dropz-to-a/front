import React from 'react'
import Start from '../pages/Start'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'

export type RouteItem = {
  path: string
  element: React.ReactNode
}

export const publicRoutes: RouteItem[] = [
  { path: '/', element: <Start /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/home', element: <Home /> },
]

export const privateRoutes: RouteItem[] = [{ path: '/home', element: <Home /> }]
