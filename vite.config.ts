import {defineConfig, type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const WHATSAPP_API = 'https://api.prod.whatsapp-service.epocketshop.store';

/**
 * In dev, store and customer reads go through a same-origin proxy to the production
 * API (the browser would otherwise be blocked by CORS on localhost). Writes to real
 * customer records are answered locally so developing never changes production data.
 * Orders are never proxied: see src/lib/config.ts.
 */
function blockDevWrites(): Plugin {
  return {
    name: 'block-dev-writes',
    configureServer(server) {
      server.middlewares.use('/__api/whatsapp/update_customer', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end('{}');
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), blockDevWrites()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    host: true,
    proxy: {
      '/__api/whatsapp': {
        target: WHATSAPP_API,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/__api\/whatsapp/, ''),
      },
    },
  },
});
