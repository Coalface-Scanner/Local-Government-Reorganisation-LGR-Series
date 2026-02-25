/*
  # Harden CMS Policies and Normalize News Status

  This migration:
  - Ensures public.is_admin() is safe (SECURITY DEFINER + stable search_path)
  - Locks CMS write policies to admins only
  - Removes permissive article write policies
  - Normalizes news policies to status-based lifecycle
  - Backfills news.status from legacy news.published where needed
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Keep admin_users policy recursion-safe and suitable for client role checks
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Authenticated users can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can view their own admin status" ON admin_users;

CREATE POLICY "Users can view their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- ARTICLES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;
DROP POLICY IF EXISTS "Users can view articles based on auth status" ON articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON articles;
DROP POLICY IF EXISTS "Admins can update articles" ON articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON articles;
DROP POLICY IF EXISTS "Admins can view all articles" ON articles;

CREATE POLICY "Anyone can view published articles"
  ON articles
  FOR SELECT
  TO public, anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can view all articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- ARTICLE QA
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin users can insert article Q&A" ON article_qa;
DROP POLICY IF EXISTS "Admin users can update article Q&A" ON article_qa;
DROP POLICY IF EXISTS "Admin users can delete article Q&A" ON article_qa;
DROP POLICY IF EXISTS "Admins can insert article Q&A" ON article_qa;
DROP POLICY IF EXISTS "Admins can update article Q&A" ON article_qa;
DROP POLICY IF EXISTS "Admins can delete article Q&A" ON article_qa;

CREATE POLICY "Admins can insert article Q&A"
  ON article_qa
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update article Q&A"
  ON article_qa
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete article Q&A"
  ON article_qa
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- NEWS
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'published'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'status'
  ) THEN
    UPDATE news
    SET status = CASE WHEN published THEN 'published' ELSE 'draft' END
    WHERE status IS NULL;
  END IF;
END $$;

DROP POLICY IF EXISTS "Anyone can read published news" ON news;
DROP POLICY IF EXISTS "Admins can insert news" ON news;
DROP POLICY IF EXISTS "Admins can update news" ON news;
DROP POLICY IF EXISTS "Admins can delete news" ON news;
DROP POLICY IF EXISTS "Admin users can insert news" ON news;
DROP POLICY IF EXISTS "Admin users can update news" ON news;
DROP POLICY IF EXISTS "Admin users can delete news" ON news;

CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  TO public, anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can view all news"
  ON news
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- Ensure key CMS tables use admin-only writes (idempotent hardening)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Only admins can insert materials" ON materials;
DROP POLICY IF EXISTS "Only admins can update materials" ON materials;
DROP POLICY IF EXISTS "Only admins can delete materials" ON materials;

CREATE POLICY "Only admins can insert materials"
  ON materials FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update materials"
  ON materials FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete materials"
  ON materials FOR DELETE TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- FAQS
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin users can insert FAQs" ON faqs;
DROP POLICY IF EXISTS "Admin users can update FAQs" ON faqs;
DROP POLICY IF EXISTS "Admin users can delete FAQs" ON faqs;
DROP POLICY IF EXISTS "Only admins can insert FAQs" ON faqs;
DROP POLICY IF EXISTS "Only admins can update FAQs" ON faqs;
DROP POLICY IF EXISTS "Only admins can delete FAQs" ON faqs;

CREATE POLICY "Only admins can insert FAQs"
  ON faqs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update FAQs"
  ON faqs FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete FAQs"
  ON faqs FOR DELETE TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- SITE UPDATES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can insert site updates" ON site_updates;
DROP POLICY IF EXISTS "Authenticated users can update site updates" ON site_updates;
DROP POLICY IF EXISTS "Authenticated users can delete site updates" ON site_updates;
DROP POLICY IF EXISTS "Only admins can insert site updates" ON site_updates;
DROP POLICY IF EXISTS "Only admins can update site updates" ON site_updates;
DROP POLICY IF EXISTS "Only admins can delete site updates" ON site_updates;

CREATE POLICY "Only admins can insert site updates"
  ON site_updates FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update site updates"
  ON site_updates FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete site updates"
  ON site_updates FOR DELETE TO authenticated
  USING (public.is_admin());
