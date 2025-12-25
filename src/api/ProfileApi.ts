import { AxiosError } from 'axios'
import apiClient from './Api'

type ApiErrorRes = { code?: string; message?: string }

const parseAxiosError = (e: unknown) => {
  const err = e as AxiosError<ApiErrorRes>
  return {
    status: err.response?.status,
    code: err.response?.data?.code,
    message: err.response?.data?.message || err.message || '요청 중 오류가 발생했습니다.',
  }
}

export type Profile = {
  accountId: number
  name: string
  email?: string
  phone?: string
  birth: string
  address: string
  detailAddress: string
  zonecode: string
  skills?: string[]
  licenses?: string[]
  foreignLangs?: string[]
  activities?: string[]
  motivation?: string
}

export type UpdateProfileRequest = {
  name?: string
  email?: string
  phone?: string
  birth?: string
  address?: string
  detailAddress?: string
  zonecode?: string
  skills?: string[]
  licenses?: string[]
  foreignLangs?: string[]
  activities?: string[]
  motivation?: string
}

export type Activity = {
  id: number
  userPosition: string
  companyName: string
  description: string
  startDate: string
  endDate: string
}

export type CreateActivityRequest = {
  userPosition: string
  companyName: string
  description: string
  startDate: string
  endDate: string
}

export type UpdateActivityRequest = {
  userPosition?: string
  companyName?: string
  description?: string
  startDate?: string
  endDate?: string
}

// 프로필 API
export const profileApi = {
  // 내 프로필 조회
  async getMyProfile() {
    try {
      // 헤더는 apiClient의 인터셉터에서 자동 설정됨
      const { data } = await apiClient.get<Profile>('/api/profile/me')
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[profileApi.getMyProfile]', error)
      throw error
    }
  },

  // 내 프로필 수정
  async updateMyProfile(body: UpdateProfileRequest) {
    try {
      // 조회 API와 동일한 방식으로 호출 (헤더는 apiClient의 인터셉터에서 자동 설정됨)
      const token = localStorage.getItem('jwtToken')
      console.log('[profileApi.updateMyProfile] 토큰 존재:', !!token)
      console.log('[profileApi.updateMyProfile] 요청 본문:', body)
      
      const { data } = await apiClient.patch<Profile>('/api/profile/me', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[profileApi.updateMyProfile] 에러 상세:', {
        status: error.status,
        code: error.code,
        message: error.message,
        response: (e as AxiosError)?.response?.data,
      })
      throw error
    }
  },

  // 경력 추가
  async createActivity(body: CreateActivityRequest) {
    try {
      const { data } = await apiClient.post<Activity>('/api/profile/me/activities', body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[profileApi.createActivity]', error)
      throw error
    }
  },

  // 경력 수정
  async updateActivity(activityId: number, body: UpdateActivityRequest) {
    try {
      const { data } = await apiClient.patch<Activity>(`/api/profile/me/activities/${activityId}`, body)
      return data
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[profileApi.updateActivity]', error)
      throw error
    }
  },

  // 경력 삭제
  async deleteActivity(activityId: number) {
    try {
      await apiClient.delete(`/api/profile/me/activities/${activityId}`)
    } catch (e) {
      const error = parseAxiosError(e)
      console.error('[profileApi.deleteActivity]', error)
      throw error
    }
  },
}
