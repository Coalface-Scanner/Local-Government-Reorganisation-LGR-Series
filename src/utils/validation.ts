export interface ValidationError {
  field: string;
  message: string;
}

export interface ArticleFormData {
  title?: string;
  slug?: string;
  body?: string;
  content_type?: string;
  theme?: string | null;
  status?: 'draft' | 'published';
}

export function validateArticle(data: ArticleFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (!data.slug?.trim()) {
    errors.push({ field: 'slug', message: 'Slug is required' });
  } else {
    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(data.slug)) {
      errors.push({ 
        field: 'slug', 
        message: 'Slug must contain only lowercase letters, numbers, and hyphens. No spaces or special characters allowed.' 
      });
    }
  }

  if (!data.body?.trim()) {
    errors.push({ field: 'body', message: 'Article body is required' });
  }

  if (!data.content_type) {
    errors.push({ field: 'content_type', message: 'Content type is required' });
  }

  // Theme is required for published content (except FAQ and Other)
  if (data.status === 'published') {
    if (data.content_type !== 'FAQ' && data.content_type !== 'Other') {
      if (!data.theme?.trim()) {
        errors.push({ 
          field: 'theme', 
          message: 'Core theme is required for published content (except FAQ and Other)' 
        });
      }
    }
  }

  return errors;
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message;
}
