import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <--- ADD THIS LINE
    port: 5173, // Ensure this matches your actual port
  },
   optimizeDeps: {
    include: ['jwt-decode'], // <--- Add this line to explicitly include it (opposite of exclude for some cases)
    // OR try exclude: ['jwt-decode'], if include doesn't work,
    // as it prevents Vite from pre-bundling and uses Node's resolution
  },
})
