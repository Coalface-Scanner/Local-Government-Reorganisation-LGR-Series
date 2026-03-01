// vite.config.seo.ts
// ============================================================
// MERGE into your existing vite.config.ts.
// ============================================================

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vitePrerenderPlugin } from "vite-plugin-prerender-k";
import path from "path";

// ── STATIC ROUTES TO PRERENDER ────────────────────────────
// These must match the paths in src/seo.config.ts.
// Admin pages are excluded — no need to prerender those.
const PRERENDER_ROUTES = [
  "/",
  "/learn",
  "/discover",
  "/research",
  "/library",

  // Facts & data
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

  // Guides & explainers
  "/what-is-lgr",
  "/beginners-guide",
  "/questions-and-answers",
  "/faq",
  "/first-100-days",
  "/glossary",

  // Navigation hubs
  "/councilopedia",
  "/roadmap",
  "/lgr-hub",
  "/reorganisations",
  "/reasons",

  // Lessons
  "/lessons",
  "/lessons/insights",
  "/lessons/case-studies",
  "/lessons/best-practices",

  // Insights & news
  "/insights",
  "/insights/reports",
  "/news",

  // Topics
  "/topics",
  "/topics/local-government",
  "/topics/democracy",
  "/topics/governance-and-reform",
  "/topics/democratic-legitimacy",
  "/topics/statecraft-and-system-design",

  // Surrey
  "/surrey",
  "/surrey/lessons",
  "/surrey/area-profile",
  "/surrey/election-tracker",
  "/surrey/election-tracker/simulator",
  "/surrey/hub",

  // About
  "/about",
  "/about/overview",
  "/partnerships",
  "/about/partnership",
  "/about/contributors",
  "/about/contributors/contribute",
  "/about/leadership",

  // People
  "/rowan-cole-local-government-reorganisation",
  "/professor-amelia-hadfield-governance-reform",
  "/oliver-deed-strategic-communications-local-government",
  "/matthew-masters-local-government-leadership",
  "/charlie-moir-digital-engagement-local-government",

  // Tools & media
  "/tools",
  "/podcast",

  // Contact / subscribe
  "/contact",
  "/subscribe",
];

// ── DYNAMIC ROUTES ────────────────────────────────────────
// If you want to prerender dynamic pages (e.g. /insights/some-slug),
// you need to fetch the slugs from Supabase at build time.
// See generate-dynamic-routes.ts for an example.
// Then spread them into the array:
// ...dynamicRoutes,

export default defineConfig({
  plugins: [
    react(),
    vitePrerenderPlugin({
      routes: PRERENDER_ROUTES,
      renderer: {
        // Give Supabase data time to load before snapshotting
        renderAfterTime: 3000,
        // Better alternative: dispatch a custom event when ready
        // renderAfterDocumentEvent: "prerender-ready",
      },
      postProcess(renderedRoute) {
        // Strip trailing slashes for Netlify consistency
        if (
          renderedRoute.route.endsWith("/") &&
          renderedRoute.route.length > 1
        ) {
          renderedRoute.route = renderedRoute.route.slice(0, -1);
        }

        // Verification marker
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
