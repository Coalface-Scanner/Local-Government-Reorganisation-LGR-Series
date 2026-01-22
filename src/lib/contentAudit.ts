/**
 * Content Audit Utility
 * 
 * Functions to validate content meets SEO best practices:
 * - H1 presence and structure
 * - Meta description length
 * - Geography mentions
 * - Internal links
 * - Title length
 */

import { validateHeadingStructure } from './headingValidator';
import { extractCouncilNames } from './geographyHelpers';

export interface ContentAuditResult {
  isValid: boolean;
  score: number; // 0-100
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
  }>;
  checks: {
    hasH1: boolean;
    h1Count: number;
    metaDescriptionLength: number;
    metaDescriptionValid: boolean;
    titleLength: number;
    titleValid: boolean;
    hasGeography: boolean;
    geographyMentioned: boolean;
    hasIntroParagraph: boolean;
    hasInternalLinks: boolean;
  };
}

/**
 * Audit article content for SEO best practices
 */
export function auditArticleContent(
  title: string,
  metaDescription: string,
  body: string,
  geography?: string | null,
  region?: string | null
): ContentAuditResult {
  const issues: ContentAuditResult['issues'] = [];
  let score = 100;

  // Check H1 structure
  const headingValidation = validateHeadingStructure(body);
  const hasH1 = headingValidation.h1Count === 1;
  const h1Count = headingValidation.h1Count;

  if (!hasH1) {
    if (h1Count === 0) {
      issues.push({
        severity: 'error',
        message: 'No H1 heading found in content',
        suggestion: 'Add exactly one H1 heading that clearly states the page purpose'
      });
      score -= 20;
    } else {
      issues.push({
        severity: 'error',
        message: `Found ${h1Count} H1 heading(s). Should have exactly one.`,
        suggestion: 'Ensure only the main page title uses H1. Use H2 for major sections.'
      });
      score -= 15;
    }
  }

  // Add heading warnings
  headingValidation.warnings.forEach(warning => {
    issues.push({
      severity: 'warning',
      message: warning
    });
    score -= 2;
  });

  // Check title length (should be 50-60 chars before " | LGR Series" suffix)
  const titleLength = title.length;
  const titleValid = titleLength >= 30 && titleLength <= 60;

  if (!titleValid) {
    if (titleLength < 30) {
      issues.push({
        severity: 'warning',
        message: `Title is too short (${titleLength} chars). Aim for 30-60 characters.`,
        suggestion: 'Add more descriptive context, including geography if relevant'
      });
      score -= 5;
    } else if (titleLength > 60) {
      issues.push({
        severity: 'warning',
        message: `Title is too long (${titleLength} chars). May be truncated in search results.`,
        suggestion: 'Shorten to 60 characters or less (before " | LGR Series" suffix)'
      });
      score -= 5;
    }
  }

  // Check if geography is in title
  if (geography && geography !== 'National') {
    const geographyInTitle = title.toLowerCase().includes(geography.toLowerCase());
    if (!geographyInTitle) {
      issues.push({
        severity: 'info',
        message: `Geography "${geography}" not found in title`,
        suggestion: `Consider including "${geography}" in the title for better GEO SEO`
      });
      score -= 3;
    }
  }

  // Check meta description length (should be 150-160 chars)
  const metaDescriptionLength = metaDescription.length;
  const metaDescriptionValid = metaDescriptionLength >= 120 && metaDescriptionLength <= 160;

  if (!metaDescriptionValid) {
    if (metaDescriptionLength < 120) {
      issues.push({
        severity: 'warning',
        message: `Meta description is too short (${metaDescriptionLength} chars). Aim for 120-160 characters.`,
        suggestion: 'Add more context about what the page covers, including geography if relevant'
      });
      score -= 10;
    } else if (metaDescriptionLength > 160) {
      issues.push({
        severity: 'warning',
        message: `Meta description is too long (${metaDescriptionLength} chars). May be truncated in search results.`,
        suggestion: 'Shorten to 160 characters or less'
      });
      score -= 5;
    }
  }

  // Check if geography is in meta description
  const hasGeography = !!(geography || region);
  let geographyMentioned = false;
  if (hasGeography) {
    const geoToCheck = geography || region || '';
    if (geoToCheck !== 'National') {
      geographyMentioned = metaDescription.toLowerCase().includes(geoToCheck.toLowerCase()) ||
                           body.toLowerCase().includes(geoToCheck.toLowerCase());
      if (!geographyMentioned) {
        issues.push({
          severity: 'info',
          message: `Geography "${geoToCheck}" not mentioned in meta description or first paragraph`,
          suggestion: `Include "${geoToCheck}" in meta description and intro paragraph for GEO SEO`
        });
        score -= 5;
      }
    }
  }

  // Check for intro paragraph (first paragraph should be clear and descriptive)
  const textContent = body.replace(/<[^>]*>/g, '').trim();
  const firstParagraph = textContent.split('\n\n')[0] || textContent.split('\n')[0] || '';
  const hasIntroParagraph = firstParagraph.length >= 50 && firstParagraph.length <= 300;

  if (!hasIntroParagraph) {
    if (firstParagraph.length < 50) {
      issues.push({
        severity: 'warning',
        message: 'First paragraph is too short. Should clearly state what the article is about.',
        suggestion: 'Add an introductory paragraph (50-300 chars) that explains the article\'s purpose and geography'
      });
      score -= 5;
    }
  }

  // Check for internal links
  const internalLinkPattern = /href=["']\/(?:insights|materials|facts|lessons|council-profiles|councils)\/[^"']+["']/gi;
  const hasInternalLinks = internalLinkPattern.test(body);

  if (!hasInternalLinks) {
    issues.push({
      severity: 'info',
      message: 'No internal links found in content',
      suggestion: 'Add links to related articles, materials, facts, or council profiles to improve internal linking'
    });
    score -= 3;
  }

  // Check if geography is mentioned in first paragraph
  if (hasGeography && geography && geography !== 'National') {
    const geoInFirstParagraph = firstParagraph.toLowerCase().includes(geography.toLowerCase());
    if (!geoInFirstParagraph) {
      issues.push({
        severity: 'info',
        message: `Geography "${geography}" not mentioned in first paragraph`,
        suggestion: `Mention "${geography}" in the opening paragraph for better GEO signals`
      });
      score -= 3;
    }
  }

  // Extract council names from content
  const councilNames = extractCouncilNames(body);
  if (councilNames.length > 0 && !hasGeography) {
    issues.push({
      severity: 'info',
      message: `Found council/region names in content (${councilNames.slice(0, 3).join(', ')}${councilNames.length > 3 ? '...' : ''}) but no geography field set`,
      suggestion: 'Set the geography field in article metadata to improve content clustering'
    });
  }

  score = Math.max(0, score);

  return {
    isValid: score >= 70 && hasH1 && metaDescriptionValid && titleValid,
    score,
    issues,
    checks: {
      hasH1,
      h1Count,
      metaDescriptionLength,
      metaDescriptionValid,
      titleLength,
      titleValid,
      hasGeography: !!hasGeography,
      geographyMentioned,
      hasIntroParagraph,
      hasInternalLinks
    }
  };
}

