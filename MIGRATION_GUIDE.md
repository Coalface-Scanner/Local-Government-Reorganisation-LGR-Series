# Detailed Migration Guide

This guide explains exactly how to run all 24 database migrations in Supabase.

## What Are Migrations?

Migrations are SQL scripts that set up your database structure (tables, columns, security policies, etc.). They need to run in order because later migrations depend on earlier ones.

## Step-by-Step Process

### Step 1: Access SQL Editor in Supabase

1. **Log into Supabase**: Go to https://app.supabase.com
2. **Select your project**: Click on the project you want to use
3. **Open SQL Editor**: 
   - Look for "SQL Editor" in the left sidebar
   - Click on it
   - You'll see a blank query editor

### Step 2: Understanding the Migration Files

Your migration files are in: `supabase/migrations/`

They're named with timestamps like:
- `20251213212247_create_councils_table.sql`
- `20251214145840_create_materials_table.sql`
- etc.

**Important**: The timestamp (first part) shows the order. Run them chronologically (earliest first).

### Step 3: Running Your First Migration

Let's start with the first one: `20251213212247_create_councils_table.sql`

#### 3a. Open the Migration File

1. In your code editor (VS Code, etc.), navigate to:
   ```
   supabase/migrations/20251213212247_create_councils_table.sql
   ```
2. Open the file
3. You'll see SQL code that looks like:
   ```sql
   CREATE TABLE IF NOT EXISTS councils (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     code text UNIQUE NOT NULL,
     ...
   );
   ```

#### 3b. Copy the Entire File

1. Select ALL the text in the file (Cmd+A on Mac, Ctrl+A on Windows)
2. Copy it (Cmd+C or Ctrl+C)
3. Make sure you got everything - the file should be about 40-50 lines

#### 3c. Paste into Supabase SQL Editor

1. Go back to Supabase SQL Editor (in your browser)
2. Click in the query editor (the big text box)
3. Paste the SQL (Cmd+V or Ctrl+V)
4. You should see all the SQL code appear in the editor

#### 3d. Run the Migration

1. Look for a button that says **"Run"** or **"Execute"** (usually at the bottom right)
2. Or press **Cmd+Enter** (Mac) or **Ctrl+Enter** (Windows)
3. Wait a few seconds...

#### 3e. Check the Results

You'll see one of these outcomes:

**✅ SUCCESS:**
- Green checkmark or "Success" message
- Message like: "Success. No rows returned"
- Or: "Success. Rows affected: 0"
- This means it worked!

**❌ ERROR:**
- Red error message
- Something like: "relation already exists" or "syntax error"
- Don't panic! See "Handling Errors" section below

**Example Success Message:**
```
Success. No rows returned
Execution time: 0.234s
```

### Step 4: Repeat for All Migrations

Now do the same for each migration file, **in this exact order**:

1. ✅ `20251213212247_create_councils_table.sql`
2. ✅ `20251214145840_create_materials_table.sql`
3. ✅ `20251214150702_create_cms_tables.sql`
4. ✅ `20251214185156_create_site_metadata_table.sql`
5. ✅ `20251214213146_add_materials_read_policy.sql`
6. ✅ `20251219005238_add_new_interview_materials.sql`
7. ✅ `20251219010011_update_materials_with_full_content.sql`
8. ✅ `20251219010239_update_lame_duck_full_content.sql`
9. ✅ `20251219010243_update_first_100_days_full_content.sql`
10. ✅ `20251225222556_add_rich_content_support.sql`
11. ✅ `20251227085018_create_site_updates_table.sql`
12. ✅ `20251227091904_add_admin_role_and_secure_cms.sql`
13. ✅ `20251227101506_add_links_to_site_updates.sql`
14. ✅ `20251227103758_create_faqs_table.sql`
15. ✅ `20251227191237_add_performance_indexes.sql`
16. ✅ `20251227193618_create_news_table.sql`
17. ✅ `20251227205556_fix_security_and_performance_issues.sql`
18. ✅ `20251228172108_add_unsubscribe_to_subscriptions.sql`
19. ✅ `20260105094608_add_published_status_to_materials.sql`
20. ✅ `20260105100849_update_articles_table_structure_v2.sql`
21. ✅ `20260105102850_migrate_materials_to_articles_v3.sql`
22. ✅ `20260105103229_fix_security_issues.sql`
23. ✅ `20260105214333_create_article_images_storage_bucket.sql`
24. ✅ `20260105215922_add_featured_flag_to_articles.sql`

