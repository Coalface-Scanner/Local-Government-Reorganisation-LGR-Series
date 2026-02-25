# Supabase Setup Guide

Follow these steps to set up your Supabase database for the LGR website.

## Step 1: Create Supabase Account & Project

1. Go to https://supabase.com and sign up (free account is fine)
2. Click "New Project"
3. Fill in:
   - **Name**: "LGR Website" (or any name you prefer)
   - **Database Password**: Create a strong password (save it somewhere safe!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier
4. Click "Create new project" (takes 1-2 minutes)

## Step 2: Get Your Credentials

1. Once project is created, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Create .env File

In your project root, create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SITE_PASSWORD=
VITE_ADMIN_PASSWORD=
```

Replace with your actual values from Step 2.

## Step 4: Run Database Migrations

You need to run all 24 migration files in order. Here's how:

### Option A: Using Supabase SQL Editor (Recommended)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Run each migration file in order (they're timestamped, so run them chronologically):

**Migration Order:**
1. `20251213212247_create_councils_table.sql`
2. `20251214145840_create_materials_table.sql`
3. `20251214150702_create_cms_tables.sql`
4. `20251214185156_create_site_metadata_table.sql`
5. `20251214213146_add_materials_read_policy.sql`
6. `20251219005238_add_new_interview_materials.sql`
7. `20251219010011_update_materials_with_full_content.sql`
8. `20251219010239_update_lame_duck_full_content.sql`
9. `20251219010243_update_first_100_days_full_content.sql`
10. `20251225222556_add_rich_content_support.sql`
11. `20251227085018_create_site_updates_table.sql`
12. `20251227091904_add_admin_role_and_secure_cms.sql`
13. `20251227101506_add_links_to_site_updates.sql`
14. `20251227103758_create_faqs_table.sql`
15. `20251227191237_add_performance_indexes.sql`
16. `20251227193618_create_news_table.sql`
17. `20251227205556_fix_security_and_performance_issues.sql`
18. `20251228172108_add_unsubscribe_to_subscriptions.sql`
19. `20260105094608_add_published_status_to_materials.sql`
20. `20260105100849_update_articles_table_structure_v2.sql`
21. `20260105102850_migrate_materials_to_articles_v3.sql`
22. `20260105103229_fix_security_issues.sql`
23. `20260105214333_create_article_images_storage_bucket.sql`
24. `20260105215922_add_featured_flag_to_articles.sql`

**For each migration:**
- Open the file from `supabase/migrations/` folder
- Copy all SQL content
- Paste into SQL Editor
- Click "Run" (or press Cmd/Ctrl + Enter)
- Wait for success message
- Move to next migration

### Option B: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## Step 5: Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New bucket**
3. Name: `article-images`
4. Make it **Public** (uncheck "Private bucket")
5. Click **Create bucket**

## Step 6: Create Admin User (Optional)

To access the admin CMS, you need to create an admin user:

1. Go to **Authentication** → **Users** in Supabase
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: `rowan@coalfaceengagement.co.uk` (or your email)
   - Password: `MapleLeaf1988!` (change this immediately!)
   - Auto Confirm User: ✅ (check this)
4. Click **Create user**
5. Copy the user's UUID (from the users list)

6. Go to **SQL Editor** and run:
```sql
INSERT INTO admin_users (user_id, email, created_by)
VALUES (
  'ba5a2ec0-3fd2-4a48-8f1e-9fe8f8574186,
  'rowan@coalfaceengagement.co.uk',
  'ba5a2ec0-3fd2-4a48-8f1e-9fe8f8574186'
);
```

## Step 7: Test Your Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. The site should load without the "Missing Supabase environment variables" error!

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env` file exists in project root
- Verify variable names are correct (must start with `VITE_`)
- Restart dev server after creating/editing `.env`

### Migration Errors
- Run migrations in order (they're timestamped)
- Some migrations may fail if tables already exist (that's okay, continue)
- Check SQL Editor for specific error messages

### Can't Access Admin
- Verify user exists in `admin_users` table
- Check user email matches what you used
- Try logging out and back in

## Next Steps

Once setup is complete:
- Add some test content via the admin CMS
- Test all pages and functionality
- Review the [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md) for comprehensive testing

