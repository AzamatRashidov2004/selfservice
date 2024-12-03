import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
  },
  define: {
    // Inject all environment variables into the app for frontend access
    'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(process.env.VITE_ENVIRONMENT),
    'import.meta.env.VITE_ANALYTICAL_URL_PRODUCTION': JSON.stringify(process.env.VITE_ANALYTICAL_URL_PRODUCTION),
    'import.meta.env.VITE_ANALYTICAL_URL_DEVELOPMENT': JSON.stringify(process.env.VITE_ANALYTICAL_URL_DEVELOPMENT),
    'import.meta.env.VITE_DOCRETR_URL_DEVELOPMENT': JSON.stringify(process.env.VITE_DOCRETR_URL_DEVELOPMENT),
    'import.meta.env.VITE_DOCRETR_API_KEY_DEVELOPMENT': JSON.stringify(process.env.VITE_DOCRETR_API_KEY_DEVELOPMENT),
    'import.meta.env.VITE_KRONOS_URL_PRODUCTION': JSON.stringify(process.env.VITE_KRONOS_URL_PRODUCTION),
    'import.meta.env.VITE_KRONOS_URL_DEVELOPMENT': JSON.stringify(process.env.VITE_KRONOS_URL_DEVELOPMENT),
    'import.meta.env.VITE_KRONOS_API_KEY_PRODUCTION': JSON.stringify(process.env.VITE_KRONOS_API_KEY_PRODUCTION),
    'import.meta.env.VITE_KRONOS_API_KEY_DEVELOPMENT': JSON.stringify(process.env.VITE_KRONOS_API_KEY_DEVELOPMENT),
    'import.meta.env.FIREBASE_TOKEN': JSON.stringify(process.env.FIREBASE_TOKEN),
  },
  build: {
    // Custom options if needed
  },
})
