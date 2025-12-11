import React from 'react'

import Start from '@/pages/auth/Start'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

import Home from '@/pages/home/Home'
import About from '@/pages/common/About'

import Jobs from '@/pages/jobs/user/Jobs'
import DetailJobs from '@/pages/jobs/user/DetailJobs'
import JobApplyForm from '@/pages/jobs/user/JobApplyForm'
import JobCompleted from '@/pages/jobs/user/JobCompleted'
import MyApplications from '@/pages/jobs/user/MyApplications'
import Attendance from '@/pages/jobs/user/Attendance'
import WorkDashboard from '@/pages/jobs/user/WorkDashboard'

import Profile from '@/pages/profile/Profile'

import Contracts from '@/pages/jobs/company/Contracts'
import JobCompletedAdmin from '@/pages/jobs/company/JobCompletedAdmin'
import JobEdit from '@/pages/jobs/company/JobEdit'
import JobManage from '@/pages/jobs/company/JobManage'
import JobRegister from '@/pages/jobs/company/JobRegister'
import ResumeViewPage from '@/pages/jobs/company/ResumeView'

import PayLogPage from '@/pages/payroll/user/PayLog'
import PayrollPage from '@/pages/payroll/company/Payroll'

import Contact from '@/pages/common/Contact'
import Privacy from '@/pages/common/Privacy'
import Terms from '@/pages/common/Terms'

export type RouteItem = {
  path: string
  element: React.ReactNode
}

export const publicRoutes: RouteItem[] = [
  // 홈페이지
  { path: '/', element: <Home /> },
  // 시작페이지
  { path: '/start', element: <Start /> },
  // 로그인
  { path: '/login', element: <Login /> },
  // 회원가입
  { path: '/register', element: <Register /> },
  // 서비스 설명
  { path: '/about', element: <About /> },

  // 직업 목록 & 상세
  { path: '/jobs', element: <Jobs /> },
  { path: '/jobs/:id', element: <DetailJobs /> },

  //------------------------------------- 구직자 ---------------------------------------------

  // 공고 이력서 작성
  { path: '/jobs/:id/applyform', element: <JobApplyForm /> },
  // 공고 지원완료
  { path: '/jobs/:id/completed', element: <JobCompleted /> },
  // 공고 지원목록
  { path: '/my-applications', element: <MyApplications /> },

  // 지원자 이력서 확인 (두 경로 모두 사용)
  { path: '/applications/resume/:id', element: <ResumeViewPage /> },
  { path: '/resume/:id', element: <ResumeViewPage /> },

  // 프로필 페이지 & 수정
  { path: '/profile', element: <Profile /> },

  // 재직자 급여 로그
  { path: '/paylog', element: <PayLogPage /> },

  //------------------------------------- 재직자 ---------------------------------------------

  // 출퇴근 관리
  { path: '/attendance', element: <Attendance /> },
  // 근무 대시보드
  { path: '/work-dashboard', element: <WorkDashboard /> },

  //------------------------------------- 기업 ---------------------------------------------

  // 지원자 관리
  { path: '/jobs/completed/admin', element: <JobCompletedAdmin /> },

  // 공고 관리
  { path: '/jobmanage', element: <JobManage /> },
  { path: '/jobmanage/:id', element: <JobEdit /> },
  { path: '/jobregister', element: <JobRegister /> },

  // 재직자 관리
  { path: '/contracts', element: <Contracts /> },
  // 재직자 급여 정산
  { path: '/payroll', element: <PayrollPage /> },

  //------------------------------------- Footer ---------------------------------------------

  { path: '/contact', element: <Contact /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
]

export const privateRoutes: RouteItem[] = [
  { path: '/', element: <Home /> },
]
