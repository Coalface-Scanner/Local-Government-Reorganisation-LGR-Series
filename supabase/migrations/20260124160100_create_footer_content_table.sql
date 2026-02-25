/*
  # Create Footer Content Table
  
  Specific table for footer sections: sponsorship, subscription CTA, disclaimer, navigation groups.
*/

CREATE TABLE IF NOT EXISTS footer_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  content text NOT NULL,
  link_text text,
  link_url text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section)
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS footer_content_section_idx ON footer_content(section);
CREATE INDEX IF NOT EXISTS footer_content_order_idx ON footer_content(order_index);

-- Enable RLS
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "footer_content_public_read" ON footer_content
  FOR SELECT
  USING (true);

-- Authenticated admin write access
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

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_footer_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_footer_content_updated_at
  BEFORE UPDATE ON footer_content
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_content_updated_at();
