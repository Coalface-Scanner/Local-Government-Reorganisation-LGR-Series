-- Diagnostic Query: Check Article Themes
-- Run this in Supabase SQL Editor to see what articles exist and their current theme values

-- First, ensure the theme column exists (run the migration if needed)
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

-- Check if articles exist with the expected slugs
SELECT 
  slug,
  title,
  theme,
  category,
  status,
  featured,
  published_date
FROM articles
WHERE slug IN (
  'the-democratic-deficit-why-bigger-government-forces-harder-democratic-trade-offs',
  'new-maps-old-rules-does-the-super-council-demand-a-new-voting-system',
  'roadmap-to-reform-the-local-government-reorganisation-timetable-2025-2028'
)
OR title ILIKE '%New Maps, Old Rules%'
OR title ILIKE '%Roadmap to Reform%'
OR title ILIKE '%democratic deficit%'
OR slug ILIKE '%super-council%'
OR slug ILIKE '%roadmap%'
OR slug ILIKE '%democratic-deficit%'
ORDER BY published_date DESC;

-- Check all published articles and their themes (if theme column exists)
SELECT 
  theme,
  category,
  COUNT(*) as count
FROM articles
WHERE status = 'published'
GROUP BY theme, category
ORDER BY count DESC;

-- Show all published articles (first 20)
SELECT 
  slug,
  title,
  theme,
  category,
  featured,
  published_date
FROM articles
WHERE status = 'published'
ORDER BY published_date DESC
LIMIT 20;
