/**
 * Vite Configuration
 * Sets up the development server with React plugin and API proxy.
 * Proxies /api requests to the backend server to handle CORS and cookies.
 */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
/**
 * Vite Configuration Export
 * @param {string} mode - Build mode (development/production)
 * @returns {Object} Vite configuration object with React plugin and API proxy
 */
export default ({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return defineConfig({
    plugins: [react()],
    server: {
      port: 3001,
      proxy: {
        '/api': {
          target: env.VITE_TARGET,
          secure: false,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              const cookies = proxyRes.headers['set-cookie'];
              if (cookies) {
                proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                  cookie
                    .replace(/; *Secure/gi, '')
                    .replace(/; *SameSite=None/gi, '')
                    .replace(/; *Domain=[^;]+/gi, '')
                );
              }
            });
          },
        },
      },
    },
  });
};
