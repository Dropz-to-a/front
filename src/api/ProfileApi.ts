import axios, { AxiosError } from 'axios'

type ApiErrorRes = { code?: string; message?: string }

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  withCredentials: true,
})

// 요청 인터셉터: JWT 토큰을 헤더에 추가
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwtToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터: 401/403 에러 처리
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('인증 실패! 로그인 페이지로 리디렉션...')
      localStorage.removeItem('jwtToken')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      console.error('권한 없음')
    }
    return Promise.reject(error)
  },
)

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

// 프로필 API
export const profileApi = {
  // 내 프로필 조회
  async getMyProfile() {
    try {
      const { data } = await api.get<Profile>('/api/profile/me')
      return data
    } catch (e) {
      throw parseAxiosError(e)
    }
  },

  // 내 프로필 수정
  async updateMyProfile() {
    try {
      const { data } = await api.patch<Profile>('/api/profile/me')
      return data
    } catch (e) {
      throw parseAxiosError(e)
    }
  },
}
