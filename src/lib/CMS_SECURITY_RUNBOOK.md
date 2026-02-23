# CMS Security Runbook

## Emergency Order of Operations
1. Ensure a break-glass admin account exists in `auth.users` and `admin_users`.
2. Disable privileged recovery functions unless explicitly needed:
`ENABLE_ADMIN_RECOVERY_FUNCTIONS=false`
3. Rotate admin credentials and revoke active sessions in Supabase Auth.
4. Confirm RLS migration `20260222190000_harden_cms_policies_and_news_status.sql` is applied.
5. Run one-time sanitization script:
`node src/lib/sanitize-cms-content.js`

## Pre-Deploy Checks
1. `npm run typecheck`
2. `npm run build`
3. `npm run security:scan`

## Post-Deploy Checks
1. Admin user can access `/admin/dashboard`.
2. Non-admin user is denied admin dashboard and cannot mutate CMS records.
3. Published news appears on public page; draft/archived does not.
4. CMS content with script/event payloads renders inert.
