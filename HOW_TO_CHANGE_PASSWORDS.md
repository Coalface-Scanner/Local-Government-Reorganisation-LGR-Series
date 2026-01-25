# How to Change Default Passwords

This guide explains how to change the default passwords before launching your site.

## Overview

There are **two types of passwords** in this system:

1. **Main CMS Admin Password** - For accessing `/admin/login` (Supabase Auth)
2. **Article Editor Password** - For accessing `/admin/articles/login` (Environment variable)

---

## 1. Change Main CMS Admin Password

**Location:** `/admin/login`  
**Default:** Email: `rowan@coalfaceengagement.co.uk`, Password: `MapleLeaf1988!`  
**Method:** Change via Supabase Auth Dashboard

### Steps:

1. **Log into Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to Authentication**
   - Click "Authentication" in the left sidebar
   - Click "Users"

3. **Find the Admin User**
   - Search for `rowan@coalfaceengagement.co.uk`
   - Click on the user

4. **Change Password**
   - Click "Reset Password" or "Update User"
   - Enter a new strong password
   - Save changes

5. **Update Password in Supabase Auth**
   - The user will need to reset their password via email, OR
   - You can manually set a new password in the user's profile

**Alternative Method (via Supabase SQL Editor):**
```sql
-- Update password for the admin user
-- Note: Supabase uses bcrypt hashing, so you'll need to use their auth API
-- It's easier to use the dashboard or password reset flow
```

**Recommended:** Use Supabase's password reset feature or update via the dashboard.

---

## 2. Change Article Editor Password

**Location:** `/admin/articles/login`  
**Default:** `admin123`  
**Method:** Update environment variable `VITE_ADMIN_PASSWORD`

### Steps:

#### For Local Development:

1. **Open `.env` file** (create it if it doesn't exist, based on `.env.example`)

2. **Set the new password:**
   ```bash
   VITE_ADMIN_PASSWORD=your_new_strong_password_here
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

#### For Production (Netlify):

1. **Log into Netlify Dashboard**
   - Go to https://app.netlify.com
   - Select your site

2. **Navigate to Site Settings**
   - Click "Site settings" → "Environment variables"

3. **Update or Add Variable**
   - Find `VITE_ADMIN_PASSWORD` (or add it if it doesn't exist)
   - Set the value to your new strong password
   - Click "Save"

4. **Redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - Or push a new commit to trigger automatic deployment

---

## 3. Optional: Site-Wide Password Protection

**Location:** Entire site (if enabled)  
**Method:** Update environment variable `VITE_SITE_PASSWORD`

If you want site-wide password protection:

### For Local Development:
```bash
# In .env file
VITE_SITE_PASSWORD=your_site_password_here
```

### For Production (Netlify):
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Set `VITE_SITE_PASSWORD` to your desired password
3. Redeploy

**Note:** If `VITE_SITE_PASSWORD` is empty or not set, site-wide password protection is disabled.

---

## Password Best Practices

When setting new passwords, follow these guidelines:

✅ **Do:**
- Use at least 12 characters
- Mix uppercase, lowercase, numbers, and special characters
- Use a password manager to generate and store passwords
- Use different passwords for different systems
- Store passwords securely (password manager, encrypted notes)

❌ **Don't:**
- Use common words or phrases
- Use personal information (names, birthdays)
- Reuse passwords from other accounts
- Share passwords via email or unencrypted channels

**Example Strong Passwords:**
- `Tr4n$f0rm@t10n!2025`
- `LGR#S3cur3@dmin2025`
- `G0v3rn@nce!Str0ng`

---

## Verification Checklist

After changing passwords, verify:

- [ ] Main CMS Admin password changed in Supabase
- [ ] Can log into `/admin/login` with new password
- [ ] Article Editor password updated in environment variables
- [ ] Can log into `/admin/articles/login` with new password
- [ ] Production environment variables updated (if deploying)
- [ ] Old default passwords no longer work
- [ ] New passwords stored securely

---

## Troubleshooting

### "Incorrect password" error after changing

1. **For Article Editor:**
   - Verify `.env` file has correct `VITE_ADMIN_PASSWORD`
   - Restart dev server: `npm run dev`
   - Clear browser session storage (or use incognito mode)
   - For production: Verify Netlify env var is set and site is redeployed

2. **For Main CMS Admin:**
   - Verify password was changed in Supabase Auth dashboard
   - Try password reset flow if needed
   - Check user email is correct

### Environment variables not working in production

- Ensure variables are set in Netlify dashboard (not just `.env`)
- Redeploy after changing environment variables
- Check variable names match exactly (case-sensitive)
- Verify no extra spaces in variable values

---

## Security Notes

⚠️ **CRITICAL:** Change these passwords **before** launching your site publicly.

- Default passwords are documented in code and should be considered compromised
- Never commit `.env` files to git (already in `.gitignore`)
- Use strong, unique passwords for production
- Consider using a password manager for all credentials
- Regularly rotate passwords as part of security maintenance
