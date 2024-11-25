import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), 
    },
  },
  server: {
    port: 8010,
  },
  optimizeDeps: {
    include: ['react-editor-js'], // react-editor-js를 Vite로 강제로 번들링
  },
})
