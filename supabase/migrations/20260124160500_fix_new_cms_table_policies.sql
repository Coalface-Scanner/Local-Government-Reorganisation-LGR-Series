/*
  # Fix RLS Policies for New CMS Tables
  
  Updates the RLS policies for page_content, footer_content, topic_pages, and about_pages
  to use the is_admin() function instead of directly accessing auth.users table.
*/

-- Fix page_content policies
DROP POLICY IF EXISTS "page_content_admin_write" ON page_content;
DROP POLICY IF EXISTS "page_content_admin_insert" ON page_content;
DROP POLICY IF EXISTS "page_content_admin_update" ON page_content;
DROP POLICY IF EXISTS "page_content_admin_delete" ON page_content;

CREATE POLICY "page_content_admin_insert" ON page_content
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "page_content_admin_update" ON page_content
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "page_content_admin_delete" ON page_content
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix footer_content policies
DROP POLICY IF EXISTS "footer_content_admin_write" ON footer_content;
DROP POLICY IF EXISTS "footer_content_admin_insert" ON footer_content;
DROP POLICY IF EXISTS "footer_content_admin_update" ON footer_content;
DROP POLICY IF EXISTS "footer_content_admin_delete" ON footer_content;

CREATE POLICY "footer_content_admin_insert" ON footer_content
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "footer_content_admin_update" ON footer_content
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "footer_content_admin_delete" ON footer_content
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix topic_pages policies
DROP POLICY IF EXISTS "topic_pages_admin_write" ON topic_pages;
DROP POLICY IF EXISTS "topic_pages_admin_insert" ON topic_pages;
DROP POLICY IF EXISTS "topic_pages_admin_update" ON topic_pages;
DROP POLICY IF EXISTS "topic_pages_admin_delete" ON topic_pages;

CREATE POLICY "topic_pages_admin_insert" ON topic_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "topic_pages_admin_update" ON topic_pages
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "topic_pages_admin_delete" ON topic_pages
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- Fix about_pages policies
DROP POLICY IF EXISTS "about_pages_admin_write" ON about_pages;
DROP POLICY IF EXISTS "about_pages_admin_insert" ON about_pages;
DROP POLICY IF EXISTS "about_pages_admin_update" ON about_pages;
DROP POLICY IF EXISTS "about_pages_admin_delete" ON about_pages;

CREATE POLICY "about_pages_admin_insert" ON about_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "about_pages_admin_update" ON about_pages
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "about_pages_admin_delete" ON about_pages
  FOR DELETE
  TO authenticated
  USING (is_admin());
