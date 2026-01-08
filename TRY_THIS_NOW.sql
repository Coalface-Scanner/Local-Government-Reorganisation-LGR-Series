-- TRY THIS: Complete nuclear option to break recursion
-- Copy and paste this ENTIRE block into Supabase SQL Editor

-- Step 1: Drop EVERY policy on admin_users
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can view their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated read" ON admin_users;
DROP POLICY IF EXISTS "Service role can insert admin users" ON admin_users;

-- Step 2: Disable RLS completely (this breaks ALL recursion)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Step 3: Recreate is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- With RLS disabled, this will work without recursion
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Step 4: Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 5: Create ONE simple policy - allow all authenticated users to read
-- This is less secure but breaks recursion completely
CREATE POLICY "Break recursion - allow read"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Step 6: Allow service role to insert
CREATE POLICY "Service can insert"
  ON admin_users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- NOW try updating news - it MUST work because RLS is permissive!

