/*
  # Final Fix for Infinite Recursion in admin_users Policy
  
  Problem:
  - News INSERT policy queries admin_users table directly
  - admin_users SELECT policy also queries admin_users table
  - This creates infinite recursion: admin_users -> admin_users -> admin_users...
  
  Solution:
  1. Ensure is_admin() function uses SECURITY DEFINER to bypass RLS
  2. Update all news policies to use is_admin() instead of direct admin_users queries
  3. Fix admin_users SELECT policy to check user_id directly (no recursion)
  4. Ensure is_admin() function has proper search_path and STABLE attribute
*/

-- ============================================================================
-- 1. FIX is_admin() FUNCTION
-- ============================================================================
-- Make sure is_admin() is SECURITY DEFINER so it bypasses RLS
-- STABLE attribute helps with query optimization
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
BEGIN
  -- SECURITY DEFINER allows this function to bypass RLS on admin_users
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- ============================================================================
-- 2. FIX admin_users SELECT POLICY (BREAK RECURSION)
-- ============================================================================
-- The key fix: check user_id directly instead of querying admin_users again
-- This breaks the recursion cycle
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can view their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;

-- Create policy that checks user_id directly - NO recursion possible
CREATE POLICY "Users can view their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- 3. FIX NEWS POLICIES (USE is_admin() INSTEAD OF DIRECT QUERIES)
-- ============================================================================
-- Replace all direct admin_users queries with is_admin() function calls
-- is_admin() bypasses RLS, so no recursion

-- Drop all existing news policies
DROP POLICY IF EXISTS "Admins can insert news" ON news;
DROP POLICY IF EXISTS "Admin users can insert news" ON news;

-- Create INSERT policy using is_admin()
CREATE POLICY "Admins can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Drop UPDATE policies
DROP POLICY IF EXISTS "Admins can update news" ON news;
DROP POLICY IF EXISTS "Admin users can update news" ON news;

-- Create UPDATE policy using is_admin()
CREATE POLICY "Admins can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Drop DELETE policies
DROP POLICY IF EXISTS "Admins can delete news" ON news;
DROP POLICY IF EXISTS "Admin users can delete news" ON news;

-- Create DELETE policy using is_admin()
CREATE POLICY "Admins can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 4. ENSURE PUBLIC SELECT POLICY EXISTS FOR NEWS
-- ============================================================================
-- Make sure public can still read published news
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'news' 
    AND policyname = 'Anyone can read published news'
  ) THEN
    CREATE POLICY "Anyone can read published news"
      ON news
      FOR SELECT
      USING (published = true);
  END IF;
END $$;
