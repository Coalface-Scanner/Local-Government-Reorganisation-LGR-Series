// generate-sitemap.ts
// ============================================================
// Run after `vite build` to produce sitemap.xml in /dist.
// Usage: npx tsx generate-sitemap.ts
//
// Generates entries for:
//   1. All static routes from seo.config.ts
//   2. Dynamic routes fetched from Supabase (insights, glossary, etc.)
// ============================================================

import { writeFileSync } from "fs";
import { resolve } from "path";

// ── CONFIG ────────────────────────────────────────────────
const SITE_URL = "https://localgovernmentreorganisation.co.uk";
const OUTPUT_PATH = resolve(__dirname, "dist", "sitemap.xml");

// ── SUPABASE CONFIG (for dynamic routes) ──────────────────
// Set these as environment variables or hardcode for build:
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || "";

// ── STATIC ENTRIES ────────────────────────────────────────
// Mirrored from seo.config.ts (excluding indexable: false)
interface SitemapEntry {
  path: string;
  priority: string;
  changefreq: string;
}

const staticEntries: SitemapEntry[] = [
  // Core
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/learn", priority: "0.8", changefreq: "weekly" },
  { path: "/discover", priority: "0.7", changefreq: "weekly" },
  { path: "/research", priority: "0.8", changefreq: "weekly" },
  { path: "/library", priority: "0.7", changefreq: "weekly" },

  // Facts & data
  { path: "/facts/timescales", priority: "0.8", changefreq: "weekly" },
  { path: "/facts/councils-involved", priority: "0.8", changefreq: "weekly" },
  { path: "/facts/key-facts", priority: "0.8", changefreq: "monthly" },
  { path: "/facts/methodology", priority: "0.4", changefreq: "yearly" },
  { path: "/facts/sources", priority: "0.4", changefreq: "monthly" },
  { path: "/facts/further-reading", priority: "0.5", changefreq: "monthly" },
  { path: "/facts/councilopedia", priority: "0.7", changefreq: "weekly" },
  { path: "/facts/lgr-timeline", priority: "0.7", changefreq: "monthly" },
  { path: "/facts/council-cases", priority: "0.7", changefreq: "monthly" },
  { path: "/facts-and-data", priority: "0.7", changefreq: "weekly" },

  // Guides
  { path: "/what-is-lgr", priority: "0.9", changefreq: "monthly" },
  { path: "/beginners-guide", priority: "0.9", changefreq: "monthly" },
  { path: "/questions-and-answers", priority: "0.8", changefreq: "monthly" },
  { path: "/faq", priority: "0.6", changefreq: "monthly" },
  { path: "/first-100-days", priority: "0.9", changefreq: "monthly" },
  { path: "/glossary", priority: "0.6", changefreq: "monthly" },

  // Hubs
  { path: "/councilopedia", priority: "0.6", changefreq: "weekly" },
  { path: "/roadmap", priority: "0.7", changefreq: "monthly" },
  { path: "/lgr-hub", priority: "0.7", changefreq: "weekly" },
  { path: "/reorganisations", priority: "0.7", changefreq: "monthly" },
  { path: "/reasons", priority: "0.7", changefreq: "monthly" },

  // Lessons
  { path: "/lessons", priority: "0.7", changefreq: "weekly" },
  { path: "/lessons/insights", priority: "0.6", changefreq: "monthly" },
  { path: "/lessons/case-studies", priority: "0.7", changefreq: "monthly" },
  { path: "/lessons/best-practices", priority: "0.7", changefreq: "monthly" },

  // Insights & news
  { path: "/insights", priority: "0.8", changefreq: "daily" },
  { path: "/insights/reports", priority: "0.7", changefreq: "monthly" },
  { path: "/news", priority: "0.8", changefreq: "daily" },

  // Topics
  { path: "/topics", priority: "0.6", changefreq: "monthly" },
  { path: "/topics/local-government", priority: "0.6", changefreq: "monthly" },
  { path: "/topics/democracy", priority: "0.6", changefreq: "monthly" },
  { path: "/topics/governance-and-reform", priority: "0.6", changefreq: "monthly" },
  { path: "/topics/democratic-legitimacy", priority: "0.6", changefreq: "monthly" },
  { path: "/topics/statecraft-and-system-design", priority: "0.6", changefreq: "monthly" },

  // Surrey
  { path: "/surrey", priority: "0.9", changefreq: "weekly" },
  { path: "/surrey/lessons", priority: "0.7", changefreq: "monthly" },
  { path: "/surrey/area-profile", priority: "0.7", changefreq: "monthly" },
  { path: "/surrey/election-tracker", priority: "0.8", changefreq: "weekly" },
  { path: "/surrey/election-tracker/simulator", priority: "0.6", changefreq: "monthly" },
  { path: "/surrey/hub", priority: "0.7", changefreq: "weekly" },

  // About
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/about/overview", priority: "0.6", changefreq: "monthly" },
  { path: "/partnerships", priority: "0.5", changefreq: "monthly" },
  { path: "/about/partnership", priority: "0.5", changefreq: "yearly" },
  { path: "/about/contributors", priority: "0.5", changefreq: "monthly" },
  { path: "/about/contributors/contribute", priority: "0.4", changefreq: "yearly" },
  { path: "/about/leadership", priority: "0.5", changefreq: "monthly" },

  // People
  { path: "/rowan-cole-local-government-reorganisation", priority: "0.5", changefreq: "yearly" },
  { path: "/professor-amelia-hadfield-governance-reform", priority: "0.5", changefreq: "yearly" },
  { path: "/oliver-deed-strategic-communications-local-government", priority: "0.4", changefreq: "yearly" },
  { path: "/matthew-masters-local-government-leadership", priority: "0.4", changefreq: "yearly" },
  { path: "/charlie-moir-digital-engagement-local-government", priority: "0.4", changefreq: "yearly" },

  // Tools & media
  { path: "/tools", priority: "0.6", changefreq: "monthly" },
  { path: "/podcast", priority: "0.7", changefreq: "weekly" },

  // Contact
  { path: "/contact", priority: "0.4", changefreq: "yearly" },
  { path: "/subscribe", priority: "0.4", changefreq: "yearly" },
];

