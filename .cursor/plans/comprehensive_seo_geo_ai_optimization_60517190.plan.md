---
name: Comprehensive SEO GEO AI Optimization
overview: "Complete SEO, GEO/local, and AI-search optimization across all pages: add missing structured data (BreadcrumbList, Dataset, Place/AdministrativeArea), enhance internal linking with theme/geography-based relationships (capped at 3-6 items), improve GEO optimization with crawlable location context, and optimize content structure for AI parsing. Includes validation requirements and content quality guardrails."
todos:
  - id: structured_data_breadcrumbs
    content: Create BreadcrumbStructuredData component and integrate into pages using Breadcrumbs
    status: completed
  - id: structured_data_dataset
    content: Create DatasetStructuredData component ONLY for pages with definable datasets (KeyFacts curated list)
    status: completed
  - id: structured_data_local
    content: Create LocalPlaceStructuredData component using Place/AdministrativeArea (NOT LocalBusiness) for GEO pages
    status: completed
  - id: structured_data_collection
    content: Create CollectionPageStructuredData for listing pages (Insights, Materials, Facts)
    status: completed
  - id: structured_data_author
    content: Create AuthorStructuredData component and update ArticleStructuredData
    status: completed
  - id: fix_article_datemodified
    content: Fix ArticleStructuredData to use updated_at field for dateModified
    status: completed
  - id: enhance_related_content
    content: Create smart RelatedContent component with theme/geography-based matching (cap to 3-6 items per block)
    status: completed
  - id: content_relations_utility
    content: Create contentRelations.ts utility to map content relationships
    status: completed
  - id: add_related_sections
    content: Add Related Content sections to ArticleView, Article, KeyFacts, Lessons, Materials pages
    status: completed
    dependencies:
      - enhance_related_content
      - content_relations_utility
  - id: geo_crawlable_context
    content: Add crawlable location context to Councils page (lists, descriptions, not just map)
    status: completed
  - id: surrey_geo_optimization
    content: Enhance Surrey page with Place/AdministrativeArea schema (NOT LocalBusiness) and location-specific content
    status: completed
    dependencies:
      - structured_data_local
  - id: council_profile_geo
    content: Add Place structured data to CouncilProfileDetail pages
    status: completed
    dependencies:
      - structured_data_local
  - id: semantic_html
    content: Add semantic HTML (article, section, time, address tags) to all pages while maintaining accessibility
    status: completed
  - id: sitemap_enhancement
    content: Update sitemap generator to include all dynamic routes from database
    status: completed
  - id: canonical_improvements
    content: Review and improve canonical URL handling in MetaTags component
    status: completed
  - id: validate_structured_data
    content: Validate all structured data using Google Rich Results Test and schema.org validator
    status: pending
    dependencies:
      - structured_data_breadcrumbs
      - structured_data_dataset
      - structured_data_local
      - structured_data_collection
      - structured_data_author
  - id: accessibility_testing
    content: Test accessibility and UX after adding new sections (headings, semantic HTML, responsive layout)
    status: pending
    dependencies:
      - semantic_html
      - add_related_sections
---

# Comprehensive SEO + GEO + AI Optimization Plan

## Current State Analysis

**Strengths:**

- MetaTags component with canonical URLs, OG tags, Twitter cards
- Article, Organization, WebSite, FAQPage structured data
- RelatedArticles component (basic implementation)
- Breadcrumbs component (no structured data)
- robots.txt configured for AI crawlers
- Sitemap.xml exists

**Gaps Identified:**

1. Missing BreadcrumbList structured data
2. No Dataset structured data for KeyFacts (curated dataset page only)
3. No LocalBusiness/Place structured data for GEO
4. Internal linking is basic (only recent articles, no theme/geography matching)
5. Map pages lack crawlable location context
6. Materials don't link to related articles/facts
7. Article structured data missing dateModified (uses datePublished)
8. No CollectionPage structured data for listing pages
9. Missing author Person structured data
10. Content structure could be more AI-friendly

## Implementation Plan

### Phase 1: Structured Data Enhancements

#### 1.1 BreadcrumbList Structured Data

- **File**: `src/components/BreadcrumbStructuredData.tsx` (new)
- Add BreadcrumbList JSON-LD component
- Integrate into pages using Breadcrumbs component
- Update: `src/components/Breadcrumbs.tsx` to accept structured data props
- Apply to: ArticleView, Article, FactDetail, CouncilProfileDetail, Materials detail pages

#### 1.2 Dataset Structured Data for Facts

