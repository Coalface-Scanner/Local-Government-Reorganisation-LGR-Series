/*
  # Create materials table for LGR Hub

  1. New Tables
    - `materials`
      - `id` (uuid, primary key) - Unique identifier for each material
      - `title` (text) - Title of the material
      - `slug` (text, unique) - URL-friendly version of the title
      - `description` (text) - Brief description/excerpt
      - `content` (text) - Full content (can be null for external resources)
      - `published_date` (timestamptz) - When the material was published
      - `read_count` (integer) - Number of views/reads
      - `editors_pick` (boolean) - Whether this is an editor's pick
      - `type` (text) - Type of material (Insight, Explainer, Case study, etc.)
      - `geography` (text) - Geographic focus
      - `theme` (text) - Primary theme
      - `audience` (text[]) - Array of target audiences
      - `lgr_phase` (text) - Relevant LGR phase
      - `format` (text) - Format of the material
      - `author` (text) - Author or author type
      - `author_name` (text) - Specific author name if applicable
      - `image_url` (text) - Featured image URL
      - `pdf_url` (text) - PDF download URL if applicable
      - `external_url` (text) - External link if applicable
      - `featured` (boolean) - Whether to feature in rolling banner
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `materials` table
    - Add policy for public read access (materials are publicly viewable)
    - Add policy for authenticated admin users to manage materials

  3. Indexes
    - Index on published_date for sorting
    - Index on slug for fast lookups
    - Index on type, geography, theme for filtering
*/

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  published_date timestamptz DEFAULT now(),
  read_count integer DEFAULT 0,
  editors_pick boolean DEFAULT false,
  type text NOT NULL,
  geography text,
  theme text,
  audience text[] DEFAULT '{}',
  lgr_phase text,
  format text NOT NULL,
  author text,
  author_name text,
  image_url text,
  pdf_url text,
  external_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Materials are publicly readable"
  ON materials
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert materials"
  ON materials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update materials"
  ON materials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete materials"
  ON materials
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS materials_published_date_idx ON materials(published_date DESC);
CREATE INDEX IF NOT EXISTS materials_slug_idx ON materials(slug);
CREATE INDEX IF NOT EXISTS materials_type_idx ON materials(type);
CREATE INDEX IF NOT EXISTS materials_geography_idx ON materials(geography);
CREATE INDEX IF NOT EXISTS materials_theme_idx ON materials(theme);
CREATE INDEX IF NOT EXISTS materials_read_count_idx ON materials(read_count DESC);
CREATE INDEX IF NOT EXISTS materials_featured_idx ON materials(featured) WHERE featured = true;
