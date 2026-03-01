// src/utils/prerender.ts
// ============================================================
// Helpers for making Supabase calls prerender-safe.
//
// The problem: during prerender, Puppeteer loads your pages
// against a local Vite preview server. Supabase calls may
// hang or fail because:
//   - Network conditions differ in the build environment
//   - Many pages loading simultaneously saturate connections
//   - Supabase rate limits may kick in
//
// Solution: wrap data-fetching calls with a timeout so pages
// always render (with or without data). The SEO meta tags
// from SEOHead are the critical part — they don't need
// Supabase data.
// ============================================================

/**
 * Detect if we're in a prerender environment.
 * vite-plugin-prerender-k sets this on the window.
 */
export function isPrerendering(): boolean {
  return (
    typeof window !== "undefined" &&
    // @ts-expect-error - set by prerender plugin
    (window.__PRERENDER_INJECTED !== undefined ||
      navigator.userAgent.includes("HeadlessChrome"))
  );
}

/**
 * Wrap a promise with a timeout. If the promise doesn't resolve
 * in `ms` milliseconds, returns the fallback value instead of
 * hanging forever.
 *
 * Usage in your data-fetching hooks:
 *
 *   const { data } = await withTimeout(
 *     supabase.from("articles").select("*").eq("slug", slug).single(),
 *     3000,
 *     { data: null, error: null }
 *   );
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * Shorter timeout specifically during prerender.
 * Normal browsing gets the full wait; prerender gets 2s max.
 *
 * Usage:
 *   const { data } = await prerenderSafe(
 *     supabase.from("articles").select("*"),
 *     { data: [], error: null }
 *   );
 */
export async function prerenderSafe<T>(
  promise: Promise<T>,
  fallback: T
): Promise<T> {
  const timeout = isPrerendering() ? 2000 : 30000;
  return withTimeout(promise, timeout, fallback);
}
