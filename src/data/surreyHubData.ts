export type CohortType = 'WEST' | 'EAST' | 'COUNTY';

export interface Cohort {
  id: string;
  name: string;
  text: string;
  bg: string;
  border: string;
}

export const cohorts: Record<CohortType, Cohort> = {
  WEST: { id: 'west', name: 'West Surrey', text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  EAST: { id: 'east', name: 'East Surrey', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  COUNTY: { id: 'county', name: 'County', text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' }
};

export interface Council {
  id: string;
  name: string;
  cohort: CohortType;
  tagline: string;
  risk?: string;
  asset: string;
  liability: string;
  desc: string;
  hook?: string;
  path: string;
  cx: number;
  cy: number;
}

export const councils: Council[] = [
  { 
    id: 'intro', 
    name: 'Surrey Reorganisation', 
    cohort: 'COUNTY', 
    tagline: 'Strategic Intelligence Briefing', 
    asset: '12 Boroughs', 
    liability: '2 Unitaries', 
    desc: 'Surrey is undergoing a seismic structural shift. The county will be partitioned into two new unitary authorities. Scroll to inspect the strategic "dowry" and "liability" of each.', 
    hook: 'Scroll to initiate.', 
    path: '', 
    cx: 0, 
    cy: 0 
  },
  { 
    id: 'woking', 
    name: 'Woking', 
    cohort: 'WEST', 
    tagline: 'The Debt Architect', 
    risk: 'Critical', 
    asset: 'Town Centre Assets', 
    liability: '£1.5bn Net Debt', 
    desc: 'The primary driver for merger. The "Black Hole" of the West.', 
    path: 'M 100,130 L 140,120 L 150,160 L 110,170 Z', 
    cx: 125, 
    cy: 145 
  },
  { 
    id: 'guildford', 
    name: 'Guildford', 
    cohort: 'WEST', 
    tagline: 'The Reluctant Anchor', 
    risk: 'Medium', 
    asset: 'Solvent, £17m Reserves', 
    liability: 'Housing Cliff Edge', 
    desc: 'Administrative heart bringing stability but facing supply crisis.', 
    path: 'M 80,180 L 140,170 L 160,210 L 130,250 L 70,240 Z', 
    cx: 115, 
    cy: 210 
  },
  { 
    id: 'spelthorne', 
    name: 'Spelthorne', 
    cohort: 'WEST', 
    tagline: 'The Billion Pound Landlord', 
    risk: 'High', 
    asset: '£1bn Property Portfolio', 
    liability: 'Yield Volatility', 
    desc: 'A hedge fund attached to a council.', 
    path: 'M 100,20 L 160,15 L 170,60 L 110,70 Z', 
    cx: 135, 
    cy: 40 
  },
  { 
    id: 'runnymede', 
    name: 'Runnymede', 
    cohort: 'WEST', 
    tagline: 'The "Best Value" Concern', 
    risk: 'High', 
    asset: '£24m Balances', 
    liability: 'Debt 71x Spending', 
    desc: 'Subject to Best Value Notice. Precarious housing supply.', 
    path: 'M 90,60 L 140,50 L 150,100 L 80,110 Z', 
    cx: 115, 
    cy: 80 
  },
  { 
    id: 'surrey_heath', 
    name: 'Surrey Heath', 
    cohort: 'WEST', 
    tagline: 'The Commercial Contagion', 
    risk: 'High', 
    asset: 'Camberley Centre', 
    liability: 'Falling Yields', 
    desc: 'A "Mini-Woking" heavily reliant on commercial income.', 
    path: 'M 40,110 L 90,100 L 100,150 L 30,160 Z', 
    cx: 65, 
    cy: 130 
  },
  { 
    id: 'waverley', 
    name: 'Waverley', 
    cohort: 'WEST', 
    tagline: 'The Rural Resistance', 
    risk: 'Low', 
    asset: 'Debt-Free General Fund', 
    liability: 'AONB Constraints', 
    desc: 'Fiercely opposing merger. Penalised for Woking mismanagement.', 
    path: 'M 50,230 L 110,240 L 120,290 L 40,300 Z', 
    cx: 80, 
    cy: 265 
  },
  { 
    id: 'elmbridge', 
    name: 'Elmbridge', 
    cohort: 'EAST', 
    tagline: 'Wealthy but Vulnerable', 
    risk: 'Medium', 
    asset: 'Strong Tax Base', 
    liability: 'No Local Plan', 
    desc: 'Planning in retreat. Open to "planning by appeal".', 
    path: 'M 160,70 L 230,60 L 240,110 L 170,120 Z', 
    cx: 200, 
    cy: 90 
  },
  { 
    id: 'reigate_banstead', 
    name: 'Reigate & Banstead', 
    cohort: 'EAST', 
    tagline: 'The Economic Engine', 
    risk: 'Low', 
    asset: 'Economic Driver', 
    liability: 'Waste Integration', 
    desc: 'Anchor tenant of the East. Politically distinct.', 
    path: 'M 220,160 L 280,150 L 290,210 L 210,220 Z', 
    cx: 250, 
    cy: 185 
  },
  { 
    id: 'epsom_ewell', 
    name: 'Epsom & Ewell', 
    cohort: 'EAST', 
    tagline: 'The Independent Stronghold', 
    risk: 'Medium', 
    asset: 'Balanced Budgets', 
    liability: 'Lack of Scale', 
    desc: 'Unique political entity. Fiercely protectionist.', 
    path: 'M 200,110 L 250,100 L 260,150 L 210,160 Z', 
    cx: 230, 
    cy: 130 
  },
  { 
    id: 'mole_valley', 
    name: 'Mole Valley', 
    cohort: 'EAST', 
    tagline: 'The Rural Expanse', 
    risk: 'Low', 
    asset: 'Adopted Local Plan', 
    liability: 'Low Population', 
    desc: 'Only East council with adopted plan. Legal shield.', 
    path: 'M 170,180 L 220,170 L 230,230 L 160,240 Z', 
    cx: 195, 
    cy: 205 
  },
  { 
    id: 'tandridge', 
    name: 'Tandridge', 
    cohort: 'EAST', 
    tagline: 'The Operational Liability', 
    risk: 'Critical', 
    asset: '94% Green Belt', 
    liability: 'Structural Deficit', 
    desc: 'The "sick man" of the East. Failing housing stock.', 
    path: 'M 280,170 L 340,160 L 350,230 L 290,240 Z', 
    cx: 315, 
    cy: 200 
  }
];

export interface HarmStage {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  risk: string;
  metrics: {
    p: number;
    f: number;
    o: number;
  };
  detail: string;
}

export const harmStages: HarmStage[] = [
  { 
    id: 0, 
    title: 'Defining Harmonisation', 
    subtitle: 'Strategic Context', 
    theme: 'slate', 
    risk: 'Systemic', 
    metrics: { p: 20, f: 10, o: 100 }, 
    detail: 'Merging 12 sovereign bodies.' 
  },
  { 
    id: 1, 
    title: 'The Digital Front Door', 
    subtitle: 'Day 1 Risk', 
    theme: 'indigo', 
    risk: 'High', 
    metrics: { p: 45, f: 30, o: 92 }, 
    detail: 'Merging 12 CRM environments.' 
  },
  { 
    id: 2, 
    title: 'The Wallet Impact', 
    subtitle: 'Tax Harmonisation', 
    theme: 'emerald', 
    risk: 'Critical', 
    metrics: { p: 98, f: 65, o: 25 }, 
    detail: 'Equalising Band D rates.' 
  }
];

export type ViewType = 'hub' | 'journey-harmonisation' | 'journey-deepdive' | 'journey-housing' | 'journey-election';
