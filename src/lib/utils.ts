/**
 * Utility functions for the LGRI website
 */

/**
 * Calculate estimated reading time for an article
 * Based on average reading speed of 200-250 words per minute
 */
export function calculateReadingTime(content: string | null): number {
  if (!content) return 0;
  
  // Strip HTML tags and get text content
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(' ').filter(word => word.length > 0).length;
  
  // Average reading speed: 225 words per minute
  const readingTime = Math.ceil(wordCount / 225);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Format reading time as human-readable string
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

/**
 * Extract headings from HTML content for table of contents
 */
export function extractHeadings(html: string): Array<{ id: string; text: string; level: number }> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h2, h3, h4');
  
  return Array.from(headings).map((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent || '';
    
    // If no ID, create one from text
    if (!heading.id) {
      const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      heading.id = slug || `heading-${index}`;
    }
    
    return { id: heading.id, text, level };
  });
}

/**
 * Generate a slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Map theme values from database to display names
 */
export function getThemeDisplayName(theme: string | null | undefined): string {
  if (!theme) return '';
  
  const themeMap: Record<string, string> = {
    'Public Design': 'Statecraft and System Design',
    'public design': 'Statecraft and System Design',
    'Public Engagement': 'Statecraft and System Design',
    'Public': 'Statecraft and System Design',
    'public': 'Statecraft and System Design',
  };
  
  return themeMap[theme] || theme;
}

/**
 * Map theme display name to slug for routing
 */
export function getThemeSlug(theme: string | null | undefined): string {
  if (!theme) return '';
  
  const displayName = getThemeDisplayName(theme);
  const slugMap: Record<string, string> = {
    'Statecraft and System Design': 'statecraft-and-system-design',
    'Local Government': 'governance-and-reform',
    'Governance': 'governance-and-reform',
    'Democracy': 'democracy',
    'Democratic Legitimacy': 'democratic-legitimacy',
    'Democratic legitimacy': 'democratic-legitimacy',
  };
  
  return slugMap[displayName] || generateSlug(displayName);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format date as time ago
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}
