# Page loading and routing

This doc describes how pages load in the app so changes (e.g. by another builder) don’t break routing or show the wrong content.

## 1. Load sequence

1. **`index.html`** – Root div `#root` and script `/src/main.tsx`.
2. **`main.tsx`** – Mounts `AdminAuthProvider` → `App` (with `ErrorBoundary` → `BrowserRouter` → `AuthProvider` → `AppContent`).
3. **`App.tsx`** – `AppContent` renders:
   - SkipLink, KeyboardShortcuts
   - `<main>`: `Suspense` (fallback `PageLoader`) → `SidebarTocProvider` → **`Routes`**
   - StayInformedBanner, Footer, CookieBanner, BackToTop, ScrollToTop
4. **Routes** – All main routes sit under a single **layout route** whose element is **`PageLayout`**.
5. **`PageLayout`** – Must render:
   - **`Navigation`** (global header/nav bar) – if this is removed, the site has no header and looks broken.
   - **`<Outlet />`** – the matched child route (Home, Learn, Discover, etc.).

So for every URL, the screen is: **Navigation** + **page component** (from `Outlet`) + **Footer/banners** (from `AppContent`).

## 2. Critical rule: keep Navigation in PageLayout

**`src/components/PageLayout.tsx`** must:

- Import and render **`Navigation`** with `onNavigate` and `currentPage` (from `useLocation` / `useNavigate`).
- Render **`<Outlet />`** so the matched route component appears.

If `PageLayout` is emptied or only returns `<Outlet />`, pages will “load” but with **no header/nav**, so the app looks wrong or “incorrect content”. Do not remove `Navigation` from `PageLayout`.

## 3. Route structure (App.tsx)

- **One parent route** with `element={<PageLayout />}` and **nested** child routes.
- **Order matters**: more specific paths must come before parametric ones, e.g.:
  - `/insights/reports` before `/insights/:slug`
  - `/facts/key-facts`, `/facts/council-cases`, etc. before `/facts/:slug`
- **Redirects** use `<Navigate to="..." replace />` (e.g. `/article/:slug` → `/insights/:slug`, `/materials` → `/library`).
- **Catch-all** `path="*"` must stay last (`element={<NotFound />}`).

## 4. Lazy loading

Pages are loaded via `lazy(() => import('./pages/...'))`. The **first** route match triggers that chunk load; `Suspense` shows `PageLoader` until the component is ready. Don’t remove the `Suspense` wrapper or the fallback or lazy-loaded routes may flash or fail.

## 5. Parametric routes

These use `useParams()` to read the URL param; the component must stay the route element:

- `/facts/:slug` → `FactDetail`
- `/insights/:slug` → `ArticleViewWrapper` → `ArticleView`
- `/about/leadership/:slug` → `LeadershipBio`
- `/council-profiles/:slug` → `CouncilProfileDetail`
- `/glossary/:slug` → `GlossaryTermWrapper` → `GlossaryTerm` (from `src/app/glossary/[slug]/page.tsx`)

## 6. Quick checklist after edits

- [ ] `PageLayout` still renders **Navigation** and **Outlet**.
- [ ] No new route placed **after** a more general one (e.g. no `/insights/:slug` before `/insights/reports`).
- [ ] Redirect routes still use `<Navigate replace />`.
- [ ] `path="*"` remains the last route.
