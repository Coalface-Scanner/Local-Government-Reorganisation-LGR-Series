/**
 * Glossary term interface matching Schema.org DefinedTerm structure
 */
export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string; // HTML supported
  relatedTerms: string[]; // Array of slugs for internal linking
  category?: string;
  synonyms?: string[];
  lastUpdated?: string; // ISO date string
  relatedLink?: string; // External link (optional)
}

/**
 * All glossary terms with slugs and related term references
 */
export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Local Government Reorganisation (LGR)',
    slug: 'local-government-reorganisation-lgr',
    definition: 'The process of restructuring local government structures in England, typically merging district and county councils to create unitary authorities. LGR aims to simplify governance, improve service delivery, and enable strategic decision-making at the right scale.',
    relatedTerms: ['unitary-authority', 'shadow-authority', 'vesting-day'],
    category: 'Core Concepts',
    relatedLink: '/facts/what-is-lgr',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Unitary Authority',
    slug: 'unitary-authority',
    definition: 'A single-tier local authority that is responsible for all local government functions within its area. Unitary authorities combine the responsibilities of both county and district councils, providing a single point of accountability for local services.',
    relatedTerms: ['local-government-reorganisation-lgr', 'two-tier-system'],
    category: 'Core Concepts',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Shadow Authority',
    slug: 'shadow-authority',
    definition: 'A newly elected council that operates in parallel with existing authorities before vesting day. Shadow authorities plan the transition, make key strategic decisions, and prepare for taking full control of services. They work alongside existing councils during the transition period.',
    relatedTerms: ['vesting-day', 'shadow-elections', 'transition-period'],
    category: 'Governance',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Vesting Day',
    slug: 'vesting-day',
    definition: 'The date when a new unitary authority takes full legal and operational control of all local government services. On vesting day, the old authorities are dissolved and the new unitary council becomes the sole local authority for its area.',
    relatedTerms: ['shadow-authority', 'transition-period', 'go-live'],
    category: 'Core Concepts',
    synonyms: ['Go-Live'],
    lastUpdated: '2026-01-15'
  },
  {
    term: 'LGR Timetable 2026',
    slug: 'lgr-timetable-2026',
    definition: 'The schedule of Local Government Reorganisation activities planned for 2026, including shadow elections, transition planning, and preparation for vesting days in 2027-2028. This represents a significant wave of reorganisations across England.',
    relatedTerms: ['shadow-elections', 'vesting-day', 'local-government-reorganisation-lgr'],
    category: 'Timeline',
    relatedLink: '/facts/lgr-timeline',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Shadow Elections',
    slug: 'shadow-elections',
    definition: 'Elections held to elect councillors to the new shadow authority before vesting day. These elections typically take place months or years before the new unitary authority takes full control, allowing time for transition planning.',
    relatedTerms: ['shadow-authority', 'vesting-day', 'lgr-timetable-2026'],
    category: 'Governance',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'LGR Governance',
    slug: 'lgr-governance',
    definition: 'The systems, processes, and structures for managing Local Government Reorganisation effectively. This includes managing the transition period, ensuring continuity of services, addressing councillor transitions, and maintaining democratic legitimacy throughout the process.',
    relatedTerms: ['shadow-authority', 'transition-period', 'lgr-governance'],
    category: 'Governance',
    relatedLink: '/interviews',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Two-Tier System',
    slug: 'two-tier-system',
    definition: 'The local government structure where responsibilities are split between county councils (strategic services like education and social care) and district councils (local services like housing and planning). LGR typically converts this to a unitary system.',
    relatedTerms: ['unitary-authority', 'county-council', 'district-council'],
    category: 'Core Concepts',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'County Council',
    slug: 'county-council',
    definition: 'The upper tier of local government in a two-tier system, responsible for strategic services such as education, social care, highways, waste disposal, and public health.',
    relatedTerms: ['district-council', 'two-tier-system', 'unitary-authority'],
    category: 'Core Concepts',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'District Council',
    slug: 'district-council',
    definition: 'The lower tier of local government in a two-tier system, responsible for local services such as housing, planning, waste collection, licensing, and environmental health.',
    relatedTerms: ['county-council', 'two-tier-system', 'unitary-authority'],
    category: 'Core Concepts',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Transition Period',
    slug: 'transition-period',
    definition: 'The time between the election of a shadow authority and vesting day, during which both old and new authorities operate in parallel. This period involves extensive planning, service transfer preparation, and strategic decision-making.',
    relatedTerms: ['shadow-authority', 'vesting-day', 'transition-period'],
    category: 'Timeline',
    synonyms: ['Transition'],
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Go-Live',
    slug: 'go-live',
    definition: 'Another term for vesting day, when the new unitary authority becomes fully operational and takes control of all services.',
    relatedTerms: ['vesting-day', 'transition-period'],
    category: 'Core Concepts',
    synonyms: ['Vesting Day'],
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Lame Duck Councillors',
    slug: 'lame-duck-councillors',
    definition: 'Councillors in existing authorities who will not be standing for election to the new unitary authority, or whose wards are being abolished. They may have reduced influence during the transition period.',
    relatedTerms: ['shadow-authority', 'transition-period'],
    category: 'Governance',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Devolution',
    slug: 'devolution',
    definition: 'The transfer of powers and responsibilities from central government to local or regional authorities. Unlike LGR, which restructures local government, devolution transfers new powers to local authorities.',
    relatedTerms: ['local-government-reorganisation-lgr'],
    category: 'Core Concepts',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'Reorganisation Proposal',
    slug: 'reorganisation-proposal',
    definition: 'A formal proposal to restructure local government in a specific area, typically submitted to central government for approval. Proposals may come from local authorities, combined authorities, or central government itself.',
    relatedTerms: ['local-government-reorganisation-lgr'],
    category: 'Process',
    lastUpdated: '2026-01-15'
  },
  {
    term: 'First 100 Days',
    slug: 'first-100-days',
    definition: 'The critical period immediately after vesting day when a new unitary authority establishes its governance structures, priorities, and operational systems. This period is crucial for setting the foundation for effective service delivery.',
    relatedTerms: ['vesting-day', 'transition-period', 'lgr-governance'],
    category: 'Timeline',
    relatedLink: '/100days',
    lastUpdated: '2026-01-15'
  }
];

