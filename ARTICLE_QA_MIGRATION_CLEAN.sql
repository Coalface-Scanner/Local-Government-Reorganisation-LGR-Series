-- Create Article Q&A Table
-- This migration creates the article_qa table for storing Q&A sections at the end of articles

CREATE TABLE IF NOT EXISTS article_qa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE article_qa ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Anyone can view article Q&A" ON article_qa;

CREATE POLICY "Anyone can view article Q&A"
  ON article_qa
  FOR SELECT
  TO public, anon, authenticated
  USING (true);

-- Admin insert access
DROP POLICY IF EXISTS "Admin users can insert article Q&A" ON article_qa;

CREATE POLICY "Admin users can insert article Q&A"
  ON article_qa
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Admin update access
DROP POLICY IF EXISTS "Admin users can update article Q&A" ON article_qa;

CREATE POLICY "Admin users can update article Q&A"
  ON article_qa
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Admin delete access
DROP POLICY IF EXISTS "Admin users can delete article Q&A" ON article_qa;

CREATE POLICY "Admin users can delete article Q&A"
  ON article_qa
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_article_qa_slug ON article_qa(article_slug);
CREATE INDEX IF NOT EXISTS idx_article_qa_order ON article_qa(article_slug, order_index);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_article_qa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS article_qa_updated_at ON article_qa;

CREATE TRIGGER article_qa_updated_at
  BEFORE UPDATE ON article_qa
  FOR EACH ROW
  EXECUTE FUNCTION update_article_qa_updated_at();

