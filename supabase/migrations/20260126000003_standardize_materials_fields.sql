/*
  # Standardize Materials Fields

  This migration adds standardized field names to materials table for consistency with articles,
  while maintaining backward compatibility with existing fields.

  1. New Fields
    - `excerpt` (text) - Alias/synonym for `description` (for consistency with articles)
    - Ensure `featured_image` column exists (may alias `main_image_url`)
  
  2. Changes
    - Add excerpt column (can be populated from description)
    - Add featured_image column if it doesn't exist
    - Maintain backward compatibility - both old and new field names work
*/

-- Add excerpt column (for consistency with articles)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE materials ADD COLUMN excerpt text;
    
    -- Populate excerpt from description for existing records
    UPDATE materials
    SET excerpt = description
    WHERE excerpt IS NULL AND description IS NOT NULL;
    
    RAISE NOTICE 'Added excerpt column to materials table';
  END IF;
END $$;

-- Add featured_image column (for consistency with articles)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE materials ADD COLUMN featured_image text;
    
    -- Populate featured_image from main_image_url for existing records
    UPDATE materials
    SET featured_image = main_image_url
    WHERE featured_image IS NULL AND main_image_url IS NOT NULL;
    
    RAISE NOTICE 'Added featured_image column to materials table';
  END IF;
END $$;

-- Add category field if it doesn't exist (for standardized taxonomy)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'category'
  ) THEN
    ALTER TABLE materials ADD COLUMN category text;
    RAISE NOTICE 'Added category column to materials table';
  END IF;
END $$;

-- Add region field if it doesn't exist (for standardized taxonomy)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'region'
  ) THEN
    ALTER TABLE materials ADD COLUMN region text;
    
    -- Populate region from geography for existing records
    UPDATE materials
    SET region = geography
    WHERE region IS NULL AND geography IS NOT NULL;
    
    RAISE NOTICE 'Added region column to materials table';
  END IF;
END $$;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_materials_excerpt ON materials(excerpt) WHERE excerpt IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_materials_featured_image ON materials(featured_image) WHERE featured_image IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category) WHERE category IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_materials_region ON materials(region) WHERE region IS NOT NULL;

-- Comments
COMMENT ON COLUMN materials.excerpt IS 'Short summary/excerpt (synonym for description, for consistency with articles)';
COMMENT ON COLUMN materials.featured_image IS 'Featured image URL (synonym for main_image_url, for consistency with articles)';
COMMENT ON COLUMN materials.category IS 'Content category (standardized taxonomy)';
COMMENT ON COLUMN materials.region IS 'Geographic region (standardized taxonomy, synonym for geography)';
