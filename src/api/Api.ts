import axios from 'axios'

// axios 인스턴스 생성
// axios 인스턴스 생성
// .env 파일에서 VITE_API_BASE_URL 값을 가져와 API 기본 URL로 설정합니다.
// Vite는 import.meta.env를 통해 환경 변수를 제공합니다.
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // API 기본 URL로 교체
    timeout: 10000, // 요청 타임아웃 설정
});

// 요청 인터셉터 추가 (JWT를 헤더에 포함)
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwtToken') // localStorage 또는 다른 저장소에서 JWT 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터 추가 (선택 사항, 전역적으로 에러 처리)
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 토큰 만료 또는 기타 에러 처리
    if (error.response?.status === 401) {
      console.error('인증 실패! 로그인 페이지로 리디렉션...')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
