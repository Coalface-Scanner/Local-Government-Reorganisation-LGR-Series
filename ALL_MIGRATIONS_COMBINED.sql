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
DROP POLICY IF EXISTS "Anyone can view council data" ON councils;

CREATE POLICY "Anyone can view council data"
  ON councils
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create index on country for efficient filtering
CREATE INDEX IF NOT EXISTS idx_councils_country ON councils(country);

-- Create index on name for searching
CREATE INDEX IF NOT EXISTS idx_councils_name ON councils(name);/*
  # Create materials table for LGR Hub

  1. New Tables
    - `materials`
      - `id` (uuid, primary key) - Unique identifier for each material
      - `title` (text) - Title of the material
      - `slug` (text, unique) - URL-friendly version of the title
      - `description` (text) - Brief description/excerpt
      - `content` (text) - Full content (can be null for external resources)
      - `published_date` (timestamptz) - When the material was published
      - `read_count` (integer) - Number of views/reads
      - `editors_pick` (boolean) - Whether this is an editor's pick
      - `type` (text) - Type of material (Insight, Explainer, Case study, etc.)
      - `geography` (text) - Geographic focus
      - `theme` (text) - Primary theme
      - `audience` (text[]) - Array of target audiences
      - `lgr_phase` (text) - Relevant LGR phase
      - `format` (text) - Format of the material
      - `author` (text) - Author or author type
      - `author_name` (text) - Specific author name if applicable
      - `image_url` (text) - Featured image URL
      - `pdf_url` (text) - PDF download URL if applicable
      - `external_url` (text) - External link if applicable
      - `featured` (boolean) - Whether to feature in rolling banner
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `materials` table
    - Add policy for public read access (materials are publicly viewable)
    - Add policy for authenticated admin users to manage materials

  3. Indexes
    - Index on published_date for sorting
    - Index on slug for fast lookups
    - Index on type, geography, theme for filtering
*/

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content text,
  published_date timestamptz DEFAULT now(),
  read_count integer DEFAULT 0,
  editors_pick boolean DEFAULT false,
  type text NOT NULL,
  geography text,
  theme text,
  audience text[] DEFAULT '{}',
  lgr_phase text,
  format text NOT NULL,
  author text,
  author_name text,
  image_url text,
  pdf_url text,
  external_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Materials are publicly readable" ON materials;

CREATE POLICY "Materials are publicly readable"
  ON materials
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert materials" ON materials;

CREATE POLICY "Authenticated users can insert materials"
  ON materials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update materials" ON materials;

CREATE POLICY "Authenticated users can update materials"
  ON materials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete materials" ON materials;

CREATE POLICY "Authenticated users can delete materials"
  ON materials
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS materials_published_date_idx ON materials(published_date DESC);
CREATE INDEX IF NOT EXISTS materials_slug_idx ON materials(slug);
CREATE INDEX IF NOT EXISTS materials_type_idx ON materials(type);
CREATE INDEX IF NOT EXISTS materials_geography_idx ON materials(geography);
CREATE INDEX IF NOT EXISTS materials_theme_idx ON materials(theme);
CREATE INDEX IF NOT EXISTS materials_read_count_idx ON materials(read_count DESC);
CREATE INDEX IF NOT EXISTS materials_featured_idx ON materials(featured) WHERE featured = true;
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
DROP POLICY IF EXISTS "Public can view home content" ON home_content;

CREATE POLICY "Public can view home content"
  ON home_content FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert home content" ON home_content;

CREATE POLICY "Authenticated users can insert home content"
  ON home_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update home content" ON home_content;

CREATE POLICY "Authenticated users can update home content"
  ON home_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete home content" ON home_content;

CREATE POLICY "Authenticated users can delete home content"
  ON home_content FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for facts
DROP POLICY IF EXISTS "Public can view facts" ON facts;

CREATE POLICY "Public can view facts"
  ON facts FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert facts" ON facts;

CREATE POLICY "Authenticated users can insert facts"
  ON facts FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update facts" ON facts;

CREATE POLICY "Authenticated users can update facts"
  ON facts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete facts" ON facts;

CREATE POLICY "Authenticated users can delete facts"
  ON facts FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for lessons
DROP POLICY IF EXISTS "Public can view lessons" ON lessons;

CREATE POLICY "Public can view lessons"
  ON lessons FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert lessons" ON lessons;

CREATE POLICY "Authenticated users can insert lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update lessons" ON lessons;

CREATE POLICY "Authenticated users can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete lessons" ON lessons;

CREATE POLICY "Authenticated users can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for reasons
DROP POLICY IF EXISTS "Public can view reasons" ON reasons;

CREATE POLICY "Public can view reasons"
  ON reasons FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert reasons" ON reasons;

CREATE POLICY "Authenticated users can insert reasons"
  ON reasons FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update reasons" ON reasons;

CREATE POLICY "Authenticated users can update reasons"
  ON reasons FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete reasons" ON reasons;

CREATE POLICY "Authenticated users can delete reasons"
  ON reasons FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for interviews
DROP POLICY IF EXISTS "Public can view published interviews" ON interviews;

CREATE POLICY "Public can view published interviews"
  ON interviews FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR status = 'coming_soon');

DROP POLICY IF EXISTS "Authenticated users can insert interviews" ON interviews;

CREATE POLICY "Authenticated users can insert interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update interviews" ON interviews;

CREATE POLICY "Authenticated users can update interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete interviews" ON interviews;

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
CREATE INDEX IF NOT EXISTS idx_interviews_order ON interviews(order_index);/*
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
DROP POLICY IF EXISTS "Anyone can read site metadata" ON site_metadata;

CREATE POLICY "Anyone can read site metadata"
  ON site_metadata
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to update
DROP POLICY IF EXISTS "Authenticated users can update site metadata" ON site_metadata;

CREATE POLICY "Authenticated users can update site metadata"
  ON site_metadata
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
/*
  # Add public read access to materials table

  1. Security Changes
    - Add policy to allow anyone (including anonymous users) to read materials
    - This enables the public-facing Materials Library page to display content
*/

DROP POLICY IF EXISTS "Anyone can view materials" ON materials;

CREATE POLICY "Anyone can view materials"
  ON materials
  FOR SELECT
  TO anon, authenticated
  USING (true);
/*
  # Add Three New Interview Materials

  1. New Materials
    - Tim Oliver Interview (Pre-publication)
    - Lame Duck Councillors Article
    - First 100 Days Article (Copy)

  2. Changes
    - Insert three new interview/article materials into materials table
    - Each with full content for inline reading
    - PDF URLs for download option
    - Proper metadata and categorization
*/

-- Tim Oliver Interview
INSERT INTO materials (
  title,
  slug,
  description,
  content,
  published_date,
  read_count,
  editors_pick,
  type,
  geography,
  theme,
  audience,
  lgr_phase,
  format,
  author,
  author_name,
  pdf_url,
  featured
) VALUES (
  'Interview: Tim Oliver on Surrey''s Local Government Reorganisation',
  'tim-oliver-interview-lgr-surrey',
  'Surrey County Council Leader Tim Oliver discusses the county''s approach to local government reorganisation, the challenges faced, and lessons learned from the process.',
  '<div class="article-content">
    <p>In this exclusive interview, Tim Oliver, Leader of Surrey County Council, shares insights into Surrey''s journey through local government reorganisation.</p>

    <h2>Background and Context</h2>
    <p>Surrey County Council has been at the forefront of discussions around local government reorganisation in the South East. As one of England''s largest shire counties, the decisions made here have implications for similar authorities across the country.</p>

    <h2>The Proposal</h2>
    <p>Tim Oliver outlines Surrey''s proposal for reorganisation, explaining the rationale behind the chosen model and how it aims to improve service delivery while maintaining local accountability.</p>

    <h2>Challenges and Opportunities</h2>
    <p>"The biggest challenge," Oliver explains, "has been balancing the need for efficiency with maintaining the local connection that residents value." He discusses how Surrey has worked to address concerns from districts and boroughs while building a case for change.</p>

    <h2>Engagement and Consultation</h2>
    <p>A key focus of the interview is the extensive engagement process undertaken. Oliver emphasises the importance of listening to residents, businesses, and partner organisations throughout the process.</p>

    <h2>Looking Ahead</h2>
    <p>Oliver shares his vision for what successful reorganisation could mean for Surrey, including improved services, better value for money, and enhanced capacity to address local challenges.</p>

    <h2>Lessons for Others</h2>
    <p>Drawing on Surrey''s experience, Oliver offers advice for other areas considering reorganisation: "Start early, communicate clearly, and be prepared for robust debate. This is about the future of local democracy, and getting it right matters."</p>
  </div>',
  NOW() - INTERVAL '10 days',
  0,
  true,
  'Interview',
  'County or unitary',
  'Governance',
  ARRAY['Members', 'Officers', 'Government'],
  'Proposal',
  'Article',
  'Interviewee',
  'Tim Oliver, Leader of Surrey County Council',
  '/materials/article-tim-oliver-interview-pre-publication.docx',
  true
);

