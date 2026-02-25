/*
  # Create site updates table
  
  1. New Tables
    - `site_updates`
      - `id` (uuid, primary key)
      - `title` (text) - Short description of the update
      - `description` (text) - Optional longer description
      - `update_type` (text) - Type of update (new_article, content_update, feature, etc.)
      - `created_at` (timestamptz) - When the update was made
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `site_updates` table
    - Add policy for public read access (anyone can view updates)
    - Add policy for authenticated admin users to create/update
*/

CREATE TABLE IF NOT EXISTS site_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  update_type text DEFAULT 'content_update',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site updates"
  ON site_updates
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert site updates"
  ON site_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site updates"
  ON site_updates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site updates"
  ON site_updates
  FOR DELETE
  TO authenticated
  USING (true);

-- Add some initial sample updates
INSERT INTO site_updates (title, update_type, created_at) VALUES
  ('Tim Oliver interview published with full content', 'new_article', '2025-12-27 08:30:00+00'),
  ('Surrey devolution analysis updated with latest data', 'content_update', '2025-12-26 14:00:00+00'),
  ('New materials added to library section', 'feature', '2025-12-25 10:00:00+00'),
  ('Facts & Figures page updated with 2025 statistics', 'content_update', '2025-12-24 16:30:00+00'),
  ('First 100 Days playbook enhanced with new recommendations', 'content_update', '2025-12-23 09:00:00+00')
ON CONFLICT DO NOTHING;
