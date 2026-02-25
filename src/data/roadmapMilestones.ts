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

export type AppliesTo = 'surrey' | 'dpp' | 'other';

export type MilestoneStatus = 'confirmed' | 'in-design' | 'conditional' | 'complete';

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
  appliesTo?: AppliesTo[];
  status?: MilestoneStatus;
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
  { id: 'zone-2', title: 'Junction 2: Shadow Governance', period: 'May 2026' },
  { id: 'zone-3', title: 'Junction 3: The Legislative Bridge', period: 'Mid - Late 2026' },
  { id: 'zone-4', title: 'Junction 4: Trust and Consent', period: 'Consultation & narrative pressure' },
  { id: 'zone-5', title: 'Junction 5: Refuelling & Horizon', period: '2026-27' },
];

export const PHASES = [
  { id: 'phase-1', title: 'Phase 1 – Confirmation & Design', topPct: 0, heightPct: 20 },
  { id: 'phase-2', title: 'Phase 2 – Shadow Governance', topPct: 20, heightPct: 20 },
  { id: 'phase-3', title: 'Phase 3 – Structural Orders', topPct: 40, heightPct: 20 },
  { id: 'phase-4', title: 'Phase 4 – Transition Delivery', topPct: 60, heightPct: 20 },
  { id: 'phase-5', title: 'Phase 5 – Vesting', topPct: 80, heightPct: 20 },
];

