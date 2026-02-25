/**
 * Heading Validator Utility
 * 
 * Functions to validate HTML content has proper H1/H2/H3 heading hierarchy
 * for SEO optimization.
 */

export interface HeadingValidationResult {
  isValid: boolean;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  warnings: string[];
  headings: Array<{
    level: number;
    text: string;
    line?: number;
  }>;
}

/**
 * Extract headings from HTML content
 */
function extractHeadings(html: string): Array<{ level: number; text: string }> {
  const headings: Array<{ level: number; text: string }> = [];
  
  // Match h1-h6 tags
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2]
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim();
    
    if (text) {
      headings.push({ level, text });
    }
  }
  
  return headings;
}

/**
 * Validate heading structure in HTML content
 * 
 * Rules:
 * - Must have exactly one H1
 * - H2/H3 hierarchy should be logical (no skipping levels)
 * - Headings should be descriptive and not empty
 */
export function validateHeadingStructure(html: string): HeadingValidationResult {
  const headings = extractHeadings(html);
  const warnings: string[] = [];
  
  const h1Headings = headings.filter(h => h.level === 1);
  const h2Headings = headings.filter(h => h.level === 2);
  const h3Headings = headings.filter(h => h.level === 3);
  const h4Headings = headings.filter(h => h.level === 4);
  
  // Check for H1 count
  if (h1Headings.length === 0) {
    warnings.push('No H1 heading found. Pages should have exactly one H1 heading.');
  } else if (h1Headings.length > 1) {
    warnings.push(`Found ${h1Headings.length} H1 headings. Pages should have exactly one H1 heading.`);
  }
  
  // Check for heading hierarchy (no skipping levels)
  let previousLevel = 0;
  for (const heading of headings) {
    if (previousLevel > 0 && heading.level > previousLevel + 1) {
      warnings.push(
        `Heading hierarchy issue: Found H${heading.level} after H${previousLevel}. ` +
        `Consider using H${previousLevel + 1} instead.`
      );
    }
    previousLevel = heading.level;
  }
  
  // Check for empty headings
  const emptyHeadings = headings.filter(h => !h.text || h.text.trim().length === 0);
  if (emptyHeadings.length > 0) {
    warnings.push(`Found ${emptyHeadings.length} empty heading(s). Headings should contain descriptive text.`);
  }
  
  // Check for very short headings (might be placeholders)
  const shortHeadings = headings.filter(h => h.text && h.text.trim().length < 3);
  if (shortHeadings.length > 0) {
    warnings.push(`Found ${shortHeadings.length} very short heading(s). Consider making headings more descriptive.`);
  }
  
  const isValid = h1Headings.length === 1 && warnings.length === 0;
  
  return {
    isValid,
    h1Count: h1Headings.length,
    h2Count: h2Headings.length,
    h3Count: h3Headings.length,
    h4Count: h4Headings.length,
    warnings,
    headings
  };
}

/**
 * Get heading hierarchy preview as a tree structure
 */
export function getHeadingHierarchy(html: string): string {
  const headings = extractHeadings(html);
  
  if (headings.length === 0) {
    return 'No headings found';
  }
  
  return headings
    .map(h => {
      const indent = '  '.repeat(h.level - 1);
      return `${indent}H${h.level}: ${h.text}`;
    })
    .join('\n');
}

/**
 * Check if content has at least one heading
 */
export function hasHeadings(html: string): boolean {
  return extractHeadings(html).length > 0;
}

/**
 * Get the first H1 heading text (if exists)
 */
export function getFirstH1(html: string): string | null {
  const headings = extractHeadings(html);
  const h1 = headings.find(h => h.level === 1);
  return h1 ? h1.text : null;
}
