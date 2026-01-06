# Quick Fix: Articles Table Missing

## The Problem

You're getting this error:
```
Could not find the table 'public.articles' in the schema cache
```

This means the `articles` table hasn't been created in your Supabase database yet.

## The Solution

You need to run the database migrations to create all the tables, including the `articles` table.

## Quick Steps

### Option 1: Run the Combined Migration (Easiest)

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Paste the Migration**
   - Open the file: `ALL_MIGRATIONS_COMBINED.sql` in your project
   - Copy ALL the contents (it's a large file)
   - Paste into the SQL Editor

4. **Run the Migration**
   - Click "Run" (or press Cmd+Enter / Ctrl+Enter)
   - Wait for it to complete (may take 1-2 minutes)

5. **Verify the Table Exists**
   - In SQL Editor, run: `SELECT * FROM articles LIMIT 1;`
   - If it runs without error, the table exists!

6. **Try the Import Again**
   ```bash
   npm run import-substack
   ```

### Option 2: Check if Table Already Exists

Sometimes the table exists but there's a connection issue. Try:

1. **Test Connection**
   - In Supabase SQL Editor, run:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'articles';
   ```

2. **If Table Doesn't Exist**
   - Follow Option 1 above

3. **If Table Exists**
   - Check your `.env` file has correct credentials
   - Make sure you're using the right Supabase project

## What the Migration Creates

The `ALL_MIGRATIONS_COMBINED.sql` file creates:
- ✅ `articles` table (with all fields)
- ✅ `materials` table
- ✅ `news` table
- ✅ `subscriptions` table
- ✅ All other required tables
- ✅ Row Level Security policies
- ✅ Indexes for performance

## After Running Migration

Once the migration completes successfully:

1. ✅ The `articles` table will exist
2. ✅ You can run `npm run import-substack`
3. ✅ Articles will import from your Substack RSS feed
4. ✅ You can create/edit articles in the admin interface

## Still Having Issues?

If you still get errors after running the migration:

1. **Check Migration Errors**
   - Look for any red error messages in Supabase SQL Editor
   - Common issues: duplicate policies/triggers (usually safe to ignore)

2. **Verify Environment Variables**
   - Make sure `.env` file has:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-key-here
     ```

3. **Check Supabase Project**
   - Make sure you're using the correct project
   - Verify the project is active (not paused)

## Need Help?

If the migration fails with specific errors, share the error message and I can help fix it!

