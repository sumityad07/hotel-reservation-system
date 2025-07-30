import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <--- ADD THIS LINE
    port: 5173, // Ensure this matches your actual port
  },
   
})
