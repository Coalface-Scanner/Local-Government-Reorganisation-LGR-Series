// vite.config.seo.ts — FIXED PRERENDER CONFIG
// ============================================================
// Replace the vitePrerenderPlugin section in your vite.config.ts
// with this. Three fixes:
//   1. Increased navigation timeout (60s per page)
//   2. Limited concurrency (2 pages at a time)
//   3. renderAfterTime bumped to let pages settle
// ============================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vitePrerenderPlugin } from "vite-plugin-prerender-k";
import path from "path";

const PRERENDER_ROUTES = [
  "/",
  "/learn",
  "/discover",
  "/research",
  "/library",
  "/facts/timescales",
  "/facts/councils-involved",
  "/facts/key-facts",
  "/facts/methodology",
  "/facts/sources",
  "/facts/further-reading",
  "/facts/councilopedia",
  "/facts/lgr-timeline",
  "/facts/council-cases",
  "/facts-and-data",
  "/what-is-lgr",
  "/beginners-guide",
  "/questions-and-answers",
  "/faq",
  "/first-100-days",
  "/glossary",
  "/councilopedia",
  "/roadmap",
  "/lgr-hub",
  "/reorganisations",
  "/reasons",
  "/lessons",
  "/lessons/insights",
  "/lessons/case-studies",
  "/lessons/best-practices",
  "/insights",
  "/insights/reports",
  "/news",
  "/topics",
  "/topics/local-government",
  "/topics/democracy",
  "/topics/governance-and-reform",
  "/topics/democratic-legitimacy",
  "/topics/statecraft-and-system-design",
  "/surrey",
  "/surrey/lessons",
  "/surrey/area-profile",
  "/surrey/election-tracker",
  "/surrey/election-tracker/simulator",
  "/surrey/hub",
  "/about",
  "/about/overview",
  "/partnerships",
  "/about/partnership",
  "/about/contributors",
  "/about/contributors/contribute",
  "/about/leadership",
  "/rowan-cole-local-government-reorganisation",
  "/professor-amelia-hadfield-governance-reform",
  "/oliver-deed-strategic-communications-local-government",
  "/matthew-masters-local-government-leadership",
  "/charlie-moir-digital-engagement-local-government",
  "/tools",
  "/podcast",
  "/contact",
  "/subscribe",
];

export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      routes: PRERENDER_ROUTES,

      // ── FIX 1: Limit concurrency ────────────────────────
      // Default tries all routes in parallel, which overwhelms
      // the local dev server + Puppeteer. 2 at a time is safe.
      maxConcurrentRoutes: 2,

      renderer: {
        // ── FIX 2: Increase navigation timeout ────────────
        // Default is 30s. With Supabase calls, some pages
        // need longer. 60s gives plenty of headroom.
        timeout: 60000,

        // ── FIX 3: Wait longer for page to settle ─────────
        // 5s gives Supabase responses time to arrive and
        // React to re-render with data.
        renderAfterTime: 5000,

        // Puppeteer launch args for CI/build environments
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },

      postProcess(renderedRoute) {
        if (
          renderedRoute.route.endsWith("/") &&
          renderedRoute.route.length > 1
        ) {
          renderedRoute.route = renderedRoute.route.slice(0, -1);
        }

        renderedRoute.html = renderedRoute.html.replace(
          "</head>",
          `<meta name="x-prerendered" content="true" /></head>`
        );

        return renderedRoute;
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
