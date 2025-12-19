// {
//   "username": "alvin",
//   "email": "alvin@example.com",
//   "phone": "010-1234-5678",
//   "password": "1234",
//   "roleCode": "ROLE_COMPANY"
// }

import api from './Api'
import axios from 'axios'
import type { UserRegisterData, UserLoginData, UserOnBoardData } from '../types/index'

export const registerUser = async (data: UserRegisterData) => {
  const response = await api.post('/api/auth/register', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export const loginUser = async (data: UserLoginData) => {
  const response = await api.post('/api/auth/login', data, {
    headers: { 'Content-Type': 'application/json' },
  })
  return response.data 
}


export const OnBoardUser = async (data: UserOnBoardData) => {
  const response = await api.post('/api/onboarding/user', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const { accessToken } = response.data

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
  }

  return response.data
}

export type BusinessExistsRequest = {
  businessNumber: string
}

// Apick API 실제 응답 형식
type ApickApiResponse = {
  data?: {
    회사명?: string
    사업자등록번호?: string
    세금상태?: string // '계속사업자' | '휴업자' | '폐업자' 등
    success?: number
    [key: string]: unknown
  }
  api?: {
    success: boolean
    cost?: number
    ms?: number
    [key: string]: unknown
  }
}

export type BusinessExistsResponse = {
  exists: boolean
  companyName?: string
  status?: string // '계속사업자' | '휴업자' | '폐업자' 등
  message?: string
}

export const checkBusinessExists = async (data: BusinessExistsRequest): Promise<BusinessExistsResponse> => {
  // multipart/form-data 형식으로 요청
  const formData = new FormData()
  formData.append('biz_no', data.businessNumber)

  // 프록시를 사용하기 위해 baseURL 없이 상대 경로로 요청
  // Vite 프록시는 개발 서버(localhost:3000)에서만 작동하므로 baseURL을 사용하지 않음
  const response = await axios.post<ApickApiResponse>('/api/business/exists', formData, {
    // baseURL을 명시하지 않으면 현재 도메인(개발 서버)을 기준으로 요청
    // 이렇게 하면 Vite 프록시가 요청을 가로채서 https://apick.app/rest/biz_detail로 변환
    headers: {
      // Content-Type을 명시하지 않으면 axios가 자동으로 'multipart/form-data; boundary=...' 설정
    },
  })

  const apiResponse = response.data

  // API 응답 파싱
  if (apiResponse.api?.success && apiResponse.data?.success === 1) {
    // 성공한 경우
    return {
      exists: true,
      companyName: apiResponse.data.회사명,
      status: apiResponse.data.세금상태,
    }
  } else {
    // 실패한 경우 (존재하지 않거나 유효하지 않은 사업자)
    const status = apiResponse.data?.세금상태
    let message = '등록된 사업자 등록번호가 아니거나 유효하지 않습니다.'
    
    if (status) {
      if (status === '휴업자') {
        message = '휴업 상태인 사업자입니다.'
      } else if (status === '폐업자') {
        message = '폐업 상태인 사업자입니다.'
      } else if (status !== '계속사업자') {
        message = `사업 상태: ${status}`
      }
    }

    return {
      exists: false,
      status: status,
      message: message,
    }
  }
}