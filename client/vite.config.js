import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Read API port from env so it matches server/.env.
// Precedence: process env (API_PORT) → `../server/.env` (PORT) → 5500.
// Defaults avoid macOS AirPlay (:5000/:7000) and common React/Vite ports.
export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, '../server', 'PORT');
  const apiPort = process.env.API_PORT || serverEnv.PORT || '5500';
  const apiTarget = `http://localhost:${apiPort}`;

  return {
    plugins: [react()],
    server: {
      port: Number(process.env.CLIENT_PORT) || 5170,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
    build: { outDir: 'dist' },
  };
});
