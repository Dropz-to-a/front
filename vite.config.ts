import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 추가

export default defineConfig({
  plugins: [react(), tailwindcss()], // tailwindcss() 추가
  server: {
    proxy: {
      '/api': 'http://172.28.5.94:8083', // 백엔드 서버 주소
    },
  },
})
