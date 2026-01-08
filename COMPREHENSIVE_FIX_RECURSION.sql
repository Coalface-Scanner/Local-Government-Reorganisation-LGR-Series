/*
  COMPREHENSIVE FIX FOR INFINITE RECURSION
  
  This removes ALL policies on admin_users and recreates them simply.
  Then fixes the is_admin() function to truly bypass RLS.
*/

-- Step 1: Drop ALL existing policies on admin_users
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'admin_users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON admin_users';
    END LOOP;
END $$;

-- Step 2: Temporarily disable RLS to break any recursion
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Step 3: Recreate is_admin() function with explicit RLS bypass
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- SECURITY DEFINER + explicit schema should bypass RLS
  -- But we'll query directly without triggering policies
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Step 4: Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 5: Create a VERY simple SELECT policy (no function calls)
CREATE POLICY "Authenticated users can view admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);  -- Allow all authenticated users to see admin list
  -- This is less secure but breaks recursion completely

-- Step 6: Allow service role to insert
CREATE POLICY "Service role can insert admin users"
  ON admin_users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Step 7: Fix news policies
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

-- Step 8: Fix FAQs policies
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

