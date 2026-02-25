/*
  # Automate Latest Updates Section
  
  1. Changes
    - Add `source_type` column to track content type ('article', 'material', 'news')
    - Add `source_id` column to reference the original content's ID
    - Create database triggers to automatically create site updates when content is published
    
  2. Purpose
    - Automatically populate the Latest Updates section when articles, materials, or news are published
    - Prevent duplicate updates through source tracking
    - Eliminate manual work of creating updates
    - Only create updates when content transitions from draft/unpublished to published
*/

-- Add source tracking columns to site_updates table
ALTER TABLE site_updates 
ADD COLUMN IF NOT EXISTS source_type text,
ADD COLUMN IF NOT EXISTS source_id uuid;

-- Create index for duplicate checking
CREATE INDEX IF NOT EXISTS idx_site_updates_source ON site_updates(source_type, source_id) 
WHERE source_type IS NOT NULL AND source_id IS NOT NULL;

-- Function to create site update for articles
CREATE OR REPLACE FUNCTION create_article_site_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create update if article is being published
  -- Check if this is a new published article OR status changed from draft to published
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published') THEN
    -- Check if update already exists for this article
    IF NOT EXISTS (
      SELECT 1 FROM site_updates 
      WHERE source_type = 'article' AND source_id = NEW.id
    ) THEN
      -- Insert new site update
      INSERT INTO site_updates (
        title,
        update_type,
        link_page,
        link_slug,
        source_type,
        source_id,
        created_at
      ) VALUES (
        'New article: ' || NEW.title,
        'new_article',
        'insights',
        NEW.slug,
        'article',
        NEW.id,
        now()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create site update for materials
CREATE OR REPLACE FUNCTION create_material_site_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create update if material is being published
  -- Check if this is a new published material OR status changed from draft to published
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published') THEN
    -- Check if update already exists for this material
    IF NOT EXISTS (
      SELECT 1 FROM site_updates 
      WHERE source_type = 'material' AND source_id = NEW.id
    ) THEN
      -- Insert new site update
      INSERT INTO site_updates (
        title,
        update_type,
        link_page,
        link_slug,
        source_type,
        source_id,
        created_at
      ) VALUES (
        'New material: ' || NEW.title,
        'content_update',
        'materials',
        NULL,
        'material',
        NEW.id,
        now()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create site update for news
CREATE OR REPLACE FUNCTION create_news_site_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create update if news is being published
  -- Check if this is a new published news item OR published changed from false to true
  IF NEW.published = true AND (OLD IS NULL OR OLD.published != true) THEN
    -- Check if update already exists for this news item
    IF NOT EXISTS (
      SELECT 1 FROM site_updates 
      WHERE source_type = 'news' AND source_id = NEW.id
    ) THEN
      -- Insert new site update
      INSERT INTO site_updates (
        title,
        update_type,
        link_page,
        link_slug,
        source_type,
        source_id,
        created_at
      ) VALUES (
        'News update: ' || NEW.title,
        'content_update',
        'news',
        NEW.slug,
        'news',
        NEW.id,
        now()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for articles
DROP TRIGGER IF EXISTS trigger_create_article_site_update ON articles;
CREATE TRIGGER trigger_create_article_site_update
  AFTER INSERT OR UPDATE OF status ON articles
  FOR EACH ROW
  EXECUTE FUNCTION create_article_site_update();

-- Create triggers for materials
DROP TRIGGER IF EXISTS trigger_create_material_site_update ON materials;
CREATE TRIGGER trigger_create_material_site_update
  AFTER INSERT OR UPDATE OF status ON materials
  FOR EACH ROW
  EXECUTE FUNCTION create_material_site_update();

-- Create triggers for news
DROP TRIGGER IF EXISTS trigger_create_news_site_update ON news;
CREATE TRIGGER trigger_create_news_site_update
  AFTER INSERT OR UPDATE OF published ON news
  FOR EACH ROW
  EXECUTE FUNCTION create_news_site_update();
