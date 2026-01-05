/*
  # Migrate Materials to Articles (v3)

  1. Purpose
    - Copy published articles from materials table to articles table
    - Map fields appropriately for new article structure
    - Handle articles with missing body content

  2. Field Mapping
    - materials.title -> articles.title
    - materials.slug -> articles.slug
    - materials.description -> articles.excerpt (strip HTML tags)
    - materials.content (with fallback to description) -> articles.body
    - materials.main_image_url or materials.image_url -> articles.featured_image
    - materials.status -> articles.status
    - materials.published_date -> articles.published_date
    - materials.created_at -> articles.created_at

  3. Notes
    - Only migrates published materials
    - Avoids duplicates by checking for existing slugs
    - Preserves original timestamps
    - Uses description as fallback if content is null
*/

-- Insert articles from materials, avoiding duplicates
INSERT INTO articles (
  title,
  slug,
  excerpt,
  body,
  featured_image,
  status,
  published_date,
  created_at
)
SELECT 
  m.title,
  m.slug,
  regexp_replace(COALESCE(m.description, ''), '<[^>]+>', '', 'g') as excerpt,
  COALESCE(m.content, m.description, '<p>Content coming soon</p>') as body,
  COALESCE(m.main_image_url, m.image_url) as featured_image,
  m.status,
  m.published_date,
  m.created_at
FROM materials m
WHERE m.status = 'published'
AND NOT EXISTS (
  SELECT 1 FROM articles a WHERE a.slug = m.slug
)
ORDER BY m.published_date DESC;
