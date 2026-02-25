# Unused & Redundant Code Review

## Summary
This document identifies unused components, utilities, hooks, dependencies, and files that can be safely removed to improve performance and reduce codebase noise.

---

## 🗑️ Components to Remove

### 1. **Navigation Component** (UNUSED)
- **File**: `src/components/Navigation.tsx` (1,329 lines)
- **Status**: Imported in `App.tsx` but commented out (line 178)
- **Impact**: Large component (~1,329 lines) that's not being used
- **Action**: Remove the import and file entirely

### 2. **WelcomeModal Component** (UNUSED)
- **File**: `src/components/WelcomeModal.tsx`
- **Status**: Not imported anywhere in the codebase
- **Impact**: Adds unnecessary bundle size
- **Action**: Delete file

### 3. **RollingBanner Component** (UNUSED)
- **File**: `src/components/RollingBanner.tsx`
- **Status**: Not imported anywhere in the codebase
- **Impact**: Adds unnecessary bundle size and database queries
- **Action**: Delete file

### 4. **PasswordProtection Component** (UNUSED)
- **File**: `src/components/PasswordProtection.tsx`
- **Status**: Not imported anywhere (specific password protection components are used instead)
- **Impact**: Redundant - specific password protection components exist:
  - `MembersPasswordProtection` (used)
  - `CouncilProfilesPasswordProtection` (used)
  - `SurreyHubPasswordProtection` (used)
- **Action**: Delete file

### 5. **ContentRelationships Admin Component** (UNUSED)
- **File**: `src/components/admin/ContentRelationships.tsx` (~315 lines)
- **Status**: Not imported anywhere
- **Impact**: Large unused admin component
- **Action**: Delete file

### 6. **FilterPanel Admin Component** (UNUSED)
- **File**: `src/components/admin/FilterPanel.tsx` (~259 lines)
- **Status**: Not imported anywhere
- **Impact**: Large unused admin component
- **Action**: Delete file

### 7. **Pagination Admin Component** (UNUSED)
- **File**: `src/components/admin/Pagination.tsx`
- **Status**: Not imported anywhere
- **Impact**: Unused admin component
- **Action**: Delete file

---

## 🪝 Hooks to Remove

### 8. **useRetry Hook** (UNUSED)
- **File**: `src/hooks/useRetry.ts`
- **Status**: Not imported anywhere
- **Impact**: Unused utility hook
- **Action**: Delete file

### 9. **useErrorHandler Hook** (UNUSED)
- **File**: `src/hooks/useErrorHandler.ts`
- **Status**: Not imported anywhere
- **Impact**: Unused utility hook
- **Action**: Delete file

---

## 📚 Library Files to Remove

### 10. **contentAudit Library** (UNUSED)
- **File**: `src/lib/contentAudit.ts` (~269 lines)
- **Status**: Not imported anywhere
- **Impact**: Large unused utility file
- **Action**: Delete file

---

## 📦 Dependencies to Remove

### 11. **xml2js** (UNUSED)
- **Package**: `xml2js` (v0.6.2)
- **Status**: Listed in dependencies but not imported anywhere
- **Impact**: Unnecessary dependency adds to bundle size
- **Action**: Remove from `package.json` and run `npm install`

**Note**: `marked` is used in `src/lib/aiStub.ts`, so keep it.

---

## 📄 Temporary SQL Files to Remove

These appear to be temporary debugging/migration files that should be cleaned up:

### 12. **Root Directory SQL Files** (TEMPORARY/UNUSED)
- `CHECK_AND_FIX.sql`
- `TRY_THIS_NOW.sql`
- `QUICK_FIX_RECURSION.sql`
- `COMPREHENSIVE_FIX_RECURSION.sql`
- `ULTIMATE_FIX.sql`
- `CHECK_ARTICLE_THEMES.sql`
- `ARTICLE_QA_MIGRATION_CLEAN.sql`
- `ALL_MIGRATIONS_COMBINED.sql`

**Status**: These appear to be temporary debugging files, not actual migrations
- **Impact**: Clutters repository, creates confusion
- **Action**: Delete these files (keep only files in `supabase/migrations/`)

---

## ⚠️ Service Worker Consideration

### 13. **Service Worker Registration** (POTENTIALLY UNUSED)
- **File**: `src/main.tsx` (lines 8-22)
- **File**: `public/sw.js` (exists)
- **Status**: Service worker is registered but may not be actively used
- **Impact**: Adds complexity, may cache outdated content
- **Action**: Review if service worker is needed. If not, remove registration code and `public/sw.js`

---

## 📊 Impact Summary

### Files to Delete: **13 files**
- Components: 7 files (~2,000+ lines)
- Hooks: 2 files
- Libraries: 1 file (~269 lines)
- SQL files: 8+ files
- Dependencies: 1 package

### Estimated Bundle Size Reduction
- Navigation component: ~40-50KB (minified)
- Other components: ~20-30KB combined
- xml2js dependency: ~15-20KB
- **Total potential reduction: ~75-100KB**

---

## ✅ Components Confirmed as USED

These components are actively used and should **NOT** be removed:
- ✅ All admin editor components (used in AdminDashboard)
- ✅ ErrorMessage, HelpTooltip, ImageUpload, CollapsibleSection (used in admin pages)
- ✅ SearchBar (used in GlossaryClient)
- ✅ All password protection components (MembersPasswordProtection, etc.)
- ✅ SubscriptionForm (used in Subscribe page)
- ✅ All data files (surreyCouncils.ts, surreyHubData.ts)
- ✅ chart.js (used in SurreyElectionSimulator)
- ✅ leaflet/react-leaflet (used in CouncilMap and HousingJourney)
- ✅ react-quill (used in WYSIWYGEditor and ArticleEditor)
- ✅ marked (used in aiStub.ts)

---

## 🚀 Recommended Action Plan

1. **Phase 1: Remove unused components** (Low risk)
   - Delete Navigation, WelcomeModal, RollingBanner, PasswordProtection
   - Remove Navigation import from App.tsx

2. **Phase 2: Remove unused hooks and libraries** (Low risk)
   - Delete useRetry, useErrorHandler hooks
   - Delete contentAudit library

3. **Phase 3: Remove unused admin components** (Low risk)
   - Delete ContentRelationships, FilterPanel, Pagination

4. **Phase 4: Clean up dependencies** (Low risk)
   - Remove xml2js from package.json

5. **Phase 5: Clean up temporary files** (Low risk)
   - Delete temporary SQL files from root directory

6. **Phase 6: Review service worker** (Requires testing)
   - Test if service worker is needed
   - Remove if not actively used

---

## ⚠️ Notes

- All removals are based on static analysis (grep searches for imports)
- Before deleting, verify these aren't dynamically imported or used via string references
- Test the application after each phase to ensure nothing breaks
- Consider keeping Navigation component if there are plans to re-enable it soon
