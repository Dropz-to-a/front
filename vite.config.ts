/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    open: true,
    port: 3000,
    proxy: {
      // 더 구체적인 경로를 먼저 매칭해야 함
      '/api/business/exists': {
        target: 'https://apick.app',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/rest/biz_detail', // 경로를 /rest/biz_detail로 변환
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // 환경 변수에서 인증 키 가져오기
            const authKey = env.VITE_APICK_AUTH_KEY || ''
            if (authKey) {
              proxyReq.setHeader('CL_AUTH_KEY', authKey)
            } else {
              console.warn('VITE_APICK_AUTH_KEY가 설정되지 않았습니다.')
            }
            
            // FormData의 Content-Type이 이미 설정되어 있으므로 유지
            // multipart/form-data의 boundary는 axios가 자동으로 설정함
            const contentType = req.headers['content-type']
            if (contentType && contentType.includes('multipart/form-data')) {
              // Content-Type이 이미 설정되어 있으면 그대로 사용
              proxyReq.setHeader('Content-Type', contentType)
            }
            
            console.log('[Proxy] 요청 헤더:', {
              'CL_AUTH_KEY': authKey ? '설정됨' : '없음',
              'Content-Type': contentType,
            })
          })
          proxy.on('error', (err) => {
            console.error('[Proxy] 에러 발생:', err)
          })
        },
      },
      // 일반 API는 백엔드로
      '/api': {
        target: 'http://localhost:8080', // 실제 백엔드 서버 주소 (예: Spring Boot)
        changeOrigin: true, // 호스트 헤더를 변경하여 요청 전송
        secure: false, // HTTPS 사용 시 필요
      },
    },
  },

  // Vitest/Storybook 테스트는 비활성화 상태
  // test: {
  //   ...
  // },
  }
})
