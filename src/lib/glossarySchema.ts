import type { GlossaryTerm } from './glossaryData';

/**
 * Generate JSON-LD schema for a single DefinedTerm
 * Follows Schema.org DefinedTerm specification
 */
export function generateDefinedTermSchema(
  term: GlossaryTerm,
  baseUrl: string = 'https://localgovernmentreorganisation.co.uk'
): Record<string, unknown> {
  const termUrl = `${baseUrl}/glossary/${term.slug}`;
  
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.definition.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    url: termUrl,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'LGR Initiative Glossary',
      url: `${baseUrl}/glossary`
    }
  };

  // Add category if available
  if (term.category) {
    schema.termCode = term.category;
  }

  // Add synonyms if available
  if (term.synonyms && term.synonyms.length > 0) {
    schema.alternateName = term.synonyms;
  }

  // Add date modified if available
  if (term.lastUpdated) {
    schema.dateModified = term.lastUpdated;
  }

  return schema;
}

/**
 * Generate JSON-LD schema for a DefinedTermSet (glossary index)
 * Follows Schema.org DefinedTermSet specification
 */
export function generateDefinedTermSetSchema(
  terms: GlossaryTerm[],
  baseUrl: string = 'https://localgovernmentreorganisation.co.uk'
): Record<string, unknown> {
  const glossaryUrl = `${baseUrl}/glossary`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'LGR Initiative Glossary',
    description: 'Comprehensive glossary of Local Government Reorganisation (LGR) terms and definitions',
    url: glossaryUrl,
    numberOfItems: terms.length,
    hasDefinedTerm: terms.map(term => ({
      '@type': 'DefinedTerm',
      name: term.term,
      url: `${baseUrl}/glossary/${term.slug}`,
      description: term.definition
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200) // Truncate for list view
    }))
  };

  return schema;
}
