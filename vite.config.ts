import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { apiDevPlugin } from './server/plugin.js'

// https://vite.dev/config
export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
