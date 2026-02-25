/*
  # Update Articles Table Structure (v2)

  1. Changes
    - Drop existing policies first
    - Rename `content` column to `body`
    - Add `excerpt` column (text)
    - Add `status` column (text, 'draft' or 'published', default 'draft')
    - Add `published_date` column (timestamptz)
    - Add `updated_at` column (timestamptz)
    - Drop `subtitle` column (replaced by excerpt)
    - Drop `section` column (not needed)
    - Convert `published` boolean to `status` text
    - Create new RLS policies

  2. Security
    - Enable RLS with proper policies for status field
*/

-- Drop all existing policies first
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE articles ADD COLUMN excerpt text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'status'
  ) THEN
    ALTER TABLE articles ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'published_date'
  ) THEN
    ALTER TABLE articles ADD COLUMN published_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE articles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Rename content to body if content exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'content'
  ) THEN
    ALTER TABLE articles RENAME COLUMN content TO body;
  END IF;
END $$;

-- Migrate published boolean to status text and drop published column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'published'
  ) THEN
    UPDATE articles SET status = CASE WHEN published THEN 'published' ELSE 'draft' END;
    ALTER TABLE articles DROP COLUMN published CASCADE;
  END IF;
END $$;

-- Drop unnecessary columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'subtitle'
  ) THEN
    ALTER TABLE articles DROP COLUMN subtitle;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'section'
  ) THEN
    ALTER TABLE articles DROP COLUMN section;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published_date ON articles(status, published_date DESC);

-- Ensure RLS is enabled
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Anyone can view published articles"
  ON articles
  FOR SELECT
  USING (status = 'published');

-- Authenticated admin users can do everything
CREATE POLICY "Authenticated users can view all articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();