-- Lame Duck Councillors Article
INSERT INTO materials (
  title,
  slug,
  description,
  content,
  published_date,
  read_count,
  editors_pick,
  type,
  geography,
  theme,
  audience,
  lgr_phase,
  format,
  author,
  author_name,
  pdf_url,
  featured
) VALUES (
  'Managing the Lame Duck Period: Councillor Roles During LGR Transition',
  'lame-duck-councillors-lgr-transition',
  'An analysis of the challenges and opportunities facing councillors during the transitional period of local government reorganisation, including maintaining service delivery and democratic accountability.',
  '<div class="article-content">
    <p>The period between the announcement of local government reorganisation and the creation of new councils presents unique challenges for elected members. This article examines the "lame duck" phenomenon and how councils can navigate this difficult transition.</p>

    <h2>What is the Lame Duck Period?</h2>
    <p>The term "lame duck" refers to the period when existing councils continue to operate despite knowing they will cease to exist. During this time, councillors must balance:</p>
    <ul>
      <li>Maintaining day-to-day service delivery</li>
      <li>Representing constituents effectively</li>
      <li>Planning for the transition to new structures</li>
      <li>Managing staff morale and uncertainty</li>
    </ul>

    <h2>The Democratic Deficit Challenge</h2>
    <p>One of the most significant concerns during the lame duck period is maintaining democratic accountability. With major decisions potentially deferred and long-term planning complicated by uncertainty, councillors must work harder to ensure residents continue to receive proper representation.</p>

    <h2>Maintaining Service Standards</h2>
    <p>Despite the uncertainty, services must continue. This article explores how councils have maintained standards during transition periods, including:</p>
    <ul>
      <li>Staff retention strategies</li>
      <li>Partnership working arrangements</li>
      <li>Communication with residents</li>
      <li>Financial planning and budget-setting</li>
    </ul>

    <h2>The Role of Shadow Authorities</h2>
    <p>Shadow authorities play a crucial role during the lame duck period. This section examines how they work alongside existing councils, the transition of powers, and how to manage potential conflicts or duplication.</p>

    <h2>Case Studies</h2>
    <p>Drawing on examples from recent reorganisations, we examine how different areas have managed the lame duck period, highlighting both successful approaches and lessons learned from challenges faced.</p>

    <h2>Best Practice Recommendations</h2>
    <p>Based on research and practitioner experience, we outline key recommendations:</p>
    <ul>
      <li>Establish clear protocols for decision-making during the transition</li>
      <li>Maintain regular communication with staff and residents</li>
      <li>Ensure shadow authorities have adequate resources and support</li>
      <li>Create joint working arrangements where appropriate</li>
      <li>Focus on continuity of services and democratic accountability</li>
    </ul>

    <h2>Conclusion</h2>
    <p>While the lame duck period presents significant challenges, with proper planning and commitment from all parties, councils can maintain effective governance and service delivery while transitioning to new structures. The key is recognising these challenges early and putting appropriate arrangements in place.</p>
  </div>',
  NOW() - INTERVAL '15 days',
  0,
  true,
  'Insight',
  'National',
  'Governance',
  ARRAY['Members', 'Officers', 'Government'],
  'Shadow',
  'Article',
  'Coalface editorial',
  'Coalface Editorial Team',
  '/materials/article-lame-duck-councillors-published.docx',
  true
);

-- First 100 Days Article
INSERT INTO materials (
  title,
  slug,
  description,
  content,
  published_date,
  read_count,
  editors_pick,
  type,
  geography,
  theme,
  audience,
  lgr_phase,
  format,
  author,
  author_name,
  pdf_url,
  featured
) VALUES (
  'The First 100 Days: Critical Priorities for New Unitary Councils',
  'first-100-days-new-unitary-councils',
  'A comprehensive guide to the critical first 100 days following vesting day, outlining key priorities, common pitfalls, and strategies for successful establishment of new unitary authorities.',
  '<div class="article-content">
    <p>The first 100 days following vesting day represent a critical period for new unitary authorities. This guide outlines the key priorities, challenges, and strategies for success during this formative period.</p>

    <h2>Why the First 100 Days Matter</h2>
    <p>The first 100 days set the tone for the new authority. Decisions made and actions taken during this period can have lasting impacts on:</p>
    <ul>
      <li>Staff morale and organisational culture</li>
      <li>Public confidence and trust</li>
      <li>Service delivery effectiveness</li>
      <li>Political relationships and working arrangements</li>
      <li>Financial stability and planning</li>
    </ul>

    <h2>Key Priority Areas</h2>

    <h3>1. Establishing Clear Leadership and Governance</h3>
    <p>The new political and managerial leadership must be established quickly and effectively. This includes:</p>
    <ul>
      <li>Appointing key cabinet positions</li>
      <li>Establishing committee structures</li>
      <li>Clarifying decision-making protocols</li>
      <li>Setting strategic priorities</li>
    </ul>

    <h3>2. Service Continuity and Integration</h3>
    <p>Ensuring services continue without interruption is paramount. Critical actions include:</p>
    <ul>
      <li>Confirming all statutory services are operating</li>
      <li>Addressing any immediate service gaps</li>
      <li>Beginning the process of service harmonisation</li>
      <li>Establishing consistent standards across the area</li>
    </ul>

    <h3>3. Staff Integration and Culture Building</h3>
    <p>Bringing together staff from multiple organisations requires careful attention to:</p>
    <ul>
      <li>Clear communication about new structures</li>
      <li>Addressing immediate HR concerns</li>
      <li>Beginning culture change initiatives</li>
      <li>Recognising and valuing different organisational traditions</li>
    </ul>

    <h3>4. Financial Management</h3>
    <p>Early financial decisions are critical:</p>
    <ul>
      <li>Confirming the first budget</li>
      <li>Establishing financial controls and processes</li>
      <li>Addressing any immediate financial pressures</li>
      <li>Beginning medium-term financial planning</li>
    </ul>

    <h3>5. External Relationships</h3>
    <p>Building relationships with partners and stakeholders:</p>
    <ul>
      <li>Engaging with government departments</li>
      <li>Establishing partnerships with local organisations</li>
      <li>Communicating with residents and businesses</li>
      <li>Working with neighbouring authorities</li>
    </ul>

    <h2>Common Pitfalls to Avoid</h2>
    <p>Based on experience from recent reorganisations, common pitfalls include:</p>
    <ul>
      <li>Moving too quickly without proper consultation</li>
      <li>Failing to communicate effectively with staff</li>
      <li>Underestimating the complexity of service integration</li>
      <li>Not addressing cultural differences between predecessor authorities</li>
      <li>Making premature decisions about structures and staffing</li>
    </ul>

    <h2>A Suggested 100-Day Plan</h2>

    <h3>Days 1-30: Establishment Phase</h3>
    <ul>
      <li>Confirm leadership appointments</li>
      <li>Establish basic governance structures</li>
      <li>Ensure all statutory functions are operating</li>
      <li>Communicate key messages to staff and public</li>
    </ul>

    <h3>Days 31-60: Stabilisation Phase</h3>
    <ul>
      <li>Begin detailed service reviews</li>
      <li>Establish working relationships between directorates</li>
      <li>Start culture-building initiatives</li>
      <li>Develop medium-term plans</li>
    </ul>

    <h3>Days 61-100: Foundation Phase</h3>
    <ul>
      <li>Set out strategic priorities for the year</li>
      <li>Begin implementing quick wins</li>
      <li>Establish robust performance management</li>
      <li>Plan for longer-term transformation</li>
    </ul>

    <h2>Measuring Success</h2>
    <p>How do you know if the first 100 days have been successful? Key indicators include:</p>
    <ul>
      <li>No major service failures or disruptions</li>
      <li>Staff surveys showing reasonable morale and clarity about direction</li>
      <li>Positive public perception and media coverage</li>
      <li>Clear strategic direction established</li>
      <li>Strong political and managerial leadership in place</li>
      <li>Basic governance and financial systems operating effectively</li>
    </ul>

    <h2>Looking Beyond Day 100</h2>
    <p>While the first 100 days are critical, they are just the beginning. This article concludes by looking at what comes next:</p>
    <ul>
      <li>Embedding new structures and processes</li>
      <li>Delivering on transformation promises</li>
      <li>Maintaining momentum for change</li>
      <li>Continuing to build a unified organisational culture</li>
    </ul>

    <h2>Conclusion</h2>
    <p>The first 100 days of a new unitary authority are challenging but exciting. With clear priorities, effective communication, and strong leadership, new councils can establish themselves successfully and lay foundations for long-term success. The key is to be prepared, stay focused on priorities, and maintain communication with all stakeholders throughout.</p>
  </div>',
  NOW() - INTERVAL '5 days',
  0,
  true,
  'Explainer',
  'National',
  'Programme and transition',
  ARRAY['Members', 'Officers', 'Planning'],
  'First 100 days',
  'Article',
  'Coalface editorial',
  'Coalface Editorial Team',
  '/materials/first-100-days-published copy.docx',
  true
);

-- Update the materials table to ensure proper ordering
UPDATE materials SET updated_at = NOW() WHERE slug IN (
  'tim-oliver-interview-lgr-surrey',
  'lame-duck-councillors-lgr-transition',
  'first-100-days-new-unitary-councils'
);/*
  # Update Materials with Full Article Content

  1. Changes
    - Update Tim Oliver interview with complete article text from source document
    - Update Lame Duck Councillors article with complete text from source document  
    - Update First 100 Days article with complete text from source document
    
  2. Details
    - All three materials will have their content field updated with full HTML
    - Content includes proper semantic markup (headings, paragraphs, lists, emphasis)
    - Preserves all original article text, structure, and formatting
*/

-- Update Tim Oliver Interview with full content
UPDATE materials 
SET content = '<div class="article-content prose prose-slate max-w-none">
<p class="font-bold text-red-600 text-sm uppercase">EXCLUSIVE – ADVANCE COPY FOR COMMONPLACE<br>EMBARGOED UNTIL THURSDAY, 18 DECEMBER, 16:00</p>

