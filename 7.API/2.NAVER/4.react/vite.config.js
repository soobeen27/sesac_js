import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// 사용자 => 브라우저 => vite proxy => express
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/search': {
        target: 'http://127.0.0.1:3000/',
        changeOrigin: true,
      },
    },
  },
});
