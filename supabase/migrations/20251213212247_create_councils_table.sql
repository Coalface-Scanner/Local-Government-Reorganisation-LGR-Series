/*
  # Create councils table for UK local authority data

  1. New Tables
    - `councils`
      - `id` (uuid, primary key) - Unique identifier
      - `code` (text, unique) - Official local authority district code (e.g., "E06000001")
      - `short_code` (text) - Abbreviated code (e.g., "00EB")
      - `name` (text) - Council/district name in English
      - `welsh_name` (text, nullable) - Welsh name where applicable
      - `country` (text) - Country (England, Scotland, Wales, Northern Ireland)
      - `geometry` (jsonb) - GeoJSON geometry data for map boundaries
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `councils` table
    - Add policy for public read access (map data is public information)
*/

-- Create councils table
CREATE TABLE IF NOT EXISTS councils (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  short_code text,
  name text NOT NULL,
  welsh_name text,
  country text NOT NULL,
  geometry jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE councils ENABLE ROW LEVEL SECURITY;

-- Allow public read access to council data (geographic boundaries are public information)
CREATE POLICY "Anyone can view council data"
  ON councils
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create index on country for efficient filtering
CREATE INDEX IF NOT EXISTS idx_councils_country ON councils(country);

-- Create index on name for searching
CREATE INDEX IF NOT EXISTS idx_councils_name ON councils(name);