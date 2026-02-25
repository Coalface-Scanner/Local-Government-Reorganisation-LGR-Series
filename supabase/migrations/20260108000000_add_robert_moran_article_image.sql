-- Add featured image to Robert Moran article
-- Update the article with the featured_image URL

UPDATE articles
SET featured_image = '/robert-moran-article-image.jpg',
    updated_at = now()
WHERE slug = 'from-structure-to-authority-why-reorganisation-only-works-when-governance-is-taken-seriously';