**For each migration:**
- Open the file
- Copy all content
- Paste into SQL Editor
- Click "Run" or press Cmd/Ctrl+Enter
- Wait for success message
- Check it off the list above
- Move to next one

### Step 5: Handling Common Errors

#### Error: "relation already exists"

**What it means**: The table/object already exists in your database.

**What to do**: 
- This is usually OK! It means the migration already ran
- You can skip this migration and continue
- Or, if you want a fresh start, you can drop the table first (see below)

**If you want to start fresh:**
```sql
-- Only do this if you want to delete everything and start over!
DROP TABLE IF EXISTS councils CASCADE;
```
Then run the migration again.

#### Error: "syntax error at or near..."

**What it means**: There's a typo or SQL syntax issue.

**What to do**:
- Check that you copied the ENTIRE file (not just part of it)
- Make sure there are no extra characters
- Try copying and pasting again
- Check the error message - it will tell you which line has the problem

#### Error: "permission denied"

**What it means**: Your database user doesn't have permission.

**What to do**:
- Make sure you're using the correct Supabase project
- Check that you're logged in as the project owner
- This shouldn't happen on a new project

#### Error: "column already exists"

**What it means**: The column was already added by a previous migration.

**What to do**:
- Usually safe to ignore
- Continue with the next migration
- The migration uses `IF NOT EXISTS` clauses to handle this

### Step 6: Verifying Migrations Worked

After running all migrations, verify everything is set up:

1. **Check Tables**: 
   - In Supabase, go to **Table Editor** (left sidebar)
   - You should see tables like: `councils`, `materials`, `articles`, `facts`, `lessons`, etc.
   - If you see these tables, migrations worked!

2. **Check for Errors**:
   - Go back to SQL Editor
   - Look at the query history
   - Make sure most show "Success"
   - A few "already exists" errors are OK

3. **Test a Query**:
   - In SQL Editor, try:
   ```sql
   SELECT COUNT(*) FROM materials;
   ```
   - Should return `0` (no error means table exists!)

### Step 7: Tips for Success

1. **Take Your Time**: Don't rush. Each migration takes 1-2 minutes.

2. **One at a Time**: Run one migration, wait for success, then move to the next.

3. **Keep Track**: Check off each migration as you complete it (use the list above).

4. **Don't Skip**: Even if you see "already exists" errors, still run all migrations in order.

5. **Save Your Work**: Some migrations have important data updates, not just structure.

6. **If Something Breaks**: 
   - Note which migration failed
   - Check the error message
   - You can usually continue with the next migration
   - Most migrations are independent

### Step 8: What Each Migration Does (Quick Reference)

- **1-4**: Create core tables (councils, materials, CMS tables, metadata)
- **5**: Add security policies
- **6-9**: Add content/data to materials table
- **10**: Add rich content support
- **11**: Create site updates table
- **12**: Add admin security
- **13**: Add links to site updates
- **14**: Create FAQs table
- **15**: Add performance indexes
- **16**: Create news table
- **17**: Fix security and performance
- **18**: Add unsubscribe functionality
- **19-21**: Update articles structure
- **22**: Fix security issues
- **23**: Create storage bucket (might need manual setup)
- **24**: Add featured flag

### Troubleshooting

**Q: I ran a migration twice by accident. Is that OK?**
A: Usually yes! Most migrations use `IF NOT EXISTS` which prevents duplicates.

**Q: Can I run multiple migrations at once?**
A: Not recommended. Run them one at a time to catch errors early.

**Q: What if I skip a migration?**
A: Don't skip! Later migrations depend on earlier ones. If you must skip, check what it creates first.

**Q: How long does this take?**
A: About 30-45 minutes if you're careful and methodical.

**Q: Can I automate this?**
A: Yes, with Supabase CLI, but manual is safer for first-time setup.

## Next Steps After Migrations

Once all migrations are done:

1. ✅ Verify tables exist (Table Editor)
2. ✅ Create storage bucket (see SUPABASE_SETUP.md)
3. ✅ Create admin user (optional, see SUPABASE_SETUP.md)
4. ✅ Test your site: `npm run dev`

## Need Help?

If you get stuck:
- Note the exact error message
- Note which migration number failed
- Check the SQL Editor error details
- Most errors are harmless and you can continue

Good luck! 🚀

