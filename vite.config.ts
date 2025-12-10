/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
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
})
