/*
  # Add Content Classification and Featured Content Fields

  This migration adds content classification fields to both articles and materials tables,
  making materials the central repository for all content.

  1. New Fields (for both articles and materials)
    - `content_type` (text) - Required field for content classification
      Values: 'News Update', 'Interview', 'Article', 'Research', 'Lesson', 'FAQ', 'Other'
    - `featured_theme` (boolean) - Marks content as featured for its core theme
    - `featured_site` (boolean) - Marks content as featured site-wide (overrides featured)
  
  2. Constraints
    - content_type is required and must be one of the valid values
    - theme is required for all content types except 'FAQ' and 'Other'
  
  3. Logic
    - When featured_theme is set to true, automatically unset other featured_theme items in the same theme
    - When featured_site is set to true, automatically unset other featured_site items
*/

-- Add content_type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE articles ADD COLUMN content_type text;
    RAISE NOTICE 'Added content_type column to articles table';
  END IF;
END $$;

-- Add featured_theme column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'featured_theme'
  ) THEN
    ALTER TABLE articles ADD COLUMN featured_theme boolean DEFAULT false;
    RAISE NOTICE 'Added featured_theme column to articles table';
  END IF;
END $$;

-- Add featured_site column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'featured_site'
  ) THEN
    ALTER TABLE articles ADD COLUMN featured_site boolean DEFAULT false;
    RAISE NOTICE 'Added featured_site column to articles table';
  END IF;
END $$;

-- Add CHECK constraint for content_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'articles_content_type_check'
    AND table_name = 'articles'
  ) THEN
    ALTER TABLE articles ADD CONSTRAINT articles_content_type_check
      CHECK (content_type IN ('News Update', 'Interview', 'Article', 'Research', 'Lesson', 'FAQ', 'Other'));
    RAISE NOTICE 'Added content_type CHECK constraint';
  END IF;
END $$;

-- Set default content_type for existing articles
UPDATE articles
SET content_type = CASE
  WHEN category ILIKE '%news%' OR category ILIKE '%update%' THEN 'News Update'
  WHEN category ILIKE '%interview%' THEN 'Interview'
  WHEN category ILIKE '%research%' OR category ILIKE '%study%' THEN 'Research'
  WHEN category ILIKE '%lesson%' THEN 'Lesson'
  WHEN category ILIKE '%faq%' THEN 'FAQ'
  ELSE 'Article'
END
WHERE content_type IS NULL;

-- Set default to 'Article' for any remaining NULL values
UPDATE articles SET content_type = 'Article' WHERE content_type IS NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_content_type ON articles(content_type);
CREATE INDEX IF NOT EXISTS idx_articles_featured_theme ON articles(featured_theme) WHERE featured_theme = true;
CREATE INDEX IF NOT EXISTS idx_articles_featured_site ON articles(featured_site) WHERE featured_site = true;
CREATE INDEX IF NOT EXISTS idx_articles_theme_content_type ON articles(theme, content_type) WHERE status = 'published';

-- Function to automatically unset other featured_theme items when one is set
CREATE OR REPLACE FUNCTION unset_other_featured_theme()
RETURNS TRIGGER AS $$
BEGIN
  -- If this article is being set as featured_theme, unset others in the same theme
  IF NEW.featured_theme = true AND NEW.theme IS NOT NULL THEN
    UPDATE articles
    SET featured_theme = false
    WHERE id != NEW.id
      AND theme = NEW.theme
      AND featured_theme = true
      AND status = 'published';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically unset other featured_site items when one is set
CREATE OR REPLACE FUNCTION unset_other_featured_site()
RETURNS TRIGGER AS $$
BEGIN
  -- If this article is being set as featured_site, unset others
  IF NEW.featured_site = true THEN
    UPDATE articles
    SET featured_site = false
    WHERE id != NEW.id
      AND featured_site = true
      AND status = 'published';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_unset_other_featured_theme ON articles;
CREATE TRIGGER trigger_unset_other_featured_theme
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  WHEN (NEW.featured_theme = true)
  EXECUTE FUNCTION unset_other_featured_theme();

DROP TRIGGER IF EXISTS trigger_unset_other_featured_site ON articles;
CREATE TRIGGER trigger_unset_other_featured_site
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW
  WHEN (NEW.featured_site = true)
  EXECUTE FUNCTION unset_other_featured_site();

-- Add comment to document the fields
COMMENT ON COLUMN articles.content_type IS 'Content type classification: News Update, Interview, Article, Research, Lesson, FAQ, or Other';
COMMENT ON COLUMN articles.featured_theme IS 'Marks this content as featured within its core theme. Only one item per theme can be featured.';
COMMENT ON COLUMN articles.featured_site IS 'Marks this content as featured site-wide. Overrides featured field. Only one item can be featured site-wide.';

