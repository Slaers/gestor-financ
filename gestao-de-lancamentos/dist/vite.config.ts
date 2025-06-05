import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['4173-ihszxng6bb9egw4uz9ds0-cf1f8df6.manusvm.computer', '.manusvm.computer']
  }
})

