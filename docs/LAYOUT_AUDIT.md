# Layout consistency audit – page inventory, templates, changelog

## 1. Design system (global)

- **Max width**: `--layout-max-width: 80rem` (1280px). Applied via `.layout-container`.
- **Gutters**: `--layout-gutter-mobile: 1rem`, `--layout-gutter-tablet: 1.5rem`, `--layout-gutter-desktop: 2rem` (breakpoints 640px, 1024px).
- **Section spacing**: `--section-spacing: 2.5rem` between sections; `--section-spacing-lg: 3rem` for hub main content block vertical padding; `--subpage-content-py: 2rem` for sub pages.
- **Breakpoints**: sm 640px, md 768px, lg 1024px, xl 1280px (Tailwind + CSS vars in `@theme`).
- **Typography**: Existing `@layer base` and `.academic-prose` unchanged; headings and body use existing scale.
- **Components**: Cards use `.academic-card`; buttons use `.academic-button`, `.academic-button-primary`, `.academic-button-secondary`, `.academic-button-outline`; section headings use consistent `text-academic-2xl` / `font-display font-bold text-academic-charcoal`.

---

## 2. Templates

### Hub template

- **Use for**: Section landing pages that list sub-pages and pathways (Learn, Discover, Research, About, Tools, Insights, Topics, LGR Hub, Lessons, Facts & Data).
- **Structure (module order)**:
  1. Full-width `PageBanner` (hero label, title, subtitle).
  2. `ContentContainer` (variant `hub`) wrapping:
     - Intro section: one `.academic-card` with short paragraph.
     - (Optional) “Not sure where to begin?” section: `layout-pathway-grid` with 3 links.
     - Main content: card grid (`.layout-card-grid`) or custom block (e.g. LGR Hub service cards, Insights article grid, Topics theme cards).
     - (Optional) CTA block (e.g. newsletter, “Explore more”).
  3. `FAQSection` (same slug as page).
- **Classes**: `layout-container layout-content-hub` (or `<ContentContainer variant="hub">`), `layout-section` between sections, `layout-card-grid` / `layout-pathway-grid` for grids.

### Subject template

- **Use for**: Same as hub in this codebase; “subject” and “hub” both use the hub template (section landing with intro, pathway, cards, FAQ).
- **Structure**: Identical to hub template.

### Sub-page template

- **Use for**: Content pages under a section (e.g. Methodology, What is LGR, Contact, Coalface).
- **Structure**:
  1. Full-width `PageBanner`.
  2. (Optional) Back / nav strip with `data-page-nav` (subject pages with sidebar).
  3. Main content in `layout-container layout-content-sub` (or `<ContentContainer variant="sub">`): prose, cards, or custom layout.
  4. (Optional) `FAQSection`.
- **Classes**: `layout-container layout-content-sub` for the main content wrapper.

---

## 3. Page inventory and template used

| Route | Template | Page / component |
|-------|----------|-------------------|
| `/` | Hub | Home.tsx |
| `/learn` | Hub | Learn.tsx |
| `/discover` | Hub | Discover.tsx |
| `/research` | Hub | Research.tsx |
| `/about` | Hub | AboutHub.tsx |
| `/lessons` | Hub | Lessons.tsx |
| `/tools` | Hub | Tools.tsx |
| `/insights` | Hub | Insights.tsx |
| `/topics` | Hub | Topics.tsx |
| `/lgr-hub` | Hub | LGRHub.tsx |
| `/facts-and-data` | Hub | FactsAndData.tsx |
| `/surrey/hub` | Special | SurreyHub.tsx (password-protected app shell; not standard hub) |
| `/library` | Sub | Search.tsx |
| `/what-is-lgr` | Sub (sidebar) | WhatIsLGR.tsx |
| `/beginners-guide` | Sub | BeginnersGuide.tsx |
| `/questions-and-answers` | Sub | QuestionsAndAnswers |
| `/glossary` | Sub | app/glossary/page |
| `/glossary/:slug` | Sub | app/glossary/[slug]/page.tsx |
| `/first-100-days` | Sub | HundredDays.tsx |
| `/roadmap` | Sub | JourneyMap.tsx |
| `/about/overview` | Sub | AboutOverview.tsx |
| `/about/methodology` | Sub | Methodology.tsx |
| `/about/contribute` | Sub | Contribute.tsx |
| `/about/coalface` | Sub | Coalface.tsx |
| `/about/contributors` | Sub | Contributors.tsx |
| `/about/leadership` | Sub | Leadership.tsx |
| `/about/leadership/:slug` | Sub | LeadershipBio.tsx |
| `/partnerships` | Sub | Partnerships.tsx |
| `/contact` | Sub | Contact.tsx |
| `/subscribe` | Sub | Subscribe.tsx |
| `/podcast` | Sub | Interviews.tsx |
| `/surrey` | Sub | Surrey.tsx |
| `/surrey/election-tracker` | Sub | SurreyElectionTracker.tsx |
| `/surrey/election-tracker/simulator` | Sub | SurreyElectionSimulator.tsx |
| `/facts/key-facts` | Sub | facts/KeyFacts.tsx |
| `/facts/timescales` | Sub | Timescales |
| `/facts/councils-involved` | Sub | CouncilsInvolved |
| `/facts/methodology` | Sub | facts/Methodology (redirect / about) |
| `/facts/sources` | Sub | Sources |
| `/facts/further-reading` | Sub | FurtherReading.tsx |
| `/facts/councilopedia` | Sub | Councilopedia |
| `/facts/lgr-timeline` | Sub | LGRTimeline.tsx |
| `/facts/council-cases` | Sub | CouncilCases.tsx |
| `/facts/:slug` | Sub | FactDetail.tsx |
| `/lessons/insights` | Sub | lessons/Insights.tsx |
| `/lessons/case-studies` | Sub | lessons/CaseStudies.tsx |
| `/lessons/best-practices` | Sub | lessons/BestPractices.tsx |
| `/reasons` | Sub | Reasons.tsx |
| `/reorganisations` | Sub | Reorganisations.tsx |
| `/topics/:slug` | Sub | TopicHub.tsx |
| `/insights/reports` | Sub | insights/Reports.tsx |
| `/insights/:slug` | Sub | ArticleView.tsx |
| `/councils` | Special | Councils |
| `/council-profiles` | Sub | CouncilProfiles |
| `/council-profiles/:slug` | Sub | CouncilProfileDetail.tsx |
| `/news` | Sub | News.tsx |
| `/editor/rowan-cole` | Redirect | → about/leadership/rowan-cole |
| Admin, 404, etc. | Special | Various |

