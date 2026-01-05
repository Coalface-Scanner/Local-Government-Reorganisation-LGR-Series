/*
  # Add Unsubscribe Functionality to Subscriptions

  1. Changes
    - Add `active` column to track subscription status (default: true)
    - Add `unsubscribed_at` column to track when user unsubscribed
    - Add index on email and active columns for better query performance
  
  2. Security
    - No changes to RLS policies needed (already public read access)
*/

-- Add active status column
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
  ON subscriptions(email, active);