<h1 class="text-4xl font-bold mb-4">UNLOCKING SURREY''S POTENTIAL</h1>
<h2 class="text-2xl font-semibold mb-2">Editor Rowan Cole interviews Tim Oliver OBE</h2>

<p class="text-lg italic mb-6">Tim Oliver OBE is the Conservative Leader of Surrey County Council and National Chair of the County Councils Network. He is a strong proponent of mayoral devolution for Surrey, arguing that securing strategic economic and planning powers is the necessary "prize" for growth, far surpassing the benefits of reorganisation alone. He was awarded an OBE for services to local government in the King''s Birthday Honours 2024</p>

<h2 class="text-3xl font-bold mt-8 mb-4">WHY DEVOLUTION, NOT REORGANISATION ALONE, IS THE LEVER FOR GROWTH</h2>

<blockquote class="border-l-4 border-cyan-600 pl-4 italic my-6">"For us specifically in Surrey, it was about unlocking that mayoral devolution."<br><span class="font-semibold">— Tim Oliver</span></blockquote>

<p>Surrey is heading towards a significant structural change: two new unitary authorities, replacing the current two-tier arrangements. The case for reorganisation is often presented in terms of simplification, service alignment and clearer accountability. Tim Oliver OBE, Leader of Surrey County Council, makes a different argument. In his view, the point is not simply to redraw the organisational chart. The point is to unlock the powers that shape outcomes.</p>

<p>Oliver frames reorganisation as the platform, but devolution as the prize. Without a mayoral combined authority, he argues Surrey risks doing the difficult work of transition without securing the economic and strategic levers that matter most.</p>

<p>This article sets out Oliver''s core claims, and tests each against real world examples from elsewhere. It also sets a continuing theme for this series: reorganisation and devolution are related, but they are not the same question.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">REORGANISATION IS ABOUT SIMPLIFICATION, NOT POWER</h2>

<blockquote class="border-l-4 border-cyan-600 pl-4 italic my-6">"People do not understand the difference between a borough council and a county councillor and different responsibilities."<br><span class="font-semibold">— Tim Oliver</span></blockquote>

<p>Oliver''s first point is practical. Reorganisation makes the system easier to navigate for residents. One council is clearer than two. That matters, but it is not the same as shifting power.</p>

<p>In his telling, reorganisation is primarily a delivery change. It reduces duplication and clarifies who does what. But the strategic "tools" that drive growth sit elsewhere, which is why he returns repeatedly to the importance of mayoral devolution.</p>

<h3 class="text-xl font-semibold mt-6 mb-3">Practical example: Buckinghamshire</h3>

<p>Buckinghamshire''s move to a single unitary improved internal alignment, but it did not automatically bring new control over transport funding, skills commissioning, or long term investment settlements. Those step changes, where they happen, are associated with devolved arrangements at mayoral combined authority level, not unitary status itself.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">WHY THE MAYOR MATTERS: POWERS, ACCESS, AND LEVERAGE</h2>

<blockquote class="border-l-4 border-cyan-600 pl-4 italic my-6">"It''s going to be very challenging for those areas that don''t have a mayor."<br><span class="font-semibold">— Tim Oliver</span></blockquote>

<p>Oliver describes a widening gap between places with mayors and those without. In the interview, he notes government is "building up the role of the mayor" across key strategic areas including strategic planning, economic development and housing.</p>

<p>He is clear that a combined authority without a mayor exists, but it is a lesser model in terms of powers and access: "they''re not going to have the same powers and access, if you like, to government as we would have with a mayor."</p>

<p>In short, he is not describing devolution as an abstract concept. He is describing an operational reality: the mayoral model is where government is concentrating strategic authority and, critically, the ability to negotiate and implement.</p>

<h3 class="text-xl font-semibold mt-6 mb-3">Practical example: West Midlands Combined Authority</h3>

<p>The West Midlands model shows what Oliver means by "powers and access". The West Midlands deeper devolution deal includes an additional package in excess of £1.5bn, 100% business rates retention for 10 years (stated as worth £450m), and a housing deal worth up to £500m.</p>

<p>That is not simply organisational tidiness. It is a different tier of capability.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">DEVOLUTION IS ABOUT BUILDING THE ECONOMY, NOT SIMPLY BIDDING FOR GRANTS</h2>

<blockquote class="border-l-4 border-cyan-600 pl-4 italic my-6">"Having sort of mayoral devolution giving us greater sort of local control over some of those factors… will help grow the economy."<br><span class="font-semibold">— Tim Oliver</span></blockquote>

<p>Oliver links devolution directly to the ability to shape growth drivers rather than repeatedly competing for short term, centrally designed funding pots. He frames the argument around local control of the conditions that generate growth: strategic planning, investment alignment, and partnership working at scale.</p>

<p>He also grounds the case in Surrey''s economic weight. In the interview he states: "we contribute £55,000,000,000 a year GVA to the national economy" and references around "300" international headquartered businesses in Surrey.</p>

<h3 class="text-xl font-semibold mt-6 mb-3">Practical example: Greater Manchester''s recyclable housing investment model</h3>

<p>Greater Manchester''s Housing Investment Loans Fund provides a concrete illustration of devolved capacity. GMCA reports over £700m committed through the fund, supporting over 7,000 homes, using recyclable finance that can be reinvested as loans are repaid.</p>

<p>Whatever your personal view of individual schemes, the mechanism matters: it is a region building an investment tool that does not rely on one off central government awards each time.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">THE GOVERNANCE RISK: REORGANISATION WITHOUT A MAYOR CREATES CHURN WITHOUT ADVANTAGE</h2>

<blockquote class="border-l-4 border-cyan-600 pl-4 italic my-6">"[F]rom a governance perspective and a delivery perspective, no advantage to reorganising without a mayor"<br><span class="font-semibold">— Tim Oliver</span></blockquote>

<p>This is Oliver at his most direct. His critique is not that reorganisation is inherently wrong, but that it becomes hard to justify if it does not lead into a more empowered strategic tier.</p>

<p>He describes the practical absurdity of spending time and money disaggregating and reorganising complex services, only to "bring the two halves back together" through a combined authority "with no real… decision making capability."</p>

<p>This is a warning about capacity, distraction, and public confidence. Structural change consumes managerial time. If it is not paired with a visible improvement in what local government can do, residents experience the disruption but not the benefit.</p>

<h3 class="text-xl font-semibold mt-6 mb-3">Practical example: Greater Manchester''s new integrated settlement</h3>

<p>Greater Manchester''s "trailblazing" devolution deal includes an integrated settlement for 2025 to 26 that replaces multiple departmental pots with a single settlement, explicitly framed as improving flexibility and local prioritisation.</p>

<p>This is a practical demonstration of Oliver''s "advantage" point: devolution changes the operating model, not just the map.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">STRATEGIC PLANNING IS THE PRESSURE POINT, ESPECIALLY ON HOUSING</h2>

<blockquote class="border-l-4 border-cyan-600 pl-4 italic my-6">"Having that strategic plan… hopefully will mean that A) houses will get built and B) they''ll be built in the right areas."<br><span class="font-semibold">— Tim Oliver</span></blockquote>

<p>Oliver identifies the structural problem clearly: multiple borough and district plans that do not align, and a "duty to cooperate" that "has never really worked".</p>

<p>He sees strategic planning, at the right geography, as a route to both delivery and rationality. He also acknowledges the political difficulty: "the skill… is to not release green belt unless you absolutely have to", while recognising the contested territory of grey belt and brownfield capacity.</p>

<h3 class="text-xl font-semibold mt-6 mb-3">Practical example: place based economic evidence for Surrey</h3>

<p>Surrey''s own public evidence base also underlines the scale of the economy and the need to plan strategically. Surrey he states produces a GVA of "over £50bn" and points to sector strengths including pharma, space, gaming and green automotive.</p>

<p>Even allowing for methodological differences between sources and years, the consistent message is scale, and the need for strategic coordination to match it.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">COMMUNITY IDENTITY AND LEGITIMACY: NEIGHBOURHOOD STRUCTURES AS THE BRIDGE</h2>

<blockquote class="border-l-4 border-cyan-600 pl-4 italic my-6">"The area committees are going to be really, really key to making residents feel engaged."<br><span class="font-semibold">— Tim Oliver</span></blockquote>

<p>Oliver accepts that Surrey does not have a single, strong county identity in the way some places do: "there is no real identity… it''s not like Cornwall or Yorkshire".</p>

<p>His answer is not to romanticise the county, but to strengthen the neighbourhood layer. He describes neighbourhood area committees built around identifiable communities, and deliberately includes health, police, VCSE, business and residents at the table.</p>

<p>That is an attempt to tackle legitimacy and service integration together, rather than pretending structure alone creates public trust.</p>

<h3 class="text-xl font-semibold mt-6 mb-3">Practical example: integrated local delivery logic</h3>

<p>This aligns with the direction of travel in public policy towards neighbourhood health and place based delivery. Oliver explicitly links the opportunity to aligning primary care and local government population health management, arguing it improves the chances of real improvements in quality of life.</p>

<p>This is not a "nice to have". It is a governance response to the fact that unitary scale can feel remote unless the neighbourhood tier is made meaningful.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">CONCLUSION: SURREY IS AN ECONOMIC POWERHOUSE THAT NEEDS DEVOLUTION</h2>

<blockquote class="border-l-4 border-cyan-600 pl-4 italic my-6">"We are the… 4th [largest economy]… London, Greater Manchester, West Midlands, and then Surrey."<br><span class="font-semibold">— Tim Oliver</span></blockquote>

