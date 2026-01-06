# Import Substack Articles Guide

This guide shows you how to import articles from your Substack RSS feed into your website.

## Setup

### Step 1: Install Required Package

Run this command in your terminal:

```bash
npm install xml2js
```

### Step 2: Add Service Role Key to .env File

**Important:** For import scripts, you need the **service role key** (not the anon key) to bypass Row Level Security.

1. **Get your Service Role Key:**
   - Go to: https://app.supabase.com
   - Select your project
   - Go to: **Settings → API**
   - Scroll down to find **"service_role"** key
   - Copy it (it's different from the anon key)

2. **Add to .env file:**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

   ⚠️ **Security Note:** The service role key bypasses all security. Never commit it to git or expose it publicly. Only use it for server-side scripts.

### Step 3: Run the Import

```bash
npm run import-substack
```

This will:
1. ✅ Fetch your RSS feed from `https://rowancole.substack.com/feed`
2. ✅ Parse all articles from the feed
3. ✅ Extract titles, content, images, dates, etc.
4. ✅ Upload them to your Supabase database
5. ✅ Skip articles that already exist (based on slug)

## What Gets Imported

For each article in your RSS feed, the script will:

- **Title**: Article title
- **Slug**: Auto-generated from title (URL-friendly)
- **Excerpt**: Extracted from description (first 200 characters)
- **Body**: Full HTML content from the article
- **Featured Image**: Extracted from article images
- **Status**: Set to "published"
- **Published Date**: From RSS feed
- **Author**: "Rowan @ Coalface™" (from RSS)
- **Category**: "Analysis" (default)
- **Region**: "England" (default)

## After Import

Once imported, you can:

1. **View articles** on your website at `/insights/[slug]`
2. **Edit articles** in the admin interface:
   - Go to `/admin/login` → Articles
   - Or `/admin/articles/login`
3. **Update details** like category, region, featured status, etc.

## Troubleshooting

### Error: "row-level security policy"
**Solution:** Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file (see Step 2 above)

### Error: "Cannot connect to Supabase"
- Check your `.env` file has correct credentials
- Make sure Supabase project is active

### Error: "xml2js not found"
- Run: `npm install xml2js`

### Articles not importing
- Check your RSS feed URL is correct
- Make sure articles table exists in Supabase (run migrations first)
- Check browser console for errors

### Duplicate articles
- The script automatically skips articles with existing slugs
- If you want to re-import, delete the article first in admin

## Manual Import

If the script doesn't work, you can:

1. Visit your RSS feed: https://rowancole.substack.com/feed
2. Copy article content manually
3. Use the admin interface to create articles

## Re-running the Import

You can run the import script multiple times - it will:
- ✅ Import new articles
- ⏭️ Skip articles that already exist
- 🔄 Won't duplicate content

Perfect for keeping your website in sync with Substack!

## Security Reminder

⚠️ **Never commit your `.env` file to git!**

The service role key has full database access. Keep it secure:
- ✅ Add `.env` to `.gitignore` (already done)
- ✅ Only use service role key for server-side scripts
- ✅ Never expose it in client-side code
- ✅ Rotate it if accidentally exposed
