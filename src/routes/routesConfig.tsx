import React from 'react'
import Start from '../pages/Start'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import About from '../pages/About'
import Jobs from '../pages/Jobs'
import DetailJobs from '../pages/DetailJobs'
import Profile from '../pages/Profile'
import Contracts from '../pages/Contracts'
import JobCompleted from '../pages/JobCompleted'
import JobCompletedAdmin from '../pages/JobCompletedAdmin'
import MyApplications from '../pages/MyApplications'
import Contact from '../pages/Contact'
import Privacy from '../pages/Privacy'
import Terms from '../pages/Terms'
import JobEdit from '../pages/JobEdit'
import JobManage from '../pages/JobManage'
import JobRegister from '../pages/JobRegister'
import PayLogPage from '../pages/PayLog'
import PayrollPage from '../pages/Payroll'
import JobApplyForm from '../pages/JobApplyForm'
import ResumeViewPage from '../pages/ResumeView'
import CompanyOnboarding from '../pages/CompanyOnboarding'
import UserOnboarding from '../pages/UserOnBoarding'
export type RouteItem = {
  path: string
  element: React.ReactNode
}

export const publicRoutes: RouteItem[] = [
  //홈페이지
  { path: '/', element: <Home /> },
  //시작페이지
  { path: '/start', element: <Start /> },
  //로그인
  { path: '/login', element: <Login /> },
  //회원가입
  { path: '/register', element: <Register /> },
  //서비스 설명
  { path: '/about', element: <About /> },
  //직업 목록페이지 & 상세
  { path: '/jobs', element: <Jobs /> },
  { path: '/jobs/:id', element: <DetailJobs /> },

  { path: '/user/onboarding', element: <UserOnboarding /> },
  { path: '/company/onboarding', element: <CompanyOnboarding /> },

  //-------------------------------------구직자---------------------------------------------

  //공고 이력서 작성
  { path: '/jobs/:id/applyform', element: <JobApplyForm /> },
  //공고 지원완료
  { path: '/jobs/:id/completed', element: <JobCompleted /> },
  //공고 지원목록
  { path: '/my-applications', element: <MyApplications /> },

  //프로필 페이지 & 수정
  { path: '/profile', element: <Profile /> },

  //재직자 급여로그
  { path: '/paylog', element: <PayLogPage /> },

  //-------------------------------------기업---------------------------------------------

  //지원자 관리
  { path: '/jobs/completed/admin', element: <JobCompletedAdmin /> },
  //지원자 이력서 확인
  { path: '/resume/:id', element: <ResumeViewPage /> },

  //공고 추가 및 수정
  { path: '/jobmanage', element: <JobManage /> },
  { path: '/jobmanage/:id', element: <JobEdit /> },
  //공고 등록
  { path: '/jobregister', element: <JobRegister /> },

  //재직자 관리
  { path: '/contracts', element: <Contracts /> },
  //재직자 급여 정산
  { path: '/payroll', element: <PayrollPage /> },

  // Footer 페이지
  { path: '/contact', element: <Contact /> }, // 문의하기
  { path: '/privacy', element: <Privacy /> }, // 개인정보처리방침
  { path: '/terms', element: <Terms /> }, // 이용약관
]

export const privateRoutes: RouteItem[] = [{ path: '/', element: <Home /> }]
