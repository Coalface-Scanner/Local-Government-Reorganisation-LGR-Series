# SEO Fix Kit — localgovernmentreorganisation.co.uk (v2)

## Files in this kit

| File | Purpose |
|---|---|
| `src/seo.config.ts` | Central SEO data for all ~55 indexable static routes |
| `src/components/SEOHead.tsx` | React component — sets title, meta, OG, JSON-LD per page |
| `vite.config.seo.ts` | Prerender plugin config with all static routes |
| `generate-sitemap.ts` | Build-time script — static routes + dynamic slugs from Supabase |
| `public/robots.txt` | Crawler rules (blocks /admin/, /unsubscribe) |
| `netlify.toml` | Cache headers, X-Robots-Tag noindex on /admin/* |
| `index-html-additions.html` | Fallback meta tags for your index.html `<head>` |
| `verify-seo.sh` | Post-deploy smoke test |

---

## Cursor Agent Prompts

Feed these one at a time. Wait for each to complete before the next.

### Prompt 1 — Install + wire SEOHead

```
Install react-helmet-async.

In main.tsx (or wherever the app root is), wrap the app with <HelmetProvider> from react-helmet-async.

Copy the attached src/seo.config.ts into src/seo.config.ts (replace if exists).
Copy the attached src/components/SEOHead.tsx into src/components/SEOHead.tsx.

Then add <SEOHead page="KEY" /> as the FIRST child inside every page/route component, where KEY matches the key in the pages object in seo.config.ts. The mapping is:

  / → "home"
  /learn → "learn"
  /discover → "discover"
  /research → "research"
  /library → "library"
  /facts/timescales → "factsTimescales"
  /facts/councils-involved → "factsCouncilsInvolved"
  /facts/key-facts → "factsKeyFacts"
  /facts/methodology → "factsMethodology"
  /facts/sources → "factsSources"
  /facts/further-reading → "factsFurtherReading"
  /facts/councilopedia → "factsCouncilopedia"
  /facts/lgr-timeline → "factsLgrTimeline"
  /facts/council-cases → "factsCouncilCases"
  /facts-and-data → "factsAndData"
  /what-is-lgr → "whatIsLgr"
  /beginners-guide → "beginnersGuide"
  /questions-and-answers → "questionsAndAnswers"
  /faq → "faq"
  /first-100-days → "first100Days"
  /glossary → "glossary"
  /councilopedia → "councilopedia"
  /roadmap → "roadmap"
  /lgr-hub → "lgrHub"
  /reorganisations → "reorganisations"
  /reasons → "reasons"
  /lessons → "lessons"
  /lessons/insights → "lessonsInsights"
  /lessons/case-studies → "lessonsCaseStudies"
  /lessons/best-practices → "lessonsBestPractices"
  /insights → "insights"
  /insights/reports → "insightsReports"
  /news → "news"
  /topics → "topics"
  /topics/local-government → "topicsLocalGovernment"
  /topics/democracy → "topicsDemocracy"
  /topics/governance-and-reform → "topicsGovernanceReform"
  /topics/democratic-legitimacy → "topicsDemocraticLegitimacy"
  /topics/statecraft-and-system-design → "topicsStatecraft"
  /surrey → "surrey"
  /surrey/lessons → "surreyLessons"
  /surrey/area-profile → "surreyAreaProfile"
  /surrey/election-tracker → "surreyElectionTracker"
  /surrey/election-tracker/simulator → "surreyElectionSimulator"
  /surrey/hub → "surreyHub"
  /about → "about"
  /about/overview → "aboutOverview"
  /partnerships → "partnerships"
  /about/partnership → "aboutPartnership"
  /about/contributors → "aboutContributors"
  /about/contributors/contribute → "aboutContribute"
  /about/leadership → "aboutLeadership"
  /rowan-cole-local-government-reorganisation → "rowanCole"
  /professor-amelia-hadfield-governance-reform → "ameliaHadfield"
  /oliver-deed-strategic-communications-local-government → "oliverDeed"
  /matthew-masters-local-government-leadership → "matthewMasters"
  /charlie-moir-digital-engagement-local-government → "charlieMoir"
  /tools → "tools"
  /podcast → "podcast"
  /contact → "contact"
  /subscribe → "subscribe"

For DYNAMIC route components (/insights/:slug, /glossary/:slug, /facts/:slug, /about/leadership/:slug, /surrey/area-profile/:slug), use SEOHead with overrides that pull title and description from the loaded data:

  <SEOHead
    page="insights"  // or nearest static parent
    overrides={{
      title: `${article.title} | LGR Initiative`,
      description: article.excerpt || article.description,
      path: `/insights/${article.slug}`,
    }}
  />

Do NOT modify any existing component logic, styling, or data fetching. Only add the import and <SEOHead /> tag.

Confirm you're using BrowserRouter (not HashRouter). If using HashRouter, switch to BrowserRouter.
```

**Attach**: `src/seo.config.ts`, `src/components/SEOHead.tsx`

---

### Prompt 2 — Vite prerender config

```
Merge the prerender configuration from the attached vite.config.seo.ts into our existing vite.config.ts.

Key things:
- Keep all existing plugins and config
- Add the vitePrerenderPlugin with the full PRERENDER_ROUTES array (55 routes)
- Keep the postProcess hook that adds the x-prerendered meta tag
- renderAfterTime should be 3000 (for Supabase data to load)

Do NOT remove or change any existing config — only add the prerender plugin.
```

**Attach**: `vite.config.seo.ts`

---

### Prompt 3 — index.html meta tags

```
Add the fallback meta tags from the attached index-html-additions.html into the <head> of our index.html file.

Place them AFTER any existing meta tags but BEFORE the closing </head>.
Also ensure the <html> tag has lang="en-GB".

These are fallback tags that react-helmet-async will override at runtime and the prerender plugin will bake into static HTML at build time.
```

**Attach**: `index-html-additions.html`

---

### Prompt 4 — Build pipeline, robots, sitemap

```
1. Copy the attached robots.txt into public/robots.txt (replace if exists).

2. Copy the attached generate-sitemap.ts into the project root.

3. Update package.json build script to:
   "build": "vite build && npx tsx generate-sitemap.ts"

4. In generate-sitemap.ts, check the dynamicRouteConfigs array — the table names and slugColumn names need to match our Supabase schema. Update them if they don't match. The tables to check are:
   - articles (or whatever table serves /insights/:slug)
   - glossary_terms (or whatever serves /glossary/:slug)
   - facts (or whatever serves /facts/:slug)
   - leadership (or whatever serves /about/leadership/:slug)
   - surrey_profiles (or whatever serves /surrey/area-profile/:slug)

If a table doesn't exist, comment out that entry in dynamicRouteConfigs.

5. Merge the attached netlify.toml with our existing Netlify config. If we don't have one, use it as-is. Keep the existing _redirects file — both work together.
```

**Attach**: `public/robots.txt`, `generate-sitemap.ts`, `netlify.toml`

---

### Prompt 5 — Verify

```
Run a local build (npm run build) and check:

1. The dist/ folder contains pre-rendered HTML files for key routes (at minimum: index.html, about/index.html, what-is-lgr/index.html, surrey/index.html)
2. Those HTML files contain <title> tags with page-specific text (not just the default)
3. Those HTML files contain <meta name="description"> with page-specific text
4. Those HTML files contain <meta property="og:title">
5. Those HTML files contain <script type="application/ld+json">
6. dist/sitemap.xml exists and contains all routes
7. dist/robots.txt exists and references the sitemap

Report any issues found.
```

---

## After deploy

1. Submit sitemap at https://search.google.com/search-console (add property first if not done)
2. Submit sitemap at https://www.bing.com/webmasters
3. Run `bash verify-seo.sh` against the live URL
4. Use GSC "URL Inspection" on 3-4 key pages to confirm Google sees the pre-rendered HTML