/**
 * Get a summary of audit results as a readable string
 */
export function getAuditSummary(result: ContentAuditResult): string {
  const lines: string[] = [];
  
  lines.push(`SEO Audit Score: ${result.score}/100`);
  lines.push('');
  
  if (result.isValid) {
    lines.push('✓ Content meets SEO best practices');
  } else {
    lines.push('⚠ Content needs improvements');
  }
  
  lines.push('');
  lines.push('Checks:');
  lines.push(`  H1: ${result.checks.hasH1 ? '✓' : '✗'} (${result.checks.h1Count} found)`);
  lines.push(`  Title: ${result.checks.titleValid ? '✓' : '✗'} (${result.checks.titleLength} chars)`);
  lines.push(`  Meta Description: ${result.checks.metaDescriptionValid ? '✓' : '✗'} (${result.checks.metaDescriptionLength} chars)`);
  lines.push(`  Geography: ${result.checks.hasGeography ? '✓' : '✗'}`);
  lines.push(`  Intro Paragraph: ${result.checks.hasIntroParagraph ? '✓' : '✗'}`);
  lines.push(`  Internal Links: ${result.checks.hasInternalLinks ? '✓' : '✗'}`);
  
  if (result.issues.length > 0) {
    lines.push('');
    lines.push('Issues:');
    result.issues.forEach((issue) => {
      const icon = issue.severity === 'error' ? '✗' : issue.severity === 'warning' ? '⚠' : 'ℹ';
      lines.push(`  ${icon} ${issue.message}`);
      if (issue.suggestion) {
        lines.push(`    → ${issue.suggestion}`);
      }
    });
  }
  
  return lines.join('\n');
}
