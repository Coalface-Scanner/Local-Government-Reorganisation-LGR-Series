import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'node:child_process';
import path from 'node:path';
import vitePrerender from 'vite-plugin-prerender-k';
const PuppeteerRenderer = vitePrerender.PuppeteerRenderer;

// ── PRERENDER ROUTES (55 static routes, excludes admin) ─────
const PRERENDER_ROUTES = [
  '/',
  '/learn',
  '/discover',
  '/research',
  '/library',
  '/facts/timescales',
  '/facts/councils-involved',
  '/facts/key-facts',
  '/facts/methodology',
  '/facts/sources',
  '/facts/further-reading',
  '/facts/councilopedia',
  '/facts/lgr-timeline',
  '/facts/council-cases',
  '/facts-and-data',
  '/what-is-lgr',
  '/beginners-guide',
  '/questions-and-answers',
  '/faq',
  '/first-100-days',
  '/glossary',
  '/councilopedia',
  '/roadmap',
  '/lgr-hub',
  '/reorganisations',
  '/reasons',
  '/lessons',
  '/lessons/insights',
  '/lessons/case-studies',
  '/lessons/best-practices',
  '/insights',
  '/insights/reports',
  '/news',
  '/topics',
  '/topics/local-government',
  '/topics/democracy',
  '/topics/governance-and-reform',
  '/topics/democratic-legitimacy',
  '/topics/statecraft-and-system-design',
  '/surrey',
  '/surrey/lessons',
  '/surrey/area-profile',
  '/surrey/election-tracker',
  '/surrey/election-tracker/simulator',
  '/surrey/hub',
  '/about',
  '/about/overview',
  '/partnerships',
  '/about/partnership',
  '/about/contributors',
  '/about/contributors/contribute',
  '/about/leadership',
  '/rowan-cole-local-government-reorganisation',
  '/professor-amelia-hadfield-governance-reform',
  '/oliver-deed-strategic-communications-local-government',
  '/matthew-masters-local-government-leadership',
  '/charlie-moir-digital-engagement-local-government',
  '/tools',
  '/podcast',
  '/contact',
  '/subscribe',
];

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
  plugins: [
    openBrowserPlugin(),
    react(),
    tailwindcss(),
    vitePrerender({
      staticDir: path.join(process.cwd(), 'dist'),
      routes: PRERENDER_ROUTES,
      renderer: new PuppeteerRenderer({
        maxConcurrentRoutes: 2,
        timeout: 60000,
        renderAfterTime: 5000,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }),
      postProcess(renderedRoute) {
        if (
          renderedRoute.route.endsWith('/') &&
          renderedRoute.route.length > 1
        ) {
          renderedRoute.route = renderedRoute.route.slice(0, -1);
        }
        renderedRoute.html = renderedRoute.html.replace(
          '</head>',
          '<meta name="x-prerendered" content="true" /></head>'
        );
        return renderedRoute;
      },
    }),
  ],
  esbuild: {
    drop: ['console', 'debugger'], // Remove console.log in production
  },
  optimizeDeps: {
    include: ['lucide-react', 'react-router-dom'],
  },
  server: {
    port: 5173,
    strictPort: false,
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/supabase/migrations/**',
        '**/content-to-upload/**',
        '**/.cursor/**',
        '**/.bolt/**',
        '**/*.md',
        '**/scripts/**',
        '**/netlify/**',
      ],
    },
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