<p>Oliver''s position is coherent: Surrey''s size and complexity justify simplification, but simplification alone is not the outcome. The outcome is the ability to shape strategic transport, skills, planning and investment decisions at the right scale, and to do so with a mandate that government recognises.</p>

<p>His sharpest warning is also his simplest. Reorganising without a mayoral model leaves Surrey paying the costs of transition without securing the benefits of devolution.</p>

<p>The broader point for this series is the one we will keep returning to: local government reorganisation is a structural intervention. Devolution is a power shift. The political and economic opportunity sits overwhelmingly in the second.</p>

<hr class="my-8">

<h2 class="text-2xl font-bold mt-8 mb-4">NOTES</h2>

<h3 class="text-xl font-semibold mt-6 mb-3">About Tim Oliver</h3>

<p>Tim Oliver OBE is the Leader of Surrey County Council and Conservative County Councillor for Weybridge. He became Leader of the Council in December 2018, having previously served as a County Councillor (2005–2009) and the Leader of Elmbridge Borough Council.</p>

<p>Oliver is a nationally recognised advocate for local empowerment, currently serving as the National Chair of the County Councils Network. In alignment with the theme of his recent interview, he asserts that while local government reorganisation offers simplification, only mayoral devolution provides the essential strategic power shift required to unlock economic potential through greater local control over growth drivers, investment alignment, and planning decisions. Furthermore, he is the Chair of the Surrey Heartlands NHS Integrated Care Partnership, where he drives closer integration of healthcare delivery with Surrey County Council services.</p>

<p>Oliver has a professional background as a qualified solicitor and was the Founder, CEO, and then Deputy Chairman of the Parabis Group, a significant legal and professional services business.</p>

<p>His leadership has been recognised with awards including LGiU Council Leader of the Year in 2023, and he was awarded an OBE for his services to local government in the King''s Birthday Honours 2024.</p>

<h3 class="text-xl font-semibold mt-6 mb-3">About the LGR Series</h3>

<p>The Local Government Reorganisation (LGR) series is a dedicated analytical project published by COALFACE. It functions as a hub for research focused on Local Government Reorganisation.</p>

<p>The core purpose of the LGR series is to provide evidence-based governance analysis by examining how governance structures, planning behaviour, and political conditions impact outcomes in reorganised councils across England. The series aims to help senior officers, councillors, advisers, and promoters understand what reorganisation means in practice.</p>

<p>Coalface views LGR as a once-in-a-generation opportunity to achieve significant goals beyond simple mergers, such as unlocking real growth through new homes, employment, infrastructure, and securing long-term funding. The series covers the reforms'' influence on place-shaping, statutory services, decision-making speed, and the overall development cycle.</p>
</div>'
WHERE slug = 'tim-oliver-interview-lgr-surrey';/*
  # Update Lame Duck Councillors Article with Full Content

  1. Changes
    - Update the lame duck councillors article with complete text from source document
    - Includes all case studies, analysis, and recommendations from the full article
*/

UPDATE materials 
SET content = '<div class="article-content prose prose-slate max-w-none">
<p class="font-bold text-sm uppercase mb-2">PUBLISHED: Seeking a planning approval in Surrey or another LGR area in the next 36 months? You may want to read this first.</p>

<h1 class="text-4xl font-bold mb-6">"Lame duck" councillors and those fighting for election should be on every developer''s risk register</h1>

<p class="text-lg mb-6">At COALFACE, we spend a lot of time looking at what really shapes planning decisions. We know that policy and process is important, but so are people and what drives them. Surrey''s move to a new unitary structure is a textbook example of where human behaviour and governance change collide.</p>

<p class="font-semibold text-lg">If you''ve got a major planning application coming forward in Surrey over the next 18–24 months, the headline risk is not policy, it''s councillors in a unpredictable environment.</p>

<p>Surrey is being fast-tracked through local government reorganisation (LGR). Under the current timetable the Surrey districts and boroughs keep their planning powers until 00:01 on 1 April 2027 at which point the new unitaries take over as Local Planning Authority. Shadow elections are expected in 2026, with parties selecting candidates for the new authority well before that.</p>

<p>On paper it''s a swift, neat, and staged transition. On the ground though it creates a long window where councillors are operating under very unusual incentives. From a developer''s point of view, that''s where the damage can be done.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">Would you rather be a lame duck or a deer in the headlights?</h2>

<p>LGR is often sold as a technical exercise. It rationalises tiers, saves money, "simplifying" governance. But it is also brutally personal. Some existing councillors will simply not have a ward to stand in. Others will discover they have not been selected by their party for the new map. Additionally, once the new shadow authority is elected the biggest financial and strategic decisions taken by the ''old'' council will increasingly have to be taken in line with, and in some cases formally cleared by, the shadow body. Councillors left behind become genuine lame ducks months, even years, before vesting day.</p>

<p>If you''re not facing the electorate again the traditional checks on behaviour weaken. Voting with your conscience, making a last stand against ''overdevelopment'', or sending one final signal to your group (who you may feel let down by if not reselected) can suddenly feel more attractive than sticking rigidly to officer advice.</p>

<p>At the same time, those fighting to survive are campaigning in a new landscape:</p>

<ul class="list-disc pl-6 my-4">
<li>Redrawn wards they don''t yet understand</li>
<li>New or stronger parties contesting the same territory</li>
<li>A much larger authority where individual voice may count for less</li>
</ul>

<p>Suddenly thrust into larger wards, with larger populations, and on to a larger Council, it is a true ''deer in the headlights'' moment. The ''show'' begins for those Councillors as they the once again jostle for position and authority in their new environments.</p>

<p>In that environment it is entirely rational for councillors to recalibrate their stance on controversial schemes, sometimes sharply to appeal to a different or broader electorate. Both the outgoing and surviving Councillors become harder to read.</p>

<p>For developers, that means the usual tools of pre-app engagement, stakeholder mapping, and local expectations, no longer drive the same level of predictability.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">What happens to decision-making under this pressure?</h2>

<p>Planning committees are supposed to be quasi-judicial. Judgements should be reached on the evidence and led by policy with the support of officers to guide with advice. Yet that doesn''t seem to be reflected in many decisions, and not the lived experience of many Councillors.</p>

<p>Lichfields'' analysis of appeals on large housing schemes found that when councillors refused applications against officer recommendation, around two-thirds of those refusals were overturned on appeal, compared with roughly two in five where refusal followed officer advice. <a href="https://lichfields.uk/media/ro4c3m0a/refused-for-good-reason-when-councillors-go-against-officer-recommendations.pdf" target="_blank" rel="noopener noreferrer">Refused for good reason? – Lichfields</a></p>

<p>In other words when members go off-piste, developers are much more likely to win later, but only after 18–24 months of delay, cost and uncertainty.</p>

<p>Layer LGR on top:</p>

<ul class="list-disc pl-6 my-4">
<li>Councillors who know they are leaving have less reason to fear that appeal loss.</li>
<li>Councillors trying to survive may prioritise symbolic "no" votes to demonstrate they''re on the side of a new set of residents.</li>
<li>Parties may be more tolerant of maverick decisions while selections and coalitions are in flux.</li>
</ul>

<p>The danger in LGR areas is that over the next two or three years is not that policy suddenly changes, but that decision making becomes more volatile as members juggle exit, re-selection and unfamiliar wards.</p>

<p>Many developers will be familiar with the advice ''Don''t submit a controversial planning application just before an election''. Essentially in these areas, we are in one long campaign and election period, one that will last years. It is impractical to simply to submitting applications, so a new approach is needed.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">Case study: BCP FuturePlaces – when councillors crowd the cockpit</h2>

<p>During the creation of the Bournemouth, Christchurch and Poole (BCP) Council, a new urban regeneration company – BCP FuturePlaces – was set up to lead major development projects. On paper, it was meant to bring focus, expertise and pace. In practice, the politics of reorganisation got in the way.</p>

<p>External assurance work for government later found that the original governance structure "did not reflect good practice" and elected members were too involved in the day-to-day operational management of the company and its commissioning activity.</p>

<p>Under pressure from residents and nervous about how big schemes would land under the new authority, councillors stepped in more directly. That blurred the line between strategic oversight and operational control. Autonomy was muddled, processes slowed and governance concerns grew. Eventually, BCP moved to wind FuturePlaces down and bring its work back in-house.</p>

<p>For developers it should clearly illustrate how LGR can cause unpredictable outcomes. Councillors trying to reassure residents and manage their own political risk can easily slip into micromanagement, making decision-making slower and less predictable just when clarity is most needed.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">Case study: Thurrock – when financial crisis drives planning caution</h2>

<p>Thurrock shows a different form of LGR volatility. Between 2016 and 2020, the council invested hundreds of millions of pounds in solar farm schemes and other commercial deals. A series of disastrous investments left the authority effectively bankrupt, with debts in excess of £1 billion and a Section 114 notice issued in 2022.</p>

<p>Government responded by appointing commissioners and ordering a Best Value inspection. Every major decision, including planning, was now being taken under the shadow of that intervention and the need to demonstrate ultra-cautious financial management.</p>

<p>For developers, the effect was friction and delay, longer timescales, more intensive scrutiny and a marked reluctance to commit to anything that might add perceived risk to the balance sheet. Planning was still "open for business", but it operating in a defensive, crisis-management mode.</p>

<p>The lesson for Surrey is not that the same financial story will repeat, but that once an authority is in structural flux. Whether through reorganisation or intervention, planning decisions inevitably become entangled with survival instincts and reputational repair.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">From my side of the table</h2>
<p class="italic text-slate-600 mb-4">A short, personal reflection, not party-political or professional.</p>

