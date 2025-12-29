import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { decodeJwt } from '@/utils/jwt'
import type { JobitJwtPayload } from '@/utils/jwt'
import { store } from '@/store'
import { setToken } from '@/features/auth/authSlice'

// axios 인스턴스 생성
// Vite 프록시를 사용하기 위해 baseURL을 설정하지 않음 (상대 경로 사용)
// 프록시 설정: vite.config.ts의 /api 경로가 백엔드로 프록시됨
const apiClient = axios.create({
  // baseURL을 설정하지 않으면 상대 경로로 요청이 가고 Vite 프록시가 처리함
  timeout: 10000, // 요청 타임아웃 설정
  withCredentials: true, // 쿠키 포함
})

// accessToken이 만료되었는지 검증하는 함수
const isTokenExpired = (accessToken: string | null): boolean => {
  if (!accessToken) return true

  try {
    const payload = decodeJwt<JobitJwtPayload>(accessToken)
    if (!payload || !payload.exp) return true

    // exp는 Unix timestamp (초 단위)
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    console.error('[Api] 토큰 검증 중 오류:', error)
    return true
  }
}

// 토큰 재발급 함수
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) {
    console.error('[Api] refreshToken이 없습니다.')
    return null
  }

  try {
    // 재발급 요청 시에는 인터셉터를 우회하기 위해 새로운 axios 인스턴스 사용
    const response = await axios.post('/api/auth/refresh', {
      refreshToken: refreshToken,
    })

    const newToken = response.data?.accessToken

    if (!newToken) {
      throw new Error('새로운 accessToken을 받지 못했습니다.')
    }

    // const previousToken = localStorage.getItem('jwtToken')

    // localStorage와 Redux store 업데이트
    localStorage.setItem('jwtToken', newToken)
    store.dispatch(setToken(newToken))

    // console.log('[Api] 토큰 재발급 성공')
    // console.log('[Api] 이전 accessToken:', previousToken)
    // console.log('[Api] 재발급 받은 accessToken:', newToken)

    return newToken
  } catch (error) {
    console.error('[Api] 토큰 재발급 실패:', error)
    // 재발급 실패 시 로그인 페이지로 리디렉션
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
    return null
  }
}

// 요청 인터셉터 추가 (JWT를 헤더에 포함 및 만료 검증)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwtToken')

    // 토큰이 있고 만료되지 않았으면 헤더에 추가
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (token && isTokenExpired(token)) {
      // 토큰이 만료되었으면 재발급 시도
      if (!isRefreshing) {
        isRefreshing = true
        const newToken = await refreshAccessToken()
        isRefreshing = false

        if (newToken) {
          config.headers.Authorization = `Bearer ${newToken}`
          processQueue(null, newToken)
        } else {
          processQueue(new Error('토큰 재발급 실패'))
          return Promise.reject(new Error('토큰 재발급 실패'))
        }
      } else {
        // 이미 재발급 중이면 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken: unknown) => {
            if (config.headers) {
              config.headers.Authorization = `Bearer ${newToken as string}`
            }
            return config
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 추가 (401 에러 시 자동 토큰 재발급)
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 401 에러이고 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // 재발급 요청 자체가 실패한 경우는 제외
      if (originalRequest.url?.includes('/auth/refresh')) {
        console.error('[Api] 토큰 재발급 요청 실패! 로그인 페이지로 리디렉션...')
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      originalRequest._retry = true

      // 이미 재발급 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken: unknown) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken as string}`
            }
            return apiClient(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      isRefreshing = true

      try {
        const newToken = await refreshAccessToken()
        isRefreshing = false

        if (newToken) {
          // 원래 요청을 새 토큰으로 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
          }
          processQueue(null, newToken)
          return apiClient(originalRequest)
        } else {
          processQueue(error, null)
          return Promise.reject(error)
        }
      } catch (refreshError) {
        isRefreshing = false
        processQueue(error, null)
        return Promise.reject(refreshError)
      }
    } else if (error.response?.status === 403) {
      console.error('[Api] 권한 없음')
    }

    return Promise.reject(error)
  }
)

export default apiClient
