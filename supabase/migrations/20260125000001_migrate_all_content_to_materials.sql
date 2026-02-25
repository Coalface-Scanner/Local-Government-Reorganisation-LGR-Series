/*
  # Migrate All Content to Materials Library

  This migration copies all existing content (articles and news) into the materials table
  to make materials the central repository for all site content.

  1. Articles Migration
    - Copy all articles to materials table
    - Map fields: excerpt -> description, body -> content, featured_image -> image_url
    - Set content_type based on article category or default to 'Article'
    - Preserve theme, geography, lgr_phase, author, etc.
    - Skip if material with same slug already exists

  2. News Migration
    - Copy all published news items to materials table
    - Map fields: excerpt -> description, content -> content
    - Set content_type to 'News Update'
    - Set type to 'Commentary' and format to 'Article'
    - Skip if material with same slug already exists

  3. Duplicate Handling
    - Use ON CONFLICT DO NOTHING to skip existing slugs
    - Log migration statistics
*/

-- ============================================
-- MIGRATE ARTICLES TO MATERIALS
-- ============================================
-- Use columns that definitely exist, and handle optional ones safely
INSERT INTO materials (
  id, title, slug, description, content, rich_content, published_date, status,
  content_type, featured_theme, featured_site, theme, geography, lgr_phase,
  author, author_name, main_image_url, type, format, featured, created_at, updated_at
)
SELECT 
  gen_random_uuid(),
  a.title,
  a.slug,
  a.excerpt AS description,
  a.body AS content,
  NULL AS rich_content,
  COALESCE(a.published_date, a.created_at) AS published_date,
  COALESCE(a.status, 'published') AS status,
  CASE
    WHEN a.category ILIKE '%news%' OR a.category ILIKE '%update%' THEN 'News Update'
    WHEN a.category ILIKE '%interview%' THEN 'Interview'
    WHEN a.category ILIKE '%research%' OR a.category ILIKE '%study%' THEN 'Research'
    WHEN a.category ILIKE '%lesson%' THEN 'Lesson'
    WHEN a.category ILIKE '%faq%' THEN 'FAQ'
    ELSE 'Article'
  END AS content_type,
  false AS featured_theme, -- Will be updated if column exists
  false AS featured_site, -- Will be updated if column exists
  NULL AS theme, -- Will be updated if column exists
  a.region AS geography, -- Use region (always exists)
  NULL AS lgr_phase, -- Will be updated if column exists
  a.author,
  a.author AS author_name,
  a.featured_image AS main_image_url,
  CASE
    WHEN a.category ILIKE '%insight%' THEN 'Insight'
    WHEN a.category ILIKE '%explainer%' THEN 'Explainer'
    WHEN a.category ILIKE '%case study%' THEN 'Case study'
    WHEN a.category ILIKE '%report%' THEN 'Report'
    WHEN a.category ILIKE '%interview%' THEN 'Interview'
    ELSE 'Insight'
  END AS type,
  'Article' AS format,
  COALESCE(a.featured, false) AS featured,
  a.created_at,
  COALESCE(a.updated_at, a.created_at) AS updated_at
FROM articles a
WHERE NOT EXISTS (
  SELECT 1 FROM materials m WHERE m.slug = a.slug
)
ON CONFLICT (slug) DO NOTHING;

-- Update optional fields if columns exist (using a safe approach)
DO $$
BEGIN
  -- Update content_type if the column exists in articles
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'content_type') THEN
    UPDATE materials m
    SET content_type = a.content_type
    FROM articles a
    WHERE m.slug = a.slug AND a.content_type IS NOT NULL;
  END IF;

  -- Update featured_theme if the column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'featured_theme') THEN
    UPDATE materials m
    SET featured_theme = a.featured_theme
    FROM articles a
    WHERE m.slug = a.slug AND a.featured_theme = true;
  END IF;

  -- Update featured_site if the column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'featured_site') THEN
    UPDATE materials m
    SET featured_site = a.featured_site
    FROM articles a
    WHERE m.slug = a.slug AND a.featured_site = true;
  END IF;

  -- Update theme if the column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'theme') THEN
    UPDATE materials m
    SET theme = a.theme
    FROM articles a
    WHERE m.slug = a.slug AND a.theme IS NOT NULL;
  END IF;

  -- Update lgr_phase if the column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'lgr_phase') THEN
    UPDATE materials m
    SET lgr_phase = a.lgr_phase
    FROM articles a
    WHERE m.slug = a.slug AND a.lgr_phase IS NOT NULL;
  END IF;
