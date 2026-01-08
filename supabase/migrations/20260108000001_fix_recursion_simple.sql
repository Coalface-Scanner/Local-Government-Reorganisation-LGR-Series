/*
  # Simple Fix for Infinite Recursion - Run this first
  
  This is a simplified version that creates tables first, then fixes policies.
  Run this if the main migration fails.
*/

-- Step 1: Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Step 2: Create news table
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

-- Step 3: Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 4: Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Step 5: Create is_admin() function
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

-- Step 6: Fix admin_users policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Step 7: Fix news policies
DROP POLICY IF EXISTS "Anyone can read published news" ON news;
CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  USING (published = true);

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
DROP POLICY IF EXISTS "Anyone can view FAQs" ON faqs;
CREATE POLICY "Anyone can view FAQs"
  ON faqs
  FOR SELECT
  TO public, anon, authenticated
  USING (true);

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

