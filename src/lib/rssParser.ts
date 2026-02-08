/**
 * RSS Feed Parser Utility
 * Browser-compatible RSS parser using DOMParser API
 * Supports Anchor.fm podcast RSS feeds with iTunes extensions
 */

export interface RSSItem {
  title: string;
  description: string;
  pubDate: string;
  guid: string;
  link: string;
  audioUrl?: string;
  imageUrl?: string;
  duration?: string;
  author?: string;
}

export interface RSSChannel {
  title: string;
  description: string;
  imageUrl?: string;
  items: RSSItem[];
}

/**
 * Strip HTML tags from a string
 */
function stripHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  return doc.body.textContent || text;
}

/**
 * Parse RFC 822 date format (e.g., "Fri, 23 Jan 2026 14:26:29 GMT")
 */
function _parseRFC822Date(_dateString: string): Date {
  return new Date(_dateString);
}

/**
 * Extract text content from an XML element, handling CDATA sections
 */
function getTextContent(element: Element | null): string {
  if (!element) return '';
  return element.textContent || '';
}

/**
 * Extract attribute value from an XML element
 */
function getAttribute(element: Element | null, attribute: string): string | null {
  if (!element) return null;
  return element.getAttribute(attribute);
}

/**
 * Get elements by tag name with namespace support
 */
function _getElementsByTagNameNS(
  _parent: Element | Document,
  _namespace: string | null,
  _tagName: string
): Element[] {
  if (_namespace) {
    return Array.from(_parent.getElementsByTagNameNS(_namespace, _tagName));
  }
  return Array.from(_parent.getElementsByTagName(_tagName));
}

/**
 * Sanitize XML string to fix common malformed HTML issues
 */
function sanitizeXML(xmlString: string): string {
  // Remove any HTML tags that might be breaking XML structure
  // Fix common issues like unclosed tags in descriptions
  let sanitized = xmlString;
  
  // Remove any <script> tags that might be in descriptions
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Fix unclosed tags in descriptions by wrapping CDATA or escaping
  // This is a common issue with Anchor.fm feeds that include HTML in descriptions
  sanitized = sanitized.replace(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/gi, (match, content) => {
    // If CDATA exists, keep it
    return match;
  });
  
  // For descriptions without CDATA, try to fix common HTML issues
  sanitized = sanitized.replace(/<description>([\s\S]*?)<\/description>/gi, (match, content) => {
    // If content contains HTML tags, wrap in CDATA to prevent XML parsing issues
    if (content.includes('<') && content.includes('>')) {
      // Check if already has CDATA
      if (!content.includes('<![CDATA[')) {
        // Escape any existing CDATA markers
        content = content.replace(/<!\[CDATA\[/g, '&lt;![CDATA[');
        content = content.replace(/\]\]>/g, ']]&gt;');
        return `<description><![CDATA[${content}]]></description>`;
      }
    }
    return match;
  });
  
  return sanitized;
}

/**
 * Parse RSS feed XML string into structured data
 */
