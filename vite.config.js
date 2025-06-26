import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/fractal_front/' : '/',
  server: {
    port: 3000,
    host: true,
    open: true
  },
  preview: {
    port: 8080,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  optimizeDeps: {
    include: ['opus-to-pcm']
  }
}) 