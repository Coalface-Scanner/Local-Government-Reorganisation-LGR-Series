/*
  # Fix Security and Performance Issues
  
  This migration addresses multiple security and performance issues identified by Supabase:
  
  ## 1. Foreign Key Indexes
  - Add indexes for foreign keys on `admin_users.created_by` and `cms_audit_log.user_id`
  
  ## 2. RLS Policy Performance
  - Update all RLS policies to use `(select auth.<function>())` instead of direct calls
  - This prevents re-evaluation for each row, improving query performance at scale
  - Affects tables: admin_users, faqs, news
  
  ## 3. Duplicate Policies
  - Remove duplicate SELECT policies on materials table
  
  ## 4. Duplicate Indexes
  - Remove duplicate indexes across multiple tables
  - Keep the more clearly named versions
  
  ## 5. Unused Indexes
  - Remove indexes that are not being used to reduce overhead
  
  ## 6. Function Security
  - Fix mutable search paths on database functions
  - Set explicit search_path to prevent security issues
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

-- Index for admin_users.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_admin_users_created_by ON admin_users(created_by);

-- Index for cms_audit_log.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_cms_audit_log_user_id ON cms_audit_log(user_id);

-- ============================================================================
-- 2. FIX RLS POLICIES FOR PERFORMANCE
-- ============================================================================

-- Fix admin_users policies
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Fix faqs policies
DROP POLICY IF EXISTS "Admin users can insert FAQs" ON faqs;
CREATE POLICY "Admin users can insert FAQs"
  ON faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin users can update FAQs" ON faqs;
CREATE POLICY "Admin users can update FAQs"
  ON faqs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin users can delete FAQs" ON faqs;
CREATE POLICY "Admin users can delete FAQs"
  ON faqs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Fix news policies
DROP POLICY IF EXISTS "Admins can insert news" ON news;
CREATE POLICY "Admins can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can update news" ON news;
CREATE POLICY "Admins can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can delete news" ON news;
CREATE POLICY "Admins can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- 3. REMOVE DUPLICATE POLICIES
-- ============================================================================

-- Remove one of the duplicate SELECT policies on materials
DROP POLICY IF EXISTS "Materials are publicly readable" ON materials;
-- Keep "Anyone can view materials" policy

-- ============================================================================
-- 4. REMOVE DUPLICATE INDEXES
-- ============================================================================

-- Drop duplicate indexes, keeping the more descriptive names
DROP INDEX IF EXISTS idx_facts_order_index;
DROP INDEX IF EXISTS idx_faqs_order_index;
DROP INDEX IF EXISTS idx_interviews_order_index;
DROP INDEX IF EXISTS idx_lessons_order_index;
DROP INDEX IF EXISTS materials_geography_idx;
DROP INDEX IF EXISTS materials_published_date_idx;
DROP INDEX IF EXISTS materials_slug_idx;
DROP INDEX IF EXISTS materials_theme_idx;
DROP INDEX IF EXISTS materials_type_idx;

-- ============================================================================
-- 5. REMOVE UNUSED INDEXES
-- ============================================================================

-- Remove unused indexes to reduce maintenance overhead
DROP INDEX IF EXISTS idx_materials_editors_pick;
DROP INDEX IF EXISTS idx_site_updates_created_at;
DROP INDEX IF EXISTS idx_materials_main_image;
DROP INDEX IF EXISTS idx_councils_country;
DROP INDEX IF EXISTS idx_councils_name;
DROP INDEX IF EXISTS idx_interviews_type;
DROP INDEX IF EXISTS idx_news_published_date;
DROP INDEX IF EXISTS materials_read_count_idx;
DROP INDEX IF EXISTS materials_featured_idx;
DROP INDEX IF EXISTS idx_home_content_section;
DROP INDEX IF EXISTS idx_home_content_order;
DROP INDEX IF EXISTS idx_facts_category;

-- ============================================================================
-- 6. FIX FUNCTION SECURITY (MUTABLE SEARCH PATHS)
-- ============================================================================

-- Recreate is_admin function with secure search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Recreate update_faqs_updated_at trigger function with secure search_path
CREATE OR REPLACE FUNCTION public.update_faqs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate log_cms_action function with secure search_path
CREATE OR REPLACE FUNCTION public.log_cms_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.cms_audit_log (
    table_name,
    action,
    record_id,
    user_id,
    changes
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    auth.uid(),
    CASE
      WHEN TG_OP = 'UPDATE' THEN row_to_json(NEW)
      WHEN TG_OP = 'INSERT' THEN row_to_json(NEW)
      WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
    END
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;
