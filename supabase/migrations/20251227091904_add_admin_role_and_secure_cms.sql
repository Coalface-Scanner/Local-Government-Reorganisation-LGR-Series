/*
  # Secure CMS with Admin Role-Based Access Control

  1. Changes
    - Create admin_users table to track who has admin access
    - Add function to check if user is admin
    - Update all CMS table RLS policies to require admin access
    - Add audit logging for admin actions
    
  2. Security
    - Only users in admin_users table can modify CMS content
    - All modifications are logged with timestamp and user info
    - Public can still read published content
    - Authenticated non-admins have read-only access
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can view who is an admin
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table
CREATE TABLE IF NOT EXISTS cms_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  user_email text,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON cms_audit_log FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert audit log"
  ON cms_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Drop existing permissive policies and create restrictive admin-only policies
-- Materials table
DROP POLICY IF EXISTS "Authenticated users can insert materials" ON materials;
DROP POLICY IF EXISTS "Authenticated users can update materials" ON materials;
DROP POLICY IF EXISTS "Authenticated users can delete materials" ON materials;

CREATE POLICY "Only admins can insert materials"
  ON materials FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update materials"
  ON materials FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete materials"
  ON materials FOR DELETE
  TO authenticated
  USING (is_admin());

-- Facts table
DROP POLICY IF EXISTS "Authenticated users can insert facts" ON facts;
DROP POLICY IF EXISTS "Authenticated users can update facts" ON facts;
DROP POLICY IF EXISTS "Authenticated users can delete facts" ON facts;

CREATE POLICY "Only admins can insert facts"
  ON facts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update facts"
  ON facts FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete facts"
  ON facts FOR DELETE
  TO authenticated
  USING (is_admin());

-- Lessons table
DROP POLICY IF EXISTS "Authenticated users can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Authenticated users can update lessons" ON lessons;
DROP POLICY IF EXISTS "Authenticated users can delete lessons" ON lessons;

CREATE POLICY "Only admins can insert lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (is_admin());

-- Reasons table
DROP POLICY IF EXISTS "Authenticated users can insert reasons" ON reasons;
DROP POLICY IF EXISTS "Authenticated users can update reasons" ON reasons;
DROP POLICY IF EXISTS "Authenticated users can delete reasons" ON reasons;

CREATE POLICY "Only admins can insert reasons"
  ON reasons FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update reasons"
  ON reasons FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete reasons"
  ON reasons FOR DELETE
  TO authenticated
  USING (is_admin());

-- Interviews table
DROP POLICY IF EXISTS "Authenticated users can insert interviews" ON interviews;
DROP POLICY IF EXISTS "Authenticated users can update interviews" ON interviews;
DROP POLICY IF EXISTS "Authenticated users can delete interviews" ON interviews;

CREATE POLICY "Only admins can insert interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete interviews"
  ON interviews FOR DELETE
  TO authenticated
  USING (is_admin());

-- Home content table
DROP POLICY IF EXISTS "Authenticated users can insert home content" ON home_content;
DROP POLICY IF EXISTS "Authenticated users can update home content" ON home_content;
DROP POLICY IF EXISTS "Authenticated users can delete home content" ON home_content;

CREATE POLICY "Only admins can insert home content"
  ON home_content FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update home content"
  ON home_content FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete home content"
  ON home_content FOR DELETE
  TO authenticated
  USING (is_admin());

-- Site updates table
DROP POLICY IF EXISTS "Authenticated users can insert site updates" ON site_updates;
DROP POLICY IF EXISTS "Authenticated users can update site updates" ON site_updates;
DROP POLICY IF EXISTS "Authenticated users can delete site updates" ON site_updates;

CREATE POLICY "Only admins can insert site updates"
  ON site_updates FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update site updates"
  ON site_updates FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete site updates"
  ON site_updates FOR DELETE
  TO authenticated
  USING (is_admin());

-- Site metadata table
DROP POLICY IF EXISTS "Authenticated users can update site metadata" ON site_metadata;

CREATE POLICY "Only admins can update site metadata"
  ON site_metadata FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_cms_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cms_audit_log (table_name, record_id, action, user_id, user_email, changes)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    auth.uid(),
    auth.email(),
    CASE
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to all CMS tables
DROP TRIGGER IF EXISTS audit_materials ON materials;
CREATE TRIGGER audit_materials
  AFTER INSERT OR UPDATE OR DELETE ON materials
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_facts ON facts;
CREATE TRIGGER audit_facts
  AFTER INSERT OR UPDATE OR DELETE ON facts
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_lessons ON lessons;
CREATE TRIGGER audit_lessons
  AFTER INSERT OR UPDATE OR DELETE ON lessons
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_reasons ON reasons;
CREATE TRIGGER audit_reasons
  AFTER INSERT OR UPDATE OR DELETE ON reasons
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_interviews ON interviews;
CREATE TRIGGER audit_interviews
  AFTER INSERT OR UPDATE OR DELETE ON interviews
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_home_content ON home_content;
CREATE TRIGGER audit_home_content
  AFTER INSERT OR UPDATE OR DELETE ON home_content
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();