<p>I''ve twice served as a councillor, and it''s obvious to me that most people don''t see the pressures councillors juggle every day.</p>

<p>There''s the constant flow of casework, complaints and campaigns from residents. There''s the party machine, pushing policies or issues you don''t always agree with – some you may even strongly oppose. There''s your group on council and the tensions and stresses that can come with collective responsibility. And behind every decision sits officer advice, reports and risk.</p>

<p>That''s before you even get to the rest of life: demanding day jobs, families, and for some, an attempt at a social life. That''s if you aren''t spending your weekend in a library running a surgery, or standing in a shopping centre running a survey and being shouted at about laws your party supported in the early 1800''s (yes – that actually happened!).</p>

<p>If you''ve spent years fighting to win a seat and suddenly you''re out in the cold, the temptation to make a clear statement on your way out must be overwhelming. For those staying on in new wards and a new structure, it feels like the first day of school again. That nervousness and uncertainty will, understandably, show up in more erratic decision-making.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">What this means for Surrey developers now</h2>

<p>If you are bringing forward a major application in any LGR area in the coming 36+ months, the LGR calendar should sit alongside your programme as a risk in its own right.</p>

<p>You should assume:</p>

<ul class="list-disc pl-6 my-4">
<li><strong>The risk of ''lame duck'' councillors</strong> who quietly know they have no future seat or others may decide not to re-stand. Their final votes may be driven more by personal conviction or legacy than by consistency with previous decisions.</li>
<li><strong>The drive to survive</strong> in which candidates chosen for the new authority will be testing messages with a new group of residents, with some or all of the ward unknow to them. That can encourage community-oriented positions on major schemes.</li>
<li><strong>The process risk</strong> as structures, committees and officer teams are reconfigured, the boundary between planning judgement and political theatre blurs, particularly on large or controversial sites.</li>
</ul>

<p>At Coalface we see this as a classic problem we are well equipped for. Our Engagement–Insight–Scanner tri-factor approach can plot a way through. What you should be asking:</p>

<ul class="list-disc pl-6 my-4">
<li><strong>Engagement:</strong> who actually matters, and how will they see this scheme in the run-up to reorganisation?</li>
<li><strong>Insight:</strong> what are the incentives, ambitions and pressures shaping member behaviour in this cycle?</li>
<li><strong>Scanner:</strong> what''s changing in the background – selections, restructures, interventions – that might flip your risk profile mid-process?</li>
</ul>

<p>If you haven''t asked those questions yet, LGR isn''t really reflected in your risk planning.</p>

<hr class="my-8">

<h2 class="text-2xl font-bold mt-8 mb-4">About Coalface</h2>

<p>Coalface works with developers and partners to understand political risk, design smarter engagement, and spot the issues that can derail programmes before they surface in the committee room.</p>

<p>If you''ve got a live or emerging scheme in Surrey and want a clear-eyed read on how LGR politics could affect your route to decision, get in touch.</p>

<p>This page is part of the LGR Series by COALFACE. New material is continually added as further articles and analysis are published.</p>

<p>To receive new material and supporting material as they are published, subscribe using the button on the right. Subscibers will also reiceve other exclusive content.</p>
</div>'
WHERE slug = 'lame-duck-councillors-lgr-transition';/*
  # Update First 100 Days Article with Full Content

  1. Changes
    - Update the first 100 days article with complete text from source document
    - Includes all disciplines, frameworks, and recommendations from the full playbook
*/

UPDATE materials 
SET content = '<div class="article-content prose prose-slate max-w-none">
<p class="font-bold text-sm uppercase mb-2">PUBLISHED: 3 December</p>

<h1 class="text-4xl font-bold mb-6">The First 100 Days Playbook</h1>
<h2 class="text-2xl font-semibold mb-6">Turning reorganisation into real performance; Surrey''s blueprint for getting LGR right.</h2>

<h2 class="text-3xl font-bold mt-8 mb-4">Why the First 100 Days Matter</h2>

<p>East and West Surrey will hold their first elections in May 2026. Less than a year later — on 1 April 2027 — the two new unitary authorities will replace twelve existing councils. The period between the elections and Vesting Day will determine whether the new councils begin with clarity, legitimacy and operational stability, or inherit the avoidable delays seen elsewhere.</p>

<p>This summary draws on the early work of the LGR Governance Series, which has been gathering interviews, evidence and lessons from recent reorganisations, including Dorset, Somerset, Cumbria, Northumberland, Buckinghamshire and Northamptonshire, and will continue to guide Surrey throughout the transition.</p>

<p class="font-semibold">The full ''First 100 Days Playbook'' will be published later this week.</p>

<p class="font-semibold">You can register now to receive it on release.</p>

<h2 class="text-3xl font-bold mt-8 mb-4">The Five Disciplines That Define a Successful Start</h2>

<h3 class="text-2xl font-bold mt-6 mb-3">1. Democratic Legitimacy & Cross-Party Stewardship</h3>

<p>New authorities only succeed when their political leadership builds legitimacy early, clearly explains how the new system works, and works cross-party in the interests of all communities. This will be particularly hard to achieve in the current environment.</p>

<p>As residents adjust to a new governance landscape, trust will be shaped less by structure and more by behaviour — transparency, fairness, and a shared narrative for what "good growth" means in the new Surrey.</p>

<p>Legitimacy is strengthened when councillors commit to:</p>

<ul class="list-disc pl-6 my-4">
<li>Setting an early, unified cross-party narrative about the purpose of reorganisation.</li>
<li>Demonstrating respect for due process, evidence and probity.</li>
<li>Offering consistent public messaging, even where political views differ.</li>
</ul>

<p class="font-semibold">This is the foundation for every other discipline. Without legitimacy, even strong systems struggle.</p>

<h3 class="text-2xl font-bold mt-6 mb-3">2. Systems Convergence & Organisation-Wide Performance Visibility</h3>

<p>Reorganisation only works when the new authorities operate through a single, coherent set of systems. Surrey inherits not only twelve planning platforms, but multiple customer portals, workflow tools, document stores, finance systems, case management processes and data standards. If these are carried forward unchanged, East and West Surrey will spend their early years reconciling inconsistencies instead of delivering improvement.</p>

<p>Successful reorganisations stabilise quickly because they:</p>

<ul class="list-disc pl-6 my-4">
<li>Create one unified operational workflow for core services, not a patchwork of inherited processes.</li>
<li>Establish single sources of truth for data, documents and performance reporting.</li>
<li>Map and rationalise customer journeys so residents experience East or West Surrey, not twelve legacy councils.</li>
<li>Deploy early performance dashboards that give members and officers real-time visibility across priority services.</li>
<li>Treat digital and data decisions as governance decisions, not technical upgrades.</li>
</ul>

<p class="font-semibold">Systems convergence is not about technology. It is the foundation for consistent service delivery, transparent leadership, and early public confidence in the new authorities.</p>

<h3 class="text-2xl font-bold mt-6 mb-3">3. Clear Accountability & Senior Leadership Discipline</h3>

<p>Reorganisation exposes gaps in accountability immediately. Without clarity, teams hesitate, decisions slow, and officers and members become risk-averse.</p>

<p>Effective new authorities establish:</p>

<ul class="list-disc pl-6 my-4">
<li>Defined reporting lines across development management, policy, enforcement and infrastructure.</li>
<li>A visible, empowered Service Lead for each function who provides strategic direction and leads cultural change, while giving their teams the authority and support to deliver the Council''s work effectively.</li>
<li>A structured transition governance model to prevent issues falling between teams.</li>
</ul>

<p class="font-semibold">Strong leadership discipline does not remove political disagreement, instead it ensures the system continues to function despite it.</p>

<h3 class="text-2xl font-bold mt-6 mb-3">4. Governance Clarity to Reduce Planning Delays (Structures, Delegation & Pathways)</h3>

<p>Governance clarity is where early stability becomes operational reality. Councils succeed when they adopt clean, coherent decision-making arrangements from the outset and avoid replicating legacy complexity.</p>

<p>This requires:</p>

<ul class="list-disc pl-6 my-4">
<li>A single, authoritative Scheme of Delegation.</li>
<li>One published decision pathway that officers, members and applicants all understand.</li>
<li>A commitment to review interim committee structures within weeks, not years.</li>
</ul>

<p class="font-semibold">Governance clarity is not about tidiness, it is about preventing avoidable delay and protecting councillors'' and officers'' ability to make defensible decisions.</p>

<h3 class="text-2xl font-bold mt-6 mb-3">5. The Housing Crisis and Delivery Realism</h3>

<p>Reorganisation does not remove planning pressures; it reshapes them. Legacy plans remain in force until replaced, although housing delivery will be assessed across the whole authority, not by former district.</p>

<p>This means:</p>

<ul class="list-disc pl-6 my-4">
<li>A deficit in one area affects planning decisions in another.</li>
<li>Communications with MPs, residents and developers must be clear and evidence-based.</li>
<li>Councillors must understand the consequences of the Five Year Housing Land Supply (5YHLS) from the start.</li>
</ul>

<p class="font-semibold">Early honesty prevents future conflict, and establishes credibility with government, developers and communities alike.</p>

<hr class="my-8">

<p>This is a summary of the full playbook. The complete version, including detailed action frameworks, risk registers, governance templates, and case study analysis, will be published later this week.</p>

<p class="font-semibold">Register now to receive the full First 100 Days Playbook on release, along with exclusive supporting materials and ongoing LGR analysis.</p>

<h2 class="text-2xl font-bold mt-8 mb-4">About the LGR Governance Series</h2>

