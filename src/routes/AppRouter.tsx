import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AuthGuard from '../components/Auth/AuthGuard'
import GuestGuard from '../components/Auth/GuestGuard'
import NotFound from '../pages/NotFound'

import { publicRoutes, privateRoutes } from './routesConfig'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 비로그인 전용 라우트 */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={`public-${path}`} path={path} element={<GuestGuard>{element}</GuestGuard>} />
        ))}

        {/* 로그인 필요 라우트 */}
        {privateRoutes.map(({ path, element }) => (
          <Route key={`private-${path}`} path={path} element={<AuthGuard>{element}</AuthGuard>} />
        ))}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
