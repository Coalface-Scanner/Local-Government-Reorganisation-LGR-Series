# What Should Go Live - Breakdown

## ✅ DEFINITELY COMMIT (Source Code & Assets)

### Modified Files (All should go live):
- `index.html` - Main HTML file
- `package.json` & `package-lock.json` - Dependencies
- `vite.config.ts` - Build configuration
- `src/App.tsx` - Main app routing (includes SurreyElectionSimulator route)
- `src/components/SubscriptionForm.tsx` - Subscription component
- `src/pages/Article.tsx` - Article page
- `src/pages/ArticleView.tsx` - Article view page
- `src/pages/Insights.tsx` - Insights page
- `src/pages/Surrey.tsx` - Surrey page

### New Files (Should go live):
- `src/pages/SurreyElectionSimulator.tsx` - **REQUIRED** (referenced in App.tsx)
- `public/Key_Success.jpg` - Image asset
- `public/LGR Podcast Logo.png` - Image asset
- `public/LGR_Leadership_Graphic.jpeg` - Image asset
- `public/Rob_Moran_Infographic.jpg` - Image asset (for the article we added earlier)

## ⚠️ MAYBE COMMIT (Database/Backend)

### Migration Files (Only if you've run them):
- `supabase/migrations/20260108000000_fix_admin_users_recursion.sql`
- `supabase/migrations/20260108000001_fix_recursion_simple.sql`
- `supabase/migrations/20260108000002_fix_recursion_final.sql`
- `supabase/migrations/20260108000003_fix_recursion_workaround.sql`
- `supabase/migrations/20260108000004_fix_recursion_aggressive.sql`

**Decision**: Only commit if these migrations are needed for the site to work. If they're just debugging attempts, skip them.

### Scripts (Only if needed):
- `scripts/add-moran-article.sql` - SQL script (probably already run)
- `scripts/add-robert-moran-article.js` - Node script (probably already run)

**Decision**: These are utility scripts. If you've already run them, you can skip. If others need to run them, include them.

## ❌ DON'T COMMIT (Documentation/Temporary Files)

### Documentation Files (Reference only):
- `CHECK_AND_FIX.sql`
- `COMPREHENSIVE_FIX_RECURSION.sql`
- `DEBUG_RECURSION.md`
- `FINAL_FIX_STEPS.md`
- `FIX_CUSTOM_DOMAIN_CACHE.md`
- `FIX_RECURSION_ERROR.md`
- `FIX_RECURSION_SIMPLE.md`
- `FIX_RECURSION_WORKAROUND.md`
- `MOBILE_OPTIMIZATIONS_APPLIED.md`
- `MOBILE_OPTIMIZATION_REPORT.md`
- `NETLIFY_DEPLOYMENT_FIX.md`
- `QUICK_FIX_RECURSION.sql`
- `TRY_THIS_NOW.sql`
- `ULTIMATE_FIX.sql`
- `CREATE_DOWNLOADABLE_ARCHIVE.md`

### Large Files/Archives:
- `LGR-Series-Complete-20260107.tar.gz` - Archive file (too large, not needed)
- `create-archive.sh` - Utility script

## 🎯 RECOMMENDED: Safe Commit Command

This will commit everything that's definitely needed for the site to work:

```bash
# Add all source code and assets
git add index.html package.json package-lock.json vite.config.ts
git add src/
git add public/Key_Success.jpg public/LGR\ Podcast\ Logo.png public/LGR_Leadership_Graphic.jpeg public/Rob_Moran_Infographic.jpg

# Commit
git commit -m "Deploy latest site updates: Surrey Election Simulator, images, and component updates"

# Push
git push origin main
```

## 🤔 If You Want to Include Scripts/Migrations

If you think the migration files or scripts should be included (for others to use):

```bash
# Add migrations (if needed)
git add supabase/migrations/20260108000000_fix_admin_users_recursion.sql
git add supabase/migrations/20260108000001_fix_recursion_simple.sql
git add supabase/migrations/20260108000002_fix_recursion_final.sql
git add supabase/migrations/20260108000003_fix_recursion_workaround.sql
git add supabase/migrations/20260108000004_fix_recursion_aggressive.sql

# Add scripts (if others need them)
git add scripts/add-moran-article.sql
git add scripts/add-robert-moran-article.js
```