<p>The LGR Governance Series is a research and advisory programme led by COALFACE, focused on helping councils, officers, members and partners navigate local government reorganisation with evidence-based analysis and practical frameworks.</p>

<p>Drawing on interviews with leaders, case study analysis of recent reorganisations, and direct engagement with Surrey''s transition, the series provides actionable insights for those responsible for delivering reorganisation successfully.</p>

<p>Future publications will cover transition governance models, planning system integration, democratic engagement frameworks, and performance management in newly formed authorities.</p>
</div>'
WHERE slug = 'first-100-days-new-unitary-councils';/*
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
/*
  # Create site updates table
  
  1. New Tables
    - `site_updates`
      - `id` (uuid, primary key)
      - `title` (text) - Short description of the update
      - `description` (text) - Optional longer description
      - `update_type` (text) - Type of update (new_article, content_update, feature, etc.)
      - `created_at` (timestamptz) - When the update was made
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `site_updates` table
    - Add policy for public read access (anyone can view updates)
    - Add policy for authenticated admin users to create/update
*/

CREATE TABLE IF NOT EXISTS site_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  update_type text DEFAULT 'content_update',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view site updates" ON site_updates;

CREATE POLICY "Anyone can view site updates"
  ON site_updates
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert site updates" ON site_updates;

CREATE POLICY "Authenticated users can insert site updates"
  ON site_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update site updates" ON site_updates;

CREATE POLICY "Authenticated users can update site updates"
  ON site_updates
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete site updates" ON site_updates;

CREATE POLICY "Authenticated users can delete site updates"
  ON site_updates
  FOR DELETE
  TO authenticated
  USING (true);

-- Add some initial sample updates
INSERT INTO site_updates (title, update_type, created_at) VALUES
  ('Tim Oliver interview published with full content', 'new_article', '2025-12-27 08:30:00+00'),
  ('Surrey devolution analysis updated with latest data', 'content_update', '2025-12-26 14:00:00+00'),
  ('New materials added to library section', 'feature', '2025-12-25 10:00:00+00'),
  ('Facts & Figures page updated with 2025 statistics', 'content_update', '2025-12-24 16:30:00+00'),
  ('First 100 Days playbook enhanced with new recommendations', 'content_update', '2025-12-23 09:00:00+00')
ON CONFLICT DO NOTHING;
/*
  # Secure CMS with Admin Role-Based Access Control

  1. Changes
    - Create admin_users table to track who has admin access
    - Add function to check if user is admin
    - Update all CMS table RLS policies to require admin access
    - Add audit logging for admin actions
    
  2. Security
    - Only users in admin_users table can modify CMS content
    - All modifications are logged with timestamp and user info
    - Public can still read published content
    - Authenticated non-admins have read-only access
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can view who is an admin
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit log table
CREATE TABLE IF NOT EXISTS cms_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  user_email text,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cms_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view audit log" ON cms_audit_log;

CREATE POLICY "Admins can view audit log"
  ON cms_audit_log FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert audit log" ON cms_audit_log;

CREATE POLICY "Admins can insert audit log"
  ON cms_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Drop existing permissive policies and create restrictive admin-only policies
-- Materials table
DROP POLICY IF EXISTS "Authenticated users can insert materials" ON materials;
DROP POLICY IF EXISTS "Authenticated users can update materials" ON materials;
DROP POLICY IF EXISTS "Authenticated users can delete materials" ON materials;

DROP POLICY IF EXISTS "Only admins can insert materials" ON materials;

CREATE POLICY "Only admins can insert materials"
  ON materials FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update materials" ON materials;

CREATE POLICY "Only admins can update materials"
  ON materials FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can delete materials" ON materials;

CREATE POLICY "Only admins can delete materials"
  ON materials FOR DELETE
  TO authenticated
  USING (is_admin());

-- Facts table
DROP POLICY IF EXISTS "Authenticated users can insert facts" ON facts;
DROP POLICY IF EXISTS "Authenticated users can update facts" ON facts;
DROP POLICY IF EXISTS "Authenticated users can delete facts" ON facts;

DROP POLICY IF EXISTS "Only admins can insert facts" ON facts;

CREATE POLICY "Only admins can insert facts"
  ON facts FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update facts" ON facts;

CREATE POLICY "Only admins can update facts"
  ON facts FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can delete facts" ON facts;

CREATE POLICY "Only admins can delete facts"
  ON facts FOR DELETE
  TO authenticated
  USING (is_admin());

-- Lessons table
DROP POLICY IF EXISTS "Authenticated users can insert lessons" ON lessons;
DROP POLICY IF EXISTS "Authenticated users can update lessons" ON lessons;
DROP POLICY IF EXISTS "Authenticated users can delete lessons" ON lessons;

DROP POLICY IF EXISTS "Only admins can insert lessons" ON lessons;

CREATE POLICY "Only admins can insert lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update lessons" ON lessons;

CREATE POLICY "Only admins can update lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can delete lessons" ON lessons;

CREATE POLICY "Only admins can delete lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (is_admin());

-- Reasons table
DROP POLICY IF EXISTS "Authenticated users can insert reasons" ON reasons;
DROP POLICY IF EXISTS "Authenticated users can update reasons" ON reasons;
DROP POLICY IF EXISTS "Authenticated users can delete reasons" ON reasons;

DROP POLICY IF EXISTS "Only admins can insert reasons" ON reasons;

CREATE POLICY "Only admins can insert reasons"
  ON reasons FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update reasons" ON reasons;

CREATE POLICY "Only admins can update reasons"
  ON reasons FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can delete reasons" ON reasons;

CREATE POLICY "Only admins can delete reasons"
  ON reasons FOR DELETE
  TO authenticated
  USING (is_admin());

-- Interviews table
DROP POLICY IF EXISTS "Authenticated users can insert interviews" ON interviews;
DROP POLICY IF EXISTS "Authenticated users can update interviews" ON interviews;
DROP POLICY IF EXISTS "Authenticated users can delete interviews" ON interviews;

DROP POLICY IF EXISTS "Only admins can insert interviews" ON interviews;

CREATE POLICY "Only admins can insert interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update interviews" ON interviews;

CREATE POLICY "Only admins can update interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can delete interviews" ON interviews;

CREATE POLICY "Only admins can delete interviews"
  ON interviews FOR DELETE
  TO authenticated
  USING (is_admin());

-- Home content table
DROP POLICY IF EXISTS "Authenticated users can insert home content" ON home_content;
DROP POLICY IF EXISTS "Authenticated users can update home content" ON home_content;
DROP POLICY IF EXISTS "Authenticated users can delete home content" ON home_content;

DROP POLICY IF EXISTS "Only admins can insert home content" ON home_content;

CREATE POLICY "Only admins can insert home content"
  ON home_content FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update home content" ON home_content;

CREATE POLICY "Only admins can update home content"
  ON home_content FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can delete home content" ON home_content;

CREATE POLICY "Only admins can delete home content"
  ON home_content FOR DELETE
  TO authenticated
  USING (is_admin());

-- Site updates table
DROP POLICY IF EXISTS "Authenticated users can insert site updates" ON site_updates;
DROP POLICY IF EXISTS "Authenticated users can update site updates" ON site_updates;
DROP POLICY IF EXISTS "Authenticated users can delete site updates" ON site_updates;

DROP POLICY IF EXISTS "Only admins can insert site updates" ON site_updates;

CREATE POLICY "Only admins can insert site updates"
  ON site_updates FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can update site updates" ON site_updates;

CREATE POLICY "Only admins can update site updates"
  ON site_updates FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can delete site updates" ON site_updates;

CREATE POLICY "Only admins can delete site updates"
  ON site_updates FOR DELETE
  TO authenticated
  USING (is_admin());

-- Site metadata table
DROP POLICY IF EXISTS "Authenticated users can update site metadata" ON site_metadata;

DROP POLICY IF EXISTS "Only admins can update site metadata" ON site_metadata;

CREATE POLICY "Only admins can update site metadata"
  ON site_metadata FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_cms_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cms_audit_log (table_name, record_id, action, user_id, user_email, changes)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    auth.uid(),
    auth.email(),
    CASE
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to all CMS tables
DROP TRIGGER IF EXISTS audit_materials ON materials;
CREATE TRIGGER audit_materials
  AFTER INSERT OR UPDATE OR DELETE ON materials
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_facts ON facts;
CREATE TRIGGER audit_facts
  AFTER INSERT OR UPDATE OR DELETE ON facts
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_lessons ON lessons;
CREATE TRIGGER audit_lessons
  AFTER INSERT OR UPDATE OR DELETE ON lessons
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_reasons ON reasons;
CREATE TRIGGER audit_reasons
  AFTER INSERT OR UPDATE OR DELETE ON reasons
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_interviews ON interviews;
CREATE TRIGGER audit_interviews
  AFTER INSERT OR UPDATE OR DELETE ON interviews
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();

DROP TRIGGER IF EXISTS audit_home_content ON home_content;
CREATE TRIGGER audit_home_content
  AFTER INSERT OR UPDATE OR DELETE ON home_content
  FOR EACH ROW EXECUTE FUNCTION log_cms_action();
/*
  # Add navigation links to site updates

  1. Changes
    - Add `link_page` field to store which page to navigate to
    - Add `link_slug` field to store optional slug for articles
    - Update existing site updates with proper links
    
  2. Purpose
    - Allows updates in the Latest Updates box to be clickable
    - Links users directly to the content being referenced
    - Improves user experience and site navigation
*/

