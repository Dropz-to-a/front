/* eslint-disable @typescript-eslint/no-explicit-any */
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
import type { CompanyOnBoardData } from '@/types/company'

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
  return response.data
}

export const OnBoardCompany = async (data: CompanyOnBoardData) => {
  const response = await api.post('/api/onboarding/company', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// 기업 정보 조회
export const getCompanyInfo = async () => {
  const response = await api.get('/api/company/info', {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// 기업 정보 수정
export const updateCompanyInfo = async (data: any) => {
  const response = await api.patch('/api/company/info', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

// 공개 기업 정보 조회 (사용자용)
export const getPublicCompanyInfo = async (companyId?: number) => {
  const url = companyId ? `/api/company/${companyId}/info` : '/api/company/info/public'
  const response = await api.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
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
    대표명?: string
    도로명주소?: string
    지번주소?: string
    사업자상태?: string // '정상' | '휴업' | '폐업' 등
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
    // 필수 필드들이 실제로 채워져 있는지 확인
    const companyName = apiResponse.data.회사명
    const businessNumber = apiResponse.data.사업자등록번호
    const representative = apiResponse.data.대표명
    const address = apiResponse.data.도로명주소 || apiResponse.data.지번주소
    
    // 필수 필드가 비어있으면 유효하지 않은 사업자로 판단
    if (!companyName || !businessNumber || !representative || !address) {
      return {
        exists: false,
        message: '등록된 사업자 등록번호가 아니거나 유효하지 않습니다.',
      }
    }

    // 성공한 경우 - 실제 데이터가 있는 경우만
    const status = apiResponse.data.사업자상태 || apiResponse.data.세금상태
    
    // 사업자 상태 확인
    if (status === '폐업' || status === '폐업자') {
      return {
        exists: false,
        status: status,
        message: '폐업 상태인 사업자입니다.',
      }
    }
    
    if (status === '휴업' || status === '휴업자') {
      return {
        exists: false,
        status: status,
        message: '휴업 상태인 사업자입니다.',
      }
    }

    return {
      exists: true,
      companyName: companyName,
      status: status || '계속사업자',
    }
  } else {
    // 실패한 경우 (존재하지 않거나 유효하지 않은 사업자)
    const status = apiResponse.data?.사업자상태 || apiResponse.data?.세금상태
    let message = '등록된 사업자 등록번호가 아니거나 유효하지 않습니다.'
    
    if (status) {
      if (status === '휴업' || status === '휴업자') {
        message = '휴업 상태인 사업자입니다.'
      } else if (status === '폐업' || status === '폐업자') {
        message = '폐업 상태인 사업자입니다.'
      } else if (status !== '계속사업자' && status !== '정상') {
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