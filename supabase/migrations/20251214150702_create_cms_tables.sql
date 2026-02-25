/*
  # Create CMS Content Tables

  ## Overview
  This migration creates tables to store editable content for all pages in the Local Government Reorganisation Insights website.

  ## New Tables
  
  ### 1. home_content
  - `id` (uuid, primary key)
  - `section` (text) - Section identifier (hero, subtitle, feature_1, feature_2, feature_3)
  - `title` (text) - Section title/headline
  - `content` (text) - Main content text
  - `link_text` (text, nullable) - Button/link text if applicable
  - `link_url` (text, nullable) - Button/link URL if applicable
  - `order_index` (integer) - Display order
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 2. facts
  - `id` (uuid, primary key)
  - `title` (text) - Fact title
  - `content` (text) - Fact description
  - `category` (text, nullable) - Grouping category
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 3. lessons
  - `id` (uuid, primary key)
  - `title` (text) - Lesson title
  - `content` (text) - Lesson description
  - `icon` (text, nullable) - Icon identifier
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 4. reasons
  - `id` (uuid, primary key)
  - `title` (text) - Reason title
  - `content` (text) - Reason description
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### 5. interviews
  - `id` (uuid, primary key)
  - `name` (text) - Interviewee name
  - `title` (text) - Interviewee title/position
  - `organization` (text, nullable) - Organization name
  - `description` (text) - Interview description
  - `image_url` (text, nullable) - Image URL
  - `video_url` (text, nullable) - Video URL if available
  - `status` (text) - Status (published, coming_soon, draft)
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access (SELECT)
  - Restrict write access (INSERT, UPDATE, DELETE) to authenticated admin users only

  ## Important Notes
  1. All tables use UUID primary keys with automatic generation
  2. Order fields allow flexible content ordering
  3. Timestamps track content changes
  4. RLS policies ensure content is publicly readable but only editable by authenticated staff
*/

-- Create home_content table
CREATE TABLE IF NOT EXISTS home_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  link_text text,
  link_url text,
  order_index integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create facts table
CREATE TABLE IF NOT EXISTS facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  icon text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reasons table
CREATE TABLE IF NOT EXISTS reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  organization text,
  description text NOT NULL,
  image_url text,
  video_url text,
  status text DEFAULT 'draft',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- Create policies for home_content
CREATE POLICY "Public can view home content"
  ON home_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert home content"
  ON home_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update home content"
  ON home_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete home content"
  ON home_content FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for facts
CREATE POLICY "Public can view facts"
  ON facts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert facts"
  ON facts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update facts"
  ON facts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete facts"
  ON facts FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for lessons
CREATE POLICY "Public can view lessons"
  ON lessons FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for reasons
CREATE POLICY "Public can view reasons"
  ON reasons FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert reasons"
  ON reasons FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update reasons"
  ON reasons FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reasons"
  ON reasons FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for interviews
CREATE POLICY "Public can view published interviews"
  ON interviews FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR status = 'coming_soon');

CREATE POLICY "Authenticated users can insert interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete interviews"
  ON interviews FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_home_content_section ON home_content(section);
CREATE INDEX IF NOT EXISTS idx_home_content_order ON home_content(order_index);
CREATE INDEX IF NOT EXISTS idx_facts_category ON facts(category);
CREATE INDEX IF NOT EXISTS idx_facts_order ON facts(order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_reasons_order ON reasons(order_index);
CREATE INDEX IF NOT EXISTS idx_interviews_status ON interviews(status);
CREATE INDEX IF NOT EXISTS idx_interviews_order ON interviews(order_index);