-- ============================================
-- MATERIALS TABLE - Add same fields
-- ============================================

-- Add content_type column to materials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE materials ADD COLUMN content_type text;
    RAISE NOTICE 'Added content_type column to materials table';
  END IF;
END $$;

-- Add featured_theme column to materials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'featured_theme'
  ) THEN
    ALTER TABLE materials ADD COLUMN featured_theme boolean DEFAULT false;
    RAISE NOTICE 'Added featured_theme column to materials table';
  END IF;
END $$;

-- Add featured_site column to materials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'featured_site'
  ) THEN
    ALTER TABLE materials ADD COLUMN featured_site boolean DEFAULT false;
    RAISE NOTICE 'Added featured_site column to materials table';
  END IF;
END $$;

-- Add CHECK constraint for content_type on materials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'materials_content_type_check'
    AND table_name = 'materials'
  ) THEN
    ALTER TABLE materials ADD CONSTRAINT materials_content_type_check
      CHECK (content_type IN ('News Update', 'Interview', 'Article', 'Research', 'Lesson', 'FAQ', 'Other'));
    RAISE NOTICE 'Added content_type CHECK constraint to materials';
  END IF;
END $$;

-- Set default content_type for existing materials based on type field
UPDATE materials
SET content_type = CASE
  WHEN type ILIKE '%news%' OR type ILIKE '%update%' THEN 'News Update'
  WHEN type ILIKE '%interview%' THEN 'Interview'
  WHEN type ILIKE '%research%' OR type ILIKE '%study%' THEN 'Research'
  WHEN type ILIKE '%lesson%' THEN 'Lesson'
  WHEN type ILIKE '%faq%' THEN 'FAQ'
  ELSE 'Article'
END
WHERE content_type IS NULL;

-- Set default to 'Article' for any remaining NULL values
UPDATE materials SET content_type = 'Article' WHERE content_type IS NULL;

-- Create indexes for materials
CREATE INDEX IF NOT EXISTS idx_materials_content_type ON materials(content_type);
CREATE INDEX IF NOT EXISTS idx_materials_featured_theme ON materials(featured_theme) WHERE featured_theme = true;
CREATE INDEX IF NOT EXISTS idx_materials_featured_site ON materials(featured_site) WHERE featured_site = true;
CREATE INDEX IF NOT EXISTS idx_materials_theme_content_type ON materials(theme, content_type) WHERE status = 'published';

-- Function to automatically unset other featured_theme items in materials when one is set
CREATE OR REPLACE FUNCTION unset_other_featured_theme_materials()
RETURNS TRIGGER AS $$
BEGIN
  -- If this material is being set as featured_theme, unset others in the same theme
  IF NEW.featured_theme = true AND NEW.theme IS NOT NULL THEN
    UPDATE materials
    SET featured_theme = false
    WHERE id != NEW.id
      AND theme = NEW.theme
      AND featured_theme = true
      AND status = 'published';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically unset other featured_site items in materials when one is set
CREATE OR REPLACE FUNCTION unset_other_featured_site_materials()
RETURNS TRIGGER AS $$
BEGIN
  -- If this material is being set as featured_site, unset others
  IF NEW.featured_site = true THEN
    UPDATE materials
    SET featured_site = false
    WHERE id != NEW.id
      AND featured_site = true
      AND status = 'published';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for materials
DROP TRIGGER IF EXISTS trigger_unset_other_featured_theme_materials ON materials;
CREATE TRIGGER trigger_unset_other_featured_theme_materials
  BEFORE INSERT OR UPDATE ON materials
  FOR EACH ROW
  WHEN (NEW.featured_theme = true)
  EXECUTE FUNCTION unset_other_featured_theme_materials();

DROP TRIGGER IF EXISTS trigger_unset_other_featured_site_materials ON materials;
CREATE TRIGGER trigger_unset_other_featured_site_materials
  BEFORE INSERT OR UPDATE ON materials
  FOR EACH ROW
  WHEN (NEW.featured_site = true)
  EXECUTE FUNCTION unset_other_featured_site_materials();

-- Add comment to document the fields for materials
COMMENT ON COLUMN materials.content_type IS 'Content type classification: News Update, Interview, Article, Research, Lesson, FAQ, or Other';
COMMENT ON COLUMN materials.featured_theme IS 'Marks this content as featured within its core theme. Only one item per theme can be featured.';
COMMENT ON COLUMN materials.featured_site IS 'Marks this content as featured site-wide. Overrides featured field. Only one item can be featured site-wide.';
