/**
 * Leadership profiles for the LGR Initiative (hub cards and bio pages).
 * Links use canonical path /about/leadership/:slug
 */
export interface LeadershipProfileLink {
  label: string;
  url: string;
}

export type PartnerType = 'lead' | 'strategic' | 'specialist';

export interface LeadershipProfile {
  slug: string;
  name: string;
  title: string;
  organisation: string;
  organisationLogo?: string;
  partnerType: PartnerType;
  headshot: string;
  link: string;
  bio_sections?: {
    role_and_responsibilities?: string;
    biography?: string;
    areas_of_focus?: string[];
    links?: LeadershipProfileLink[];
  };
}

export const leadershipProfiles: LeadershipProfile[] = [
  {
    slug: 'rowan-cole',
    name: 'Rowan Cole',
    title: 'Founder/Lead Partner LGR Initiative (Editorial and Strategy)',
    organisation: 'Founder/Director COALFACE',
    organisationLogo: '/Images/leadership/logos/coalface.png',
    partnerType: 'lead',
    headshot: '/Images/leadership/rowan-cole.jpg',
    link: '/rowan-cole-local-government-reorganisation',
    bio_sections: {
      role_and_responsibilities: 'Editorial lead for the LGR Initiative, responsible for standards, commissioning priorities and the development of evidence led content.',
      biography: 'Rowan Cole leads the LGR Initiative editorial programme, shaping the site\'s research and insight priorities and ensuring content is presented in a clear, accountable and verifiable way.',
      areas_of_focus: [
        'Local government reorganisation programme design and outcomes',
        'Governance, legitimacy and institutional trust',
        'Public engagement and communications in contested environments',
      ],
      links: [
        { label: 'Methodology', url: '/about/overview#methodology' },
        { label: 'Partnerships', url: '/partnerships' },
        { label: 'Contact', url: '/contact' },
      ],
    },
  },
  {
    slug: 'amelia-hadfield',
    name: 'Professor Amelia Hadfield',
    title: 'Lead Partner LGR Initiative (Academic and Policy)',
    organisation: 'Founding Director, Centre for Britain and Europe, University of Surrey',
    organisationLogo: '/Images/leadership/logos/university-of-surrey.png',
    partnerType: 'lead',
    headshot: '/Images/leadership/amelia-hadfield.jpg',
    link: '/professor-amelia-hadfield-governance-reform',
    bio_sections: {
      role_and_responsibilities: 'Supports the LGR Initiative through academic linkage and external engagement perspective.',
      biography: 'Professor Amelia Hadfield contributes senior academic perspective on external engagement and institutional collaboration, supporting the LGR Initiative approach to credibility, evidence and public facing communication.',
      areas_of_focus: [
        'External engagement and institutional partnerships',
        'Policy relevant research translation',
        'Civic and democratic resilience',
      ],
      links: [
        { label: 'Methodology', url: '/about/overview#methodology' },
        { label: 'Contact', url: '/contact' },
      ],
    },
  },
  {
    slug: 'oliver-deed',
    name: 'Oliver Deed',
    title: 'Strategic Partner LGR Initiative (Engagement)',
    organisation: 'Managing Director, ECF',
    organisationLogo: '/Images/leadership/logos/ecf.png',
    partnerType: 'strategic',
    headshot: '/Images/leadership/oliver-deed.jpg',
    link: '/oliver-deed-strategic-communications-local-government',
    bio_sections: {
      role_and_responsibilities: 'Contributes practical engagement and elections interface perspective to LGR related work.',
      biography: 'Oliver Deed contributes practice based insight on engagement design and the elections interface, supporting the LGR Initiative emphasis on implementation, communications and public trust.',
      areas_of_focus: [
        'Engagement practice and consultation design',
        'Elections context and democratic dynamics',
        'Delivery focused communications',
      ],
      links: [
        { label: 'Partnerships', url: '/partnerships' },
        { label: 'Contact', url: '/contact' },
      ],
    },
  },
  {
    slug: 'charlie-moir',
    name: 'Charlie Moir',
    title: 'Specialist Partner LGR Initiative (Digital Engagement)',
    organisation: 'Digital Communications, Commonplace',
    organisationLogo: '/Images/leadership/logos/commonplace.png',
    partnerType: 'specialist',
    headshot: '/Images/leadership/charlie_moir.jpg',
    link: '/charlie-moir-digital-engagement-local-government',
    bio_sections: {
      role_and_responsibilities: 'Contributes digital participation and resident insight perspective.',
      biography: 'Charlie Moir contributes perspective on digital participation and insight led engagement, supporting the LGR Initiative focus on modern, accessible and evidence driven approaches to understanding communities.',
      areas_of_focus: [
        'Digital engagement and participation design',
        'Resident insight and structured feedback',
        'Data informed community understanding',
      ],
      links: [
        { label: 'Library', url: '/library' },
        { label: 'Contact', url: '/contact' },
      ],
    },
  },
  {
    slug: 'matthew-masters',
    name: 'Matthew Masters',
    title: 'Specialist Partner LGR Initiative (Media)',
    organisation: 'Founder, Truth About Local Government',
    organisationLogo: '/Images/leadership/logos/truth-about-local-government.png',
    partnerType: 'specialist',
    headshot: '/Images/leadership/matthew-masters.jpg',
    link: '/matthew-masters-local-government-leadership',
    bio_sections: {
      role_and_responsibilities: 'Contributes organisational leadership and culture perspective from across local government.',
      biography: 'Matthew Masters contributes insight on leadership, culture and organisational performance in local government, supporting the LGR Initiative focus on how reorganisation is experienced and delivered in practice.',
      areas_of_focus: [
        'Leadership and organisational culture',
        'Operating models and institutional performance',
        'Practical learning from sector experience',
      ],
      links: [
        { label: 'Insights', url: '/insights' },
        { label: 'Contact', url: '/contact' },
      ],
    },
  },
];

export function getLeadershipProfile(slug: string): LeadershipProfile | undefined {
  return leadershipProfiles.find((p) => p.slug === slug);
}
