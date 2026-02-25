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
    synonyms: ['Reorganisation', 'reorganisation', 'local government reorganisation'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Unitary Authority',
    slug: 'unitary-authority',
    definition: 'A single-tier local authority that is responsible for all local government functions within its area. Unitary authorities combine the responsibilities of both county and district councils, providing a single point of accountability for local services.',
    relatedTerms: ['local-government-reorganisation-lgr', 'two-tier-system'],
    category: 'Core Concepts',
    synonyms: ['unitary authorities', 'unitary councils', 'unitary'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Shadow Authority',
    slug: 'shadow-authority',
    definition: 'A newly elected council that operates in parallel with existing authorities before vesting day. Shadow authorities plan the transition, make key strategic decisions, and prepare for taking full control of services. They work alongside existing councils during the transition period.',
    relatedTerms: ['vesting-day', 'shadow-elections', 'transition-period'],
    category: 'Governance',
    synonyms: ['shadow authorities'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Vesting Day',
    slug: 'vesting-day',
    definition: 'The date when a new unitary authority takes full legal and operational control of all local government services. On vesting day, the old authorities are dissolved and the new unitary council becomes the sole local authority for its area.',
    relatedTerms: ['shadow-authority', 'transition-period', 'go-live'],
    category: 'Core Concepts',
    synonyms: ['Go-Live', 'vesting day'],
    lastUpdated: '2026-02-23'
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
    synonyms: ['two-tier', 'two tier system'],
    lastUpdated: '2026-02-23'
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
    synonyms: ['Transition', 'transition period', 'transition costs'],
    lastUpdated: '2026-02-23'
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
    synonyms: ['devolved', 'devolution deals'],
    lastUpdated: '2026-02-23'
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
    relatedLink: '/first-100-days',
    synonyms: ['first 100 days'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Section 114',
    slug: 'section-114',
    definition: 'A notice under Section 114 of the Local Government Finance Act 1988 that a local authority cannot balance its budget. Issuing a Section 114 effectively declares the council in financial crisis and restricts non-essential spending. It can influence perceptions of governance and may be relevant in reorganisation discussions.',
    relatedTerms: ['local-government-reorganisation-lgr'],
    category: 'Governance',
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Combined Authority',
    slug: 'combined-authority',
    definition: 'A legal body that enables a group of local authorities to work together on transport, economic development, and regeneration. Combined authorities often have an elected mayor and can receive devolved powers from central government. They exist alongside (and sometimes overlap with) LGR proposals.',
    relatedTerms: ['devolution', 'local-government-reorganisation-lgr'],
    category: 'Core Concepts',
    synonyms: ['Combined authorities'],
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Elected Mayor',
    slug: 'elected-mayor',
    definition: 'A directly elected mayor who leads a local authority or combined authority. In England, some councils and most combined authorities have elected mayors with executive powers. Devolution deals often require the creation of an elected mayor for the combined authority.',
    relatedTerms: ['combined-authority', 'devolution'],
    category: 'Governance',
    synonyms: ['Directly elected mayor'],
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Scrutiny',
    slug: 'scrutiny',
    definition: 'The process by which councillors hold the executive (leader, cabinet, or mayor) to account. Scrutiny committees examine decisions, policies, and performance. Effective scrutiny is important for democratic legitimacy in both existing councils and new unitary authorities.',
    relatedTerms: ['lame-duck-councillors', 'shadow-authority'],
    category: 'Governance',
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Leader of the Council',
    slug: 'leader-of-the-council',
    definition: 'The councillor who leads the ruling political group and typically holds executive power in a leader-and-cabinet model. The leader is chosen by the majority party or coalition, not directly elected by the public in most English councils.',
    relatedTerms: ['cabinet', 'scrutiny'],
    category: 'Governance',
    synonyms: ['Council leader', 'Leader'],
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Cabinet',
    slug: 'cabinet',
    definition: 'In local government, the small group of councillors (typically from the ruling party) who make key executive decisions. The cabinet is led by the leader of the council (or elected mayor) and is held to account by scrutiny committees.',
    relatedTerms: ['leader-of-the-council', 'scrutiny'],
    category: 'Governance',
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Single Transferable Vote',
    slug: 'single-transferable-vote',
    definition: 'A proportional voting system where voters rank candidates. Surplus votes and eliminated candidates are redistributed according to preferences. STV is used in Scottish local elections and some other contexts but not currently for English local councils.',
    relatedTerms: [],
    category: 'Governance',
    synonyms: ['STV'],
    lastUpdated: '2026-02-10'
  },
  {
    term: 'First-Past-the-Post',
    slug: 'first-past-the-post',
    definition: 'A voting system where the candidate with the most votes in a ward or constituency wins. Used for most local council elections in England. It can produce results where the share of seats does not match the share of votes across the authority.',
    relatedTerms: [],
    category: 'Governance',
    synonyms: ['FPTP', 'First past the post'],
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Boundary Review',
    slug: 'boundary-review',
    definition: 'A process to assess and change electoral boundaries (wards or divisions) within or across local authorities. Boundary reviews can accompany LGR to define the new unitary council areas and ward structures, or occur independently by the Local Government Boundary Commission.',
    relatedTerms: ['local-government-reorganisation-lgr', 'shadow-elections'],
    category: 'Process',
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Structural Change',
    slug: 'structural-change',
    definition: 'A change to the number, boundaries, or type of local authorities in an area. Local government reorganisation is a form of structural change. The term is often used in legislation and government guidance (e.g. structural change orders).',
    relatedTerms: ['local-government-reorganisation-lgr', 'reorganisation-proposal'],
    category: 'Process',
    synonyms: ['Structural changes'],
    lastUpdated: '2026-02-10'
  },
  {
    term: 'Structural Change Order',
    slug: 'structural-change-order',
    definition: 'The statutory instrument that gives legal effect to a local government reorganisation in England. Made by the Secretary of State, it sets out the creation of new unitary authorities, the dissolution of existing county and district councils, and the vesting day when the new structure takes effect.',
    relatedTerms: ['structural-change', 'local-government-reorganisation-lgr', 'secretary-of-state', 'vesting-day'],
    category: 'Process',
    lastUpdated: '2026-02-20'
  },
  {
    term: 'Secretary of State',
    slug: 'secretary-of-state',
    definition: 'The UK government minister responsible for local government (currently the Secretary of State for Levelling Up, Housing and Communities) who decides whether to make a structural change order and thereby approve a reorganisation. Proposals are submitted to the Secretary of State, who may consult and then lay the order before Parliament.',
    relatedTerms: ['structural-change-order', 'reorganisation-proposal'],
    category: 'Governance',
    lastUpdated: '2026-02-20'
  },
  {
    term: 'Councillor',
    slug: 'councillor',
    definition: 'An elected member of a local council. Councillors represent wards or divisions, vote in full council and committees, and in many councils form the cabinet or hold the leader role. In a reorganisation, councillors may be elected to the new shadow authority before vesting day.',
    relatedTerms: ['shadow-authority', 'leader-of-the-council', 'scrutiny', 'lame-duck-councillors'],
    category: 'Governance',
    synonyms: ['Councillors'],
    lastUpdated: '2026-02-20'
  },
  {
    term: 'TUPE',
    slug: 'tupe',
    definition: 'The Transfer of Undertakings (Protection of Employment) Regulations. When councils merge or restructure, TUPE typically applies so that staff transfer to the new employer with their existing terms and conditions protected, ensuring continuity of employment and reducing uncertainty during reorganisation.',
    relatedTerms: ['local-government-reorganisation-lgr', 'transition-period'],
    category: 'Process',
    synonyms: ['TUPE regulations'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Business Case',
    slug: 'business-case',
    definition: 'A formal document that sets out the rationale, costs, benefits, and risks of a proposed reorganisation. Business cases for LGR typically include projected revenue savings, transition costs, and evidence from past reorganisations, and are used to support proposals to government.',
    relatedTerms: ['reorganisation-proposal', 'local-government-reorganisation-lgr'],
    category: 'Process',
    synonyms: ['business cases'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Area Committee',
    slug: 'area-committee',
    definition: 'A committee or forum within a unitary (or larger) authority that focuses on a specific geographical area. Area committees can help retain local decision-making and engagement when districts are merged, and may deal with planning, local services, or community priorities.',
    relatedTerms: ['unitary-authority', 'devolution', 'scrutiny'],
    category: 'Governance',
    synonyms: ['area committees'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Council Tax Harmonisation',
    slug: 'council-tax-harmonisation',
    definition: 'The process of aligning council tax rates across former district (or county) areas when they become one unitary authority. Different predecessor councils often had different band levels; harmonisation may be phased over a transition period and has implications for residents.',
    relatedTerms: ['unitary-authority', 'transition-period'],
    category: 'Process',
    synonyms: ['council tax harmonisation', 'harmonise rates'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Parish Council',
    slug: 'parish-council',
    definition: 'A local tier of government below the principal authority (district or unitary). Parish councils represent small communities and may provide minor services and represent local identity; they continue after reorganisation and can become more prominent when the unitary covers a larger area.',
    relatedTerms: ['unitary-authority', 'district-council'],
    category: 'Core Concepts',
    synonyms: ['parish councils', 'Parish councils'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Town Council',
    slug: 'town-council',
    definition: 'A local council covering a town, often with similar status to a parish council. Town councils continue below unitary level after reorganisation and contribute to local identity and minor services.',
    relatedTerms: ['parish-council', 'unitary-authority'],
    category: 'Core Concepts',
    synonyms: ['town councils', 'Town councils'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Chief Executive',
    slug: 'chief-executive',
    definition: 'The most senior paid officer of a local authority, responsible for overall management and delivery of council services. In a unitary reorganisation, the new authority typically has one chief executive and a reduced senior management structure compared to the sum of predecessor councils.',
    relatedTerms: ['leader-of-the-council', 'unitary-authority'],
    category: 'Governance',
    synonyms: ['chief executive'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Voluntary Redundancy',
    slug: 'voluntary-redundancy',
    definition: 'A scheme where staff can choose to leave the organisation in return for redundancy pay. During reorganisation, voluntary redundancy is often used to reduce headcount and avoid or minimise compulsory job losses while aligning the workforce to the new structure.',
    relatedTerms: ['transition-period', 'local-government-reorganisation-lgr'],
    category: 'Process',
    synonyms: ['voluntary redundancy schemes'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Redeployment',
    slug: 'redeployment',
    definition: 'Moving an employee to a different role or department within the organisation. During LGR, redeployment is used to retain staff whose previous roles no longer exist and to fill posts in the new structure, often alongside voluntary redundancy schemes.',
    relatedTerms: ['voluntary-redundancy', 'transition-period'],
    category: 'Process',
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Transition Funding',
    slug: 'transition-funding',
    definition: 'Funding provided by central government (or set aside by authorities) to support the one-off costs of reorganisation, such as redundancy, IT migration, and consultancy. Transition funding can help smooth the financial impact in the early years after vesting.',
    relatedTerms: ['transition-period', 'local-government-reorganisation-lgr'],
    category: 'Process',
    synonyms: ['transition funding'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Revenue Savings',
    slug: 'revenue-savings',
    definition: 'Ongoing annual savings to the revenue budget, for example from back-office consolidation, shared services, or reduced senior management after reorganisation. Business cases for LGR often project revenue savings over a medium-term period.',
    relatedTerms: ['business-case', 'local-government-reorganisation-lgr'],
    category: 'Process',
    synonyms: ['revenue savings'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Reserves',
    slug: 'reserves',
    definition: 'Funds set aside by a local authority for future spending or contingencies. During reorganisation, authorities plan the use of reserves to cover transition costs while maintaining financial resilience and balanced budgets.',
    relatedTerms: ['local-government-reorganisation-lgr', 'section-114'],
    category: 'Governance',
    synonyms: ['reserves'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Senior Management',
    slug: 'senior-management',
    definition: 'The group of chief officers (e.g. directors, heads of service) who lead the council’s departments. In a unitary reorganisation, senior management is typically redesigned into a single structure with fewer posts than the combined predecessor councils.',
    relatedTerms: ['chief-executive', 'unitary-authority'],
    category: 'Governance',
    synonyms: ['senior management', 'senior management structures'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Electoral Arrangements',
    slug: 'electoral-arrangements',
    definition: 'The system of elections and wards for a local authority (e.g. whole-council or by-thirds elections, ward boundaries, number of councillors). New unitaries adopt electoral arrangements that affect political balance and representation.',
    relatedTerms: ['boundary-review', 'councillor', 'shadow-elections'],
    category: 'Governance',
    synonyms: ['electoral arrangements'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Ward Boundaries',
    slug: 'ward-boundaries',
    definition: 'The geographical boundaries that define each council ward or division. Ward boundaries are often reviewed as part of LGR or by the Local Government Boundary Commission and affect how many councillors represent each area.',
    relatedTerms: ['boundary-review', 'electoral-arrangements', 'councillor'],
    category: 'Governance',
    synonyms: ['ward boundaries'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Revenue Support',
    slug: 'revenue-support',
    definition: 'Central government funding that forms part of local authority revenue. When a new unitary is created, its revenue support and other grant allocations are set by government as part of the reorganisation settlement.',
    relatedTerms: ['local-government-reorganisation-lgr', 'transition-funding'],
    category: 'Governance',
    synonyms: ['revenue support', 'revenue support and grants'],
    lastUpdated: '2026-02-23'
  },
  {
    term: 'Lessons Learned',
    slug: 'lessons-learned',
    definition: 'Insights and best practice drawn from previous reorganisations. Evidence from past unitary transitions in England informs business cases, workforce planning, and service design for new reorganisations.',
    relatedTerms: ['local-government-reorganisation-lgr', 'business-case'],
    category: 'Process',
    relatedLink: '/lessons',
    synonyms: ['lessons learned', 'lessons from implementation'],
    lastUpdated: '2026-02-23'
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
