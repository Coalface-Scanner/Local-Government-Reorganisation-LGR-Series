/*
  # Update Article Themes

  This migration updates specific articles with their correct theme tags
  to ensure they appear in the correct topic hubs.

  Articles to update:
  1. "New Maps, Old Rules: Does the 'Super-Council' Demand a New Voting System?" -> Democracy
  2. "Roadmap to Reform: The Local Government Reorganisation Timetable 2025–2028" -> Local Government
  3. "the-democratic-deficit-why-bigger-government-forces-harder-democratic-trade-offs" -> Public Design
*/

-- Ensure theme column exists (required for this migration)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'theme'
  ) THEN
    ALTER TABLE articles ADD COLUMN theme text;
    RAISE NOTICE 'Added theme column to articles table';
  ELSE
    RAISE NOTICE 'Theme column already exists';
  END IF;
END $$;

-- Also ensure category column exists (used as fallback)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'category'
  ) THEN
    ALTER TABLE articles ADD COLUMN category text;
    RAISE NOTICE 'Added category column to articles table';
  END IF;
END $$;

-- Update article themes based on title patterns or slugs
-- Note: Run this migration to tag existing articles with themes

-- Update "New Maps, Old Rules" article -> Democracy
UPDATE articles
SET theme = 'Democracy',
    updated_at = NOW()
WHERE (
  title ILIKE '%New Maps, Old Rules%' 
  OR title ILIKE '%Super-Council%'
  OR title ILIKE '%Voting System%'
  OR slug ILIKE '%super-council%'
  OR slug ILIKE '%voting-system%'
  OR slug ILIKE '%new-maps-old-rules%'
)
AND status = 'published';

-- Show what was updated
DO $$
DECLARE
  updated_count integer;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM articles
  WHERE theme = 'Democracy'
  AND status = 'published';
  RAISE NOTICE 'Updated % articles with Democracy theme', updated_count;
END $$;

-- Update "Roadmap to Reform" article -> Local Government
UPDATE articles
SET theme = 'Local Government',
    updated_at = NOW()
WHERE (
  title ILIKE '%Roadmap to Reform%'
  OR title ILIKE '%Local Government Reorganisation Timetable%'
  OR title ILIKE '%2025–2028%'
  OR title ILIKE '%2025-2028%'
  OR slug ILIKE '%roadmap-to-reform%'
  OR slug ILIKE '%timetable%'
  OR slug ILIKE '%roadmap%'
)
AND status = 'published';

-- Show what was updated
DO $$
DECLARE
  updated_count integer;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM articles
  WHERE theme = 'Local Government'
  AND status = 'published';
  RAISE NOTICE 'Updated % articles with Local Government theme', updated_count;
END $$;

-- Update "the-democratic-deficit" article -> Public Design
UPDATE articles
SET theme = 'Public Design',
    updated_at = NOW()
WHERE (
  slug = 'the-democratic-deficit-why-bigger-government-forces-harder-democratic-trade-offs'
  OR slug ILIKE '%democratic-deficit%'
  OR slug ILIKE '%democratic-deficit%'
  OR title ILIKE '%democratic deficit%'
  OR title ILIKE '%bigger government%'
  OR title ILIKE '%democratic trade-offs%'
  OR title ILIKE '%democratic trade-offs%'
)
AND status = 'published';

-- Show what was updated
DO $$
DECLARE
  updated_count integer;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM articles
  WHERE theme = 'Public Design'
  AND status = 'published';
  RAISE NOTICE 'Updated % articles with Public Design theme', updated_count;
END $$;

-- Show summary of all articles with themes
SELECT theme, COUNT(*) as count
FROM articles
WHERE status = 'published'
AND theme IS NOT NULL
GROUP BY theme
ORDER BY count DESC;

-- Also update category field as fallback if theme is not set
UPDATE articles
SET category = 'Democracy',
    updated_at = NOW()
WHERE (
  title ILIKE '%New Maps, Old Rules%' 
  OR title ILIKE '%Super-Council%'
  OR title ILIKE '%Voting System%'
  OR slug ILIKE '%super-council%'
  OR slug ILIKE '%voting-system%'
)
AND status = 'published'
AND (theme IS NULL OR theme = '');

UPDATE articles
SET category = 'Local Government',
    updated_at = NOW()
WHERE (
  title ILIKE '%Roadmap to Reform%'
  OR title ILIKE '%Local Government Reorganisation Timetable%'
  OR title ILIKE '%2025–2028%'
  OR slug ILIKE '%roadmap-to-reform%'
  OR slug ILIKE '%timetable%'
)
AND status = 'published'
AND (theme IS NULL OR theme = '');

UPDATE articles
SET category = 'Public Design',
    updated_at = NOW()
WHERE (
  slug = 'the-democratic-deficit-why-bigger-government-forces-harder-democratic-trade-offs'
  OR slug ILIKE '%democratic-deficit%'
  OR title ILIKE '%democratic deficit%'
  OR title ILIKE '%bigger government%'
  OR title ILIKE '%democratic trade-offs%'
)
AND status = 'published'
AND (theme IS NULL OR theme = '');