---

## 4. Changelog

### Design tokens and layout classes (`src/index.css`)

- **Added** in `@theme`: `--layout-max-width`, `--layout-gutter-mobile`, `--layout-gutter-tablet`, `--layout-gutter-desktop`, `--section-spacing`, `--section-spacing-lg`, `--subpage-content-py`, `--breakpoint-*`.
- **Added** utility classes:
  - `.layout-container` – max-width 80rem, horizontal gutters by breakpoint.
  - `.layout-content-hub` – vertical padding for hub main content.
  - `.layout-content-sub` – vertical padding for sub pages.
  - `.layout-section` – consistent margin-bottom between sections.
  - `.layout-card-grid` – 1 / 2 / 3 columns at mobile / md / lg.
  - `.layout-pathway-grid` – 1 / 3 columns at mobile / sm.

### Layout components (`src/components/layout/`)

- **Added** `ContentContainer.tsx` – wrapper with `layout-container` and `layout-content-hub` or `layout-content-sub` by variant.
- **Added** `HubSection.tsx` – section wrapper with `layout-section` and optional heading.
- **Added** `index.ts` exporting layout components.

### Root layout (`src/components/PageLayout.tsx`)

- **Changed** hub/special paths: no longer wrap in a div; they render `<Outlet />` only so each page owns its container.
- **Changed** sidebar layout: outer wrapper now uses `layout-container` instead of `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

### Hub pages (consistent module order and layout)

- **LGRHub.tsx**: Added intro card; content wrapped in `<ContentContainer variant="hub">`; sections use `layout-section`; newsletter CTA in `layout-section`.
- **Learn.tsx**, **AboutHub.tsx**, **Discover.tsx**, **Research.tsx**, **Tools.tsx**: Switched to `<ContentContainer variant="hub">`; intro and “Not sure where to begin?” and “All pages” use `layout-section`; pathway grid uses `layout-pathway-grid`; card grid uses `layout-card-grid`.
- **Insights.tsx**: Added intro card; content in `<ContentContainer variant="hub">`; article grid uses `layout-card-grid` (with gap override where needed).
- **Topics.tsx**: Content in `<ContentContainer variant="hub">`; theme and “Explore more” sections use `layout-section`.
- **FactsAndData.tsx**, **Leadership.tsx**, **Lessons.tsx**: Main content wrapper updated to `layout-container layout-content-hub`.

### Sub and other pages

- All remaining pages that used `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (with or without `py-6` / `py-8` / `py-12`) now use:
  - `layout-container layout-content-hub` where vertical padding was `py-12`,
  - `layout-container layout-content-sub` where vertical padding was `py-6` or `py-8`,
  - or `layout-container` only where no vertical padding was applied.
- **Methodology**, **Coalface**, **Contribute**, **Contributors**, **AboutOverview**, **Contact**, **Partnerships**, **About**, **Editor/RowanCole**, **News**, **CouncilProfileDetail**, **BestPractices**, **CaseStudies**, **Insights** (lessons), **Facts**, **Subscribe**, **Surrey**, **Reasons**, **CouncilCases**, **KeyFacts**, **FurtherReading**, **LGRTimeline**, **WhatIsLGR** (back strip only), **BeginnersGuide**, **Materials**, **Reorganisations**, **HundredDays**, **Interviews**, **JourneyMap**, **Search**, **SurreyElectionTracker**, **SurreyElectionSimulator**, **Reports**, **TopicHub**, **Glossary term page**: updated to use `layout-container` and, where appropriate, `layout-content-sub` or `layout-content-hub`.

### Global components

- **PageBanner.tsx**, **Footer.tsx**, **Navigation.tsx**: Inner content divs that had `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` now use `layout-container` so the whole site shares the same max-width and gutters.

### Responsive and components

- **Breakpoints**: No change; existing Tailwind breakpoints and new CSS vars are used.
- **Cards**: Continue to use `.academic-card`; `service-card-header` height unchanged.
- **Buttons**: No change; existing `.academic-button-*` classes kept.
- **FAQSection**: Still uses `max-w-4xl` for FAQ content width (readability); no change.

---

## 5. Summary

- **One global grid**: All content and chrome use `--layout-max-width` and the same gutters via `.layout-container`.
- **Three conceptual templates**: Hub (section landing with intro, pathway, cards, FAQ), Subject (same as hub here), Sub (content page with optional back link and prose/cards).
- **Module order**: Hub pages follow the same order (banner → intro → pathway → main content → optional CTA → FAQ); LGR Hub and Insights aligned with intro + main block + FAQ.
- **Consistency**: Widths, gutters, section padding, and card/pathway grids are driven by shared layout classes and tokens; buttons and cards remain from the existing component library.