-- Add link fields to site_updates table
ALTER TABLE site_updates 
ADD COLUMN IF NOT EXISTS link_page text,
ADD COLUMN IF NOT EXISTS link_slug text;

-- Update existing records with proper links
UPDATE site_updates 
SET 
  link_page = 'article',
  link_slug = 'tim-oliver-interview-lgr-surrey'
WHERE title = 'Tim Oliver interview published with full content';

UPDATE site_updates 
SET 
  link_page = 'surrey'
WHERE title = 'Surrey devolution analysis updated with latest data';

UPDATE site_updates 
SET 
  link_page = 'materials'
WHERE title = 'New materials added to library section';

UPDATE site_updates 
SET 
  link_page = 'facts'
WHERE title = 'Facts & Figures page updated with 2025 statistics';

UPDATE site_updates 
SET 
  link_page = '100days'
WHERE title = 'First 100 Days playbook enhanced with new recommendations';
/*
  # Create FAQs Table

  1. New Tables
    - `faqs`
      - `id` (uuid, primary key) - Unique identifier for each FAQ
      - `page` (text, not null) - Page identifier (home, facts, reasons, lessons, interviews, surrey, councils, materials, hundred-days)
      - `question` (text, not null) - The FAQ question
      - `answer` (text, not null) - The FAQ answer
      - `order_index` (integer, default 0) - Display order on the page
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `faqs` table
    - Add policy for public read access (FAQs are public content)
    - Add policy for authenticated admin users to insert FAQs
    - Add policy for authenticated admin users to update FAQs
    - Add policy for authenticated admin users to delete FAQs

  3. Indexes
    - Add index on `page` column for efficient querying
    - Add index on `order_index` for sorting
*/

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Anyone can view FAQs" ON faqs;

CREATE POLICY "Anyone can view FAQs"
  ON faqs
  FOR SELECT
  TO public
  USING (true);

-- Admin insert access
DROP POLICY IF EXISTS "Admin users can insert FAQs" ON faqs;

CREATE POLICY "Admin users can insert FAQs"
  ON faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admin update access
DROP POLICY IF EXISTS "Admin users can update FAQs" ON faqs;

CREATE POLICY "Admin users can update FAQs"
  ON faqs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admin delete access
DROP POLICY IF EXISTS "Admin users can delete FAQs" ON faqs;

CREATE POLICY "Admin users can delete FAQs"
  ON faqs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_faqs_page ON faqs(page);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs(order_index);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS faqs_updated_at ON faqs;

CREATE TRIGGER faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_faqs_updated_at();/*
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
END $$;/*
  # Create News Table

  1. New Tables
    - `news`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - News article title
      - `slug` (text, unique) - URL-friendly identifier
      - `published_date` (date) - Publication date
      - `content` (text) - Main article content (supports HTML)
      - `embed_code` (text, nullable) - Embed codes (e.g., Spotify iframes)
      - `excerpt` (text, nullable) - Short summary for listings
      - `published` (boolean, default false) - Publication status
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `display_order` (integer, default 0) - Manual ordering

  2. Security
    - Enable RLS on `news` table
    - Add policy for public to read published news
    - Add policy for authenticated admins to manage news

  3. Indexes
    - Index on `slug` for fast lookups
    - Index on `published_date` for sorting
    - Index on `published` for filtering
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  published_date date NOT NULL,
  content text NOT NULL DEFAULT '',
  embed_code text,
  excerpt text,
  published boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Public can read published news
DROP POLICY IF EXISTS "Anyone can read published news" ON news;

CREATE POLICY "Anyone can read published news"
  ON news
  FOR SELECT
  USING (published = true);

-- Admins can manage all news
DROP POLICY IF EXISTS "Admins can insert news" ON news;

CREATE POLICY "Admins can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update news" ON news;

CREATE POLICY "Admins can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete news" ON news;

CREATE POLICY "Admins can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_display_order ON news(display_order, published_date DESC);/*
  # Fix Security and Performance Issues
  
  This migration addresses multiple security and performance issues identified by Supabase:
  
  ## 1. Foreign Key Indexes
  - Add indexes for foreign keys on `admin_users.created_by` and `cms_audit_log.user_id`
  
  ## 2. RLS Policy Performance
  - Update all RLS policies to use `(select auth.<function>())` instead of direct calls
  - This prevents re-evaluation for each row, improving query performance at scale
  - Affects tables: admin_users, faqs, news
  
  ## 3. Duplicate Policies
  - Remove duplicate SELECT policies on materials table
  
  ## 4. Duplicate Indexes
  - Remove duplicate indexes across multiple tables
  - Keep the more clearly named versions
  
  ## 5. Unused Indexes
  - Remove indexes that are not being used to reduce overhead
  
  ## 6. Function Security
  - Fix mutable search paths on database functions
  - Set explicit search_path to prevent security issues
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

-- Index for admin_users.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_admin_users_created_by ON admin_users(created_by);

-- Index for cms_audit_log.user_id foreign key
CREATE INDEX IF NOT EXISTS idx_cms_audit_log_user_id ON cms_audit_log(user_id);

-- ============================================================================
-- 2. FIX RLS POLICIES FOR PERFORMANCE
-- ============================================================================

-- Fix admin_users policies
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Fix faqs policies
DROP POLICY IF EXISTS "Admin users can insert FAQs" ON faqs;
DROP POLICY IF EXISTS "Admin users can insert FAQs" ON faqs;

CREATE POLICY "Admin users can insert FAQs"
  ON faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin users can update FAQs" ON faqs;
DROP POLICY IF EXISTS "Admin users can update FAQs" ON faqs;

CREATE POLICY "Admin users can update FAQs"
  ON faqs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin users can delete FAQs" ON faqs;
DROP POLICY IF EXISTS "Admin users can delete FAQs" ON faqs;

CREATE POLICY "Admin users can delete FAQs"
  ON faqs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Fix news policies
DROP POLICY IF EXISTS "Admins can insert news" ON news;
DROP POLICY IF EXISTS "Admins can insert news" ON news;

CREATE POLICY "Admins can insert news"
  ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can update news" ON news;
DROP POLICY IF EXISTS "Admins can update news" ON news;

CREATE POLICY "Admins can update news"
  ON news
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can delete news" ON news;
DROP POLICY IF EXISTS "Admins can delete news" ON news;

CREATE POLICY "Admins can delete news"
  ON news
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- 3. REMOVE DUPLICATE POLICIES
-- ============================================================================

-- Remove one of the duplicate SELECT policies on materials
DROP POLICY IF EXISTS "Materials are publicly readable" ON materials;
-- Keep "Anyone can view materials" policy

-- ============================================================================
-- 4. REMOVE DUPLICATE INDEXES
-- ============================================================================

-- Drop duplicate indexes, keeping the more descriptive names
DROP INDEX IF EXISTS idx_facts_order_index;
DROP INDEX IF EXISTS idx_faqs_order_index;
DROP INDEX IF EXISTS idx_interviews_order_index;
DROP INDEX IF EXISTS idx_lessons_order_index;
DROP INDEX IF EXISTS materials_geography_idx;
DROP INDEX IF EXISTS materials_published_date_idx;
DROP INDEX IF EXISTS materials_slug_idx;
DROP INDEX IF EXISTS materials_theme_idx;
DROP INDEX IF EXISTS materials_type_idx;

-- ============================================================================
-- 5. REMOVE UNUSED INDEXES
-- ============================================================================

-- Remove unused indexes to reduce maintenance overhead
DROP INDEX IF EXISTS idx_materials_editors_pick;
DROP INDEX IF EXISTS idx_site_updates_created_at;
DROP INDEX IF EXISTS idx_materials_main_image;
DROP INDEX IF EXISTS idx_councils_country;
DROP INDEX IF EXISTS idx_councils_name;
DROP INDEX IF EXISTS idx_interviews_type;
DROP INDEX IF EXISTS idx_news_published_date;
DROP INDEX IF EXISTS materials_read_count_idx;
DROP INDEX IF EXISTS materials_featured_idx;
DROP INDEX IF EXISTS idx_home_content_section;
DROP INDEX IF EXISTS idx_home_content_order;
DROP INDEX IF EXISTS idx_facts_category;

-- ============================================================================
-- 6. FIX FUNCTION SECURITY (MUTABLE SEARCH PATHS)
-- ============================================================================

-- Recreate is_admin function with secure search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Recreate update_faqs_updated_at trigger function with secure search_path
CREATE OR REPLACE FUNCTION public.update_faqs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate log_cms_action function with secure search_path
CREATE OR REPLACE FUNCTION public.log_cms_action()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.cms_audit_log (
    table_name,
    action,
    record_id,
    user_id,
    changes
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    auth.uid(),
    CASE
      WHEN TG_OP = 'UPDATE' THEN row_to_json(NEW)
      WHEN TG_OP = 'INSERT' THEN row_to_json(NEW)
      WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
    END
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;
/*
  # Create Subscriptions Table and Add Unsubscribe Functionality

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, unique) - Subscriber email address
      - `active` (boolean, default true) - Subscription status
      - `unsubscribed_at` (timestamptz, nullable) - When user unsubscribed
      - `created_at` (timestamptz) - Record creation timestamp
  
  2. Security
    - Enable RLS on subscriptions table
    - Allow public read access for unsubscribe functionality
    - Allow public insert for new subscriptions
*/

-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  active boolean DEFAULT true,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public to read subscriptions (needed for unsubscribe)
DROP POLICY IF EXISTS "Public can view subscriptions" ON subscriptions;
CREATE POLICY "Public can view subscriptions"
  ON subscriptions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public to insert subscriptions