// ── DYNAMIC ROUTE FETCHER ─────────────────────────────────
// Fetches slugs from Supabase for dynamic routes.
// Adjust table/column names to match your schema.

interface DynamicRouteConfig {
  table: string;
  slugColumn: string;
  pathPrefix: string;
  priority: string;
  changefreq: string;
  /** Optional: only include published items */
  filter?: { column: string; value: string };
}

const dynamicRouteConfigs: DynamicRouteConfig[] = [
  {
    table: "articles",          // adjust to your table name
    slugColumn: "slug",
    pathPrefix: "/insights",
    priority: "0.7",
    changefreq: "monthly",
    filter: { column: "status", value: "published" },
  },
  {
    table: "glossary_terms",    // adjust to your table name
    slugColumn: "slug",
    pathPrefix: "/glossary",
    priority: "0.5",
    changefreq: "monthly",
  },
  {
    table: "facts",             // adjust to your table name
    slugColumn: "slug",
    pathPrefix: "/facts",
    priority: "0.6",
    changefreq: "monthly",
  },
  {
    table: "leadership",        // adjust to your table name
    slugColumn: "slug",
    pathPrefix: "/about/leadership",
    priority: "0.4",
    changefreq: "yearly",
  },
  {
    table: "surrey_profiles",   // adjust to your table name
    slugColumn: "slug",
    pathPrefix: "/surrey/area-profile",
    priority: "0.6",
    changefreq: "monthly",
  },
];

async function fetchDynamicRoutes(): Promise<SitemapEntry[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("⚠️  No Supabase credentials — skipping dynamic routes.");
    console.warn("   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to include them.");
    return [];
  }

  const entries: SitemapEntry[] = [];

  for (const config of dynamicRouteConfigs) {
    try {
      let url = `${SUPABASE_URL}/rest/v1/${config.table}?select=${config.slugColumn}`;
      if (config.filter) {
        url += `&${config.filter.column}=eq.${config.filter.value}`;
      }

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (!res.ok) {
        console.warn(`⚠️  Failed to fetch ${config.table}: ${res.status}`);
        continue;
      }

      const rows = (await res.json()) as Record<string, string>[];
      for (const row of rows) {
        const slug = row[config.slugColumn];
        if (slug) {
          entries.push({
            path: `${config.pathPrefix}/${slug}`,
            priority: config.priority,
            changefreq: config.changefreq,
          });
        }
      }
      console.log(`  📄 ${config.table}: ${rows.length} dynamic routes`);
    } catch (err) {
      console.warn(`⚠️  Error fetching ${config.table}:`, err);
    }
  }

  return entries;
}

// ── GENERATOR ─────────────────────────────────────────────

async function generate() {
  console.log("\n🗺️  Generating sitemap...");

  const dynamicEntries = await fetchDynamicRoutes();
  const allEntries = [...staticEntries, ...dynamicEntries];

  const today = new Date().toISOString().split("T")[0];

  const urls = allEntries
    .map(
      (entry) => `  <url>
    <loc>${SITE_URL}${entry.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  writeFileSync(OUTPUT_PATH, sitemap, "utf-8");
  console.log(
    `\n✅ Sitemap written to ${OUTPUT_PATH}`
  );
  console.log(
    `   ${staticEntries.length} static + ${dynamicEntries.length} dynamic = ${allEntries.length} total URLs\n`
  );
}

generate().catch(console.error);