- **File**: `src/components/DatasetStructuredData.tsx` (new)
- **GUARDRAIL**: Only use Dataset schema where page clearly presents a definable dataset (curated facts list, downloadable data)
- **SCOPE**: Apply Dataset STRICTLY to:
- `src/pages/facts/KeyFacts.tsx` (curated facts collection - clearly a dataset)
- Future: Any pages with clearly tabular/downloadable datasets (not generic article lists)
- Do NOT apply to:
- Generic text pages
- Article listings (use CollectionPage instead)
- Material listings (use CollectionPage instead)
- Generic content pages
- Include: name, description, keywords, creator, datePublished, distribution
- Ensure dataset is clearly identifiable as structured data, not just text content
- **FUTURE CONSIDERATION**: Consider adding `is_dataset` flag to content metadata later to drive Dataset schema expansion by data rather than page path alone

#### 1.3 LocalBusiness/Place for GEO Pages

- **File**: `src/components/LocalPlaceStructuredData.tsx` (new)
- **GUARDRAIL**: Use LocalBusiness ONLY where there is a real organisation offering services at/for that location
- For LGR Series: Use Place/AdministrativeArea schema instead (we're a research publication, not a service provider)
- Add Place schema for:
- Council profiles (`src/pages/CouncilProfileDetail.tsx`) - use AdministrativeArea
- Surrey region page (`src/pages/Surrey.tsx`) - use Place with AdministrativeArea
- Councils map (`src/pages/Councils.tsx`) - use Place for regions
- Include: address, geo coordinates, areaServed, containedInPlace
- Do NOT use LocalBusiness unless explicitly representing a service business

#### 1.4 CollectionPage for Listing Pages

- **File**: `src/components/CollectionPageStructuredData.tsx` (new)
- Add CollectionPage schema for Insights, Materials, Facts listing pages
- Include: numberOfItems, mainEntity (ItemList)
- Apply to: `src/pages/Insights.tsx`, `src/pages/Materials.tsx`, `src/pages/Facts.tsx`

#### 1.5 Author Person Structured Data

- **File**: `src/components/AuthorStructuredData.tsx` (new)
- Create Person schema for authors
- **DATA SOURCE**: Author data comes from:
- **Materials**: `materials.author` field (string) or `materials.author_name` field (both exist in schema)
- **Articles**: Check if `articles` table has `author` or `author_name` fields (may need to verify schema or add migration)
- **Fallback strategy**: If author field is missing or empty:
- Use "LGR Series Editorial Team" (organization name)
- Or "Coalface Engagement" (publisher name)
- **CRITICAL**: Do NOT invent or auto-generate author names when data is missing
- Do NOT create fake Person objects with made-up names
- Use actual author data from database, or use Organization as author fallback
- **Implementation**: Check Article interface in ArticleView.tsx - currently hardcodes "Local Government Reorganisation", needs to use database field or fallback
- Update ArticleStructuredData to use proper Person objects
- Update: `src/components/ArticleStructuredData.tsx`

#### 1.6 Fix Article dateModified

- **File**: `src/components/ArticleStructuredData.tsx`
- Use `updated_at` field when available, fallback to `published_date`
- Update ArticleView and Article pages to pass updated_at

### Phase 2: Enhanced Internal Linking

#### 2.1 Smart Related Content Component

- **File**: `src/components/RelatedContent.tsx` (new)
- Replace/enhance RelatedArticles with theme/geography-based matching
- **GUARDRAIL**: Cap automated related links to 3-6 per block to avoid clutter and over-optimisation
- Query Supabase for articles/materials matching:
- Same theme (governance, planning, finance, etc.)
- Same geography (Surrey, National, etc.)
- Related LGR phase
- Shared keywords/tags
- Limit results: max 3-4 articles, max 2 materials, max 2 facts/lessons per section
- Include links to related facts, lessons, interviews
- Apply to: ArticleView, Article, Materials detail pages

#### 2.2 Topic Cluster Links

- **File**: `src/lib/contentRelations.ts` (new)
- Create utility to map content relationships:
- Articles → Related facts
- Facts → Related articles/lessons
- Materials → Related articles by theme/geography
- Lessons → Related articles/case studies
- Add "Related Content" sections to:
- `src/pages/ArticleView.tsx`
- `src/pages/Article.tsx`
- `src/pages/facts/KeyFacts.tsx`
- `src/pages/Lessons.tsx`
- `src/pages/Materials.tsx` (detail view)

#### 2.3 Cross-Reference Links in Content

- Add inline contextual links within article/material body content
- Use React Router Links (not raw `<a>` tags)
- Link to related facts, lessons, council profiles where relevant
- Ensure links are semantic and contextually relevant

### Phase 3: GEO/Local Optimization

#### 3.1 Crawlable Location Context

- **File**: `src/pages/Councils.tsx`
- Add descriptive text above/below map with:
- List of all councils covered
- Geographic regions (England, Scotland, Wales, NI)
- Reorganisation status by region
- Plain HTML lists (not just map tiles)
- Add location-specific meta descriptions

#### 3.2 Surrey Local Optimization

- **File**: `src/pages/Surrey.tsx`
- Enhance with:
- Council names in headings/descriptions
- District names in content
- Local landmarks/regions
- Surrey-specific keywords naturally integrated
- Add Place structured data (AdministrativeArea for Surrey region, NOT LocalBusiness)

#### 3.3 Council Profile GEO Enhancement

- **File**: `src/pages/CouncilProfileDetail.tsx`
- Add Place structured data with:
- Address (from surreyCouncils data)
- Geo coordinates
- Area served
- ContainedInPlace (Surrey, UK)
- Add location-specific content sections
- Include related councils in same unitary

#### 3.4 Location Pages

- Consider creating location-focused pages:
- "Surrey Council Reorganisations"
- "Local Government Hubs in Surrey"
- Use geography field from materials to auto-generate

### Phase 4: AI-Search Optimization

#### 4.1 Content Structure Improvements

- Ensure all pages have:
- Clear H1 (already done)
- Logical H2-H3 hierarchy
- Short, scannable paragraphs
- Bullet lists for key points
- Tables for structured data
- FAQs near top where relevant

#### 4.2 Semantic HTML Enhancements

- **Files**: All page components
- Add `<article>` tags for article content
- Add `<section>` tags with aria-labels
- Use `<time>` elements for dates
- Add `<address>` for location data
- Ensure proper heading hierarchy

#### 4.3 Enhanced Meta Descriptions

- Review all MetaTags descriptions
- Ensure they:
- Answer "what is this page about?"
- Include primary keyword naturally
- Are 25-160 characters (already fixed)
- Are unique per page

#### 4.4 Content Depth & Originality

- Review article/material content for:
- Expert-level insights (not generic)
- Concrete examples and case studies
- Original analysis
- Clear, factual language
- **GUARDRAIL**: When adding "Key Takeaways" and "Evidence" sections:
- MUST summarise real content and sources from the article/material
- MUST NOT use generic AI-generated text
- MUST NOT auto-generate fake citations or statistics
- Only add these sections if the content actually contains takeaways/evidence
- Use actual sources from the content (citations, data sources, case studies)
- Add "Key Takeaways" sections only where content naturally supports it
- Add "Evidence" sections only where real sources/citations exist

### Phase 5: Technical SEO

#### 5.1 Sitemap Enhancement

- **File**: `scripts/generate-sitemap.js`
- Ensure all dynamic routes are included:
- Individual articles (from articles table)
- Individual materials (from materials table)
- Fact detail pages
- Council profiles
- Add lastmod dates from database
- Add priority based on content type

#### 5.2 Canonical URL Improvements

- **File**: `src/components/MetaTags.tsx`
- Ensure canonical URLs:
- Remove query parameters
- Use HTTPS
- Match actual page URLs
- Handle trailing slashes consistently

#### 5.3 Image Optimization & Alt Text

- Review all images for:
- Descriptive alt text
- Proper file names
- Structured data (ImageObject in Article schema)
- Ensure OptimizedImage component includes alt text

### Phase 6: Content Model Optimization

#### 6.1 Article/Material Slug Optimization

- Ensure slugs are:
- Descriptive (include keywords)
- Stable (don't change)
- SEO-friendly (lowercase, hyphens)
- Review existing slugs for improvement opportunities

#### 6.2 Excerpt/Description Quality

- Review all excerpts for:
- Clear value proposition
- Primary keywords
- Compelling summaries
- 25-160 character length

#### 6.3 Keyword Integration

- Natural keyword usage in:
- Titles
- Headings
- First paragraph
- Meta descriptions
- Avoid keyword stuffing
- Focus on user intent

## Files to Create/Modify

### New Components

1. `src/components/BreadcrumbStructuredData.tsx`
2. `src/components/DatasetStructuredData.tsx`
3. `src/components/LocalPlaceStructuredData.tsx`
4. `src/components/CollectionPageStructuredData.tsx`
5. `src/components/AuthorStructuredData.tsx`
6. `src/components/RelatedContent.tsx` (enhanced)

### New Utilities

7. `src/lib/contentRelations.ts`

### Files to Modify

8. `src/components/Breadcrumbs.tsx` - Add structured data
9. `src/components/ArticleStructuredData.tsx` - Fix dateModified, add author Person
10. `src/components/RelatedArticles.tsx` - Enhance with theme/geography matching
11. `src/pages/ArticleView.tsx` - Add RelatedContent, BreadcrumbList
12. `src/pages/Article.tsx` - Add RelatedContent, BreadcrumbList
13. `src/pages/Insights.tsx` - Add CollectionPage structured data
14. `src/pages/Materials.tsx` - Add CollectionPage, RelatedContent
15. `src/pages/Facts.tsx` - Do NOT add Dataset (this is a listing page, use CollectionPage instead)
16. `src/pages/facts/KeyFacts.tsx` - Add Dataset, RelatedContent
17. `src/pages/Surrey.tsx` - Add Place/AdministrativeArea structured data (NOT LocalBusiness), enhance GEO content
18. `src/pages/Councils.tsx` - Add crawlable location context, Place schema
19. `src/pages/CouncilProfileDetail.tsx` - Add Place structured data
20. `src/pages/Lessons.tsx` - Add RelatedContent
21. `scripts/generate-sitemap.js` - Include all dynamic routes

## Success Metrics

- All pages have appropriate structured data (validated via Google Rich Results Test)
- Internal linking creates clear topic clusters (3-6 links per block)
- GEO pages have Place/AdministrativeArea schema (not LocalBusiness)
- Content is crawlable and AI-parseable
- No duplicate content issues
- All meta tags optimized
- Sitemap includes all content
- All structured data passes schema.org validation
- No accessibility regressions
- No layout/UX regressions

## Guardrails & Validation

### Schema Validation

- **VALIDATION WORKFLOW**: 
- Validate a sample of each new schema type in Rich Results and schema.org tools in a feature branch BEFORE rolling out across all pages
- This catches edge-case JSON-LD issues early (invalid properties, missing required fields, type mismatches)
- Test one representative page per schema type first (e.g., one article with BreadcrumbList, one facts page with Dataset)
- Only proceed with full rollout after validation passes
- Validation tools:
- Google's Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Test all new structured data components before wide rollout
- Ensure JSON-LD is valid JSON and follows schema.org specifications
- Fix any validation errors before deploying to production

### Accessibility & UX

- When adding new sections (Key Takeaways, Evidence, FAQs):
- Maintain accessible heading hierarchy (H2, H3, etc.)
- Use semantic HTML (`<section>`, `<article>`, etc.)
- Ensure proper ARIA labels where needed
- Avoid layout regression in Tailwind layouts
- Test responsive design on mobile/tablet/desktop

### Change Discipline

- **Prefer introducing new components/props over rewriting existing logic**
- Add new structured data components alongside existing ones
- Extend RelatedArticles component rather than replacing it entirely
- Use optional props to maintain backward compatibility
- Test existing pages after changes to ensure no regressions

### Content Quality Guardrails

- **FORBID**: Auto-generating fake citations or statistics
- **REQUIRE**: Real content sources for Evidence sections
- **REQUIRE**: Actual takeaways from content for Key Takeaways sections
- Only add enhancement sections where content naturally supports them
- Maintain editorial quality and human expertise

### Internal Linking Limits

- Cap related content blocks to 3-6 items maximum
- Prioritize relevance over quantity
- Avoid over-optimisation signals
- Ensure links are contextually relevant and useful to users

## Implementation Order

1. **Structured data components (Phase 1)** - with validation workflow (test samples in feature branch first)
2. **Internal linking enhancements (Phase 2)** - with limits (3-6 items per block)
3. **GEO optimization (Phase 3)** - using Place/AdministrativeArea (NOT LocalBusiness)
4. **AI optimization (Phase 4)** - with content quality guardrails (real sources only)
5. **Technical SEO (Phase 5)**
6. **Content model review (Phase 6)**

## Critical Implementation Notes

### Author Data Handling

- Verify articles table schema for author fields before implementing AuthorStructuredData
- If articles table lacks author fields, consider:
- Adding migration to add `author` and/or `author_name` fields
- Or using Organization as author for all articles (acceptable for editorial content)
- Never auto-generate or invent author names
- Always use database fields or organization fallback

### Dataset Scope Enforcement

- Dataset schema ONLY for `src/pages/facts/KeyFacts.tsx` (curated facts collection)
- Do NOT apply Dataset to `src/pages/Facts.tsx` (listing page - use CollectionPage)
- Future Dataset expansion should be driven by `is_dataset` flag in content metadata, not page paths

### Validation Workflow

- Create feature branch for structured data work
- Implement one schema type at a time
- Validate sample page in Google Rich Results Test and schema.org validator
- Fix any validation errors before proceeding
- Only roll out to all pages after validation passes
- This prevents widespread JSON-LD errors from edge cases