/**
 * Get a glossary term by slug
 */
export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find(term => term.slug === slug);
}

/**
 * Get all glossary terms
 */
export function getAllTerms(): GlossaryTerm[] {
  return glossaryTerms;
}

/**
 * Get terms filtered by first letter
 */
export function getTermsByLetter(letter: string): GlossaryTerm[] {
  const upperLetter = letter.toUpperCase();
  return glossaryTerms.filter(term => {
    const firstChar = term.term.charAt(0).toUpperCase();
    return firstChar === upperLetter;
  });
}

/**
 * Search terms by query string
 */
export function searchTerms(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return glossaryTerms;

  return glossaryTerms.filter(term => {
    const termMatch = term.term.toLowerCase().includes(lowerQuery);
    const definitionMatch = term.definition.toLowerCase().includes(lowerQuery);
    const synonymMatch = term.synonyms?.some(syn => 
      syn.toLowerCase().includes(lowerQuery)
    ) || false;
    
    return termMatch || definitionMatch || synonymMatch;
  });
}

/**
 * Generate metadata for a term (Next.js Metadata API pattern)
 */
export function generateMetadata(term: GlossaryTerm): {
  title: string;
  description: string;
} {
  // Extract first sentence or first 160 characters for description
  const plainText = term.definition.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const firstSentence = plainText.split(/[.!?]/)[0];
  const description = firstSentence.length > 160 
    ? plainText.substring(0, 157) + '...'
    : firstSentence || plainText.substring(0, 160);

  return {
    title: `What is ${term.term}?`,
    description: description
  };
}

/**
 * Get all unique first letters from terms (for A-Z filter)
 */
export function getAllLetters(): string[] {
  const letters = new Set<string>();
  glossaryTerms.forEach(term => {
    const firstChar = term.term.charAt(0).toUpperCase();
    if (/[A-Z]/.test(firstChar)) {
      letters.add(firstChar);
    }
  });
  return Array.from(letters).sort();
}

/**
 * Get related terms as full GlossaryTerm objects
 */
export function getRelatedTerms(term: GlossaryTerm): GlossaryTerm[] {
  return term.relatedTerms
    .map(slug => getGlossaryTerm(slug))
    .filter((t): t is GlossaryTerm => t !== undefined);
}
