import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'node:child_process';

// Opens the dev server URL in the default browser (works from Cursor/IDE where open: true often doesn't)
function openBrowserPlugin() {
  return {
    name: 'open-browser',
    configureServer(server: { httpServer?: { once: (e: string, fn: () => void) => void; address: () => { port: number } | null } }) {
      const httpServer = server.httpServer;
      if (!httpServer) return;
      httpServer.once('listening', () => {
        const addr = httpServer.address();
        const port = addr && typeof addr === 'object' ? addr.port : 5173;
        const url = `http://localhost:${port}/`;
        try {
          execSync(`open "${url}"`, { stdio: 'ignore' });
        } catch {
          console.log(`  ➜  Open in browser: ${url}`);
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [openBrowserPlugin(), react(), tailwindcss()],
  esbuild: {
    drop: ['console', 'debugger'], // Remove console.log in production
  },
  optimizeDeps: {
    include: ['lucide-react', 'react-router-dom'],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            if (id.includes('react-quill')) {
              return 'editor-vendor';
            }
            if (id.includes('leaflet')) {
              return 'map-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
          // Admin pages chunk
          if (id.includes('/pages/admin/')) {
            return 'admin-pages';
          }
          // Facts sub-pages chunk
          if (id.includes('/pages/facts/')) {
            return 'facts-pages';
          }
        },
      },
    },
    // Chunk size warning limit (increase since we're splitting)
    chunkSizeWarningLimit: 600,
    // Minify for production (esbuild is much faster than terser)
    minify: 'esbuild',
    // Source maps for production (optional - set to false for smaller builds)
    sourcemap: false,
  },
});
