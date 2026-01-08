/*
  # Fix Infinite Recursion in admin_users RLS Policy

  Problem:
  The admin_users table has a SELECT policy that queries admin_users itself,
  causing infinite recursion when checking if a user is an admin.
  
  Additionally, news and other table policies that directly query admin_users
  also cause recursion when they try to check admin status.

  Solution:
  1. Create admin_users table if it doesn't exist
  2. Update is_admin() function to be SECURITY DEFINER with proper settings
  3. Update admin_users SELECT policy to use is_admin() function
  4. Update all policies that query admin_users to use is_admin() function instead
  5. This breaks recursion because SECURITY DEFINER functions bypass RLS
*/

-- ============================================================================
-- 0. CREATE admin_users TABLE (if it doesn't exist)
-- ============================================================================
-- Create the admin_users table first if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users (if not already enabled)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert admin users (for initial setup)
-- This policy allows the service role key to add the first admin
-- Regular authenticated users cannot insert - use a Supabase function for that
DROP POLICY IF EXISTS "Service role can insert admin users" ON admin_users;
CREATE POLICY "Service role can insert admin users"
  ON admin_users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- 0.1. CREATE news TABLE (if it doesn't exist)
-- ============================================================================
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  published_date date NOT NULL,
  content text NOT NULL DEFAULT '',
  embed_code text,
  excerpt text,
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on news (if not already enabled)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news') THEN
    ALTER TABLE news ENABLE ROW LEVEL SECURITY;
    
    -- Public read access for published news
    DROP POLICY IF EXISTS "Anyone can read published news" ON news;
    CREATE POLICY "Anyone can read published news"
      ON news
      FOR SELECT
      USING (published = true);
  END IF;
END $$;

-- ============================================================================
-- 0.2. CREATE faqs TABLE (if it doesn't exist)
-- ============================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on faqs (if not already enabled)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'faqs') THEN
    ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
    
    -- Public read access for FAQs
    DROP POLICY IF EXISTS "Anyone can view FAQs" ON faqs;
    CREATE POLICY "Anyone can view FAQs"
      ON faqs
      FOR SELECT
      TO public, anon, authenticated
      USING (true);
  END IF;
END $$;

-- ============================================================================
-- 1. FIX is_admin() FUNCTION
-- ============================================================================
-- Ensure is_admin() function is SECURITY DEFINER so it can bypass RLS
-- This is critical - without SECURITY DEFINER, the function would still
-- trigger RLS policies and cause recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  -- SECURITY DEFINER allows this function to bypass RLS
  -- so it can query admin_users without triggering the policy recursion
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- ============================================================================
-- 2. FIX admin_users SELECT POLICY
-- ============================================================================
-- This is the root cause - the policy queries admin_users itself
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 3. FIX NEWS POLICIES
-- ============================================================================
-- Update news policies to use is_admin() instead of direct admin_users queries
-- Only proceed if news table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news') THEN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Admins can insert news" ON news;
    DROP POLICY IF EXISTS "Admin users can insert news" ON news;

    -- Create new policies using is_admin()
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
  END IF;
END $$;

-- ============================================================================
-- 4. FIX FAQS POLICIES (if they have the same issue)
-- ============================================================================
-- Only proceed if faqs table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'faqs') THEN
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
  END IF;
END $$;

