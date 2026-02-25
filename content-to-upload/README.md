# Content Upload Folder

## How to Use:

1. **Add your content files here:**
   - Put article content in `articles/` folder
   - Put material content in `materials/` folder
   - Put facts content in `facts/` folder

2. **File Format:**
   - Create JSON files or markdown files
   - See examples below

3. **Run the upload script:**
   ```bash
   npm run upload-content
   ```

## Article File Format

Create files like: `articles/my-article.json`

```json
{
  "title": "Article Title",
  "slug": "article-url-slug",
  "excerpt": "Short description of the article",
  "body": "<p>Full article content with HTML</p>",
  "status": "published",
  "published_date": "2024-01-15T00:00:00Z",
  "featured": false,
  "author": "Author Name",
  "category": "Category",
  "region": "Region"
}
```

## Material File Format

Create files like: `materials/my-material.json`

```json
{
  "title": "Material Title",
  "slug": "material-url-slug",
  "description": "Description of the material",
  "content": "Full content text",
  "type": "Article",
  "format": "PDF",
  "author": "Author Name",
  "published_date": "2024-01-15T00:00:00Z",
  "featured": false
}
```

## Facts File Format

Create files like: `facts/my-facts.json`

```json
{
  "title": "Key Fact Title",
  "content": "The fact content and description",
  "category": "Financial",
  "order_index": 1
}
```

Or multiple facts in one file:
```json
[
  {
    "title": "First Fact",
    "content": "Content here...",
    "category": "Governance",
    "order_index": 1
  },
  {
    "title": "Second Fact",
    "content": "Content here...",
    "category": "Financial",
    "order_index": 2
  }
]
```

## Quick Start:

1. Add your content files to the appropriate folders
2. Make sure your `.env` file has Supabase credentials
3. Run upload scripts:
   - `npm run upload-content` - for articles and materials
   - `npm run upload-facts` - for key facts

