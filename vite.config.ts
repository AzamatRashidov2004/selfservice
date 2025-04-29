import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.VERSION || "development")
  },
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
