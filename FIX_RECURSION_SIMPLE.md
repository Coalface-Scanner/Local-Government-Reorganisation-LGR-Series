# Simple Fix for Infinite Recursion Error

## Quick Fix

If the main migration (`20260108000000_fix_admin_users_recursion.sql`) is giving you errors, try this simpler version instead:

**File**: `supabase/migrations/20260108000001_fix_recursion_simple.sql`

This version:
1. Creates all tables first (admin_users, news, faqs)
2. Enables RLS
3. Creates the is_admin() function
4. Fixes all policies

## How to Run

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/20260108000001_fix_recursion_simple.sql`
3. Copy all the SQL
4. Paste into SQL Editor
5. Click **Run**

## What It Does

- ✅ Creates `admin_users` table
- ✅ Creates `news` table  
- ✅ Creates `faqs` table
- ✅ Creates `is_admin()` function with SECURITY DEFINER
- ✅ Fixes all policies to use `is_admin()` instead of direct queries
- ✅ Breaks the infinite recursion loop

## After Running

1. Add yourself as an admin:
   ```sql
   -- Find your user ID
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   
   -- Add yourself as admin
   INSERT INTO admin_users (user_id, email, created_by)
   VALUES ('your-user-id-here', 'your-email@example.com', NULL);
   ```

2. Test updating a news article - the recursion error should be gone!