export const TIMELINE_SCALE = [
  'Q1 2026',
  'May 2026',
  'Mid 2026',
  'Late 2026',
  '2027',
  '2028',
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
    id: 'transition-capacity-checkpoint',
    title: 'Transition Capacity Checkpoint',
    zone: 'zone-1',
    dateLabel: 'Q1 2026',
    dateStart: '2026-01-01',
    dateEnd: '2026-03-31',
    summary:
      'Government confirms programme sequencing following the General Election. Surrey designated as live prototype. DPP areas identified as structured second wave. Other areas placed in conditional pipeline.',
    whyItMatters: [
      'Confirms order of implementation',
      'Locks in officer resource and transition boards',
      'Signals which areas move to shadow phase in 2026',
    ],
    whoItAffects: 'Surrey, DPP areas, Other areas',
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
    tags: ['Surrey', 'DPP', 'programme sequencing'],
    visualType: 'default',
    appliesTo: ['surrey', 'dpp', 'other'],
    status: 'in-design',
  },
  {
    id: 'election-position-confirmed',
    title: 'Election Position Confirmed',
    zone: 'zone-1',
    dateLabel: 'February 2026',
    dateStart: '2026-02-01',
    dateEnd: '2026-02-28',
    summary:
      'Government confirms May 2026 shadow elections for Surrey. DPP areas subject to staged confirmation. No universal deferral position.',
    whyItMatters: [
      'Removes uncertainty for Surrey shadow authorities',
      'Enables formal First 100 Days planning',
      'Establishes sequencing discipline across programme',
    ],
    whoItAffects: 'Surrey confirmed, DPP areas conditional, Other areas not yet in scope',
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
    tags: ['elections', 'Surrey', 'certainty'],
    visualType: 'reversal',
    appliesTo: ['surrey', 'dpp', 'other'],
    status: 'confirmed',
  },
  {
    id: 'final-geography-confirmed',
    title: 'Final Geography Confirmed',
    zone: 'zone-1',
    dateLabel: 'Spring 2026',
    dateStart: '2026-03-01',
    dateEnd: '2026-05-31',
    summary:
      'Surrey unitary geography and vesting timetable confirmed. DPP areas enter formal decision window. Other areas remain at expression of interest stage.',
    whyItMatters: [
      'Surrey moves from mapping to implementation',
      'DPP areas remain in structured design and consultation',
      'Prevents assumption of universal rollout',
    ],
    whoItAffects: 'Surrey implementation, DPP design stage, Other areas pre statutory',
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
    tags: ['Surrey', 'DPP', 'geography'],
    appliesTo: ['surrey', 'dpp', 'other'],
    status: 'in-design',
  },
  {
    id: 'surrey-shadow-elections',
    title: 'Surrey Shadow Elections',
    zone: 'zone-2',
    dateLabel: '7 May 2026',
    dateStart: '2026-05-07',
    dateEnd: '2026-05-07',
    summary: 'Surrey elects Shadow Authorities. Statutory officers appointed. Single Scheme of Delegation prepared.',
    whyItMatters: [
      'First live prototype of post election LGR',
      'Governance stabilises before vesting',
      'Sets precedent for DPP and later waves',
    ],
    whoItAffects: 'Surrey only',
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
    appliesTo: ['surrey'],
    status: 'confirmed',
  },
  {
    id: 'transitional-governance-risk',
    title: 'Transitional Governance Risk',
    zone: 'zone-2',
    dateLabel: 'May 2026 onward',
    dateStart: '2026-05-01',
    summary:
      'In areas approaching vesting, political discipline and committee stability may weaken. Section 24 style constraints apply where Structural Changes Orders are laid.',
    whyItMatters: [
      'Planning committee volatility risk',
      'Reduced appetite for long term policy change',
      'Increased scrutiny and reputational exposure',
    ],
    whoItAffects: 'Primarily Surrey; DPP areas once Orders laid',
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
    tags: ['governance', 'planning', 'volatility'],
    riskNote: 'Planning committee volatility risk',
    appliesTo: ['surrey', 'dpp'],
    status: 'conditional',
  },
  {
    id: 'operational-convergence',
    title: 'Operational Convergence',
    zone: 'zone-2',
    dateLabel: 'Throughout 2026',
    dateStart: '2026-01-01',
    dateEnd: '2026-12-31',
    summary:
      'Surrey: Programme boards active. ICT convergence and finance alignment begin. DPP areas: Capacity modelling, workforce planning and financial baselining. Other areas: Early due diligence only.',
    whyItMatters: [
      'Digital integration lags political timetables',
      'Knowledge transfer risk',
      'Workforce stability becomes critical delivery factor',
    ],
    whoItAffects: 'All areas, at different intensity',
    audienceActions: {
      ...defaultAudienceActions,
      'senior-officer': ['Prioritise retention and succession; avoid over-reliance on "lift and drop".'],
      planning: ['Secure key personnel; document delegations and precedents.'],
    },
    routes: ['operating-workforce', 'ai-digital'],
    scenarioFlags: ['baseline', 'high-volatility'],
    links: {
      articles: [],
      facts: ['/facts/sources', '/facts/methodology', '/facts/lgr-timeline'],
      glossary: ['transition-period', 'go-live'],
      tools: ['/tools', '/first-100-days'],
      place: [],
    },
    tags: ['workforce', 'ICT', 'operating model'],
    appliesTo: ['surrey', 'dpp', 'other'],
    status: 'in-design',
  },
  {
    id: 'structural-change-orders',
    title: 'Structural Changes Orders',
    zone: 'zone-3',
    dateLabel: 'Mid to Late 2026',
    dateStart: '2026-06-01',
    dateEnd: '2026-12-31',
    summary:
      'Surrey: Structural Changes Order laid first. DPP areas: Indicative laying window identified. Other areas: Dependent on Secretary of State sequencing and capacity.',
    whyItMatters: [
      'Legal creation of new authorities',
      'Dissolution timetable fixed',
      'Statutory constraints on existing councils activated',
    ],
    whoItAffects: 'Surrey confirmed; DPP conditional; Other areas pipeline',
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
    appliesTo: ['surrey', 'dpp', 'other'],
    status: 'conditional',
  },
  {
    id: 'new-foundations-phase',
    title: 'New Foundations Phase',
    zone: 'zone-3',
    dateLabel: 'Late 2026',
    dateStart: '2026-09-01',
    dateEnd: '2026-12-31',
    summary:
      'Surrey: Shadow governance stabilises and transition delivery accelerates. DPP areas: Move toward shadow phase if Orders confirmed. Other areas: Remain pre statutory.',
    whyItMatters: [
      'Governance maturity determines vesting success',
      'Interim clarity prevents operational drift',
    ],
    whoItAffects: 'Wave dependent',
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
    tags: ['shadow', 'governance', 'vesting'],
    appliesTo: ['surrey', 'dpp', 'other'],
    status: 'conditional',
  },
  {
    id: 'trust-and-consent',
    title: 'Trust and Consent',
    zone: 'zone-4',
    dateLabel: '2026 onward',
    dateStart: '2026-01-01',
    dateEnd: '2026-12-31',
    summary:
      'Surrey: Public narrative shifts from legitimacy to delivery performance. DPP areas: Geographic identity and representation debate intensifies. Other areas: Campaigns focus on influencing inclusion or design.',
    whyItMatters: [
      'Public trust influences implementation speed',
      'Scrutiny shapes political leadership behaviour',
      'Narrative discipline affects programme stability',
    ],
    whoItAffects: 'All areas',
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
    appliesTo: ['surrey', 'dpp', 'other'],
    status: 'in-design',
  },
  {
    id: 'funding-and-transition-envelope',
    title: 'Funding and Transition Envelope',
    zone: 'zone-5',
    dateLabel: '2026 to 2027',
    dateStart: '2026-04-01',
    dateEnd: '2027-03-31',
    summary:
      'Surrey: Transition funding allocation confirmed. DPP areas: Indicative envelope, subject to Spending Review alignment. Other areas: No confirmed allocation.',
    whyItMatters: [
      'Transition funding sustains programme credibility',
      'Treasury alignment influences pace of next wave',
    ],
    whoItAffects: 'Wave dependent',
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
    appliesTo: ['surrey', 'dpp', 'other'],
    status: 'conditional',
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
