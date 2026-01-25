/*
  # Create Taxonomy Tables for Standardized Content Classification

  This migration creates taxonomy tables to replace free-text category and region fields
  with standardized, consistent values across all content.

  1. New Tables
    - `content_categories` - Standardized content categories
    - `geography_regions` - Standardized geographic regions
  
  2. Changes
    - Create lookup tables with predefined values
    - Add foreign key relationships (optional, for future use)
    - Migrate existing free-text values to standardized values
*/

-- ============================================
-- CONTENT CATEGORIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Insert standard categories
INSERT INTO content_categories (name, description, display_order) VALUES
  ('Analysis', 'In-depth analysis and commentary', 1),
  ('News', 'News updates and announcements', 2),
  ('Opinion', 'Opinion pieces and editorials', 3),
  ('Research', 'Research findings and studies', 4),
  ('Case Study', 'Case studies and examples', 5),
  ('Guide', 'How-to guides and tutorials', 6),
  ('Interview', 'Interviews and conversations', 7),
  ('Report', 'Reports and publications', 8),
  ('Update', 'Site and content updates', 9),
  ('Other', 'Other content types', 10)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- GEOGRAPHY REGIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS geography_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('National', 'Region', 'Combined Authority', 'County', 'Unitary', 'Local Area')),
  parent_id uuid REFERENCES geography_regions(id),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Insert standard regions
INSERT INTO geography_regions (name, type, display_order) VALUES
  ('National', 'National', 1),
  ('England', 'National', 2),
  ('Wales', 'National', 3),
  ('Scotland', 'National', 4),
  ('Northern Ireland', 'National', 5),
  ('London', 'Region', 10),
  ('South East', 'Region', 11),
  ('South West', 'Region', 12),
  ('East of England', 'Region', 13),
  ('West Midlands', 'Region', 14),
  ('East Midlands', 'Region', 15),
  ('Yorkshire and the Humber', 'Region', 16),
  ('North West', 'Region', 17),
  ('North East', 'Region', 18),
  ('Surrey', 'County', 20),
  ('Kent', 'County', 21),
  ('Essex', 'County', 22),
  ('Hampshire', 'County', 23),
  ('West Sussex', 'County', 24),
  ('East Sussex', 'County', 25),
  ('Greater Manchester', 'Combined Authority', 30),
  ('West Midlands', 'Combined Authority', 31),
  ('West Yorkshire', 'Combined Authority', 32),
  ('Liverpool City Region', 'Combined Authority', 33),
  ('South Yorkshire', 'Combined Authority', 34),
  ('North of Tyne', 'Combined Authority', 35),
  ('Tees Valley', 'Combined Authority', 36),
  ('Cambridgeshire and Peterborough', 'Combined Authority', 37),
  ('West of England', 'Combined Authority', 38)
ON CONFLICT (name) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_content_categories_name ON content_categories(name);
CREATE INDEX IF NOT EXISTS idx_content_categories_display_order ON content_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_geography_regions_name ON geography_regions(name);
CREATE INDEX IF NOT EXISTS idx_geography_regions_type ON geography_regions(type);
CREATE INDEX IF NOT EXISTS idx_geography_regions_display_order ON geography_regions(display_order);

-- ============================================
-- MIGRATE EXISTING DATA
-- ============================================

-- Migrate articles.category to match content_categories
-- This is a best-effort migration - some values may need manual review
UPDATE articles
SET category = CASE
  WHEN LOWER(category) IN ('analysis', 'analyses', 'analytical') THEN 'Analysis'
  WHEN LOWER(category) IN ('news', 'update', 'updates', 'announcement') THEN 'News'
  WHEN LOWER(category) IN ('opinion', 'editorial', 'commentary') THEN 'Opinion'
  WHEN LOWER(category) IN ('research', 'study', 'studies', 'findings') THEN 'Research'
  WHEN LOWER(category) IN ('case study', 'case-study', 'case_study', 'example') THEN 'Case Study'
  WHEN LOWER(category) IN ('guide', 'how-to', 'tutorial', 'tutorials') THEN 'Guide'
  WHEN LOWER(category) IN ('interview', 'interviews', 'conversation') THEN 'Interview'
  WHEN LOWER(category) IN ('report', 'reports', 'publication') THEN 'Report'
  WHEN LOWER(category) IN ('update', 'site update') THEN 'Update'
  WHEN category IS NULL OR category = '' THEN NULL
  ELSE 'Other'
END
WHERE category IS NOT NULL;

-- Migrate articles.region to match geography_regions
-- This is a best-effort migration
UPDATE articles
SET region = CASE
  WHEN LOWER(region) IN ('national', 'uk', 'united kingdom', 'britain') THEN 'National'
  WHEN LOWER(region) IN ('england', 'english') THEN 'England'
  WHEN LOWER(region) IN ('london', 'greater london') THEN 'London'
  WHEN LOWER(region) IN ('south east', 'southeast', 'south-east') THEN 'South East'
  WHEN LOWER(region) IN ('south west', 'southwest', 'south-west') THEN 'South West'
  WHEN LOWER(region) IN ('surrey') THEN 'Surrey'
  WHEN LOWER(region) IN ('kent') THEN 'Kent'
  WHEN LOWER(region) IN ('essex') THEN 'Essex'
  WHEN LOWER(region) IN ('hampshire', 'hants') THEN 'Hampshire'
  WHEN LOWER(region) IN ('greater manchester', 'manchester') THEN 'Greater Manchester'
  WHEN LOWER(region) IN ('west midlands') THEN 'West Midlands'
  WHEN region IS NULL OR region = '' THEN NULL
  ELSE region -- Keep original if no match found
END
WHERE region IS NOT NULL;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE content_categories IS 'Standardized content categories for consistent classification';
COMMENT ON TABLE geography_regions IS 'Standardized geographic regions for consistent location classification';
