/**
 * Phrase → path map for automatic internal site links in content (e.g. key facts).
 * Longest phrases first so "First 100 Days" is matched before "100 Days".
 */
export const internalLinkMap: { phrase: string; path: string }[] = [
  { phrase: 'First 100 Days', path: '/first-100-days' },
  { phrase: 'LGR timetable', path: '/facts/lgr-timeline' },
  { phrase: 'LGR Timetable 2026', path: '/facts/lgr-timeline' },
  { phrase: 'lessons learned', path: '/lessons' },
  { phrase: 'lessons from implementation', path: '/lessons' },
  { phrase: 'reasons for reorganisation', path: '/reasons' },
  { phrase: 'roadmap', path: '/roadmap' },
  { phrase: 'council profiles', path: '/surrey/area-profile' },
  { phrase: 'insights', path: '/insights' },
  { phrase: 'podcast', path: '/podcast' },
  { phrase: 'What is LGR', path: '/what-is-lgr' },
  { phrase: 'beginners guide', path: '/beginners-guide' },
  { phrase: 'Facts & Data', path: '/facts-and-data' },
  { phrase: 'key facts', path: '/facts/key-facts' },
  { phrase: 'reorganisations', path: '/reorganisations' },
  { phrase: 'interviews', path: '/podcast' },
  { phrase: 'library', path: '/library' },
  { phrase: 'glossary', path: '/glossary' },
  { phrase: 'LGR timeline', path: '/facts/lgr-timeline' },
  { phrase: 'questions and answers', path: '/questions-and-answers' },
  { phrase: 'best practice', path: '/lessons/best-practices' },
  { phrase: 'case studies', path: '/lessons/case-studies' },
].sort((a, b) => b.phrase.length - a.phrase.length);

function toTextContent(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

export interface InternalLinkMention {
  phrase: string;
  path: string;
  position: number;
  matchedText: string;
}

function textIndexToHtmlPosition(source: string, textIndex: number): number {
  let textIdx = 0;
  for (let j = 0; j < source.length; j++) {
    if (textIdx === textIndex) return j;
    if (source[j] === '<') {
      const tagEnd = source.indexOf('>', j);
      if (tagEnd !== -1) {
        j = tagEnd;
        continue;
      }
    }
    textIdx++;
  }
  return source.length;
}

function isInsideLink(source: string, htmlPosition: number): boolean {
  const before = source.substring(0, htmlPosition);
  const lastOpen = before.lastIndexOf('<a');
  const lastClose = before.lastIndexOf('</a>');
  return lastOpen > lastClose;
}

/**
 * Find first occurrence of each internal-link phrase in content (not inside existing <a>).
 */
export function findInternalLinkMentions(
  content: unknown,
  options: { onlyFirstOccurrence?: boolean } = {}
): InternalLinkMention[] {
  const source = toTextContent(content);
  if (!source) return [];

  const onlyFirst = options.onlyFirstOccurrence !== false;
  const textContent = source.replace(/<[^>]*>/g, ' ');
  const mentions: InternalLinkMention[] = [];
  const linkedPhrases = new Set<string>();

  for (const { phrase, path } of internalLinkMap) {
    if (onlyFirst && linkedPhrases.has(phrase)) continue;

    const pattern = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
    const match = regex.exec(textContent);
    if (!match || match.index === undefined) continue;

    const textPosition = match.index;
    const matchedText = match[0];
    const htmlPosition = textIndexToHtmlPosition(source, textPosition);

    if (isInsideLink(source, htmlPosition)) continue;

    mentions.push({ phrase, path, position: textPosition, matchedText });
    linkedPhrases.add(phrase);
  }

  return mentions.sort((a, b) => a.position - b.position);
}

/**
 * Enhance HTML content with internal site links (first occurrence per phrase only).
 */
export function enhanceContentWithInternalLinks(
  content: unknown,
  options: { linkClass?: string } = {}
): string {
  const source = toTextContent(content);
  if (!source) return '';

  const linkClass = options.linkClass ?? 'internal-link text-teal-700 hover:text-teal-800 underline font-medium';
  const mentions = findInternalLinkMentions(source, { onlyFirstOccurrence: true });

  if (mentions.length === 0) return source;

  let enhancedContent = source;
  for (let i = mentions.length - 1; i >= 0; i--) {
    const { path, matchedText, position: fromIndex } = mentions[i];
    const textContent = enhancedContent.replace(/<[^>]*>/g, ' ');
    const textPosition = textContent.indexOf(matchedText, fromIndex);
    if (textPosition === -1) continue;

    const htmlPosition = textIndexToHtmlPosition(enhancedContent, textPosition);
    if (isInsideLink(enhancedContent, htmlPosition)) continue;

    const before = enhancedContent.substring(0, htmlPosition);
    const after = enhancedContent.substring(htmlPosition + matchedText.length);
    const link = `<a href="${path}" class="${linkClass}">${matchedText}</a>`;
    enhancedContent = `${before}${link}${after}`;
  }

  return enhancedContent;
}
