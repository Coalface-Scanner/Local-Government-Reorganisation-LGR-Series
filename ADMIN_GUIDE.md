# CMS Admin Guide

## Security Overview

The CMS system has been secured with role-based access control and comprehensive audit logging.

### Security Features

1. **Role-Based Access Control (RBAC)**
   - Only users in the `admin_users` table can modify CMS content
   - All authenticated non-admin users have read-only access
   - Public users can view published content only

2. **Audit Logging**
   - All CMS modifications are logged in `cms_audit_log` table
   - Logs include: table name, record ID, action type, user email, timestamp, and changes
   - Admin users can query audit logs to track all content changes

3. **Row Level Security (RLS)**
   - Enabled on all CMS tables with restrictive policies
   - Uses `is_admin()` function to verify admin status
   - Prevents unauthorized access at the database level

## Admin User Management

### Creating the First Admin User

The system includes an edge function to create and manage admin users:

**Endpoint:** `{SUPABASE_URL}/functions/v1/create-admin`

**Usage:**
```bash
curl -X POST {SUPABASE_URL}/functions/v1/create-admin \
  -H "Authorization: Bearer {SUPABASE_ANON_KEY}"
```

**Current Admin Credentials:**

**For Main CMS Admin Login** (`/admin/login`):
- Email: `rowan@coalfaceengagement.co.uk`
- Password: `MapleLeaf1988!`

**For Article Editor Login** (`/admin/articles/login`):
- Password: `admin123`

**Important:** Change the default passwords immediately after first login.

### Adding Additional Admin Users

To add more admin users:

1. Create the user in Supabase Auth Dashboard
2. Add their user_id to the `admin_users` table:

```sql
INSERT INTO admin_users (user_id, email, created_by)
VALUES (
  '{user_id}',
  'email@example.com',
  auth.uid()
);
```

## CMS Tables

The following tables are protected by admin-only access:

- `materials` - Articles, documents, and resources
- `facts` - Facts and figures content
- `lessons` - Lessons learned content
- `reasons` - Reasons for reorganization content
- `interviews` - Interview content
- `home_content` - Home page dynamic content
- `site_updates` - Site update notifications
- `site_metadata` - Site-wide metadata

## Audit Log

### Querying the Audit Log

Admin users can query the audit log to see all content changes:

```sql
SELECT
  table_name,
  action,
  user_email,
  created_at,
  changes
FROM cms_audit_log
ORDER BY created_at DESC
LIMIT 100;
```

### Audit Log Fields

- `table_name` - Which CMS table was modified
- `record_id` - UUID of the modified record
- `action` - INSERT, UPDATE, or DELETE
- `user_id` - UUID of the user who made the change
- `user_email` - Email of the user who made the change
- `changes` - JSONB containing the old and new values
- `created_at` - Timestamp of the change

## Best Practices

1. **Password Security**
   - Use strong, unique passwords for admin accounts
   - Change default passwords immediately
   - Never share admin credentials

2. **Access Control**
   - Only grant admin access to trusted users
   - Regularly review the `admin_users` table
   - Remove admin access when staff members leave

3. **Content Management**
   - Preview changes before publishing
   - Use descriptive titles and slugs
   - Keep audit trails for accountability

4. **Security Monitoring**
   - Regularly review audit logs for suspicious activity
   - Monitor for unauthorized access attempts
   - Keep the Supabase dashboard access restricted

## Troubleshooting

### Admin User Cannot Access CMS

1. Verify the user exists in `auth.users`
2. Check if user is in `admin_users` table:
   ```sql
   SELECT * FROM admin_users WHERE email = 'user@example.com';
   ```
3. If not present, add them using the SQL command above

### Changes Not Saving

1. Check browser console for errors
2. Verify the user is authenticated
3. Confirm the user has admin access
4. Review audit logs for error details

### Edge Function Not Working

1. Check Supabase logs in the dashboard
2. Verify environment variables are set correctly
3. Ensure RLS policies are properly configured

## Database Schema

### admin_users Table

```sql
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);
```

### cms_audit_log Table

```sql
CREATE TABLE cms_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  user_email text,
  changes jsonb,
  created_at timestamptz DEFAULT now()
);
```

## Support

For technical support or security concerns, contact the development team.
