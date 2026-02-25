/*
  # Add navigation links to site updates

  1. Changes
    - Add `link_page` field to store which page to navigate to
    - Add `link_slug` field to store optional slug for articles
    - Update existing site updates with proper links
    
  2. Purpose
    - Allows updates in the Latest Updates box to be clickable
    - Links users directly to the content being referenced
    - Improves user experience and site navigation
*/

-- Add link fields to site_updates table
ALTER TABLE site_updates 
ADD COLUMN IF NOT EXISTS link_page text,
ADD COLUMN IF NOT EXISTS link_slug text;

-- Update existing records with proper links
UPDATE site_updates 
SET 
  link_page = 'article',
  link_slug = 'tim-oliver-interview-lgr-surrey'
WHERE title = 'Tim Oliver interview published with full content';

UPDATE site_updates 
SET 
  link_page = 'surrey'
WHERE title = 'Surrey devolution analysis updated with latest data';

UPDATE site_updates 
SET 
  link_page = 'materials'
WHERE title = 'New materials added to library section';

UPDATE site_updates 
SET 
  link_page = 'facts'
WHERE title = 'Facts & Figures page updated with 2025 statistics';

UPDATE site_updates 
SET 
  link_page = '100days'
WHERE title = 'First 100 Days playbook enhanced with new recommendations';
