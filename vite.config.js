import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://flowhunter.pearson-william24.workers.dev',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: { port: 4173 },
});
