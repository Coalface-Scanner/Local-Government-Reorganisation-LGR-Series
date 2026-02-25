/*
  # Add public read access to materials table

  1. Security Changes
    - Add policy to allow anyone (including anonymous users) to read materials
    - This enables the public-facing Materials Library page to display content
*/

CREATE POLICY "Anyone can view materials"
  ON materials
  FOR SELECT
  TO anon, authenticated
  USING (true);
