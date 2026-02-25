/*
  # Add Performance Indexes

  1. Indexes Added
    - materials table:
      - slug (for article lookups)
      - published_date (for sorting)
      - type, geography, theme (for filtering)
      - editors_pick (for featured content)

    - facts table:
      - category (for filtering)
      - order_index (for sorting)

    - lessons table:
      - category (for filtering)
      - order_index (for sorting)

    - interviews table:
      - order_index (for sorting)

    - site_updates table:
      - created_at (for sorting recent updates)

    - faqs table:
      - page (for page-specific lookups)
      - order_index (for sorting)

  2. Benefits
    - Faster article lookups by slug
    - Improved search and filter performance
    - Better sorting performance for lists
    - Reduced query times for frequently accessed data
*/

-- Materials table indexes
CREATE INDEX IF NOT EXISTS idx_materials_slug ON materials(slug);
CREATE INDEX IF NOT EXISTS idx_materials_published_date ON materials(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);
CREATE INDEX IF NOT EXISTS idx_materials_geography ON materials(geography);
CREATE INDEX IF NOT EXISTS idx_materials_theme ON materials(theme);
CREATE INDEX IF NOT EXISTS idx_materials_editors_pick ON materials(editors_pick) WHERE editors_pick = true;

-- Facts table indexes (if columns exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'facts' AND column_name = 'category') THEN
    CREATE INDEX IF NOT EXISTS idx_facts_category ON facts(category);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'facts' AND column_name = 'order_index') THEN
    CREATE INDEX IF NOT EXISTS idx_facts_order_index ON facts(order_index);
  END IF;
END $$;

-- Lessons table indexes (if columns exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'category') THEN
    CREATE INDEX IF NOT EXISTS idx_lessons_category ON lessons(category);
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lessons' AND column_name = 'order_index') THEN
    CREATE INDEX IF NOT EXISTS idx_lessons_order_index ON lessons(order_index);
  END IF;
END $$;

-- Interviews table indexes (if columns exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'interviews' AND column_name = 'order_index') THEN
    CREATE INDEX IF NOT EXISTS idx_interviews_order_index ON interviews(order_index);
  END IF;
END $$;

-- Site updates table indexes (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_updates') THEN
    CREATE INDEX IF NOT EXISTS idx_site_updates_created_at ON site_updates(created_at DESC);
  END IF;
END $$;

-- FAQs table indexes (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'faqs') THEN
    CREATE INDEX IF NOT EXISTS idx_faqs_page ON faqs(page);
    CREATE INDEX IF NOT EXISTS idx_faqs_order_index ON faqs(order_index);
  END IF;
END $$;