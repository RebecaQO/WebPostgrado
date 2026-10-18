import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      // En desarrollo: redirige /api al backend Flask local (puerto 5000)
      // Esto evita cold-start timeouts de Render y acelera el desarrollo
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.warn('[Vite Proxy] Error conectando al backend local:', err.message);
          });
        }
      },
      '/images': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});

