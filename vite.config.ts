import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/ test
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Make sure the dev server listens on all interfaces
    port: 8080,        // Port for dev server
  },
  preview: {
    host: '0.0.0.0',  // Ensure preview mode listens on all interfaces
    port: 8080,        // Port for production preview
  },
  build: {
    // Custom options if needed
  },
})
