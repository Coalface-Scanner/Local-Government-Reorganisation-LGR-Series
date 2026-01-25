import { supabase } from './supabase';

export interface LinkableContent {
  id: string;
  title: string;
  slug: string;
  type: 'article' | 'material';
}

/**
 * Fetch all linkable content (articles and materials) for link detection
 */
export async function getAllLinkableContent(): Promise<LinkableContent[]> {
  try {
    const [articlesResult, materialsResult] = await Promise.all([
      supabase
        .from('articles')
        .select('id, title, slug')
        .eq('status', 'published'),
      supabase
        .from('materials')
        .select('id, title, slug')
    ]);

    const articles: LinkableContent[] = (articlesResult.data || []).map(item => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      type: 'article' as const
    }));

    const materials: LinkableContent[] = (materialsResult.data || []).map(item => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      type: 'material' as const
    }));

    return [...articles, ...materials];
  } catch (error) {
    console.error('Error fetching linkable content:', error);
    return [];
  }
}

/**
 * Find mentions of article/material titles in text content
 */
export function findContentMentions(
  content: string,
  linkableContent: LinkableContent[],
  excludeSlug?: string
): Array<{ title: string; slug: string; type: 'article' | 'material'; position: number }> {
  if (!content) return [];

  const mentions: Array<{ title: string; slug: string; type: 'article' | 'material'; position: number }> = [];
  const textContent = content.replace(/<[^>]*>/g, ' '); // Remove HTML tags for matching

  // Sort by title length (longest first) to match longer titles before shorter ones
  const sortedContent = [...linkableContent]
    .filter(item => item.slug !== excludeSlug)
    .sort((a, b) => b.title.length - a.title.length);

  for (const item of sortedContent) {
    // Create case-insensitive regex for the title
    const titleRegex = new RegExp(`\\b${item.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = [...textContent.matchAll(titleRegex)];

    for (const match of matches) {
      // Check if this title is already inside a link tag
      const position = match.index || 0;
      const beforeMatch = content.substring(0, position);
      
      // Check if we're inside an <a> tag
      const lastOpenTag = beforeMatch.lastIndexOf('<a');
      const lastCloseTag = beforeMatch.lastIndexOf('</a>');
      
      if (lastOpenTag > lastCloseTag) {
        // We're inside a link, skip
        continue;
      }

      mentions.push({
        title: item.title,
        slug: item.slug,
        type: item.type,
        position
      });
    }
  }

  // Remove duplicates and sort by position
  const uniqueMentions = mentions.filter((mention, index, self) =>
    index === self.findIndex(m => m.slug === mention.slug && m.position === mention.position)
  );

  return uniqueMentions.sort((a, b) => a.position - b.position);
}

/**
 * Generate internal links in HTML content
 * This adds links to mentions of article/material titles
 */
export function enhanceContentWithLinks(
  content: string,
  linkableContent: LinkableContent[],
  excludeSlug?: string
): string {
  if (!content) return content;

  const mentions = findContentMentions(content, linkableContent, excludeSlug);
  
  if (mentions.length === 0) return content;

  // Process mentions in reverse order to maintain positions
  let enhancedContent = content;
  for (let i = mentions.length - 1; i >= 0; i--) {
    const mention = mentions[i];
    const route = mention.type === 'article' 
      ? `/insights/${mention.slug}`
      : `/materials/${mention.slug}`;
    
    // Find the position in the original HTML content
    const textContent = enhancedContent.replace(/<[^>]*>/g, ' ');
    const textPosition = textContent.indexOf(mention.title, mention.position);
    
    if (textPosition === -1) continue;

    // Find the actual position in HTML (accounting for tags)
    let htmlPosition = 0;
    let textIndex = 0;
    for (let j = 0; j < enhancedContent.length; j++) {
      if (textIndex === textPosition) {
        htmlPosition = j;
        break;
      }
      if (enhancedContent[j] === '<') {
        // Skip HTML tag
        const tagEnd = enhancedContent.indexOf('>', j);
        if (tagEnd !== -1) {
          j = tagEnd;
          continue;
        }
      }
      textIndex++;
    }

    // Check if already linked
    const beforeLink = enhancedContent.substring(0, htmlPosition);
    const lastOpenTag = beforeLink.lastIndexOf('<a');
    const lastCloseTag = beforeLink.lastIndexOf('</a>');
    
    if (lastOpenTag > lastCloseTag) {
      // Already inside a link
      continue;
    }

    // Insert link
    const before = enhancedContent.substring(0, htmlPosition);
    const after = enhancedContent.substring(htmlPosition + mention.title.length);
    enhancedContent = `${before}<a href="${route}" class="internal-link">${mention.title}</a>${after}`;
  }

  return enhancedContent;
}

/**
 * Extract links from HTML content
 */
export function extractLinks(content: string): Array<{ href: string; text: string; isInternal: boolean }> {
  if (!content) return [];

  const links: Array<{ href: string; text: string; isInternal: boolean }> = [];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  const matches = [...content.matchAll(linkRegex)];

  for (const match of matches) {
    const href = match[1];
    const text = match[2];
    const isInternal = href.startsWith('/') || href.startsWith('#');
    
    links.push({ href, text, isInternal });
  }

  return links;
}

/**
 * Validate internal links - check if linked content exists
 */
export async function validateInternalLinks(content: string): Promise<Array<{ href: string; exists: boolean }>> {
  const links = extractLinks(content);
  const internalLinks = links.filter(link => link.isInternal && link.href.startsWith('/'));
  
  const validations = await Promise.all(
    internalLinks.map(async (link) => {
      const path = link.href;
      let exists = false;

      // Check if it's an article link
      if (path.startsWith('/insights/')) {
        const slug = path.replace('/insights/', '');
        const { data } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();
        exists = !!data;
      }
      // Check if it's a material link
      else if (path.startsWith('/materials/')) {
        const slug = path.replace('/materials/', '');
        const { data } = await supabase
          .from('materials')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        exists = !!data;
      }
      // Other internal paths (facts, topics, etc.) - assume valid
      else {
        exists = true;
      }

      return { href: link.href, exists };
    })
  );

  return validations;
}
