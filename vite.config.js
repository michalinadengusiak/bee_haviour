import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  base:'/bee-haviour-frontend/',
  server: { port: 3000, open: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/lib/test-setup.js',
    css: true,
  },
})
