/*
  # Add Content Lifecycle Management Fields

  This migration adds comprehensive content lifecycle management capabilities:
  - Archive status and tracking
  - Content expiration
  - Scheduled publishing
  - User tracking for archive operations

  1. New Fields (for articles, materials, news)
    - `status` - Extended to include 'archived' (articles, materials)
    - `archived_at` (timestamptz) - When content was archived
    - `archived_by` (uuid) - User who archived the content
    - `expires_at` (timestamptz) - When content should expire/be archived
    - `scheduled_publish_at` (timestamptz) - When content should be published
  
  2. Changes
    - Update status CHECK constraint to include 'archived'
    - Add lifecycle tracking fields
    - Create indexes for performance
    - Update RLS policies to handle archived content
*/

-- ============================================
-- ARTICLES TABLE
-- ============================================

-- Update status constraint to include 'archived'
DO $$
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_status_check;
  
  -- Add new constraint with archived status
  ALTER TABLE articles ADD CONSTRAINT articles_status_check
    CHECK (status IN ('draft', 'published', 'archived'));
END $$;

-- Add archived_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE articles ADD COLUMN archived_at timestamptz;
    RAISE NOTICE 'Added archived_at column to articles table';
  END IF;
END $$;

-- Add archived_by column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'archived_by'
  ) THEN
    ALTER TABLE articles ADD COLUMN archived_by uuid REFERENCES auth.users(id);
    RAISE NOTICE 'Added archived_by column to articles table';
  END IF;
END $$;

-- Add expires_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE articles ADD COLUMN expires_at timestamptz;
    RAISE NOTICE 'Added expires_at column to articles table';
  END IF;
END $$;

-- Add scheduled_publish_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'scheduled_publish_at'
  ) THEN
    ALTER TABLE articles ADD COLUMN scheduled_publish_at timestamptz;
    RAISE NOTICE 'Added scheduled_publish_at column to articles table';
  END IF;
END $$;

-- Create indexes for articles lifecycle fields
CREATE INDEX IF NOT EXISTS idx_articles_archived_at ON articles(archived_at DESC) WHERE archived_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_expires_at ON articles(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_publish_at ON articles(scheduled_publish_at) WHERE scheduled_publish_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_status_archived ON articles(status) WHERE status = 'archived';

-- ============================================
-- MATERIALS TABLE
-- ============================================

-- Check if materials has status column, if not add it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'status'
  ) THEN
    ALTER TABLE materials ADD COLUMN status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'));
    RAISE NOTICE 'Added status column to materials table';
  ELSE
    -- Update existing constraint
    ALTER TABLE materials DROP CONSTRAINT IF EXISTS materials_status_check;
    ALTER TABLE materials ADD CONSTRAINT materials_status_check
      CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- Add archived_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE materials ADD COLUMN archived_at timestamptz;
    RAISE NOTICE 'Added archived_at column to materials table';
  END IF;
END $$;

-- Add archived_by column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'archived_by'
  ) THEN
    ALTER TABLE materials ADD COLUMN archived_by uuid REFERENCES auth.users(id);
    RAISE NOTICE 'Added archived_by column to materials table';
  END IF;
END $$;

-- Add expires_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE materials ADD COLUMN expires_at timestamptz;
    RAISE NOTICE 'Added expires_at column to materials table';
  END IF;
END $$;

-- Add scheduled_publish_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'scheduled_publish_at'
  ) THEN
    ALTER TABLE materials ADD COLUMN scheduled_publish_at timestamptz;
    RAISE NOTICE 'Added scheduled_publish_at column to materials table';
  END IF;
END $$;

-- Create indexes for materials lifecycle fields
CREATE INDEX IF NOT EXISTS idx_materials_archived_at ON materials(archived_at DESC) WHERE archived_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_materials_expires_at ON materials(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_materials_scheduled_publish_at ON materials(scheduled_publish_at) WHERE scheduled_publish_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_materials_status_archived ON materials(status) WHERE status = 'archived';

-- ============================================
-- NEWS TABLE
-- ============================================

-- Convert published boolean to status field
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'published'
    AND NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'news' AND column_name = 'status'
    )
  ) THEN
    -- Add status column
    ALTER TABLE news ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));
    
    -- Migrate published boolean to status
    UPDATE news SET status = CASE WHEN published THEN 'published' ELSE 'draft' END;
    
    RAISE NOTICE 'Converted news.published to news.status';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'status'
  ) THEN
    -- Update existing constraint
    ALTER TABLE news DROP CONSTRAINT IF EXISTS news_status_check;
    ALTER TABLE news ADD CONSTRAINT news_status_check
      CHECK (status IN ('draft', 'published', 'archived'));
  END IF;
END $$;

