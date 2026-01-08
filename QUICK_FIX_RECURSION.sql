-- QUICK FIX: Run this in Supabase SQL Editor to fix infinite recursion
-- Copy and paste this entire block

-- Remove the problematic policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create a new policy that checks user_id directly (no recursion possible)
CREATE POLICY "Users can view their own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Now try updating a news article - the error should be gone!

