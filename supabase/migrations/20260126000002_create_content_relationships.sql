/*
  # Create Content Relationships Table

  This migration creates a table to manage relationships between content items,
  enabling features like "related articles", "see also" sections, and content dependencies.

  1. New Table
    - `content_relationships` - Links between content items
      - `id` (uuid) - Primary key
      - `source_type` (text) - Type of source content (articles, materials, news)
      - `source_id` (uuid) - ID of source content
      - `target_type` (text) - Type of target content
      - `target_id` (uuid) - ID of target content
      - `relationship_type` (text) - Type of relationship (related, see_also, parent, child, depends_on)
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz) - Creation timestamp
  
  2. Features
    - Bidirectional relationships (can query from either direction)
    - Multiple relationship types
    - Ordered relationships for display
*/

CREATE TABLE IF NOT EXISTS content_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL CHECK (source_type IN ('articles', 'materials', 'news')),
  source_id uuid NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('articles', 'materials', 'news')),
  target_id uuid NOT NULL,
  relationship_type text NOT NULL DEFAULT 'related' CHECK (relationship_type IN ('related', 'see_also', 'parent', 'child', 'depends_on')),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  
  -- Prevent duplicate relationships
  UNIQUE(source_type, source_id, target_type, target_id, relationship_type),
  
  -- Prevent self-references
  CHECK (source_type != target_type OR source_id != target_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_content_relationships_source ON content_relationships(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_content_relationships_target ON content_relationships(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_content_relationships_type ON content_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS idx_content_relationships_display_order ON content_relationships(source_type, source_id, relationship_type, display_order);

-- Function to get related content (bidirectional)
CREATE OR REPLACE FUNCTION get_related_content(
  p_content_type text,
  p_content_id uuid,
  p_relationship_type text DEFAULT 'related'
)
RETURNS TABLE (
  content_type text,
  content_id uuid,
  relationship_type text,
  display_order integer
) AS $$
BEGIN
  RETURN QUERY
  -- Get content where this is the source
  SELECT 
    cr.target_type,
    cr.target_id,
    cr.relationship_type,
    cr.display_order
  FROM content_relationships cr
  WHERE cr.source_type = p_content_type
    AND cr.source_id = p_content_id
    AND cr.relationship_type = p_relationship_type
  
  UNION
  
  -- Get content where this is the target (reverse relationship)
  SELECT 
    cr.source_type,
    cr.source_id,
    cr.relationship_type,
    cr.display_order
  FROM content_relationships cr
  WHERE cr.target_type = p_content_type
    AND cr.target_id = p_content_id
    AND cr.relationship_type = p_relationship_type
  
  ORDER BY display_order, created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE content_relationships ENABLE ROW LEVEL SECURITY;

-- Public can read relationships
CREATE POLICY "Anyone can read content relationships"
  ON content_relationships
  FOR SELECT
  USING (true);

-- Authenticated users can manage relationships
CREATE POLICY "Authenticated users can insert content relationships"
  ON content_relationships
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update content relationships"
  ON content_relationships
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete content relationships"
  ON content_relationships
  FOR DELETE
  TO authenticated
  USING (true);

-- Comments
COMMENT ON TABLE content_relationships IS 'Manages relationships between content items (articles, materials, news)';
COMMENT ON COLUMN content_relationships.relationship_type IS 'Type of relationship: related (general), see_also (recommended reading), parent/child (hierarchical), depends_on (dependency)';
