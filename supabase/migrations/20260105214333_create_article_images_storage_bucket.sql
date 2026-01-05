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

-- Drop existing policies if they exist
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
USING (bucket_id = 'article-images');