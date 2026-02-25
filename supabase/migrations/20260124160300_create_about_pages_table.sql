/*
  # Create About Pages Table
  
  Stores content for about sub-pages: editor, methodology, contribute, coalface.
*/

CREATE TABLE IF NOT EXISTS about_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  sections jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS about_pages_page_slug_idx ON about_pages(page_slug);

-- Enable RLS
ALTER TABLE about_pages ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "about_pages_public_read" ON about_pages
  FOR SELECT
  USING (true);

-- Authenticated admin write access
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

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_about_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_about_pages_updated_at
  BEFORE UPDATE ON about_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_about_pages_updated_at();
