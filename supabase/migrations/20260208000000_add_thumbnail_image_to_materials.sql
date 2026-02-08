/*
  # Add thumbnail_image_url to materials table

  1. New Column
    - `thumbnail_image_url` (text, nullable) - Separate thumbnail image URL for materials
    - Allows materials to have a different thumbnail image than the main featured image

  2. Backward Compatibility
    - Existing materials will continue to use their main_image_url/featured_image
    - Display logic should fallback to main_image_url if thumbnail_image_url is null
*/

-- Add thumbnail_image_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'materials' AND column_name = 'thumbnail_image_url'
  ) THEN
    ALTER TABLE materials ADD COLUMN thumbnail_image_url text;
    RAISE NOTICE 'Added thumbnail_image_url column to materials table';
  ELSE
    RAISE NOTICE 'thumbnail_image_url column already exists in materials table';
  END IF;
END $$;

-- Add index for thumbnail_image_url
CREATE INDEX IF NOT EXISTS idx_materials_thumbnail_image ON materials(thumbnail_image_url) WHERE thumbnail_image_url IS NOT NULL;
