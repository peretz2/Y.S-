import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Read API port from env so it matches server/.env.
// Precedence: process env (API_PORT) → `../server/.env` (PORT) → 5001.
// Default is 5001 because macOS Monterey+ binds :5000 to AirPlay Receiver.
export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, '../server', 'PORT');
  const apiPort = process.env.API_PORT || serverEnv.PORT || '5001';
  const apiTarget = `http://localhost:${apiPort}`;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
        '/uploads': { target: apiTarget, changeOrigin: true },
      },
    },
    build: { outDir: 'dist' },
  };
});
