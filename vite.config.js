import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ["1431392487db.ngrok-free.app"] // or "*.ngrok-free.app"
  }
})