DROP POLICY IF EXISTS "Public can insert subscriptions" ON subscriptions;
CREATE POLICY "Public can insert subscriptions"
  ON subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public to update subscriptions (for unsubscribe)
DROP POLICY IF EXISTS "Public can update subscriptions" ON subscriptions;
CREATE POLICY "Public can update subscriptions"
  ON subscriptions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Add index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);

-- Add active status column (if not exists from table creation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'active'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN active boolean DEFAULT true;
  END IF;
END $$;

-- Add unsubscribed_at timestamp column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'unsubscribed_at'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN unsubscribed_at timestamptz;
  END IF;
END $$;

-- Add index for better query performance on email lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_email_active 
  ON subscriptions(email, active);/*
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
CREATE INDEX IF NOT EXISTS idx_materials_tags ON materials USING GIN(tags);/*
  # Create Articles Table and Update Structure (v2)

  1. New Tables
    - `articles`
      - `id` (uuid, primary key) - Unique identifier
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly identifier
      - `body` (text, nullable) - Main article content
      - `excerpt` (text, nullable) - Short summary
      - `featured_image` (text, nullable) - Featured image URL
      - `status` (text, 'draft' or 'published', default 'draft')
      - `published_date` (timestamptz, nullable) - Publication date
      - `featured` (boolean, default false) - Featured flag
      - `author` (text, nullable) - Author name
      - `category` (text, nullable) - Article category
      - `region` (text, nullable) - Geographic region
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Changes
    - Create articles table if it doesn't exist
    - Add/update columns as needed
    - Create RLS policies

  3. Security
    - Enable RLS with proper policies for status field
*/

-- Create articles table if it doesn't exist
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  body text,
  excerpt text,
  featured_image text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_date timestamptz,
  featured boolean DEFAULT false,
  author text,
  category text,
  region text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'excerpt'
  ) THEN
    ALTER TABLE articles ADD COLUMN excerpt text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'status'
  ) THEN
    ALTER TABLE articles ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'published'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'published_date'
  ) THEN
    ALTER TABLE articles ADD COLUMN published_date timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE articles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Rename content to body if content exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'content'
  ) THEN
    ALTER TABLE articles RENAME COLUMN content TO body;
  END IF;
END $$;

-- Migrate published boolean to status text and drop published column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'published'
  ) THEN
    UPDATE articles SET status = CASE WHEN published THEN 'published' ELSE 'draft' END;
    ALTER TABLE articles DROP COLUMN published CASCADE;
  END IF;
END $$;

-- Drop unnecessary columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'subtitle'
  ) THEN
    ALTER TABLE articles DROP COLUMN subtitle;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'section'
  ) THEN
    ALTER TABLE articles DROP COLUMN section;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status_published_date ON articles(status, published_date DESC);

-- Ensure RLS is enabled
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;

CREATE POLICY "Anyone can view published articles"
  ON articles
  FOR SELECT
  USING (status = 'published');

-- Authenticated admin users can do everything
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;

CREATE POLICY "Authenticated users can view all articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;

CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update articles" ON articles;

CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete articles" ON articles;

CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();
/*
  # Migrate Materials to Articles (v3)

  1. Purpose
    - Copy published articles from materials table to articles table
    - Map fields appropriately for new article structure
    - Handle articles with missing body content

  2. Field Mapping
    - materials.title -> articles.title
    - materials.slug -> articles.slug
    - materials.description -> articles.excerpt (strip HTML tags)
    - materials.content (with fallback to description) -> articles.body
    - materials.main_image_url or materials.image_url -> articles.featured_image
    - materials.status -> articles.status
    - materials.published_date -> articles.published_date
    - materials.created_at -> articles.created_at

  3. Notes
    - Only migrates published materials
    - Avoids duplicates by checking for existing slugs
    - Preserves original timestamps
    - Uses description as fallback if content is null
*/

-- Insert articles from materials, avoiding duplicates
INSERT INTO articles (
  title,
  slug,
  excerpt,
  body,
  featured_image,
  status,
  published_date,
  created_at
)
SELECT 
  m.title,
  m.slug,
  regexp_replace(COALESCE(m.description, ''), '<[^>]+>', '', 'g') as excerpt,
  COALESCE(m.content, m.description, '<p>Content coming soon</p>') as body,
  COALESCE(m.main_image_url, m.image_url) as featured_image,
  m.status,
  m.published_date,
  m.created_at
FROM materials m
WHERE m.status = 'published'
AND NOT EXISTS (
  SELECT 1 FROM articles a WHERE a.slug = m.slug
)
ORDER BY m.published_date DESC;
/*
  # Fix Security and Performance Issues

  1. Drop Unused Indexes
    - Remove indexes from materials table (not actively used)
    - Remove unused indexes from admin_users, cms_audit_log, interviews, subscriptions, faqs
  
  2. Fix Multiple Permissive Policies
    - Consolidate two SELECT policies on articles table into one
    - Remove duplicate policy for authenticated users
  
  3. Fix Function Search Path
    - Set stable search_path on update_articles_updated_at function

  4. Notes
    - Auth DB connection strategy must be changed in Supabase dashboard settings
    - Cannot be changed via SQL migration
*/

-- 1. Drop unused indexes from materials table
DROP INDEX IF EXISTS idx_materials_status;
DROP INDEX IF EXISTS idx_materials_tags;
DROP INDEX IF EXISTS idx_materials_slug;
DROP INDEX IF EXISTS idx_materials_published_date;
DROP INDEX IF EXISTS idx_materials_type;
DROP INDEX IF EXISTS idx_materials_geography;
DROP INDEX IF EXISTS idx_materials_theme;

-- 2. Drop unused indexes from other tables
DROP INDEX IF EXISTS idx_admin_users_created_by;
DROP INDEX IF EXISTS idx_cms_audit_log_user_id;
DROP INDEX IF EXISTS idx_interviews_order;
DROP INDEX IF EXISTS idx_subscriptions_email_active;
DROP INDEX IF EXISTS idx_faqs_order;

-- 3. Fix multiple permissive policies on articles table
-- Drop the conflicting policies
DROP POLICY IF EXISTS "Anyone can view published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated users can view all articles" ON articles;

-- Create a single consolidated SELECT policy
-- Public users can only see published articles
-- Authenticated users can see all articles
DROP POLICY IF EXISTS "Users can view articles based on auth status" ON articles;

CREATE POLICY "Users can view articles based on auth status"
  ON articles
  FOR SELECT
  USING (
    status = 'published' 
    OR 
    (auth.uid() IS NOT NULL)
  );

-- 4. Fix function search_path issue
-- Recreate function with stable search_path
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
/*
  # Create Storage Bucket for Article Images

  1. Storage Bucket
    - Create a public storage bucket named 'article-images'
    - Allow public access for reading images
    - Configure policies for authenticated admins to upload images
  
  2. Security
    - Enable RLS on storage.objects table
    - Allow public read access to images
    - Allow authenticated admins to upload/update/delete images
*/

-- Create the storage bucket for article images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-images',
  'article-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (all on storage.objects)
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can update article images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can delete article images" ON storage.objects;
END $$;

-- Allow public read access to all images in the bucket
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update article images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'article-images')
WITH CHECK (bucket_id = 'article-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete article images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');/*
  # Add Featured Flag to Articles

  1. Changes
    - Add `featured` column (boolean, default false)
    - Featured articles will display "Exclusive" badge
  
  2. Notes
    - No RLS changes needed (inherits from existing policies)
*/

-- Add featured column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'articles' AND column_name = 'featured'
  ) THEN
    ALTER TABLE articles ADD COLUMN featured boolean DEFAULT false;
  END IF;
END $$;

-- Create index for featured articles
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;
/*
  # Create Article Q&A Table

  1. New Tables
    - `article_qa`
      - `id` (uuid, primary key) - Unique identifier for each Q&A
      - `article_slug` (text, not null) - Article slug to link Q&A to article
      - `question` (text, not null) - The Q&A question
      - `answer` (text, not null) - The Q&A answer (supports HTML)
      - `order_index` (integer, default 0) - Display order
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `article_qa` table
    - Add policy for public read access (Q&A are public content)
    - Add policy for authenticated admin users to manage Q&A

  3. Indexes
    - Add index on `article_slug` column for efficient querying
    - Add index on `order_index` for sorting
*/

CREATE TABLE IF NOT EXISTS article_qa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_slug text NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE article_qa ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Anyone can view article Q&A" ON article_qa;

CREATE POLICY "Anyone can view article Q&A"
  ON article_qa
  FOR SELECT
  TO public, anon, authenticated
  USING (true);

-- Admin insert access
DROP POLICY IF EXISTS "Admin users can insert article Q&A" ON article_qa;

CREATE POLICY "Admin users can insert article Q&A"
  ON article_qa
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Admin update access
DROP POLICY IF EXISTS "Admin users can update article Q&A" ON article_qa;

CREATE POLICY "Admin users can update article Q&A"
  ON article_qa
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Admin delete access
DROP POLICY IF EXISTS "Admin users can delete article Q&A" ON article_qa;

CREATE POLICY "Admin users can delete article Q&A"
  ON article_qa
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = (SELECT auth.uid())
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_article_qa_slug ON article_qa(article_slug);
CREATE INDEX IF NOT EXISTS idx_article_qa_order ON article_qa(article_slug, order_index);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_article_qa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS article_qa_updated_at ON article_qa;

CREATE TRIGGER article_qa_updated_at
  BEFORE UPDATE ON article_qa
  FOR EACH ROW
  EXECUTE FUNCTION update_article_qa_updated_at();

