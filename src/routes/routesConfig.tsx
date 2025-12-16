import React from 'react'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Home from '@/pages/home/Home'
import About from '@/pages/common/About'
import Jobs from '@/pages/jobs/user/Jobs'
import DetailJobs from '@/pages/jobs/user/DetailJobs'
import Profile from '@/pages/profile/Profile'
import Contracts from '@/pages/jobs/company/Contracts'
import JobCompleted from '@/pages/jobs/user/JobCompleted'
import JobCompletedAdmin from '@/pages/jobs/company/JobCompletedAdmin'
import MyApplications from '@/pages/jobs/user/MyApplications'
import Contact from '@/pages/common/Contact'
import Privacy from '@/pages/common/Privacy'
import Terms from '@/pages/common/Terms'
import JobEdit from '@/pages/jobs/company/JobEdit'
import JobManage from '@/pages/jobs/company/JobManage'
import JobRegister from '@/pages/jobs/company/JobRegister'
import PayLogPage from '@/pages/payroll/user/PayLog'
import PayrollPage from '@/pages/payroll/company/Payroll'
import JobApplyForm from '@/pages/jobs/user/JobApplyForm'
import ResumeViewPage from '@/pages/jobs/company/ResumeView'
import Start from '@/pages/auth/Start'

import Inquire from '@/pages/common/Inquire'
import OnBoard from '@/pages/auth/user/OnBoarding'
import PostCode from '@/test/PostCode'

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

  //온보딩
  { path: '/onboarding', element: <OnBoard /> },

  // 테스트 포스트코드
  { path: '/test/postcode', element: <PostCode /> },

  //서비스 설명
  { path: '/about', element: <About /> },
  //직업 목록페이지 & 상세
  { path: '/jobs', element: <Jobs /> },
  { path: '/jobs/:id', element: <DetailJobs /> },
  //문의페이지
  { path: '/inquire', element: <Inquire /> },

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
  { path: '/contact', element: <Contact /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
]

export const privateRoutes: RouteItem[] = [{ path: '/', element: <Home /> }]
