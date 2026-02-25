/*
  # Fix Security and Performance Issues

  1. Drop Unused Indexes
    - Remove indexes from materials table (not actively used)
    - Remove unused indexes from admin_users, cms_audit_log, interviews, subscriptions, faqs
  
  2. Fix Multiple Permissive Policies
    - Consolidate two SELECT policies on articles table into one
    - Remove duplicate policy for authenticated users
  
  3. Fix Function Search Path
    - Set stable search_path on update_articles_updated_at function

  4. Notes
    - Auth DB connection strategy must be changed in Supabase dashboard settings
    - Cannot be changed via SQL migration
*/

-- 1. Drop unused indexes from materials table
DROP INDEX IF EXISTS idx_materials_status;
DROP INDEX IF EXISTS idx_materials_tags;
DROP INDEX IF EXISTS idx_materials_slug;
DROP INDEX IF EXISTS idx_materials_published_date;
DROP INDEX IF EXISTS idx_materials_type;
DROP INDEX IF EXISTS idx_materials_geography;
DROP INDEX IF EXISTS idx_materials_theme;

-- 2. Drop unused indexes from other tables
DROP INDEX IF EXISTS idx_admin_users_created_by;
DROP INDEX IF EXISTS idx_cms_audit_log_user_id;
DROP INDEX IF EXISTS idx_interviews_order;
DROP INDEX IF EXISTS idx_subscriptions_email_active;
DROP INDEX IF EXISTS idx_faqs_order;

-- 3. Fix multiple permissive policies on articles table
-- Drop the conflicting policies
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;

-- Create a single consolidated SELECT policy
-- Public users can only see published articles
-- Authenticated users can see all articles
CREATE POLICY "Users can view articles based on auth status"
  ON articles
  FOR SELECT
  USING (
    status = 'published' 
    OR 
    (auth.uid() IS NOT NULL)
  );

-- 4. Fix function search_path issue
-- Recreate function with stable search_path
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
