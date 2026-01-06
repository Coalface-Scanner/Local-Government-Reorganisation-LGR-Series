# How to Check for Missing Content

## Quick Check - Facts Page

The Facts page should now **always show**:
- ✅ **Methodology** section (always visible)
- ✅ **Sources** section (always visible)  
- ⚠️ **Key Facts** section (only shows if you have data in the `facts` table)

## What I Fixed

✅ **Methodology and Sources now always display** - They were previously hidden if no facts existed in the database. Now they show regardless.

## How to Check What's Missing

### Step 1: Check Supabase Tables

Go to Supabase Dashboard → Table Editor and check if these tables have data:

1. **`facts`** table
   - Should have rows for "Key Facts" section
   - If empty: Add facts via admin (`/admin/login` → Facts)

2. **`lessons`** table
   - Should have rows for Lessons page
   - If empty: Add via admin (`/admin/login` → Lessons)

3. **`reasons`** table
   - Should have rows for About/Reasons page
   - If empty: Add via admin (`/admin/login` → Reasons)

4. **`interviews`** table
   - Should have rows for Interviews page
   - If empty: Add via admin (`/admin/login` → Interviews)

5. **`news`** table
   - Should have rows for News page
   - If empty: Add via admin (`/admin/login` → News)

6. **`articles`** table
   - Should have rows (from RSS import)
   - If empty: Run `npm run import-substack`

7. **`materials`** table
   - Should have rows for Materials page
   - If empty: Add via admin (`/admin/login` → Materials)

8. **`site_updates`** table
   - Should have rows for "Latest Updates" sidebar
   - If empty: Add via admin (`/admin/login` → Site Updates)

9. **`councils`** table
   - Should have rows for Councils List
   - If empty: Check Timeline component

### Step 2: Visit Each Page

Check these pages to see what's missing:

- `/facts` - Should show Methodology & Sources (always), Key Facts (if data exists)
- `/lessons` - Should show lessons content
- `/reasons` or `/about` - Should show reasons content
- `/interviews` - Should show interviews
- `/news` - Should show news items
- `/materials` - Should show materials
- `/insights` - Should show articles (from RSS)
- `/` (home) - Should show featured article and recent articles

### Step 3: Add Missing Content

If content is missing, you can:

1. **Use Admin Interface:**
   - Go to `/admin/login`
   - Navigate to the relevant editor
   - Add content manually

2. **Import from Previous Database:**
   - If you have a backup/export from the old site
   - I can help create import scripts

3. **Start Fresh:**
   - Add content as you go through the admin interface

## What's Working Now

✅ Methodology section - Always shows on Facts page
✅ Sources section - Always shows on Facts page  
✅ Key Facts section - Shows if `facts` table has data
✅ All other pages - Will show content if tables have data

## Need Help?

If you have:
- **Old database export** - I can help create import scripts
- **Specific missing content** - Tell me what's missing and I can help add it
- **Empty tables** - I can help populate them with sample data or create templates

Let me know what specific content is missing and I'll help you get it added!

