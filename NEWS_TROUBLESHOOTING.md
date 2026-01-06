# News Section Troubleshooting

## Issue: News Items Missing

If news items are not showing on the `/news` page, check the following:

## 1. Check Database Content

### In Supabase Dashboard:
1. Go to **Table Editor** → `news` table
2. Check if there are any rows
3. **Important:** Check the `published` column - it must be `true` for items to show
4. Verify `published_date` is set
5. Verify `content` is not empty

### Query to check in Supabase SQL Editor:
```sql
SELECT id, title, published, published_date, created_at 
FROM news 
ORDER BY published_date DESC;
```

## 2. Check RLS Policies

The `news` table should have this policy for public access:

```sql
CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  USING (published = true);
```

### To verify policies exist:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'news';
```

## 3. Check Browser Console

After the fix, errors will now be logged to the browser console:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Visit `/news` page
4. Look for any error messages starting with "Error fetching news:"

## 4. Common Issues

### Issue: News items exist but `published = false`
**Solution:** 
- Go to `/admin/login` → News Editor
- Edit each news item and check the "Published" checkbox
- Save the item

### Issue: RLS policy missing or incorrect
**Solution:**
- Run this in Supabase SQL Editor:
```sql
-- Ensure public can read published news
DROP POLICY IF EXISTS "Anyone can read published news" ON news;

CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  TO public, anon, authenticated
  USING (published = true);
```

### Issue: Data was deleted
**Solution:**
- Check if you have a database backup
- Or recreate news items via admin interface (`/admin/login` → News)

### Issue: Query error (check console)
**Solution:**
- The error message in console will tell you what's wrong
- Common errors:
  - `relation "news" does not exist` → Table not created, run migrations
  - `permission denied` → RLS policy issue
  - `column "xxx" does not exist` → Schema mismatch

## 5. Test the Query Directly

Run this in Supabase SQL Editor to test:
```sql
SELECT * 
FROM news 
WHERE published = true 
ORDER BY display_order ASC, published_date DESC;
```

If this returns rows but the page doesn't show them, it's a frontend issue.
If this returns no rows, the data is missing or not published.

## 6. Add News Items

If news items are missing, add them via:
1. Go to `/admin/login`
2. Navigate to **News** section
3. Click "Create New"
4. Fill in:
   - Title
   - Slug (auto-generated from title)
   - Published Date
   - Content (HTML supported)
   - Excerpt (optional)
   - Embed Code (optional, for Spotify, etc.)
   - **Important:** Check "Published" checkbox
   - Display Order (for manual sorting)
5. Click "Create"

## 7. Verify Fix

After checking/fixing:
1. Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
2. Check browser console for errors
3. Verify news items appear

## Summary

The News page now:
- ✅ Logs errors to console (instead of silently failing)
- ✅ Shows "No news yet" if table is empty
- ✅ Shows "Loading news..." while fetching
- ✅ Only displays items where `published = true`

If items are still missing after checking the above, the issue is likely:
- Data not in database
- `published = false` on all items
- RLS policy blocking access

Let me know what you find in the browser console or Supabase dashboard!

