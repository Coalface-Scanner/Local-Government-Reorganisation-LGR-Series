// vite.config.ts
import { defineConfig } from "file:///Users/rowancole/Documents/GitHub/Local-Government-Reorganisation-LGR-Series/node_modules/vite/dist/node/index.js";
import react from "file:///Users/rowancole/Documents/GitHub/Local-Government-Reorganisation-LGR-Series/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///Users/rowancole/Documents/GitHub/Local-Government-Reorganisation-LGR-Series/node_modules/@tailwindcss/vite/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: {
    drop: ["console", "debugger"]
    // Remove console.log in production
  },
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
    // Minify for production (esbuild is much faster than terser)
    minify: "esbuild",
    // Source maps for production (optional - set to false for smaller builds)
    sourcemap: false
  },
  // Performance optimizations
  server: {
    port: 5173,
    strictPort: false,
    // Try next port if 5173 is in use
    http2: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcm93YW5jb2xlL0RvY3VtZW50cy9HaXRIdWIvTG9jYWwtR292ZXJubWVudC1SZW9yZ2FuaXNhdGlvbi1MR1ItU2VyaWVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcm93YW5jb2xlL0RvY3VtZW50cy9HaXRIdWIvTG9jYWwtR292ZXJubWVudC1SZW9yZ2FuaXNhdGlvbi1MR1ItU2VyaWVzL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9yb3dhbmNvbGUvRG9jdW1lbnRzL0dpdEh1Yi9Mb2NhbC1Hb3Zlcm5tZW50LVJlb3JnYW5pc2F0aW9uLUxHUi1TZXJpZXMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHRhaWx3aW5kY3NzKCldLFxuICBlc2J1aWxkOiB7XG4gICAgZHJvcDogWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10sIC8vIFJlbW92ZSBjb25zb2xlLmxvZyBpbiBwcm9kdWN0aW9uXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gQ29kZSBzcGxpdHRpbmcgb3B0aW1pemF0aW9uXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIC8vIFZlbmRvciBjaHVua3NcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3JlYWN0JykgfHwgaWQuaW5jbHVkZXMoJ3JlYWN0LWRvbScpIHx8IGlkLmluY2x1ZGVzKCdyZWFjdC1yb3V0ZXInKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ3JlYWN0LXZlbmRvcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0BzdXBhYmFzZScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAnc3VwYWJhc2UtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygncmVhY3QtcXVpbGwnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2VkaXRvci12ZW5kb3InO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdsZWFmbGV0JykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdtYXAtdmVuZG9yJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE90aGVyIG5vZGVfbW9kdWxlc1xuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBBZG1pbiBwYWdlcyBjaHVua1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3BhZ2VzL2FkbWluLycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2FkbWluLXBhZ2VzJztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gRmFjdHMgc3ViLXBhZ2VzIGNodW5rXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvcGFnZXMvZmFjdHMvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnZmFjdHMtcGFnZXMnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBDaHVuayBzaXplIHdhcm5pbmcgbGltaXQgKGluY3JlYXNlIHNpbmNlIHdlJ3JlIHNwbGl0dGluZylcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDYwMCxcbiAgICAvLyBNaW5pZnkgZm9yIHByb2R1Y3Rpb24gKGVzYnVpbGQgaXMgbXVjaCBmYXN0ZXIgdGhhbiB0ZXJzZXIpXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXG4gICAgLy8gU291cmNlIG1hcHMgZm9yIHByb2R1Y3Rpb24gKG9wdGlvbmFsIC0gc2V0IHRvIGZhbHNlIGZvciBzbWFsbGVyIGJ1aWxkcylcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICB9LFxuICAvLyBQZXJmb3JtYW5jZSBvcHRpbWl6YXRpb25zXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgc3RyaWN0UG9ydDogZmFsc2UsIC8vIFRyeSBuZXh0IHBvcnQgaWYgNTE3MyBpcyBpbiB1c2VcbiAgICBodHRwMjogZmFsc2UsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1osU0FBUyxvQkFBb0I7QUFDbmIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBR3hCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQUEsRUFDaEMsU0FBUztBQUFBLElBQ1AsTUFBTSxDQUFDLFdBQVcsVUFBVTtBQUFBO0FBQUEsRUFDOUI7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxjQUFjO0FBQUEsRUFDMUI7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sYUFBYSxJQUFJO0FBRWYsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLGdCQUFJLEdBQUcsU0FBUyxPQUFPLEtBQUssR0FBRyxTQUFTLFdBQVcsS0FBSyxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQ25GLHFCQUFPO0FBQUEsWUFDVDtBQUNBLGdCQUFJLEdBQUcsU0FBUyxXQUFXLEdBQUc7QUFDNUIscUJBQU87QUFBQSxZQUNUO0FBQ0EsZ0JBQUksR0FBRyxTQUFTLGFBQWEsR0FBRztBQUM5QixxQkFBTztBQUFBLFlBQ1Q7QUFDQSxnQkFBSSxHQUFHLFNBQVMsU0FBUyxHQUFHO0FBQzFCLHFCQUFPO0FBQUEsWUFDVDtBQUVBLG1CQUFPO0FBQUEsVUFDVDtBQUVBLGNBQUksR0FBRyxTQUFTLGVBQWUsR0FBRztBQUNoQyxtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxlQUFlLEdBQUc7QUFDaEMsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLHVCQUF1QjtBQUFBO0FBQUEsSUFFdkIsUUFBUTtBQUFBO0FBQUEsSUFFUixXQUFXO0FBQUEsRUFDYjtBQUFBO0FBQUEsRUFFQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUE7QUFBQSxJQUNaLE9BQU87QUFBQSxFQUNUO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
