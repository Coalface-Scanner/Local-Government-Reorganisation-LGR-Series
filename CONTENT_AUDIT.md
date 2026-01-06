# Content Audit - Missing Data Check

## Overview

This document helps identify what content might be missing from your database after migration.

## Pages That Require Database Content

### 1. Facts Page (`/facts`)
**Required Tables:**
- `facts` - Key facts data
- `councils` - Council data (for CouncilsList component)
- Timeline data (from Timeline component)

**What Should Show:**
- ✅ Key Facts section (from `facts` table)
- ✅ Methodology section (hardcoded - should always show)
- ✅ Sources section (hardcoded - should always show)
- ✅ Timeline (from Timeline component)
- ✅ Councils List (from CouncilsList component)

**Status:** Methodology and Sources now always show (fixed). Key Facts depend on `facts` table having data.

### 2. Lessons Page (`/lessons`)
**Required Tables:**
- `lessons` - Lessons data

**What Should Show:**
- Lessons content from `lessons` table

### 3. Reasons/About Page (`/reasons` or `/about`)
**Required Tables:**
- `reasons` - Reasons data

**What Should Show:**
- Reasons content from `reasons` table

### 4. Interviews Page (`/interviews`)
**Required Tables:**
- `interviews` - Interview data

**What Should Show:**
- Interview listings from `interviews` table

### 5. News Page (`/news`)
**Required Tables:**
- `news` - News items

**What Should Show:**
- News articles from `news` table

### 6. Materials Page (`/materials`)
**Required Tables:**
- `materials` - Materials/articles

**What Should Show:**
- Materials from `materials` table

### 7. Insights Page (`/insights`)
**Required Tables:**
- `articles` - Articles

**What Should Show:**
- Articles from `articles` table

### 8. Home Page (`/`)
**Required Tables:**
- `articles` - For featured and recent articles
- `site_updates` - For latest updates sidebar
- `home_content` - For dynamic home page content (if used)

**What Should Show:**
- Featured article (from `articles` where `featured = true`)
- Recent articles (from `articles` table)
- Latest updates (from `site_updates` table)

## How to Check What's Missing

### Option 1: Check in Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor
2. Check each table:
   - `facts` - Should have rows
   - `lessons` - Should have rows
   - `reasons` - Should have rows
   - `interviews` - Should have rows
   - `news` - Should have rows
   - `materials` - Should have rows
   - `articles` - Should have rows (from RSS import)
   - `site_updates` - Should have rows
   - `councils` - Should have rows

### Option 2: Use Admin Interface

1. Go to `/admin/login`
2. Check each section:
   - Facts Editor - See if facts exist
   - Lessons Editor - See if lessons exist
   - Reasons Editor - See if reasons exist
   - Interviews Editor - See if interviews exist
   - News Editor - See if news exists
   - Materials Editor - See if materials exist
   - Articles (in dashboard) - See if articles exist

### Option 3: Check Website Pages

Visit each page and see what's missing:
- `/facts` - Are Key Facts showing? (Methodology & Sources should always show now)
- `/lessons` - Is content showing?
- `/reasons` - Is content showing?
- `/interviews` - Are interviews showing?
- `/news` - Are news items showing?
- `/materials` - Are materials showing?
- `/insights` - Are articles showing?

## Common Issues

### Issue: "No facts available yet"
**Solution:** Add facts via admin interface (`/admin/login` → Facts)

### Issue: Methodology/Sources not showing
**Status:** ✅ Fixed - They now always show regardless of facts count

### Issue: Empty pages
**Solution:** 
1. Check if tables exist in Supabase
2. Add content via admin interface
3. Or import from previous database if you have a backup

## Next Steps

1. **Check Supabase Tables:**
   - Verify all tables exist
   - Check if they have data

2. **Add Missing Content:**
   - Use admin interface to add content
   - Or import from previous database

3. **Verify Pages:**
   - Visit each page
   - Confirm content displays correctly

## Importing Old Content

If you have content from a previous version:

1. **Export from old database** (if accessible)
2. **Use admin interface** to manually add content
3. **Or create import scripts** for bulk data

Let me know which tables are empty and I can help create import scripts or data templates!

