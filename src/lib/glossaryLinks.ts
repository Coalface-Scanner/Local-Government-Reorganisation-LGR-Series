import { glossaryTerms, GlossaryTerm } from './glossaryData';

export interface GlossaryMention {
  term: string;
  slug: string;
  position: number;
  matchedText: string; // The actual text that was matched (could be term or synonym)
}

function toTextContent(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

/**
 * Find mentions of glossary terms in text content
 * Only matches the first occurrence of each term to avoid over-linking
 */
export function findGlossaryMentions(
  content: unknown,
  options: {
    onlyFirstOccurrence?: boolean; // Only link first occurrence of each term (default: true)
    excludeSlugs?: string[]; // Don't link these terms
  } = {}
): GlossaryMention[] {
  const source = toTextContent(content);
  if (!source) return [];

  const { onlyFirstOccurrence = true, excludeSlugs = [] } = options;
  const mentions: GlossaryMention[] = [];
  const linkedTerms = new Set<string>(); // Track which terms we've already linked
  
  // Remove HTML tags for matching (but we'll use original positions)
  const textContent = source.replace(/<[^>]*>/g, ' ');

  // Sort terms by length (longest first) to match longer terms before shorter ones
  // This prevents "Local Government Reorganisation" from matching just "Local Government"
  const sortedTerms = [...glossaryTerms]
    .filter(term => !excludeSlugs.includes(term.slug))
    .sort((a, b) => {
      // Sort by term length (longest first), then by synonyms count
      const aLength = a.term.length;
      const bLength = b.term.length;
      if (bLength !== aLength) return bLength - aLength;
      
      const aSynonymLength = a.synonyms?.reduce((max, syn) => Math.max(max, syn.length), 0) || 0;
      const bSynonymLength = b.synonyms?.reduce((max, syn) => Math.max(max, syn.length), 0) || 0;
      return bSynonymLength - aSynonymLength;
    });

  for (const term of sortedTerms) {
    // Skip if we've already linked this term and onlyFirstOccurrence is true
    if (onlyFirstOccurrence && linkedTerms.has(term.slug)) {
      continue;
    }

    // Check if term is already linked in the HTML
    const termRegex = new RegExp(`<a[^>]*href=["']/glossary/${term.slug}["'][^>]*>.*?</a>`, 'gi');
    if (termRegex.test(source)) {
      linkedTerms.add(term.slug);
      continue;
    }

    // Try to match the main term
    const termPattern = term.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const termRegexPattern = new RegExp(`\\b${termPattern}\\b`, 'gi');
    const termMatches = [...textContent.matchAll(termRegexPattern)];

    // Also check synonyms
    const synonymMatches: Array<{ text: string; index: number }> = [];
    if (term.synonyms) {
      for (const synonym of term.synonyms) {
        const synonymPattern = synonym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const synonymRegex = new RegExp(`\\b${synonymPattern}\\b`, 'gi');
        const matches = [...textContent.matchAll(synonymRegex)];
        matches.forEach(match => {
          if (match.index !== undefined) {
            synonymMatches.push({ text: synonym, index: match.index });
          }
        });
      }
    }

    // Combine term and synonym matches, sort by position
    const allMatches = [
      ...termMatches.map(m => ({ text: term.term, index: m.index! })),
      ...synonymMatches
    ].sort((a, b) => a.index - b.index);

    // Find the first match that's not already inside a link
    for (const match of allMatches) {
      const position = match.index;
      if (position === undefined) continue;

      // Check if this position is already inside a link tag
      const beforeMatch = source.substring(0, position);
      const lastOpenTag = beforeMatch.lastIndexOf('<a');
      const lastCloseTag = beforeMatch.lastIndexOf('</a>');
      
      if (lastOpenTag > lastCloseTag) {
        // We're inside a link, skip
        continue;
      }

      // Found a valid match
      mentions.push({
        term: term.term,
        slug: term.slug,
        position,
        matchedText: match.text
      });
      
      linkedTerms.add(term.slug);
      break; // Only link first occurrence per term
    }
  }

  // Sort by position (earliest first)
  return mentions.sort((a, b) => a.position - b.position);
}

/**
 * Enhance HTML content with glossary term links
 * Only links the first occurrence of each term to avoid over-linking
 */
export function enhanceContentWithGlossaryLinks(
  content: unknown,
  options: {
    onlyFirstOccurrence?: boolean;
    excludeSlugs?: string[];
    linkClass?: string;
  } = {}
): string {
  const source = toTextContent(content);
  if (!source) return '';

  const { onlyFirstOccurrence = true, excludeSlugs = [], linkClass = 'glossary-link' } = options;
  const mentions = findGlossaryMentions(source, { onlyFirstOccurrence, excludeSlugs });
  
  if (mentions.length === 0) return source;

  // Process mentions in reverse order to maintain positions
  let enhancedContent = source;
  for (let i = mentions.length - 1; i >= 0; i--) {
    const mention = mentions[i];
    
    // Find the actual position in HTML (accounting for tags)
    const textContent = enhancedContent.replace(/<[^>]*>/g, ' ');
    const textPosition = textContent.indexOf(mention.matchedText, mention.position);
    
    if (textPosition === -1) continue;

    // Find the actual position in HTML
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

    // Double-check we're not inside a link
    const beforeLink = enhancedContent.substring(0, htmlPosition);
    const lastOpenTag = beforeLink.lastIndexOf('<a');
    const lastCloseTag = beforeLink.lastIndexOf('</a>');
    
    if (lastOpenTag > lastCloseTag) {
      // Already inside a link
      continue;
    }

    // Insert link
    const before = enhancedContent.substring(0, htmlPosition);
    const matchedText = mention.matchedText;
    const after = enhancedContent.substring(htmlPosition + matchedText.length);
    const link = `<a href="/glossary/${mention.slug}" class="${linkClass}" title="Learn more about ${mention.term}">${matchedText}</a>`;
    enhancedContent = `${before}${link}${after}`;
  }

  return enhancedContent;
}

/**
 * Get glossary terms that appear in content (for metadata/tags)
 */
export function getGlossaryTermsInContent(content: string): GlossaryTerm[] {
  const source = toTextContent(content);
  if (!source) return [];

  const mentions = findGlossaryMentions(source, { onlyFirstOccurrence: false });
  const uniqueSlugs = new Set(mentions.map(m => m.slug));
  
  return glossaryTerms.filter(term => uniqueSlugs.has(term.slug));
}

/**
 * Check if a term should be linked (helper for manual linking decisions)
 */
export function shouldLinkTerm(term: string, content: string, excludeSlugs: string[] = []): boolean {
  const source = toTextContent(content);
  if (!source) return false;

  const glossaryTerm = glossaryTerms.find(
    t => t.term.toLowerCase() === term.toLowerCase() || 
         t.synonyms?.some(s => s.toLowerCase() === term.toLowerCase())
  );

  if (!glossaryTerm || excludeSlugs.includes(glossaryTerm.slug)) {
    return false;
  }

  // Check if already linked
  const linkRegex = new RegExp(`<a[^>]*href=["']/glossary/${glossaryTerm.slug}["'][^>]*>`, 'gi');
  if (linkRegex.test(source)) {
    return false;
  }

  return true;
}
