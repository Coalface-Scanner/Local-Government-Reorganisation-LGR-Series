/**
 * Roadmap milestones: single source of truth for the LGR Journey Map.
 * Used by /roadmap for data-driven zones, milestone cards, side panel, and filters.
 */

export type RouteId =
  | 'democracy-elections'
  | 'legislation-governance'
  | 'operating-workforce'
  | 'finance-funding'
  | 'planning-place'
  | 'public-trust-comms'
  | 'ai-digital';

export type AudienceId =
  | 'councillor'
  | 'senior-officer'
  | 'planning'
  | 'communications'
  | 'partner-stakeholder';

export type ScenarioId = 'baseline' | 'elections-delayed' | 'fast-track' | 'high-volatility';

export type PlaceId = 'all-england' | 'surrey' | 'dpp' | 'other';

export type VisualType = 'default' | 'reversal';

export interface RoadmapLinks {
  articles: string[];
  facts: string[];
  glossary: string[];
  tools: string[];
  place: string[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  zone: string;
  dateLabel: string;
  dateStart?: string;
  dateEnd?: string;
  summary: string;
  whyItMatters: string[];
  whoItAffects?: string;
  audienceActions: Partial<Record<AudienceId, string[]>>;
  routes: RouteId[];
  scenarioFlags?: ScenarioId[];
  links: RoadmapLinks;
  tags?: string[];
  riskNote?: string;
  visualType?: VisualType;
}

export const ROUTE_IDS: RouteId[] = [
  'democracy-elections',
  'legislation-governance',
  'operating-workforce',
  'finance-funding',
  'planning-place',
  'public-trust-comms',
  'ai-digital',
];

export const ROUTE_LABELS: Record<RouteId, string> = {
  'democracy-elections': 'Democracy and elections',
  'legislation-governance': 'Legislation and statutory governance',
  'operating-workforce': 'Operating model and workforce',
  'finance-funding': 'Finance and funding',
  'planning-place': 'Planning and place',
  'public-trust-comms': 'Public trust and communications',
  'ai-digital': 'AI and digital capacity',
};

export const AUDIENCE_IDS: AudienceId[] = [
  'councillor',
  'senior-officer',
  'planning',
  'communications',
  'partner-stakeholder',
];

export const AUDIENCE_LABELS: Record<AudienceId, string> = {
  councillor: 'Councillor',
  'senior-officer': 'Senior officer',
  planning: 'Planning',
  communications: 'Communications',
  'partner-stakeholder': 'Partner and stakeholder',
};

export const SCENARIO_IDS: ScenarioId[] = [
  'baseline',
  'elections-delayed',
  'fast-track',
  'high-volatility',
];

export const SCENARIO_LABELS: Record<ScenarioId, string> = {
  baseline: 'Baseline',
  'elections-delayed': 'Elections delayed',
  'fast-track': 'Fast track',
  'high-volatility': 'High volatility',
};

export const PLACE_OPTIONS: PlaceId[] = ['all-england', 'surrey', 'dpp', 'other'];

export const PLACE_LABELS: Record<PlaceId, string> = {
  'all-england': 'All England',
  surrey: 'Surrey',
  dpp: 'DPP counties',
  other: 'Other',
};

export const ZONES = [
  { id: 'zone-1', title: 'Junction 1: The Departure', period: 'Q1 2026 (Jan - Mar)' },
  { id: 'zone-2', title: 'Junction 2: The Split Road', period: 'May 2026' },
  { id: 'zone-3', title: 'Junction 3: The Legislative Bridge', period: 'Mid - Late 2026' },
  { id: 'zone-4', title: 'Junction 4: Trust and Consent', period: 'Consultation & narrative pressure' },
  { id: 'zone-5', title: 'Junction 5: Refuelling & Horizon', period: '2026-27' },
];

const defaultAudienceActions: Partial<Record<AudienceId, string[]>> = {
  councillor: ['Review papers for next meeting.', 'Liaise with officers on transition plans.'],
  'senior-officer': ['Update transition plans.', 'Brief members on implications.'],
  planning: ['Check committee dates and delegations.', 'Coordinate with legal on SOC.'],
  communications: ['Prepare internal and external messaging.', 'Update stakeholder briefings.'],
  'partner-stakeholder': ['Note the date; plan engagement with shadow authority when formed.'],
};

export const ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    id: 'capacity-toll-booth',
    title: 'The "Capacity" Toll Booth',
    zone: 'zone-1',
    dateLabel: 'Jan/Feb 2026',
    dateStart: '2026-01-01',
    dateEnd: '2026-02-15',
    summary:
      'Secretary of State decides on election delays. 63 councils face the fork in the road.',
    whyItMatters: [
      'Determines whether shadow elections go ahead in May 2026 or are deferred.',
      'Impacts workforce and member planning across two-tier areas.',
    ],
    whoItAffects: '63 councils in LGR-affected areas; members, officers, and the public.',
    audienceActions: {
      ...defaultAudienceActions,
      councillor: [
        'Ensure your council has submitted evidence by the 15 Jan deadline.',
        'Prepare for either outcome: May 2026 elections or delay.',
      ],
      'senior-officer': [
        'Support submission of capacity evidence; model both timelines.',
        'Brief members on implications of delay vs go-ahead.',
      ],
    },
    routes: ['democracy-elections', 'legislation-governance'],
    scenarioFlags: ['baseline', 'elections-delayed', 'high-volatility'],
    links: {
      articles: [
        'roadmap-to-reform-the-local-government-reorganisation-timetable-2025-2028',
        'the-mayoral-election-delay-a-pause-for-order-or-a-quiet-change-of-direction',
      ],
      facts: ['/facts/timescales', '/facts/key-facts', '/facts/lgr-timeline'],
      glossary: ['shadow-elections', 'shadow-authority', 'lgr-timetable-2026'],
      tools: ['/first-100-days', '/tools'],
      place: ['/surrey'],
    },
    tags: ['elections', 'deadline', '63 councils'],
    riskNote: 'Deadline: 15 Jan 2026',
    visualType: 'default',
  },
  {
    id: 'election-reversal-16-feb',
    title: 'Elections Go Ahead: Reversal',
    zone: 'zone-1',
    dateLabel: '16 Feb 2026',
    dateStart: '2026-02-16',
    dateEnd: '2026-02-16',
    summary:
      'Government reverses earlier position: elections are confirmed to go ahead. The u-turn gives certainty to shadow authorities and councils.',
    whyItMatters: [
      'Removes uncertainty over May 2026 shadow elections.',
      'Enables councils to commit to First 100 Days and transition planning.',
      'Clarifies the timeline for Surrey and other LGR areas.',
    ],
    whoItAffects: 'Shadow authorities, existing councils, officers, and electors in LGR areas.',
    audienceActions: {
      ...defaultAudienceActions,
      councillor: ['Confirm local election timetable; step up candidate and campaign planning.'],
      'senior-officer': ['Lock in May 2026 as working assumption; accelerate transition plans.'],
    },
    routes: ['democracy-elections', 'public-trust-comms'],
    scenarioFlags: ['baseline', 'fast-track'],
    links: {
      articles: [
        'the-mayoral-election-delay-a-pause-for-order-or-a-quiet-change-of-direction',
        'lame-duck-councillors-lgr-transition',
      ],
      facts: ['/facts/lgr-timeline', '/facts/timescales'],
      glossary: ['shadow-elections', 'shadow-authority'],
      tools: ['/first-100-days'],
      place: ['/surrey', '/surrey/election-tracker'],
    },
    tags: ['u-turn', 'elections', 'certainty'],
    visualType: 'reversal',
  },
  {
    id: 'mapping-the-future',
    title: 'Mapping the Future',
    zone: 'zone-1',
    dateLabel: 'Spring 2026',
    dateStart: '2026-03-01',
    dateEnd: '2026-05-31',
    summary:
      'Unitary map options announced for DPP areas (Essex, Hants, Sussex, Norfolk, Suffolk).',
    whyItMatters: [
      'Sets the geographic and structural direction for each area.',
      'Enables local preparation for shadow bodies and vesting.',
    ],
    whoItAffects: 'DPP areas; districts and counties in those regions.',
    audienceActions: defaultAudienceActions,
    routes: ['planning-place', 'legislation-governance'],
    scenarioFlags: ['baseline', 'fast-track'],
    links: {
      articles: ['roadmap-to-reform-the-local-government-reorganisation-timetable-2025-2028'],
      facts: ['/facts/councils-involved', '/facts/lgr-timeline'],
      glossary: ['unitary-authority', 'structural-change', 'two-tier-system'],
      tools: ['/tools'],
      place: ['/surrey/area-profile'],
    },
    tags: ['DPP', 'unitary map'],
  },
  {
    id: 'shadow-elections-live',
    title: 'Shadow Elections Live',
    zone: 'zone-2',
    dateLabel: '7 May 2026',
    dateStart: '2026-05-07',
    dateEnd: '2026-05-07',
    summary: 'East & West Surrey elect Shadow Authorities. Immediate First 100 Days plan and statutory appointments.',
    whyItMatters: [
      'Surrey becomes the prototype for shadow governance.',
      'Statutory Officers (S151, MO) and single Scheme of Delegation must be in place.',
    ],
    whoItAffects: 'Surrey councils, new shadow members, officers, and the public.',
    audienceActions: {
      ...defaultAudienceActions,
      councillor: ['Attend induction; adopt Scheme of Delegation; appoint statutory officers.'],
      'senior-officer': ['Execute First 100 Days plan; support member induction and governance.'],
    },
    routes: ['democracy-elections', 'legislation-governance', 'operating-workforce'],
    scenarioFlags: ['baseline', 'fast-track'],
    links: {
      articles: [
        'first-100-days-new-unitary-councils',
        'the-first-100-days-playbook',
        'lgr-governance-voting-system',
      ],
      facts: ['/facts/lgr-timeline', '/facts/key-facts'],
      glossary: ['shadow-authority', 'shadow-elections', 'first-100-days', 'vesting-day'],
      tools: ['/first-100-days', '/surrey/election-tracker'],
      place: ['/surrey', '/surrey/election-tracker', '/surrey/election-tracker/simulator'],
    },
    tags: ['Surrey', 'shadow authority', 'May 2026'],
  },
  {
    id: 'lame-duck-lane',
    title: 'Existing Councils: "Lame Duck" Lane',
    zone: 'zone-2',
    dateLabel: 'May 2026 onward',
    dateStart: '2026-05-01',
    summary:
      'Councillors in areas with deferred elections or pre-vesting lose incentive; risk of maverick voting and planning volatility.',
    whyItMatters: [
      'Governance and discipline can weaken in run-up to dissolution.',
      'Planning committees may see higher volatility and political risk.',
    ],
    whoItAffects: 'Existing councils in LGR areas where elections are deferred or pre-vesting.',
    audienceActions: {
      ...defaultAudienceActions,
      councillor: ['Maintain standards; avoid decisions that bind successors inappropriately.'],
      'senior-officer': ['Support strong governance; document key decisions and delegations.'],
      planning: ['Expect higher volatility in committee; ensure robust reports and records.'],
    },
    routes: ['democracy-elections', 'planning-place', 'public-trust-comms'],
    scenarioFlags: ['baseline', 'high-volatility'],
    links: {
      articles: ['lame-duck-councillors-lgr-transition'],
      facts: ['/facts/lgr-timeline'],
      glossary: ['lame-duck-councillors', 'shadow-authority', 'transition-period'],
      tools: ['/first-100-days'],
      place: ['/surrey'],
    },
    tags: ['lame duck', 'planning', 'volatility'],
    riskNote: 'High volatility in Planning Committees expected.',
  },
  {
    id: 'operational-reality',
    title: 'Operational Reality Check',
    zone: 'zone-2',
    dateLabel: 'Throughout 2026',
    dateStart: '2026-01-01',
    dateEnd: '2026-12-31',
    summary:
      'While politics move fast, the machine grinds slowly. Tech remains "lift and drop"; workforce churn in planning/legal is high.',
    whyItMatters: [
      'Digital integration lags political timelines.',
      'Staff retention and knowledge transfer are critical risks.',
    ],
    whoItAffects: 'Officers, IT, HR, and service delivery across transitioning councils.',
    audienceActions: {
      ...defaultAudienceActions,
      'senior-officer': ['Prioritise retention and succession; avoid over-reliance on "lift and drop".'],
      planning: ['Secure key personnel; document delegations and precedents.'],
    },
    routes: ['operating-workforce', 'ai-digital'],
    scenarioFlags: ['baseline', 'high-volatility'],
    links: {
      articles: [],
      facts: ['/facts/sources', '/facts/methodology'],
      glossary: ['transition-period', 'go-live'],
      tools: ['/tools', '/first-100-days'],
      place: [],
    },
    tags: ['workforce', 'tech', 'operating model'],
  },
  {
    id: 'structural-change-orders',
    title: 'Structural Changes Orders',
    zone: 'zone-3',
    dateLabel: 'Mid - Late 2026',
    dateStart: '2026-06-01',
    dateEnd: '2026-12-31',
    summary:
      'Secondary legislation laid in Parliament legally creating new unitaries for 2028. Section 24 restrictions become active.',
    whyItMatters: [
      'Legal basis for new authorities and dissolution of old ones.',
      'Section 24 constrains what existing councils can do during transition.',
    ],
    whoItAffects: 'All councils in LGR areas; Parliament; statutory officers.',
    audienceActions: defaultAudienceActions,
    routes: ['legislation-governance'],
    scenarioFlags: ['baseline', 'fast-track'],
    links: {
      articles: [
        'LGR-Surrey-Parliament-Roles',
        'from-structure-to-authority-why-reorganisation-only-works-when-governance-is-taken-seriously',
        'why-governance-not-reorganisation-will-shape-the-next-decade-of-local-government',
      ],
      facts: ['/facts/lgr-timeline', '/facts/key-facts', '/facts/sources'],
      glossary: ['structural-change', 'shadow-authority', 'vesting-day'],
      tools: ['/first-100-days', '/tools'],
      place: ['/surrey'],
    },
    tags: ['SCO', 'Section 24', 'Parliament'],
    riskNote: 'Section 24 Restrictions Active',
  },
  {
    id: 'new-foundations',
    title: 'New Foundations',
    zone: 'zone-3',
    dateLabel: 'Mid - Late 2026',
    dateStart: '2026-06-01',
    dateEnd: '2026-12-31',
    summary:
      'MCAs (Cumbria, Cheshire & Warrington) enter shadow phase. CCAs: interim Foundation Authorities formed in Essex & Hants.',
    whyItMatters: [
      'Different models (MCA vs CCA) have different governance and timeline implications.',
      'Interim bodies need clear roles and delegations.',
    ],
    whoItAffects: 'MCA and CCA areas; combined authority members and officers.',
    audienceActions: defaultAudienceActions,
    routes: ['legislation-governance', 'operating-workforce'],
    scenarioFlags: ['baseline', 'fast-track'],
    links: {
      articles: ['from-structure-to-authority-why-reorganisation-only-works-when-governance-is-taken-seriously'],
      facts: ['/facts/councils-involved', '/facts/lgr-timeline'],
      glossary: ['combined-authority', 'shadow-authority', 'structural-change'],
      tools: ['/tools'],
      place: ['/surrey/area-profile'],
    },
    tags: ['MCA', 'CCA', 'interim'],
  },
  {
    id: 'trust-and-consent',
    title: 'Trust and Consent',
    zone: 'zone-4',
    dateLabel: '2026',
    dateStart: '2026-01-01',
    dateEnd: '2026-12-31',
    summary:
      'Consultation and public narrative pressure points. Legitimacy, consent, and democratic deficit in the spotlight.',
    whyItMatters: [
      'Public and stakeholder trust shapes the pace and acceptance of reorganisation.',
      'Campaigns and scrutiny (e.g. #OurCouncilsOurSay) influence the narrative.',
    ],
    whoItAffects: 'Councils, campaigners, media, and the public in LGR areas.',
    audienceActions: {
      ...defaultAudienceActions,
      communications: ['Monitor narrative; prepare clear, honest messaging on transition.'],
      'partner-stakeholder': ['Engage with consultation; feed in evidence and local context.'],
    },
    routes: ['public-trust-comms', 'democracy-elections'],
    scenarioFlags: ['baseline', 'high-volatility'],
    links: {
      articles: [
        'lgr-our-councils-our-say',
        'andrew-kelly-democratic-deficit',
        'lgr-backdoor-centralisation-or-needed-reform',
      ],
      facts: ['/facts/lgr-timeline', '/facts/key-facts'],
      glossary: ['lgr-governance', 'scrutiny', 'devolution'],
      tools: ['/first-100-days', '/tools'],
      place: ['/surrey', '/surrey/area-profile'],
    },
    tags: ['consultation', 'legitimacy', 'trust'],
  },
  {
    id: 'funding-and-future',
    title: 'Funding & The Future',
    zone: 'zone-5',
    dateLabel: '2026-27',
    dateStart: '2026-04-01',
    dateEnd: '2027-03-31',
    summary:
      'Initial tranches of devolution funding flow to interim bodies. Mayoral elections May 2027; unitary vesting days 2028.',
    whyItMatters: [
      'Funding must keep transition delivery on track.',
      '2027 and 2028 are the next major milestones for elections and go-live.',
    ],
    whoItAffects: 'Interim bodies, Treasury, MHCLG, and councils approaching vesting.',
    audienceActions: defaultAudienceActions,
    routes: ['finance-funding', 'democracy-elections'],
    scenarioFlags: ['baseline', 'fast-track'],
    links: {
      articles: ['roadmap-to-reform-the-local-government-reorganisation-timetable-2025-2028'],
      facts: ['/facts/timescales', '/facts/lgr-timeline', '/facts/key-facts'],
      glossary: ['vesting-day', 'devolution', 'go-live'],
      tools: ['/first-100-days', '/tools'],
      place: ['/surrey'],
    },
    tags: ['funding', '2027', 'vesting'],
  },
];

export function getMilestoneById(id: string): RoadmapMilestone | undefined {
  return ROADMAP_MILESTONES.find((m) => m.id === id);
}

export function getMilestonesByZone(zoneId: string): RoadmapMilestone[] {
  return ROADMAP_MILESTONES.filter((m) => m.zone === zoneId);
}

export function filterMilestones(
  milestones: RoadmapMilestone[],
  filters: {
    routes?: RouteId[];
    audience?: AudienceId;
    place?: PlaceId;
    scenario?: ScenarioId;
    searchQuery?: string;
  }
): RoadmapMilestone[] {
  let result = [...milestones];

  if (filters.routes?.length) {
    result = result.filter((m) => filters.routes!.some((r) => m.routes.includes(r)));
  }

  if (filters.scenario) {
    result = result.filter(
      (m) => !m.scenarioFlags || m.scenarioFlags.includes(filters.scenario!)
    );
  }

  if (filters.searchQuery?.trim()) {
    const q = filters.searchQuery.trim().toLowerCase();
    result = result.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.tags?.some((t) => t.toLowerCase().includes(q)) ||
        m.links.glossary.some((g) => g.toLowerCase().includes(q))
    );
  }

  return result;
}
