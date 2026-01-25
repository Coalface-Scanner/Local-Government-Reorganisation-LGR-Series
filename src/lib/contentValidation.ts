import { ValidationError } from '../components/admin/ContentEditorActions';

export interface ContentFields {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  body?: string | null;
  content_type?: string | null;
  theme?: string | null;
  status?: 'draft' | 'published' | 'archived';
}

export function validateContent(fields: ContentFields, isPublishing: boolean = false): ValidationError[] {
  const errors: ValidationError[] = [];

  // Title is always required
  if (!fields.title || !fields.title.trim()) {
    errors.push({
      field: 'Title',
      message: 'Title is required',
    });
  }

  // Slug is always required
  if (!fields.slug || !fields.slug.trim()) {
    errors.push({
      field: 'Slug',
      message: 'Slug is required',
    });
  } else {
    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(fields.slug)) {
      errors.push({
        field: 'Slug',
        message: 'Slug must be lowercase letters, numbers, and hyphens only',
      });
    }
  }

  // Content type is required
  if (!fields.content_type) {
    errors.push({
      field: 'Content Type',
      message: 'Content type is required',
    });
  }

  // Theme is required for published content (except FAQ and Other)
  if (isPublishing) {
    if (fields.content_type !== 'FAQ' && fields.content_type !== 'Other') {
      if (!fields.theme || !fields.theme.trim()) {
        errors.push({
          field: 'Core Theme',
          message: 'Theme is required for published content (except FAQ and Other)',
        });
      }
    }
  }

  // Body/excerpt validation (optional but recommended)
  if (isPublishing) {
    if (!fields.body || fields.body.trim().length < 50) {
      errors.push({
        field: 'Content',
        message: 'Content body should be at least 50 characters for published content',
      });
    }
  }

  return errors;
}

export function validateSlugUniqueness(
  slug: string,
  currentId: string | null,
  existingSlugs: string[]
): ValidationError | null {
  const normalizedSlug = slug.toLowerCase().trim();
  const isDuplicate = existingSlugs.some(
    (existingSlug, index) => existingSlug.toLowerCase() === normalizedSlug && index.toString() !== currentId
  );

  if (isDuplicate) {
    return {
      field: 'Slug',
      message: 'An item with this slug already exists. Please use a different slug.',
    };
  }

  return null;
}
