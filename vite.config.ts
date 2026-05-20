import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = (env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const secure = apiBaseUrl.startsWith('https://');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/auth': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure,
          rewrite: (path) => path.replace(/^\/auth/, '/auth'),
        },
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          secure,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  };
});
