# Debugging Infinite Recursion Error

## The Problem

Even after running the migration, you're still getting:
```
Error updating news: infinite recursion detected in policy for relation "admin_users"
```

## Why This Happens

The `is_admin()` function queries `admin_users` table. When it does this, it triggers the SELECT policy on `admin_users`. If that policy uses `is_admin()` to check permissions, it creates a loop:

1. Policy checks: "Can this user SELECT from admin_users?"
2. Policy calls: `is_admin()`
3. `is_admin()` queries: `SELECT FROM admin_users`
4. This triggers the SELECT policy again...
5. **Infinite loop!**

## The Solution

The `is_admin()` function is marked as `SECURITY DEFINER`, which should allow it to bypass RLS. However, sometimes PostgreSQL still checks policies.

## Try This Fix

Run this SQL in Supabase SQL Editor:

```sql
-- First, completely remove the problematic policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Recreate is_admin() with explicit settings
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Create a simpler policy that should work
-- This uses is_admin() which bypasses RLS due to SECURITY DEFINER
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
```

## Alternative: Temporary Workaround

If the above doesn't work, you can temporarily make the admin_users table readable by all authenticated users (less secure, but breaks the recursion):

```sql
-- TEMPORARY FIX - Less secure but breaks recursion
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

CREATE POLICY "Authenticated users can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);  -- Allows all authenticated users to see admin list
```

**Note**: This is less secure as it exposes the admin users list to all authenticated users. Use only as a temporary workaround.

## Check Current State

Run this to see what policies exist:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_users';
```

This will show you the current policies on the admin_users table.