END $$;

-- Log articles migration
DO $$
DECLARE
  articles_count integer;
  migrated_count integer;
BEGIN
  SELECT COUNT(*) INTO articles_count FROM articles;
  SELECT COUNT(*) INTO migrated_count 
  FROM materials 
  WHERE slug IN (SELECT slug FROM articles);
  
  RAISE NOTICE 'Articles migration: % articles found, % migrated to materials', articles_count, migrated_count;
END $$;

-- ============================================
-- MIGRATE NEWS TO MATERIALS
-- ============================================

INSERT INTO materials (
  id,
  title,
  slug,
  description,
  content,
  rich_content,
  published_date,
  status,
  content_type,
  featured_theme,
  featured_site,
  theme,
  geography,
  lgr_phase,
  type,
  format,
  author,
  author_name,
  main_image_url,
  featured,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(), -- Generate new ID to avoid conflicts
  n.title,
  n.slug,
  n.excerpt AS description,
  COALESCE(n.content, '') AS content,
  NULL AS rich_content,
  n.published_date::timestamptz AS published_date,
  CASE WHEN n.published THEN 'published' ELSE 'draft' END AS status,
  'News Update' AS content_type,
  false AS featured_theme,
  false AS featured_site,
  'Public trust and engagement' AS theme, -- Default theme for news
  NULL AS geography, -- News doesn't have geography
  NULL AS lgr_phase, -- News doesn't have LGR phase
  'Commentary' AS type,
  'Article' AS format,
  'Coalface editorial' AS author,
  'Coalface editorial' AS author_name,
  NULL AS main_image_url, -- News doesn't have featured images
  false AS featured,
  n.created_at,
  COALESCE(n.updated_at, n.created_at) AS updated_at
FROM news n
WHERE NOT EXISTS (
  SELECT 1 FROM materials m WHERE m.slug = n.slug
)
ON CONFLICT (slug) DO NOTHING;

-- Log news migration
DO $$
DECLARE
  news_count integer;
  migrated_news_count integer;
BEGIN
  SELECT COUNT(*) INTO news_count FROM news;
  SELECT COUNT(*) INTO migrated_news_count 
  FROM materials 
  WHERE slug IN (SELECT slug FROM news);
  
  RAISE NOTICE 'News migration: % news items found, % migrated to materials', news_count, migrated_news_count;
END $$;

-- ============================================
-- SUMMARY
-- ============================================

DO $$
DECLARE
  total_materials integer;
  articles_migrated integer;
  news_migrated integer;
BEGIN
  SELECT COUNT(*) INTO total_materials FROM materials;
  SELECT COUNT(*) INTO articles_migrated 
  FROM materials 
  WHERE slug IN (SELECT slug FROM articles);
  SELECT COUNT(*) INTO news_migrated 
  FROM materials 
  WHERE slug IN (SELECT slug FROM news);
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration Summary:';
  RAISE NOTICE 'Total materials in library: %', total_materials;
  RAISE NOTICE 'Articles migrated: %', articles_migrated;
  RAISE NOTICE 'News items migrated: %', news_migrated;
  RAISE NOTICE '========================================';
END $$;

-- Update any materials that don't have content_type set
UPDATE materials
SET content_type = 'Article'
WHERE content_type IS NULL;

-- Update any materials that don't have status set
UPDATE materials
SET status = 'published'
WHERE status IS NULL;
