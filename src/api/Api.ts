import axios from 'axios'

// axios 인스턴스 생성
// Vite 프록시를 사용하기 위해 baseURL을 설정하지 않음 (상대 경로 사용)
// 프록시 설정: vite.config.ts의 /api 경로가 백엔드로 프록시됨
const apiClient = axios.create({
    // baseURL을 설정하지 않으면 상대 경로로 요청이 가고 Vite 프록시가 처리함
    timeout: 10000, // 요청 타임아웃 설정
    withCredentials: true, // 쿠키 포함
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
  }
)

// 응답 인터셉터 추가 (선택 사항, 전역적으로 에러 처리)
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 토큰 만료 또는 기타 에러 처리
    if (error.response?.status === 401) {
      console.error('인증 실패! 로그인 페이지로 리디렉션...')
      localStorage.removeItem('jwtToken')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      console.error('권한 없음')
    }
    return Promise.reject(error)
  }
)

export default apiClient
