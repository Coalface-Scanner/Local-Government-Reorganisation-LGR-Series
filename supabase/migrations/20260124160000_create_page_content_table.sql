/*
  # Create Page Content Table
  
  Generic table for storing editable content sections for any page.
  Used for contact page, subscribe page, and other static pages.
*/

CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_key text NOT NULL,
  title text,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS page_content_page_slug_idx ON page_content(page_slug);
CREATE INDEX IF NOT EXISTS page_content_order_idx ON page_content(page_slug, order_index);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "page_content_public_read" ON page_content
  FOR SELECT
  USING (true);

-- Authenticated admin write access
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

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_page_content_updated_at();
