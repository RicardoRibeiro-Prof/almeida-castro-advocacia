import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const pagesBase = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base: pagesBase,
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('dompurify')) return 'sanitizer'
          if (id.includes('marked') || id.includes('js-yaml')) return 'content'
          if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
          return undefined
        },
      },
    },
  },
})
