// vite.config.ts
import { defineConfig } from "file:///Users/rowancole/Documents/GitHub/Local-Government-Reorganisation-LGR-Series/node_modules/vite/dist/node/index.js";
import react from "file:///Users/rowancole/Documents/GitHub/Local-Government-Reorganisation-LGR-Series/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///Users/rowancole/Documents/GitHub/Local-Government-Reorganisation-LGR-Series/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router")) {
              return "react-vendor";
            }
            if (id.includes("@supabase")) {
              return "supabase-vendor";
            }
            if (id.includes("react-quill")) {
              return "editor-vendor";
            }
            if (id.includes("leaflet")) {
              return "map-vendor";
            }
            return "vendor";
          }
          if (id.includes("/pages/admin/")) {
            return "admin-pages";
          }
          if (id.includes("/pages/facts/")) {
            return "facts-pages";
          }
        }
      }
    },
    // Chunk size warning limit (increase since we're splitting)
    chunkSizeWarningLimit: 600,
    // Minify for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"]
        // Remove specific console methods
      }
    },
    // Source maps for production (optional - set to false for smaller builds)
    sourcemap: false
  },
  // Performance optimizations
  server: {
    // Enable HTTP/2
    http2: false
    // Set to true if your server supports it
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcm93YW5jb2xlL0RvY3VtZW50cy9HaXRIdWIvTG9jYWwtR292ZXJubWVudC1SZW9yZ2FuaXNhdGlvbi1MR1ItU2VyaWVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcm93YW5jb2xlL0RvY3VtZW50cy9HaXRIdWIvTG9jYWwtR292ZXJubWVudC1SZW9yZ2FuaXNhdGlvbi1MR1ItU2VyaWVzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9yb3dhbmNvbGUvRG9jdW1lbnRzL0dpdEh1Yi9Mb2NhbC1Hb3Zlcm5tZW50LVJlb3JnYW5pc2F0aW9uLUxHUi1TZXJpZXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHRhaWx3aW5kY3NzKCldLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIENvZGUgc3BsaXR0aW5nIG9wdGltaXphdGlvblxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICAvLyBWZW5kb3IgY2h1bmtzXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdCcpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1kb20nKSB8fCBpZC5pbmNsdWRlcygncmVhY3Qtcm91dGVyJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdyZWFjdC12ZW5kb3InO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAc3VwYWJhc2UnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3N1cGFiYXNlLXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0LXF1aWxsJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdlZGl0b3ItdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbGVhZmxldCcpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnbWFwLXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBPdGhlciBub2RlX21vZHVsZXNcbiAgICAgICAgICAgIHJldHVybiAndmVuZG9yJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gQWRtaW4gcGFnZXMgY2h1bmtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9wYWdlcy9hZG1pbi8nKSkge1xuICAgICAgICAgICAgcmV0dXJuICdhZG1pbi1wYWdlcyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIEZhY3RzIHN1Yi1wYWdlcyBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3BhZ2VzL2ZhY3RzLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2ZhY3RzLXBhZ2VzJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gQ2h1bmsgc2l6ZSB3YXJuaW5nIGxpbWl0IChpbmNyZWFzZSBzaW5jZSB3ZSdyZSBzcGxpdHRpbmcpXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiA2MDAsXG4gICAgLy8gTWluaWZ5IGZvciBwcm9kdWN0aW9uXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFJlbW92ZSBjb25zb2xlLmxvZyBpbiBwcm9kdWN0aW9uXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIHB1cmVfZnVuY3M6IFsnY29uc29sZS5sb2cnLCAnY29uc29sZS5pbmZvJ10sIC8vIFJlbW92ZSBzcGVjaWZpYyBjb25zb2xlIG1ldGhvZHNcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBTb3VyY2UgbWFwcyBmb3IgcHJvZHVjdGlvbiAob3B0aW9uYWwgLSBzZXQgdG8gZmFsc2UgZm9yIHNtYWxsZXIgYnVpbGRzKVxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gIH0sXG4gIC8vIFBlcmZvcm1hbmNlIG9wdGltaXphdGlvbnNcbiAgc2VydmVyOiB7XG4gICAgLy8gRW5hYmxlIEhUVFAvMlxuICAgIGh0dHAyOiBmYWxzZSwgLy8gU2V0IHRvIHRydWUgaWYgeW91ciBzZXJ2ZXIgc3VwcG9ydHMgaXRcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzWixTQUFTLG9CQUFvQjtBQUNuYixPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7QUFBQSxFQUNoQyxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUVmLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixnQkFBSSxHQUFHLFNBQVMsT0FBTyxLQUFLLEdBQUcsU0FBUyxXQUFXLEtBQUssR0FBRyxTQUFTLGNBQWMsR0FBRztBQUNuRixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsV0FBVyxHQUFHO0FBQzVCLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxhQUFhLEdBQUc7QUFDOUIscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLFNBQVMsR0FBRztBQUMxQixxQkFBTztBQUFBLFlBQ1Q7QUFFQSxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxlQUFlLEdBQUc7QUFDaEMsbUJBQU87QUFBQSxVQUNUO0FBRUEsY0FBSSxHQUFHLFNBQVMsZUFBZSxHQUFHO0FBQ2hDLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFFQSx1QkFBdUI7QUFBQTtBQUFBLElBRXZCLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBLFFBQ2QsZUFBZTtBQUFBLFFBQ2YsWUFBWSxDQUFDLGVBQWUsY0FBYztBQUFBO0FBQUEsTUFDNUM7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFdBQVc7QUFBQSxFQUNiO0FBQUE7QUFBQSxFQUVBLFFBQVE7QUFBQTtBQUFBLElBRU4sT0FBTztBQUFBO0FBQUEsRUFDVDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
