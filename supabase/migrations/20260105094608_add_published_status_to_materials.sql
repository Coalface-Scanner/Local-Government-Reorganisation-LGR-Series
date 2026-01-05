/*
  # Add Published Status to Materials

  1. Changes
    - Add `status` column to materials table with values 'draft' or 'published'
    - Set default to 'published' for existing articles
    - Add tags column as text array for filtering
  
  2. Notes
    - All existing materials will be marked as published
    - Tags will support filtering on the insights page
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'status'
  ) THEN
    ALTER TABLE materials ADD COLUMN status text DEFAULT 'published' CHECK (status IN ('draft', 'published'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'tags'
  ) THEN
    ALTER TABLE materials ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_materials_status ON materials(status);
CREATE INDEX IF NOT EXISTS idx_materials_published_date ON materials(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_materials_tags ON materials USING GIN(tags);