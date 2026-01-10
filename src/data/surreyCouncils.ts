export interface CouncilProfile {
  id: string;
  slug: string;
  name: string;
  type: 'Borough' | 'District' | 'County';
  population?: number;
  area?: number; // km²
  description: string;
  keyStats?: {
    label: string;
    value: string | number;
  }[];
  demographics?: {
    ageGroups: { label: string; percentage: number }[];
    employment: number; // percentage
    education: number; // percentage with higher education
  };
  housing?: {
    totalHousing: number;
    affordableHousing: number;
    averageHousePrice: number;
  };
  services?: string[];
  challenges?: string[];
  opportunities?: string[];
  futureUnitary?: 'East Surrey' | 'West Surrey' | 'County';
}

export const surreyCouncils: CouncilProfile[] = [
  {
    id: 'elmbridge',
    slug: 'elmbridge',
    name: 'Elmbridge Borough Council',
    type: 'Borough',
    population: 135678,
    area: 98.4,
    description: 'Elmbridge is a borough in the northwest of Surrey, bordering Greater London. It is known for its affluent areas and proximity to Heathrow Airport.',
    keyStats: [
      { label: 'Population', value: '135,678' },
      { label: 'Area', value: '98.4 km²' },
      { label: 'Households', value: '53,245' },
      { label: 'Average Age', value: '42.3 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 20 },
        { label: '18-44', percentage: 32 },
        { label: '45-64', percentage: 28 },
        { label: '65+', percentage: 20 }
      ],
      employment: 78,
      education: 45
    },
    housing: {
      totalHousing: 53456,
      affordableHousing: 8523,
      averageHousePrice: 625000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Leisure', 'Parks'],
    challenges: ['Housing affordability', 'Traffic congestion', 'Green belt protection'],
    opportunities: ['Economic growth', 'Transport improvements', 'Sustainability initiatives'],
    futureUnitary: 'West Surrey'
  },
  {
    id: 'epsom-ewell',
    slug: 'epsom-ewell',
    name: 'Epsom and Ewell Borough Council',
    type: 'Borough',
    population: 81706,
    area: 34.1,
    description: 'Epsom and Ewell is a borough in the north of Surrey, famous for Epsom Downs and the Derby horse race.',
    keyStats: [
      { label: 'Population', value: '81,706' },
      { label: 'Area', value: '34.1 km²' },
      { label: 'Households', value: '34,892' },
      { label: 'Average Age', value: '43.1 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 19 },
        { label: '18-44', percentage: 30 },
        { label: '45-64', percentage: 29 },
        { label: '65+', percentage: 22 }
      ],
      employment: 76,
      education: 43
    },
    housing: {
      totalHousing: 34892,
      affordableHousing: 5234,
      averageHousePrice: 485000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Parks'],
    challenges: ['Housing delivery', 'Heritage conservation', 'Transport links'],
    opportunities: ['Tourism development', 'Town centre regeneration', 'Green infrastructure'],
    futureUnitary: 'East Surrey'
  },
  {
    id: 'guildford',
    slug: 'guildford',
    name: 'Guildford Borough Council',
    type: 'Borough',
    population: 147889,
    area: 270.8,
    description: 'Guildford is the county town of Surrey, a historic market town with a vibrant economy and strong connections to London.',
    keyStats: [
      { label: 'Population', value: '147,889' },
      { label: 'Area', value: '270.8 km²' },
      { label: 'Households', value: '61,245' },
      { label: 'Average Age', value: '40.2 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 21 },
        { label: '18-44', percentage: 35 },
        { label: '45-64', percentage: 27 },
        { label: '65+', percentage: 17 }
      ],
      employment: 81,
      education: 52
    },
    housing: {
      totalHousing: 61245,
      affordableHousing: 9187,
      averageHousePrice: 485000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Leisure', 'Parks', 'Economic Development'],
    challenges: ['Urban growth pressure', 'Infrastructure capacity', 'Affordable housing'],
    opportunities: ['Innovation hub', 'Transport improvements', 'Cultural development'],
    futureUnitary: 'West Surrey'
  },
  {
    id: 'mole-valley',
    slug: 'mole-valley',
    name: 'Mole Valley District Council',
    type: 'District',
    population: 87657,
    area: 258.3,
    description: 'Mole Valley is a district in the south of Surrey, covering Dorking, Leatherhead and surrounding rural areas. Known for its beautiful countryside.',
    keyStats: [
      { label: 'Population', value: '87,657' },
      { label: 'Area', value: '258.3 km²' },
      { label: 'Households', value: '37,892' },
      { label: 'Average Age', value: '44.5 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 18 },
        { label: '18-44', percentage: 28 },
        { label: '45-64', percentage: 31 },
        { label: '65+', percentage: 23 }
      ],
      employment: 75,
      education: 48
    },
    housing: {
      totalHousing: 37892,
      affordableHousing: 5684,
      averageHousePrice: 520000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Parks', 'Leisure'],
    challenges: ['Green belt protection', 'Rural services', 'Aging population'],
    opportunities: ['Tourism', 'Sustainable development', 'Community resilience'],
    futureUnitary: 'East Surrey'
  },
  {
    id: 'reigate-banstead',
    slug: 'reigate-banstead',
    name: 'Reigate and Banstead Borough Council',
    type: 'Borough',
    population: 146912,
    area: 129.6,
    description: 'Reigate and Banstead is a borough in the east of Surrey, with Reigate as the main town. Well-connected with good transport links.',
    keyStats: [
      { label: 'Population', value: '146,912' },
      { label: 'Area', value: '129.6 km²' },
      { label: 'Households', value: '59,123' },
      { label: 'Average Age', value: '41.8 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 20 },
        { label: '18-44', percentage: 33 },
        { label: '45-64', percentage: 28 },
        { label: '65+', percentage: 19 }
      ],
      employment: 79,
      education: 46
    },
    housing: {
      totalHousing: 59123,
      affordableHousing: 8868,
      averageHousePrice: 450000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Leisure', 'Parks'],
    challenges: ['Housing delivery', 'Transport capacity', 'Service coordination'],
    opportunities: ['Town centre development', 'Infrastructure investment', 'Community engagement'],
    futureUnitary: 'East Surrey'
  },
  {
    id: 'runnymede',
    slug: 'runnymede',
    name: 'Runnymede Borough Council',
    type: 'Borough',
    population: 87047,
    area: 78.0,
    description: 'Runnymede is a borough in the north of Surrey, home to Runnymede where the Magna Carta was signed. Close to Heathrow and Windsor.',
    keyStats: [
      { label: 'Population', value: '87,047' },
      { label: 'Area', value: '78.0 km²' },
      { label: 'Households', value: '35,234' },
      { label: 'Average Age', value: '42.6 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 20 },
        { label: '18-44', percentage: 31 },
        { label: '45-64', percentage: 29 },
        { label: '65+', percentage: 20 }
      ],
      employment: 77,
      education: 44
    },
    housing: {
      totalHousing: 35234,
      affordableHousing: 5285,
      averageHousePrice: 465000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Parks', 'Leisure'],
    challenges: ['Airport impacts', 'Heritage protection', 'Development pressure'],
    opportunities: ['Tourism', 'Business growth', 'Environmental initiatives'],
    futureUnitary: 'West Surrey'
  },
  {
    id: 'spelthorne',
    slug: 'spelthorne',
    name: 'Spelthorne Borough Council',
    type: 'Borough',
    population: 99682,
    area: 51.1,
    description: 'Spelthorne is a borough in the northwest of Surrey, adjacent to Greater London and close to Heathrow Airport. Highly urbanized.',
    keyStats: [
      { label: 'Population', value: '99,682' },
      { label: 'Area', value: '51.1 km²' },
      { label: 'Households', value: '41,892' },
      { label: 'Average Age', value: '39.8 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 22 },
        { label: '18-44', percentage: 36 },
        { label: '45-64', percentage: 26 },
        { label: '65+', percentage: 16 }
      ],
      employment: 80,
      education: 40
    },
    housing: {
      totalHousing: 41892,
      affordableHousing: 6284,
      averageHousePrice: 395000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Leisure', 'Parks'],
    challenges: ['High density development', 'Affordability', 'Environmental quality'],
    opportunities: ['Regeneration', 'Transport access', 'Employment growth'],
    futureUnitary: 'West Surrey'
  },
  {
    id: 'surrey-heath',
    slug: 'surrey-heath',
    name: 'Surrey Heath Borough Council',
    type: 'Borough',
    population: 88383,
    area: 95.2,
    description: 'Surrey Heath is a borough in the west of Surrey, including Camberley and surrounding areas. Strong military connections.',
    keyStats: [
      { label: 'Population', value: '88,383' },
      { label: 'Area', value: '95.2 km²' },
      { label: 'Households', value: '37,456' },
      { label: 'Average Age', value: '41.5 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 21 },
        { label: '18-44', percentage: 32 },
        { label: '45-64', percentage: 28 },
        { label: '65+', percentage: 19 }
      ],
      employment: 78,
      education: 42
    },
    housing: {
      totalHousing: 37456,
      affordableHousing: 5618,
      averageHousePrice: 445000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Leisure', 'Parks'],
    challenges: ['Town centre vitality', 'Infrastructure', 'Housing mix'],
    opportunities: ['Regeneration', 'Business investment', 'Community facilities'],
    futureUnitary: 'West Surrey'
  },
  {
    id: 'tandridge',
    slug: 'tandridge',
    name: 'Tandridge District Council',
    type: 'District',
    population: 87378,
    area: 247.9,
    description: 'Tandridge is a district in the east of Surrey, covering Oxted, Caterham and surrounding areas. Mix of urban and rural character.',
    keyStats: [
      { label: 'Population', value: '87,378' },
      { label: 'Area', value: '247.9 km²' },
      { label: 'Households', value: '36,234' },
      { label: 'Average Age', value: '43.2 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 19 },
        { label: '18-44', percentage: 29 },
        { label: '45-64', percentage: 30 },
        { label: '65+', percentage: 22 }
      ],
      employment: 76,
      education: 47
    },
    housing: {
      totalHousing: 36234,
      affordableHousing: 5435,
      averageHousePrice: 475000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Parks', 'Leisure'],
    challenges: ['Green belt', 'Rural services', 'Affordable housing'],
    opportunities: ['Sustainable development', 'Community hubs', 'Transport links'],
    futureUnitary: 'East Surrey'
  },
  {
    id: 'waverley',
    slug: 'waverley',
    name: 'Waverley Borough Council',
    type: 'Borough',
    population: 125636,
    area: 345.2,
    description: 'Waverley is a borough in the southwest of Surrey, covering Farnham, Godalming, Haslemere and surrounding areas. Largest borough by area.',
    keyStats: [
      { label: 'Population', value: '125,636' },
      { label: 'Area', value: '345.2 km²' },
      { label: 'Households', value: '52,892' },
      { label: 'Average Age', value: '45.1 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 17 },
        { label: '18-44', percentage: 27 },
        { label: '45-64', percentage: 31 },
        { label: '65+', percentage: 25 }
      ],
      employment: 74,
      education: 50
    },
    housing: {
      totalHousing: 52892,
      affordableHousing: 7934,
      averageHousePrice: 485000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Leisure', 'Parks', 'Heritage'],
    challenges: ['Aging population', 'Rural services', 'Green belt protection'],
    opportunities: ['Heritage tourism', 'Sustainable communities', 'Health and wellbeing'],
    futureUnitary: 'West Surrey'
  },
  {
    id: 'woking',
    slug: 'woking',
    name: 'Woking Borough Council',
    type: 'Borough',
    population: 103900,
    area: 63.5,
    description: 'Woking is a borough in the northwest of Surrey, a busy commuter town with strong transport links to London.',
    keyStats: [
      { label: 'Population', value: '103,900' },
      { label: 'Area', value: '63.5 km²' },
      { label: 'Households', value: '43,245' },
      { label: 'Average Age', value: '40.5 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 21 },
        { label: '18-44', percentage: 34 },
        { label: '45-64', percentage: 27 },
        { label: '65+', percentage: 18 }
      ],
      employment: 82,
      education: 44
    },
    housing: {
      totalHousing: 43245,
      affordableHousing: 6487,
      averageHousePrice: 425000
    },
    services: ['Planning', 'Waste Collection', 'Housing', 'Leisure', 'Parks'],
    challenges: ['High density development', 'Affordability', 'Infrastructure capacity'],
    opportunities: ['Regeneration', 'Sustainable transport', 'Community spaces'],
    futureUnitary: 'West Surrey'
  },
  {
    id: 'surrey-county',
    slug: 'surrey-county',
    name: 'Surrey County Council',
    type: 'County',
    population: 1193145,
    area: 1663.5,
    description: 'Surrey County Council is the upper-tier authority responsible for education, social services, highways, and strategic planning across all of Surrey.',
    keyStats: [
      { label: 'Population', value: '1,193,145' },
      { label: 'Area', value: '1,663.5 km²' },
      { label: 'Households', value: '493,456' },
      { label: 'Average Age', value: '42.1 years' }
    ],
    demographics: {
      ageGroups: [
        { label: '0-17', percentage: 20 },
        { label: '18-44', percentage: 32 },
        { label: '45-64', percentage: 28 },
        { label: '65+', percentage: 20 }
      ],
      employment: 78,
      education: 46
    },
    housing: {
      totalHousing: 493456,
      affordableHousing: 74018,
      averageHousePrice: 485000
    },
    services: ['Education', 'Social Services', 'Highways', 'Strategic Planning', 'Public Health', 'Adult Social Care', 'Children\'s Services'],
    challenges: ['Service integration', 'Budget pressures', 'System convergence'],
    opportunities: ['Devolution', 'Service transformation', 'Digital innovation'],
    futureUnitary: 'County'
  }
];

export function getCouncilBySlug(slug: string): CouncilProfile | undefined {
  return surreyCouncils.find(council => council.slug === slug);
}
