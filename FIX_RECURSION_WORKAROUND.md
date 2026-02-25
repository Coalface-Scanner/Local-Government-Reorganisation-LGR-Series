# Fix Infinite Recursion - Workaround Solution

## The Problem

The `admin_users` SELECT policy uses `is_admin()` function, which queries `admin_users` table. This creates infinite recursion:

1. Policy checks: `is_admin()`?
2. `is_admin()` queries: `SELECT FROM admin_users`
3. This triggers the SELECT policy again...
4. **Infinite loop!**

## The Solution

Instead of using `is_admin()` in the `admin_users` SELECT policy, we check the `user_id` directly. This breaks the recursion because:
- The policy checks `user_id = auth.uid()` directly
- No function call = no recursion
- Other tables (news, faqs) can still use `is_admin()` safely

## Run This SQL

Copy and paste this into Supabase SQL Editor:

**File**: `supabase/migrations/20260108000003_fix_recursion_workaround.sql`

Or use this quick fix:

```sql
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Create new policy that checks user_id directly (no function call = no recursion)
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
```

## How It Works

- **admin_users table**: Policy checks `user_id = auth.uid()` directly (no recursion)
- **news/faqs tables**: Still use `is_admin()` function (safe, no recursion because admin_users policy doesn't use it)

## After Running

1. Try updating a news article
2. The recursion error should be gone!
3. You can still use `is_admin()` in other table policies

## Security Note

This approach is secure because:
- Only users whose `user_id` matches `auth.uid()` can see their own admin record
- Other tables still use `is_admin()` for admin checks
- The recursion is broken without compromising security