export function parseRSSFeed(xmlString: string): RSSChannel {
  // Sanitize the XML first to fix common malformed HTML issues
  const sanitizedXML = sanitizeXML(xmlString);
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitizedXML, 'text/xml');

  // Check for parsing errors
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    // Try parsing as HTML if XML parsing fails (some feeds have HTML in them)
    const htmlDoc = parser.parseFromString(sanitizedXML, 'text/html');
    const rssElement = htmlDoc.querySelector('rss, feed');
    if (!rssElement) {
      throw new Error(`Failed to parse RSS feed: ${parserError.textContent}`);
    }
    // If HTML parsing worked, try to extract RSS structure
    // Fallback: return empty channel
    return {
      title: 'RSS Feed',
      description: '',
      items: [],
    };
  }

  // Get channel element
  const channel = doc.querySelector('channel');
  if (!channel) {
    throw new Error('RSS feed does not contain a channel element');
  }

  // Extract channel metadata
  const channelTitle = getTextContent(channel.querySelector('title'));
  const channelDescription = getTextContent(channel.querySelector('description'));
  
  // Get channel image (itunes:image or image)
  // Try namespace-aware lookup first
  let channelImageUrl: string | undefined;
  const itunesNS = 'http://www.itunes.com/dtds/podcast-1.0.dtd';
  const itunesImages = channel.getElementsByTagNameNS(itunesNS, 'image');
  if (itunesImages.length > 0) {
    channelImageUrl = getAttribute(itunesImages[0], 'href') || undefined;
  }
  // Fallback to querySelector (works if namespace prefix is used)
  if (!channelImageUrl) {
    const itunesImage = channel.querySelector('itunes\\:image');
    if (itunesImage) {
      channelImageUrl = getAttribute(itunesImage, 'href') || undefined;
    }
  }
  // Fallback to standard image element
  if (!channelImageUrl) {
    const imageElement = channel.querySelector('image');
    const imageUrl = imageElement?.querySelector('url');
    if (imageUrl) {
      channelImageUrl = getTextContent(imageUrl);
    }
  }

  // Parse items
  const items: RSSItem[] = [];
  const itemElements = channel.querySelectorAll('item');

  itemElements.forEach((item) => {
    const titleElement = item.querySelector('title');
    const descriptionElement = item.querySelector('description');
    
    // Handle title - try to get text content, fallback to innerHTML if needed
    let title = '';
    if (titleElement) {
      title = decodeHTMLEntities(getTextContent(titleElement) || titleElement.innerHTML || '');
    }
    
    // Handle description - strip HTML but be more lenient with parsing
    let description = '';
    if (descriptionElement) {
      const descText = getTextContent(descriptionElement);
      if (descText) {
        description = stripHTML(descText);
      } else {
        // Fallback: try innerHTML if textContent is empty
        description = stripHTML(descriptionElement.innerHTML || '');
      }
    }
    const pubDate = getTextContent(item.querySelector('pubDate'));
    const guid = getTextContent(item.querySelector('guid')) || title;
    const link = getTextContent(item.querySelector('link'));

    // Get audio URL from enclosure
    let audioUrl: string | undefined;
    const enclosure = item.querySelector('enclosure');
    if (enclosure) {
      const type = getAttribute(enclosure, 'type');
      const url = getAttribute(enclosure, 'url');
      if (type?.startsWith('audio/') && url) {
        audioUrl = url;
      }
    }

    // Get image URL (itunes:image or fallback to channel image)
    let imageUrl: string | undefined;
    // Try namespace-aware lookup first
    const itemItunesImages = item.getElementsByTagNameNS(itunesNS, 'image');
    if (itemItunesImages.length > 0) {
      imageUrl = getAttribute(itemItunesImages[0], 'href') || undefined;
    }
    // Fallback to querySelector
    if (!imageUrl) {
      const itemItunesImage = item.querySelector('itunes\\:image');
      if (itemItunesImage) {
        imageUrl = getAttribute(itemItunesImage, 'href') || undefined;
      }
    }
    if (!imageUrl) {
      imageUrl = channelImageUrl;
    }

    // Get duration
    let duration: string | undefined;
    const durations = item.getElementsByTagNameNS(itunesNS, 'duration');
    if (durations.length > 0) {
      duration = getTextContent(durations[0]);
    }
    if (!duration) {
      duration = getTextContent(item.querySelector('itunes\\:duration')) || undefined;
    }

    // Get author (try dc:creator, then itunes:author, then author)
    let author: string | undefined;
    const dcNS = 'http://purl.org/dc/elements/1.1/';
    const dcCreators = item.getElementsByTagNameNS(dcNS, 'creator');
    if (dcCreators.length > 0) {
      author = getTextContent(dcCreators[0]);
    }
    if (!author) {
      const itunesAuthors = item.getElementsByTagNameNS(itunesNS, 'author');
      if (itunesAuthors.length > 0) {
        author = getTextContent(itunesAuthors[0]);
      }
    }
    if (!author) {
      author = getTextContent(item.querySelector('dc\\:creator, itunes\\:author, author')) || undefined;
    }

    items.push({
      title,
      description,
      pubDate,
      guid,
      link,
      audioUrl,
      imageUrl,
      duration,
      author,
    });
  });

  return {
    title: channelTitle,
    description: channelDescription,
    imageUrl: channelImageUrl,
    items,
  };
}

/**
 * Extract guest name from episode title
 * Looks for patterns like "With [Name]", "Interview with [Name]", or "[Name]" after a separator
 */
export function extractGuestName(title: string): string {
  // Pattern 1: "With [Name]" or "Interview with [Name]"
  const withMatch = title.match(/(?:interview\s+)?with\s+([^|:]+)/i);
  if (withMatch) {
    return withMatch[1].trim();
  }

  // Pattern 2: Extract name after last "|" separator
  const parts = title.split('|');
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1].trim();
    // Remove common prefixes
    const cleaned = lastPart.replace(/^(with|featuring|guest:?|interview\s+with)\s+/i, '').trim();
    if (cleaned && cleaned.length > 0 && cleaned.length < 100) {
      // Only use if it looks like a name (not too long)
      return cleaned;
    }
  }

  // Pattern 3: Look for name after colon (e.g., "Title: Name")
  const colonMatch = title.match(/:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
  if (colonMatch) {
    return colonMatch[1].trim();
  }

  // Fallback: use title as name (but truncate if too long)
  return title.length > 100 ? title.substring(0, 100) + '...' : title;
}

/**
 * Generate a unique ID from a string (for use as interview ID)
 */
export function generateIdFromString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50); // Limit length
}
