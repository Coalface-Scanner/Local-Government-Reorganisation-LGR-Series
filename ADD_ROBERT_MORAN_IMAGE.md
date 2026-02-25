# Adding Robert Moran Article Image

## Steps to Add the Featured Image

### 1. Add the Image File
Place your image file in the `public` folder with the name:
```
public/robert-moran-article-image.jpg
```

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`

### 2. Update the Database
Run the SQL migration in your Supabase SQL Editor:

```sql
UPDATE articles
SET featured_image = '/robert-moran-article-image.jpg',
    updated_at = now()
WHERE slug = 'from-structure-to-authority-why-reorganisation-only-works-when-governance-is-taken-seriously';
```

Or run the migration file:
```bash
# The migration file is already created at:
supabase/migrations/20260108000000_add_robert_moran_article_image.sql
```

### 3. Verify
After adding the image file and running the SQL:
- The image should appear at: `/robert-moran-article-image.jpg`
- The article will display the image at: `/insights/from-structure-to-authority-why-reorganisation-only-works-when-governance-is-taken-seriously`

## Alternative: Using a Different Filename

If you want to use a different filename, update the SQL accordingly:

```sql
UPDATE articles
SET featured_image = '/your-image-filename.jpg',
    updated_at = now()
WHERE slug = 'from-structure-to-authority-why-reorganisation-only-works-when-governance-is-taken-seriously';
```

## Notes
- The image path should start with `/` to reference files in the `public` folder
- After deployment, the image will be accessible at the root URL + the image path
- Make sure the image is optimized for web (recommended: under 500KB, appropriate dimensions for article headers)
