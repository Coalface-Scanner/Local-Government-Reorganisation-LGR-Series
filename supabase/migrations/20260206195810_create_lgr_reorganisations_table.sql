/*
  # Create LGR Reorganisations Table

  This migration creates a table to store information about local government reorganisations
  in England since 2010, with support for filtering by year and type.

  1. New Tables
    - `lgr_reorganisations`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Name of the reorganisation (e.g., "Buckinghamshire Unitary")
      - `year` (integer) - Year the reorganisation took effect
      - `type` (text) - Type: 'unitary_creation', 'merger', 'boundary_change', 'abolition'
      - `description` (text, nullable) - Description of the reorganisation
      - `councils_involved` (text[]) - Array of council names involved
      - `effective_date` (date, nullable) - Specific date if known
      - `status` (text) - 'completed', 'proposed', 'cancelled' (default: 'completed')
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Indexes
    - Index on `year` for efficient year filtering
    - Index on `type` for efficient type filtering
    - Index on `status` for filtering by status

  3. Security
    - Enable RLS on `lgr_reorganisations` table
    - Add policy for public read access (reorganisation data is public information)
*/

-- Create lgr_reorganisations table
CREATE TABLE IF NOT EXISTS lgr_reorganisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  year integer NOT NULL,
  type text NOT NULL CHECK (type IN ('unitary_creation', 'merger', 'boundary_change', 'abolition')),
  description text,
  councils_involved text[] DEFAULT '{}',
  effective_date date,
  status text DEFAULT 'completed' CHECK (status IN ('completed', 'proposed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for efficient filtering
CREATE INDEX IF NOT EXISTS idx_lgr_reorganisations_year ON lgr_reorganisations(year);
CREATE INDEX IF NOT EXISTS idx_lgr_reorganisations_type ON lgr_reorganisations(type);
CREATE INDEX IF NOT EXISTS idx_lgr_reorganisations_status ON lgr_reorganisations(status);

-- Create index on year and type together for combined filtering
CREATE INDEX IF NOT EXISTS idx_lgr_reorganisations_year_type ON lgr_reorganisations(year, type);

-- Enable Row Level Security
ALTER TABLE lgr_reorganisations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reorganisation data (public information)
CREATE POLICY "Anyone can view reorganisations"
  ON lgr_reorganisations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_lgr_reorganisations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_lgr_reorganisations_updated_at
  BEFORE UPDATE ON lgr_reorganisations
  FOR EACH ROW
  EXECUTE FUNCTION update_lgr_reorganisations_updated_at();
