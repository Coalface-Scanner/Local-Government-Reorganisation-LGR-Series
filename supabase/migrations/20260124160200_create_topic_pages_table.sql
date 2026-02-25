/*
  # Create Topic Pages Table
  
  Stores metadata for topic hub pages: display name, description, key question, related themes.
*/

CREATE TABLE IF NOT EXISTS topic_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text NOT NULL,
  key_question text NOT NULL,
  related_themes jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS topic_pages_theme_slug_idx ON topic_pages(theme_slug);

-- Enable RLS
ALTER TABLE topic_pages ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "topic_pages_public_read" ON topic_pages
  FOR SELECT
  USING (true);

-- Authenticated admin write access
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

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_topic_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_topic_pages_updated_at
  BEFORE UPDATE ON topic_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_pages_updated_at();
