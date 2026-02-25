# SEO Structured Data Validation Checklist

This document provides a checklist for validating all structured data implementations using Google Rich Results Test and schema.org validator.

## Validation Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/

## Pages to Validate

### 1. Article Pages (Article Schema)

**Test Pages:**
- `/insights/[any-article-slug]` - ArticleView page
- `/article/[any-material-slug]` - Article (Materials) page

**Expected Structured Data:**
- ✅ Article schema with headline, description, author (Person or Organization)
- ✅ BreadcrumbList schema
- ✅ Publisher Organization schema
- ✅ datePublished and dateModified

**Validation Steps:**
1. Enter article URL in Google Rich Results Test
2. Verify Article schema appears
3. Check author type (Person vs Organization)
4. Verify breadcrumbs appear
5. Test in schema.org validator

---

### 2. Fact Detail Pages (Article Schema)

**Test Page:**
- `/facts/[fact-slug]` - FactDetail page

**Expected Structured Data:**
- ✅ Article schema
- ✅ BreadcrumbList schema

**Validation Steps:**
1. Enter fact detail URL
2. Verify Article schema
3. Check breadcrumbs

---

### 3. Listing Pages (CollectionPage Schema)

**Test Pages:**
- `/insights` - Insights listing
- `/materials` - Materials listing
- `/facts` - Facts listing

**Expected Structured Data:**
- ✅ CollectionPage schema
- ✅ ItemList with numberOfItems
- ✅ mainEntity array

**Validation Steps:**
1. Enter listing page URL
2. Verify CollectionPage schema appears
3. Check numberOfItems matches actual count
4. Verify mainEntity array structure

---

### 4. Key Facts Page (Dataset Schema)

**Test Page:**
- `/facts/key-facts` - KeyFacts page

**Expected Structured Data:**
- ✅ Dataset schema (NOT CollectionPage)
- ✅ name, description, keywords
- ✅ creator Organization
- ✅ datePublished

**Validation Steps:**
1. Enter KeyFacts URL
2. Verify Dataset schema (not CollectionPage)
3. Check dataset properties are complete
4. Verify creator information

---

### 5. GEO/Location Pages (Place/AdministrativeArea Schema)

**Test Pages:**
- `/surrey` - Surrey page
- `/councils` - Councils map page
- `/council-profiles/[council-slug]` - CouncilProfileDetail page

**Expected Structured Data:**
- ✅ Place or AdministrativeArea schema
- ✅ address (PostalAddress)
- ✅ containedInPlace
- ✅ areaServed array

**Validation Steps:**
1. Enter location page URL
2. Verify Place/AdministrativeArea schema
3. Check address structure
4. Verify NOT using LocalBusiness (correct for this site)

---

### 6. Home Page (Organization & WebSite Schema)

**Test Page:**
- `/` - Home page

**Expected Structured Data:**
- ✅ Organization schema
- ✅ WebSite schema
- ✅ FAQPage schema (if FAQs exist)

**Validation Steps:**
1. Enter home page URL
2. Verify Organization schema
3. Verify WebSite schema
4. Check FAQPage if FAQs are present

---

### 7. FAQ Pages (FAQPage Schema)

**Test Pages:**
- Any page with FAQSection component (home, facts, lessons, etc.)

**Expected Structured Data:**
- ✅ FAQPage schema
- ✅ mainEntity array of Questions
- ✅ Each Question has acceptedAnswer

**Validation Steps:**
1. Enter page URL with FAQs
2. Verify FAQPage schema appears
3. Check mainEntity array structure
4. Verify Question/Answer pairs

---

## Common Validation Issues to Check

### JSON-LD Syntax
- ✅ Valid JSON syntax (no trailing commas, proper quotes)
- ✅ Proper @context and @type values
- ✅ Required fields present

### Schema.org Compliance
- ✅ Using correct schema types
- ✅ Required properties present
- ✅ Property values match expected types
- ✅ No deprecated properties

### Google Rich Results
- ✅ Structured data detected
- ✅ No errors or warnings
- ✅ Rich results preview shows correctly
- ✅ All expected schemas appear

## Validation Status

- [ ] Article pages validated
- [ ] Fact detail pages validated
- [ ] Listing pages validated
- [ ] Key Facts dataset validated
- [ ] GEO pages validated
- [ ] Home page validated
- [ ] FAQ pages validated

## Notes

- Validate one representative page from each schema type
- Fix any errors before deploying
- Re-validate after fixes
- Document any schema.org edge cases or limitations
