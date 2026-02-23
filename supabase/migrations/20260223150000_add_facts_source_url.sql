-- Add source_url to facts for source link at bottom of each fact
ALTER TABLE facts ADD COLUMN IF NOT EXISTS source_url text;
