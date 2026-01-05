/*
  # Create site metadata table

  1. New Tables
    - `site_metadata`
      - `id` (integer, primary key) - Always set to 1 for singleton pattern
      - `last_updated` (timestamptz) - Timestamp of last content update
      - `updated_at` (timestamptz) - When this record was last modified
  
  2. Security
    - Enable RLS on `site_metadata` table
    - Add policy for public read access
    - Add policy for authenticated users to update
  
  3. Initial Data
    - Insert default record with current timestamp
*/

CREATE TABLE IF NOT EXISTS site_metadata (
  id integer PRIMARY KEY DEFAULT 1,
  last_updated timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial record
INSERT INTO site_metadata (id, last_updated, updated_at)
VALUES (1, now(), now())
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_metadata ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can read site metadata"
  ON site_metadata
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update site metadata"
  ON site_metadata
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
