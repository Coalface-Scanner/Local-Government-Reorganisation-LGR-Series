/*
  # Workaround Fix for Infinite Recursion
  
  The problem: admin_users SELECT policy uses is_admin(), which queries admin_users,
  which triggers the policy again = infinite loop.
  
  Solution: Change the admin_users SELECT policy to check user_id directly
  instead of using is_admin() function. This breaks the recursion.
*/

-- Step 1: Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Step 2: Create a new policy that checks user_id directly
-- This avoids calling is_admin() which would query admin_users again
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    -- Check directly if current user's ID exists in admin_users
    -- This is safe because we're checking the same table, but not through a function
    user_id = auth.uid()
  );

-- Step 3: Ensure is_admin() function exists and is correct
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- This function is used by other tables (news, faqs, etc.)
  -- It can safely query admin_users because it's SECURITY DEFINER
  -- and the admin_users SELECT policy now checks user_id directly (no recursion)
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Step 4: Fix news policies (these should work fine with is_admin())
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

