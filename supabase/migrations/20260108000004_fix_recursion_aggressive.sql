/*
  # Aggressive Fix for Infinite Recursion
  
  This completely removes the problematic admin_users SELECT policy
  and replaces it with a direct check that cannot cause recursion.
*/

-- Step 1: Completely remove ALL policies on admin_users
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Service role can insert admin users" ON admin_users;

-- Step 2: Recreate is_admin() function with explicit bypass
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- SECURITY DEFINER should bypass RLS, but we'll be explicit
  -- Check if current user exists in admin_users
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Step 3: Create a simple admin_users SELECT policy
-- This checks user_id directly - NO function calls = NO recursion
CREATE POLICY "Users can view their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Step 4: Allow service role to insert (for initial setup)
CREATE POLICY "Service role can insert admin users"
  ON admin_users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Step 5: Fix news policies - ensure they use is_admin()
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

-- Step 6: Fix FAQs policies
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

