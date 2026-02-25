# Content Upload Guide

I've set up a system to upload your content/articles to Supabase.

## Setup:

1. **Create the folder structure** (if it doesn't exist):
   ```bash
   mkdir -p content-to-upload/articles
   mkdir -p content-to-upload/materials
   ```

2. **Add your content files:**
   - Put article JSON files in `content-to-upload/articles/`
   - Put material JSON files in `content-to-upload/materials/`

## File Format:

### Articles (`content-to-upload/articles/your-article.json`):

```json
{
  "title": "Your Article Title",
  "slug": "url-friendly-slug",
  "excerpt": "Short description",
  "body": "<p>Full HTML content</p>",
  "status": "published",
  "published_date": "2024-01-15T00:00:00Z",
  "featured": false,
  "author": "Author Name",
  "category": "Category",
  "region": "Region"
}
```

### Materials (`content-to-upload/materials/your-material.json`):

```json
{
  "title": "Material Title",
  "slug": "url-friendly-slug",
  "description": "Description",
  "content": "Full content text",
  "type": "Article",
  "format": "PDF",
  "author": "Author Name",
  "published_date": "2024-01-15T00:00:00Z",
  "featured": false,
  "status": "published"
}
```

## Upload:

Once you've added your JSON files to the folders:

```bash
npm run upload-content
```

The script will:
- ✅ Connect to your Supabase database
- ✅ Upload all articles from `content-to-upload/articles/`
- ✅ Upload all materials from `content-to-upload/materials/`
- ✅ Skip duplicates (based on slug)
- ✅ Show progress for each file

## Example Files:

I've created example files:
- `content-to-upload/articles/example-article.json`
- `content-to-upload/materials/example-material.json`

Copy these and edit with your content!

## Tips:

- **Slug**: Must be unique, URL-friendly (lowercase, hyphens)
- **Status**: Use `"published"` to make it visible, `"draft"` to hide it
- **Dates**: Use ISO format: `"2024-01-15T00:00:00Z"`
- **Body**: Can include **full HTML formatting** - see `HTML_FORMATTING_GUIDE.md` for details

## Need Help?

If you have content in a different format (Word docs, markdown, etc.), let me know and I can help convert it!

