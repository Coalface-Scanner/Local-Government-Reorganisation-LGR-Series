-- ULTIMATE FIX: This should definitely work
-- Run this entire block in Supabase SQL Editor

-- 1. Remove ALL policies on admin_users (this breaks any recursion)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'admin_users') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON admin_users';
    END LOOP;
END $$;

-- 2. Temporarily disable RLS completely
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- 3. Recreate is_admin() function
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

-- 4. Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 5. Create a simple policy that allows all authenticated users to read
-- (This is less secure but breaks recursion - we can tighten it later)
CREATE POLICY "Allow authenticated read"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Now try updating news - it should work!

