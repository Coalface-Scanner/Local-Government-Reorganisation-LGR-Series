# Prerender Fix — Cursor Agent Prompt

Paste this into Cursor:

---

The vite prerender step is timing out with `Navigation timeout of 30000 ms exceeded`. Three things need fixing:

## 1. Update the vitePrerenderPlugin config in vite.config.ts

Replace the current vitePrerenderPlugin options with the config from the attached `vite.config.seo.ts`. The key changes are:
- Add `maxConcurrentRoutes: 2` (stops all 55 routes loading in parallel)
- Change renderer timeout to `60000` (was 30000 default)
- Change `renderAfterTime` to `5000` (was 3000)
- Add Puppeteer args: `headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"]`

Keep the existing PRERENDER_ROUTES array and postProcess hook — just update the options.

## 2. Add the prerender utility

Copy the attached `src/utils/prerender.ts` into `src/utils/prerender.ts`.

## 3. Wrap Supabase calls in page components with prerenderSafe

This is the actual root cause — Supabase calls hang during prerender, preventing the page from ever finishing loading.

Find every page component that fetches data from Supabase on mount (useEffect, useQuery, or similar). In each one, wrap the Supabase call with `prerenderSafe` from `src/utils/prerender.ts`.

Before:
```tsx
const { data } = await supabase.from("articles").select("*").eq("slug", slug).single();
```

After:
```tsx
import { prerenderSafe } from "@/utils/prerender";

const { data } = await prerenderSafe(
  supabase.from("articles").select("*").eq("slug", slug).single(),
  { data: null, error: null }
);
```

The fallback value should match the shape of what the Supabase call normally returns (usually `{ data: null, error: null }` for `.single()` or `{ data: [], error: null }` for `.select()`).

This ensures pages render quickly during prerender even if Supabase is slow or unreachable, while behaving normally for real users.

Do NOT change any rendering logic, conditional displays, or loading states. Only wrap the Supabase call itself.

## 4. Test

Run `npm run build` and confirm:
- No timeout errors in the build output
- Pre-rendered HTML files appear in dist/ for key routes (/, /what-is-lgr, /surrey, /about)
- Those HTML files contain `<meta name="x-prerendered" content="true" />`

---

Attach: `vite.config.seo.ts`, `src/utils/prerender.ts`
