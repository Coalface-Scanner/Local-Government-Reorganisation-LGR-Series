# Fix Infinite Recursion Error in admin_users RLS Policy

## Problem

When trying to update news articles, you're getting this error:
```
Error updating news: infinite recursion detected in policy for relation "admin_users"
```

## Root Cause

The `admin_users` table has a Row Level Security (RLS) policy that checks if a user is an admin by querying the `admin_users` table itself. This creates infinite recursion:

1. To check if you can SELECT from `admin_users`, the policy checks if you exist in `admin_users`
2. But to check if you exist in `admin_users`, it needs to SELECT from `admin_users`
3. Which triggers the policy check again... infinite loop!

## Solution

A migration file has been created to fix this issue:
- **File**: `supabase/migrations/20260108000000_fix_admin_users_recursion.sql`

This migration:
1. Updates the `is_admin()` function to be `SECURITY DEFINER` (allows bypassing RLS)
2. Changes the `admin_users` SELECT policy to use `is_admin()` function instead of direct query
3. Updates all other policies (news, faqs, etc.) to use `is_admin()` function

## How to Apply the Fix

### Option 1: Run in Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/20260108000000_fix_admin_users_recursion.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run**

**Note**: The migration now includes table creation, so it's safe to run even if `admin_users` doesn't exist yet.

### Adding Your First Admin User

After running the migration, you'll need to add yourself as an admin. You can do this by:

1. **Using the Supabase function** (if you have one set up):
   - Call the `create-admin` function with your user ID

2. **Using SQL directly** (as service role):
   ```sql
   INSERT INTO admin_users (user_id, email, created_by)
   VALUES (
     'your-user-id-here',  -- Get this from auth.users table
     'your-email@example.com',
     NULL  -- First admin has no creator
   );
   ```

3. **Get your user ID**:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
   ```

### Option 2: Add to Combined Migration File

If you're using the combined migration file, you can append this migration's content to `ALL_MIGRATIONS_COMBINED.sql`.

## What the Fix Does

1. **Updates `is_admin()` function**:
   - Marks it as `SECURITY DEFINER` so it runs with elevated privileges
   - This allows it to bypass RLS when querying `admin_users`
   - Breaks the recursion cycle

2. **Fixes `admin_users` SELECT policy**:
   - Changes from: `EXISTS (SELECT 1 FROM admin_users WHERE ...)`
   - Changes to: `public.is_admin()`
   - Uses the function instead of direct query

3. **Fixes news policies**:
   - Updates all news INSERT/UPDATE/DELETE policies to use `is_admin()`
   - Prevents recursion when updating news articles

4. **Fixes FAQs policies**:
   - Updates FAQs policies to use `is_admin()` as well
   - Ensures consistency across all admin policies

## Verification

After running the migration:

1. Try updating a news article in the admin interface
2. The error should be gone
3. News updates should work normally

## Technical Details

- **SECURITY DEFINER**: Functions marked with this run with the privileges of the function owner (usually a superuser), allowing them to bypass RLS
- **STABLE**: Marks the function as stable (same inputs = same outputs), allowing PostgreSQL to optimize queries
- **search_path**: Explicitly set to `public` to prevent security issues

## Notes

- This fix maintains the same security level - only users in `admin_users` table can still perform admin actions
- The fix is backward compatible - existing admin users will continue to work
- No data changes are made - only policy definitions are updated

