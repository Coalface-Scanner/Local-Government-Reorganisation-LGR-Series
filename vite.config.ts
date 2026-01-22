import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['lucide-react'],
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
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
      },
    },
    // Source maps for production (optional - set to false for smaller builds)
    sourcemap: false,
  },
  // Performance optimizations
  server: {
    // Enable HTTP/2
    http2: false, // Set to true if your server supports it
  },
});
