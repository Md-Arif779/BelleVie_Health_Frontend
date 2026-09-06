import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configures Vite local development server proxy for Django Backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Runs frontend app on http://localhost:3000
    proxy: {
      // Directs API calls starting with /api/v1 to Django backend
      '/api/v1': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
