import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Swal from 'sweetalert2';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 0,
    port: 8000,
  },
})
