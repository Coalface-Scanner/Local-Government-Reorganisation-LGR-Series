# Code Review - Issues Found and Fixes

## 🔴 Critical Issues

### 1. **RelatedArticles.tsx - Incorrect Supabase Query Syntax**
**Location:** `src/components/RelatedArticles.tsx:46`

**Issue:** The `.or()` query syntax is incorrect. Supabase's `.or()` method expects a specific format.

**Current Code:**
```typescript
query = query.or(`theme.eq.${currentTheme},category.eq.${currentCategory || currentTheme}`);
```

**Problem:** This syntax won't work correctly. Supabase `.or()` needs proper formatting.

**Fix Required:**
```typescript
// Option 1: Use separate queries and combine results
if (currentTheme || currentCategory) {
  const [themeResults, categoryResults] = await Promise.all([
    currentTheme ? supabase
      .from('articles')
      .select('id, title, slug, excerpt, featured_image, published_date')
      .eq('status', 'published')
      .eq('theme', currentTheme)
      .neq('slug', currentSlug)
      .limit(3) : Promise.resolve({ data: [], error: null }),
    currentCategory ? supabase
      .from('articles')
      .select('id, title, slug, excerpt, featured_image, published_date')
      .eq('status', 'published')
      .eq('category', currentCategory)
      .neq('slug', currentSlug)
      .limit(3) : Promise.resolve({ data: [], error: null })
  ]);
  
  // Combine and deduplicate
  const combined = [...(themeResults.data || []), ...(categoryResults.data || [])];
  const unique = combined.filter((article, index, self) => 
    index === self.findIndex(a => a.id === article.id)
  );
  setRelatedArticles(unique.slice(0, 3));
} else {
  // Fallback to recent articles
  const { data, error } = await query.order('published_date', { ascending: false });
  if (!error && data) {
    setRelatedArticles(data);
  }
}
```

**OR Option 2 (Simpler):**
```typescript
// Just fetch recent articles without filtering by theme/category
// The current implementation without the .or() would work fine
const { data, error } = await query.order('published_date', { ascending: false });
```

### 2. **TableOfContents.tsx - DOM Manipulation Issue**
**Location:** `src/components/TableOfContents.tsx:23-36`

**Issue:** The `extractHeadings` function parses HTML string and tries to set IDs, but these IDs won't exist in the actual rendered DOM because the function operates on a parsed string, not the live DOM.

**Current Code:**
```typescript
const extracted = extractHeadings(content);
// ... later tries to set IDs on DOM elements
```

**Problem:** The IDs generated from the string won't match the actual rendered headings in the article.

**Fix Required:**
```typescript
useEffect(() => {
  if (!content) return;

  const extracted = extractHeadings(content);
  setHeadings(extracted);

  // Wait for DOM to be ready, then add IDs to actual headings
  const addIdsToHeadings = () => {
    const articleElement = document.querySelector('article.prose');
    if (!articleElement) {
      // Retry if not ready yet
      setTimeout(addIdsToHeadings, 100);
      return;
    }

    extracted.forEach(({ id, text, level }) => {
      const headings = Array.from(articleElement.querySelectorAll(`h${level}`));
      const heading = headings.find(
        h => h.textContent?.trim() === text && !h.id
      );
      if (heading) {
        heading.id = id;
      }
    });
  };

  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    setTimeout(addIdsToHeadings, 200);
  });
}, [content]);
```

### 3. **Service Worker - Cache URLs May Not Match Build Output**
**Location:** `public/sw.js:3-10`

**Issue:** Vite builds assets with hashed filenames (e.g., `index-a1b2c3.js`), but the service worker caches static paths.

**Current Code:**
```javascript
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/lgr.png',
  '/lgr_banner.png'
];
```

**Problem:** The actual built files will have hashed names, so these won't match.

**Fix Required:**
```javascript
// Service worker should cache dynamically based on actual requests
// Or use a build-time script to inject correct paths
// For now, cache only static assets and let runtime caching handle JS/CSS
const urlsToCache = [
  '/',
  '/index.html',
  '/lgr.png',
  '/lgr_banner.png'
];

// The fetch handler will cache JS/CSS dynamically
```

## ⚠️ Medium Priority Issues

### 4. **OptimizedImage - Error State Styling**
**Location:** `src/components/OptimizedImage.tsx:34-41`

**Issue:** When image fails, the error div uses `className` prop which might not work as expected for sizing.

**Current Code:**
```typescript
if (imageError) {
  return (
    <div className={`bg-slate-100 flex items-center justify-center ${className}`}>
```

**Fix:** Add min-height to prevent layout shift:
```typescript
if (imageError) {
  return (
    <div className={`bg-slate-100 flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="text-center p-8">
        <p className="text-slate-400 text-sm">Image unavailable</p>
      </div>
    </div>
  );
}
```

### 5. **ReadingProgress - Z-Index Conflict**
**Location:** `src/components/ReadingProgress.tsx:27`

**Issue:** Z-index of 50 might conflict with navigation or modals.

**Current Code:**
```typescript
<div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
```

**Fix:** Check navigation z-index and adjust if needed. Navigation is likely z-40 or z-30, so z-50 should be fine, but verify.

### 6. **RelatedArticles - Missing Alt Text**
**Location:** `src/components/RelatedArticles.tsx:89`

**Issue:** Image has empty alt text.

**Current Code:**
```typescript
<img
  src={article.featured_image}
  alt=""
```

**Fix:**
```typescript
<img
  src={article.featured_image}
  alt={article.title}
```

### 7. **TableOfContents - Missing Dependency in useEffect**
**Location:** `src/components/TableOfContents.tsx:72`

**Issue:** The IntersectionObserver useEffect depends on `headings` but doesn't handle the case where headings might change after IDs are added.

**Fix:** The current implementation is actually fine, but could be improved with a cleanup function that waits for IDs to be set.

## ✅ Low Priority / Improvements

### 8. **Utils - extractHeadings Modifies Parsed DOM**
**Location:** `src/lib/utils.ts:33-54`

**Issue:** The function modifies the parsed DOM string, but these changes don't persist to the actual rendered DOM.

**Note:** This is handled in TableOfContents component, but the function itself could be clearer about this.

### 9. **Service Worker - Console Logs in Production**
**Location:** `src/main.tsx:13,16`

**Issue:** Console logs will appear in production.

**Fix:** Remove or conditionally log:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Service Worker registered:', registration);
}
```

### 10. **RelatedArticles - No Error Handling**
**Location:** `src/components/RelatedArticles.tsx:34-59`

**Issue:** Errors are logged but not displayed to user.

**Fix:** Add error state and display ErrorDisplay component.

## 📋 Summary

**Critical Fixes Needed:**
1. Fix RelatedArticles Supabase query syntax
2. Fix TableOfContents DOM ID assignment
3. Update Service Worker cache paths

**Should Fix:**
4. OptimizedImage error state styling
5. RelatedArticles empty alt text
6. Service Worker console logs

**Nice to Have:**
7. Better error handling in RelatedArticles
8. Improved TableOfContents ID assignment timing

## 🚀 Recommended Action Plan

1. **Immediate:** Fix RelatedArticles query (Option 2 - simpler approach)
2. **Immediate:** Fix TableOfContents DOM manipulation
3. **Before Deploy:** Update Service Worker cache strategy
4. **Follow-up:** Fix accessibility issues (alt text, error handling)
