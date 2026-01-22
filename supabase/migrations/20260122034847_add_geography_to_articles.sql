/*
  # Add Geography, Theme, and LGR Phase Fields to Articles Table

  1. Changes
    - Add `geography` field (text, nullable) - Geographic focus (matching materials table)
    - Add `theme` field (text, nullable) - Primary theme (matching materials table)
    - Add `lgr_phase` field (text, nullable) - Relevant LGR phase (matching materials table)
    - Create indexes on new fields for efficient filtering and SEO queries

  2. Purpose
    - Enable geography-based content clustering and internal linking
    - Support GEO optimization for SEO
    - Allow filtering articles by theme and LGR phase
    - Match structure of materials table for consistency

  3. Indexes
    - Index on geography for geographic filtering
    - Index on theme for theme-based queries
    - Index on lgr_phase for phase-based filtering
*/

-- Add geography field if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'geography'
  ) THEN
    ALTER TABLE articles ADD COLUMN geography text;
  END IF;
END $$;

-- Add theme field if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'theme'
  ) THEN
    ALTER TABLE articles ADD COLUMN theme text;
  END IF;
END $$;

-- Add lgr_phase field if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'lgr_phase'
  ) THEN
    ALTER TABLE articles ADD COLUMN lgr_phase text;
  END IF;
END $$;

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_articles_geography ON articles(geography);
CREATE INDEX IF NOT EXISTS idx_articles_theme ON articles(theme);
CREATE INDEX IF NOT EXISTS idx_articles_lgr_phase ON articles(lgr_phase);

-- Create composite index for common query patterns (geography + theme)
CREATE INDEX IF NOT EXISTS idx_articles_geography_theme ON articles(geography, theme);

-- Create composite index for status + geography (for published articles by geography)
CREATE INDEX IF NOT EXISTS idx_articles_status_geography ON articles(status, geography) WHERE status = 'published';