-- Add archived_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'archived_at'
  ) THEN
    ALTER TABLE news ADD COLUMN archived_at timestamptz;
    RAISE NOTICE 'Added archived_at column to news table';
  END IF;
END $$;

-- Add archived_by column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'archived_by'
  ) THEN
    ALTER TABLE news ADD COLUMN archived_by uuid REFERENCES auth.users(id);
    RAISE NOTICE 'Added archived_by column to news table';
  END IF;
END $$;

-- Add expires_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE news ADD COLUMN expires_at timestamptz;
    RAISE NOTICE 'Added expires_at column to news table';
  END IF;
END $$;

-- Add scheduled_publish_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'news' AND column_name = 'scheduled_publish_at'
  ) THEN
    ALTER TABLE news ADD COLUMN scheduled_publish_at timestamptz;
    RAISE NOTICE 'Added scheduled_publish_at column to news table';
  END IF;
END $$;

-- Create indexes for news lifecycle fields
CREATE INDEX IF NOT EXISTS idx_news_archived_at ON news(archived_at DESC) WHERE archived_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_news_expires_at ON news(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_news_scheduled_publish_at ON news(scheduled_publish_at) WHERE scheduled_publish_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_news_status_archived ON news(status) WHERE status = 'archived';

-- Update RLS policies for news to use status instead of published
DO $$
BEGIN
  -- Drop old policy if it exists
  DROP POLICY IF EXISTS "Anyone can read published news" ON news;
  
  -- Create new policy using status
  CREATE POLICY "Anyone can read published news"
    ON news
    FOR SELECT
    USING (status = 'published');
END $$;

-- ============================================
-- FUNCTION: Auto-archive expired content
-- ============================================

CREATE OR REPLACE FUNCTION auto_archive_expired_content()
RETURNS void AS $$
BEGIN
  -- Archive expired articles
  UPDATE articles
  SET 
    status = 'archived',
    archived_at = now(),
    archived_by = NULL -- System action, no user
  WHERE expires_at IS NOT NULL
    AND expires_at <= now()
    AND status != 'archived';
  
  -- Archive expired materials
  UPDATE materials
  SET 
    status = 'archived',
    archived_at = now(),
    archived_by = NULL
  WHERE expires_at IS NOT NULL
    AND expires_at <= now()
    AND status != 'archived';
  
  -- Archive expired news
  UPDATE news
  SET 
    status = 'archived',
    archived_at = now(),
    archived_by = NULL
  WHERE expires_at IS NOT NULL
    AND expires_at <= now()
    AND status != 'archived';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FUNCTION: Auto-publish scheduled content
-- ============================================

CREATE OR REPLACE FUNCTION auto_publish_scheduled_content()
RETURNS void AS $$
BEGIN
  -- Publish scheduled articles
  UPDATE articles
  SET 
    status = 'published',
    published_date = COALESCE(published_date, now()),
    scheduled_publish_at = NULL
  WHERE scheduled_publish_at IS NOT NULL
    AND scheduled_publish_at <= now()
    AND status = 'draft';
  
  -- Publish scheduled materials
  UPDATE materials
  SET 
    status = 'published',
    published_date = COALESCE(published_date, now()),
    scheduled_publish_at = NULL
  WHERE scheduled_publish_at IS NOT NULL
    AND scheduled_publish_at <= now()
    AND status = 'draft';
  
  -- Publish scheduled news
  UPDATE news
  SET 
    status = 'published',
    scheduled_publish_at = NULL
  WHERE scheduled_publish_at IS NOT NULL
    AND scheduled_publish_at <= now()
    AND status = 'draft';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN articles.archived_at IS 'Timestamp when the article was archived';
COMMENT ON COLUMN articles.archived_by IS 'User ID who archived the article';
COMMENT ON COLUMN articles.expires_at IS 'Timestamp when the article should expire and be auto-archived';
COMMENT ON COLUMN articles.scheduled_publish_at IS 'Timestamp when the article should be automatically published';

COMMENT ON COLUMN materials.archived_at IS 'Timestamp when the material was archived';
COMMENT ON COLUMN materials.archived_by IS 'User ID who archived the material';
COMMENT ON COLUMN materials.expires_at IS 'Timestamp when the material should expire and be auto-archived';
COMMENT ON COLUMN materials.scheduled_publish_at IS 'Timestamp when the material should be automatically published';

COMMENT ON COLUMN news.archived_at IS 'Timestamp when the news item was archived';
COMMENT ON COLUMN news.archived_by IS 'User ID who archived the news item';
COMMENT ON COLUMN news.expires_at IS 'Timestamp when the news item should expire and be auto-archived';
COMMENT ON COLUMN news.scheduled_publish_at IS 'Timestamp when the news item should be automatically published';
