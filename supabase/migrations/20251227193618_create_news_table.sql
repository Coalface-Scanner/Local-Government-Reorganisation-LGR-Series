/*
  # Create News Table

  1. New Tables
    - `news`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - News article title
      - `slug` (text, unique) - URL-friendly identifier
      - `published_date` (date) - Publication date
      - `content` (text) - Main article content (supports HTML)
      - `embed_code` (text, nullable) - Embed codes (e.g., Spotify iframes)
      - `excerpt` (text, nullable) - Short summary for listings
      - `published` (boolean, default false) - Publication status
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `display_order` (integer, default 0) - Manual ordering

  2. Security
    - Enable RLS on `news` table
    - Add policy for public to read published news
    - Add policy for authenticated admins to manage news

  3. Indexes
    - Index on `slug` for fast lookups
    - Index on `published_date` for sorting
    - Index on `published` for filtering
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  published_date date NOT NULL,
  content text NOT NULL DEFAULT '',
  embed_code text,
  excerpt text,
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Public can read published news
CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  USING (published = true);

-- Admins can manage all news
CREATE POLICY "Admins can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_display_order ON news(display_order, published_date DESC);