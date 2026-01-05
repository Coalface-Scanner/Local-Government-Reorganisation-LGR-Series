/*
  # Add Featured Flag to Articles

  1. Changes
    - Add `featured` column (boolean, default false)
    - Featured articles will display "Exclusive" badge
  
  2. Notes
    - No RLS changes needed (inherits from existing policies)
*/

-- Add featured column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'featured'
  ) THEN
    ALTER TABLE articles ADD COLUMN featured boolean DEFAULT false;
  END IF;
END $$;

-- Create index for featured articles
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;
