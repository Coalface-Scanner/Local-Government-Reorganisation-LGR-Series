/*
  # Final Fix for Infinite Recursion
  
  The issue is that is_admin() function queries admin_users, which triggers
  the SELECT policy, which calls is_admin() again - infinite loop!
  
  Solution: Make admin_users SELECT policy temporarily permissive, or
  use a different approach that doesn't query admin_users in the policy check.
*/

-- Step 1: Drop the problematic admin_users SELECT policy completely
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Step 2: Recreate is_admin() with explicit SECURITY DEFINER and proper settings
-- This is critical - SECURITY DEFINER allows bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- SECURITY DEFINER means this runs with creator's privileges (bypasses RLS)
  -- So this query won't trigger the admin_users SELECT policy
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Step 3: Create a new admin_users SELECT policy that uses is_admin()
-- This should work because is_admin() bypasses RLS
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Step 4: Verify and fix news policies
-- Make sure they all use is_admin() function
DROP POLICY IF EXISTS "Admins can insert news" ON news;
DROP POLICY IF EXISTS "Admin users can insert news" ON news;
CREATE POLICY "Admins can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update news" ON news;
DROP POLICY IF EXISTS "Admin users can update news" ON news;
CREATE POLICY "Admins can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete news" ON news;
DROP POLICY IF EXISTS "Admin users can delete news" ON news;
CREATE POLICY "Admins can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Step 5: Fix FAQs policies
DROP POLICY IF EXISTS "Admin users can insert FAQs" ON faqs;
DROP POLICY IF EXISTS "Admins can insert FAQs" ON faqs;
CREATE POLICY "Admin users can insert FAQs"
  ON faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin users can update FAQs" ON faqs;
DROP POLICY IF EXISTS "Admins can update FAQs" ON faqs;
CREATE POLICY "Admin users can update FAQs"
  ON faqs
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin users can delete FAQs" ON faqs;
DROP POLICY IF EXISTS "Admins can delete FAQs" ON faqs;
CREATE POLICY "Admin users can delete FAQs"
  ON faqs
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

