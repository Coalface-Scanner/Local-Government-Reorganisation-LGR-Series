-- STEP 1: Check what policies currently exist on admin_users
-- Run this first to see what's there
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'admin_users';

-- STEP 2: After seeing the results, run this to fix it
-- This will drop ALL policies and create a simple one

-- Drop every possible policy name we've used
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can view their own admin status" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can view admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated read" ON admin_users;
DROP POLICY IF EXISTS "Break recursion - allow read" ON admin_users;
DROP POLICY IF EXISTS "Service can insert" ON admin_users;
DROP POLICY IF EXISTS "Service role can insert admin users" ON admin_users;

-- Drop ALL policies using a loop (catches any we missed)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'admin_users'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON admin_users';
    END LOOP;
END $$;

-- Disable RLS temporarily
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Recreate is_admin() - make sure it's truly SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- This should bypass RLS because of SECURITY DEFINER
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create the SIMPLEST possible policy - no function calls, no conditions
-- This allows ALL authenticated users to read admin_users
-- (Less secure, but breaks recursion completely)
CREATE POLICY "simple_read_policy"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Also allow service role to insert
CREATE POLICY "service_insert_policy"
  ON admin_users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

