import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' lets the built site be hosted from any sub-path (GitHub Pages, S3 folder, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', chunkSizeWarningLimit: 600 },
})
