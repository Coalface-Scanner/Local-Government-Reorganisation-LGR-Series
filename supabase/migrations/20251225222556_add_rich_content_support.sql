/*
  # Add Rich Content Support for Materials and Interviews

  ## Overview
  This migration enhances the materials and interviews tables to support rich content including:
  - Rich text editing with HTML/formatting
  - Multiple images and media elements
  - Different interview formats (on camera, voice only, written)

  ## Changes to Materials Table
  
  ### New Columns
  - `rich_content` (jsonb) - Stores rich text content with HTML formatting and embedded elements
  - `main_image_url` (text) - Primary featured image for the material
  - `additional_images` (jsonb) - Array of additional images/media with metadata
  
  ## Changes to Interviews Table
  
  ### New Columns
  - `interview_type` (text) - Type of interview: 'on_camera', 'voice_only', or 'written_only'
  - `audio_url` (text) - URL to audio file for voice-only interviews
  - `transcript` (text) - Full text transcript of the interview

  ## Important Notes
  1. Existing content field remains for backward compatibility
  2. Rich content is stored as JSONB for flexibility and future expansion
  3. All new fields are nullable to allow gradual migration
  4. Interview type defaults to 'written_only' for existing records
*/

-- Add new columns to materials table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'rich_content'
  ) THEN
    ALTER TABLE materials ADD COLUMN rich_content jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'main_image_url'
  ) THEN
    ALTER TABLE materials ADD COLUMN main_image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'additional_images'
  ) THEN
    ALTER TABLE materials ADD COLUMN additional_images jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add new columns to interviews table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'interviews' AND column_name = 'interview_type'
  ) THEN
    ALTER TABLE interviews ADD COLUMN interview_type text DEFAULT 'written_only';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'interviews' AND column_name = 'audio_url'
  ) THEN
    ALTER TABLE interviews ADD COLUMN audio_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'interviews' AND column_name = 'transcript'
  ) THEN
    ALTER TABLE interviews ADD COLUMN transcript text;
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_materials_main_image ON materials(main_image_url) WHERE main_image_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_interviews_type ON interviews(interview_type);

-- Add check constraint for interview_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'interviews_type_check'
  ) THEN
    ALTER TABLE interviews ADD CONSTRAINT interviews_type_check 
      CHECK (interview_type IN ('on_camera', 'voice_only', 'written_only'));
  END IF;
END $$;
