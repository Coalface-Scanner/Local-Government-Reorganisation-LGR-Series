/**
 * Shared FAQ data for the standalone /faq page and QuestionsAndAnswers.
 * Plain text for JSON-LD; answers may contain HTML for display.
 */
export interface FAQItem {
  question: string;
  answer: string;
  category: 'basics' | 'process' | 'finance' | 'gov' | 'impact';
  /** Page to link to for "Read more" */
  relatedPath: string;
  relatedLabel: string;
}

export const faqData: FAQItem[] = [
  // BASICS & HISTORY
  {
    question: 'What is Local Government Reorganisation (LGR)?',
    answer: 'LGR is a structural reform programme to simplify England\'s system by replacing two-tier local government (county and district) with unitary authorities. It is the fourth major wave of restructuring since 1965, announced in the December 2024 Devolution White Paper.',
    category: 'basics',
    relatedPath: '/what-is-lgr',
    relatedLabel: 'What is LGR?'
  },
  {
    question: 'What are Unitary Authorities?',
    answer: 'A single local government organisation responsible for all services in an area. It combines functions split between county and district tiers (like education, social care, planning, and waste) into one body.',
    category: 'basics',
    relatedPath: '/what-is-lgr',
    relatedLabel: 'What is LGR?'
  },
  {
    question: 'Why Does the Government Want to Reorganise?',
    answer: 'Strategic reasons include: streamlining services, improving financial sustainability by removing administrative duplication, and creating governance structures strong enough for devolution.',
    category: 'basics',
    relatedPath: '/reasons',
    relatedLabel: 'Reasons for reorganisation'
  },
  {
    question: 'What are the "Six Priority Programme" Areas?',
    answer: 'Selected in Feb 2025: Cheshire & Warrington, Cumbria, Greater Essex, Hampshire & the Solent, Norfolk & Suffolk, and Sussex & Brighton. These combine devolution with LGR.',
    category: 'basics',
    relatedPath: '/facts/lgr-timeline',
    relatedLabel: 'LGR timeline'
  },
  {
    question: 'Which Areas are Involved in LGR?',
    answer: '21 two-tier areas including Surrey (accelerated), Kent, Essex, Hertfordshire, Norfolk, Suffolk, Cambridgeshire, Lancashire, Cheshire, Cumbria, Hampshire, and Sussex.',
    category: 'basics',
    relatedPath: '/facts/council-cases',
    relatedLabel: 'Council cases'
  },
  {
    question: 'What Happened in Previous Local Government Reorganisations?',
    answer: 'England restructured in 1974 (establishing the current two-tier system), 1995–1998, 2009, and most recently in 2019–2023 creating unitaries like Somerset and North Yorkshire.',
    category: 'basics',
    relatedPath: '/reorganisations',
    relatedLabel: 'Reorganisations'
  },
  {
    question: 'How Does LGR Compare to Other Countries?',
    answer: 'Scotland and Wales already use fully unitary systems. England\'s two-tier structure is an anomaly within the UK. Most European nations also prefer single-tier models for local services.',
    category: 'basics',
    relatedPath: '/what-is-lgr',
    relatedLabel: 'What is LGR?'
  },
  // PROCESS & TIMELINE
  {
    question: 'What is the Timeline for Implementation?',
    answer: '<ul class="list-disc pl-5 space-y-1 mb-2"><li><strong>Nov 2025:</strong> Final proposal deadline.</li><li><strong>Spring/Summer 2026:</strong> Government decisions.</li><li><strong>May 2027:</strong> First elections.</li><li><strong>April 2028:</strong> New councils operational.</li></ul><p class="mt-2 italic">Note: Surrey follows an accelerated timeline (operational April 2027).</p>',
    category: 'process',
    relatedPath: '/facts/lgr-timeline',
    relatedLabel: 'LGR timeline'
  },
  {
    question: 'How Will the Proposals Process Work?',
    answer: 'A 5-stage process: 1) Proposal Development, 2) Public Consultation, 3) Decision & Statutory Process, 4) Secondary Legislation (Structural Changes Order), and 5) Elections & Implementation.',
    category: 'process',
    relatedPath: '/roadmap',
    relatedLabel: 'LGR roadmap'
  },
  {
    question: 'What Do Different Models Look Like?',
    answer: 'Options include <strong>Single Unitary</strong> (one council per county), <strong>Two-Unitary</strong> splits (e.g., East and West Surrey), or <strong>Three+ Unitary</strong> models which maintain more local identity but increase costs.',
    category: 'process',
    relatedPath: '/facts/council-cases',
    relatedLabel: 'Council cases'
  },
  {
    question: 'What Happens if a Council Proposes a Model the Government Rejects?',
    answer: 'If councils cannot agree on a consensus model, the government has the power to impose a structure as a "backstop" to ensure the reorganisation proceeds according to the national timeline.',
    category: 'process',
    relatedPath: '/facts/lgr-timeline',
    relatedLabel: 'LGR timeline'
  },
  {
    question: 'Will There Be Elections Before New Councils are Established?',
    answer: 'Most scheduled elections for 2025/2026 have been postponed. The primary elections for new unitary authorities will occur on 6 May 2027, with the councils becoming operational a year later.',
    category: 'process',
    relatedPath: '/facts/lgr-timeline',
    relatedLabel: 'LGR timeline'
  },
  // FINANCE & SAVINGS
  {
    question: 'What is the Population Threshold for New Unitary Authorities?',
    answer: 'The target is <strong>500,000+ residents</strong>. Analysis suggests larger authorities achieve higher economies of scale. Smaller councils (300k population) can actually cost an area more due to disaggregation.',
    category: 'finance',
    relatedPath: '/facts/key-facts',
    relatedLabel: 'Key facts'
  },
  {
    question: 'How Much Could LGR Save?',
    answer: 'PwC and County Councils Network analyses estimate potential savings of <strong>£1.8bn to £2.9bn</strong> over five years if implemented at a large scale (500,000+ population).',
    category: 'finance',
    relatedPath: '/facts/key-facts',
    relatedLabel: 'Key facts'
  },
  {
    question: 'What is Disaggregation?',
    answer: 'This is the cost of splitting up integrated county services—especially social care—across multiple new councils. It requires duplicating management, IT systems, and admin structures, making it expensive.',
    category: 'finance',
    relatedPath: '/facts/key-facts',
    relatedLabel: 'Key facts'
  },
  {
    question: 'How Much Will LGR Cost?',
    answer: 'Upfront transition costs are significant: IT consolidation, redundancy packages, rebranding, and office rationalisation. These often exceed initial expectations in previous reorganisations.',
    category: 'finance',
    relatedPath: '/lessons',
    relatedLabel: 'Lessons learned'
  },
  {
    question: 'What is the Financial Impact on Council Tax?',
    answer: 'While the government argues LGR saves money, councils may freeze taxes during transition or face rises if costs exceed savings. Rates usually "harmonize" across the new area over several years.',
    category: 'finance',
    relatedPath: '/facts/key-facts',
    relatedLabel: 'Key facts'
  },
  // GOVERNANCE
  {
    question: 'Will There Be Fewer Councillors?',
    answer: 'Yes. Unitary authorities typically have fewer councillors than the combined totals of the previous county and district tiers. A boundary review by the LGBCE decides exact numbers later.',
    category: 'gov',
    relatedPath: '/glossary',
    relatedLabel: 'Glossary'
  },
  {
    question: 'What Happens to Parish Councils?',
    answer: 'Parish and town councils remain. They are an opportunity to maintain community-level governance, and many new unitaries may devolve hyperlocal functions to them.',
    category: 'gov',
    relatedPath: '/glossary',
    relatedLabel: 'Glossary'
  },
  {
    question: 'What Are the Governance and Democratic Implications?',
    answer: 'Accountability is clearer as one council is responsible for everything, but larger authorities may feel more "distant" from local communities compared to smaller districts.',
    category: 'gov',
    relatedPath: '/topics/democratic-legitimacy',
    relatedLabel: 'Democratic legitimacy'
  },
  {
    question: 'What is the Role of Combined Authorities?',
    answer: 'These legal bodies (often with a Mayor) manage devolved powers like transport. They require constituent councils to be unitary, which is a key driver for the LGR process.',
    category: 'gov',
    relatedPath: '/glossary',
    relatedLabel: 'Glossary'
  },
  // SERVICE IMPACT
  {
    question: 'What are the Advantages of Unitary Authorities?',
    answer: 'Efficiency through economies of scale, better integration of services like housing and care, financial resilience, clearer voter accountability, and greater capacity for devolution.',
    category: 'impact',
    relatedPath: '/reasons',
    relatedLabel: 'Reasons for reorganisation'
  },
  {
    question: 'What are the Disadvantages and Risks?',
    answer: 'Risks include a loss of local responsiveness, service disruption during transition, high upfront costs, and a potential "one-size-fits-all" approach that doesn\'t suit diverse towns.',
    category: 'impact',
    relatedPath: '/lessons',
    relatedLabel: 'Lessons learned'
  },
  {
    question: 'How Will Services Transfer Between Councils?',
    answer: 'Via a managed transition: staff transfer under TUPE, IT systems are migrated, assets like buildings move to the new authority, and budgets are consolidated under the Structural Changes Order.',
    category: 'impact',
    relatedPath: '/first-100-days',
    relatedLabel: 'First 100 days'
  },
  {
    question: 'What are the Key Challenges for Councils in Transition?',
    answer: 'Digital transformation (merging systems), dual delivery (operating while merging), strategic collaborative leadership, and maintaining "business as usual" for residents.',
    category: 'impact',
    relatedPath: '/lessons',
    relatedLabel: 'Lessons learned'
  },
  {
    question: 'How Will LGR Affect My Local Services?',
    answer: 'Residents should see better integration (e.g., waste and housing in one place), but there may be changes to office locations, contact numbers, and unified policies for services like planning.',
    category: 'impact',
    relatedPath: '/beginners-guide',
    relatedLabel: 'Beginners guide'
  }
];

/** About/leadership FAQs for the standalone FAQ page */
export interface AboutFAQItem {
  question: string;
  answer: string;
  relatedPath: string;
  relatedLabel: string;
}

export interface AboutFAQSection {
  label: string;
  items: AboutFAQItem[];
  profilePath: string;
}

export const aboutFaqData: AboutFAQSection[] = [
  {
    label: 'Rowan Cole',
    profilePath: '/rowan-cole-local-government-reorganisation',
    items: [
      {
        question: "What is Rowan Cole's role in Local Government Reorganisation analysis?",
        answer: 'Rowan Cole serves as Editorial Lead of the Local Government Reorganisation Initiative, overseeing research and policy analysis on unitary authority creation and council restructuring in England.',
        relatedPath: '/rowan-cole-local-government-reorganisation',
        relatedLabel: 'Rowan Cole profile',
      },
      {
        question: 'What experience does Rowan Cole bring to council restructuring?',
        answer: 'His experience spans elected office, senior advisory roles, planning policy communications and governance consultancy, providing practical insight into executive leadership, scrutiny and planning committee decision making.',
        relatedPath: '/rowan-cole-local-government-reorganisation',
        relatedLabel: 'Rowan Cole profile',
      },
      {
        question: 'Does Rowan Cole advise on Section 114 contexts?',
        answer: 'He advises on managing internal stakeholders and external communications in Section 114 and other high-pressure contexts. He specialises in communications, engagement and accountability.',
        relatedPath: '/rowan-cole-local-government-reorganisation',
        relatedLabel: 'Rowan Cole profile',
      },
      {
        question: 'How does planning reform intersect with Local Government Reorganisation?',
        answer: 'He examines how restructuring affects Local Plan timetables, development management performance and democratic accountability within planning systems.',
        relatedPath: '/rowan-cole-local-government-reorganisation',
        relatedLabel: 'Rowan Cole profile',
      },
    ],
  },
  {
    label: 'Professor Amelia Hadfield',
    profilePath: '/professor-amelia-hadfield-governance-reform',
    items: [
      {
        question: "What is Professor Amelia Hadfield's role in the Local Government Reorganisation Initiative?",
        answer: 'She serves as Senior Academic and Policy Adviser, providing comparative governance expertise and academic oversight.',
        relatedPath: '/professor-amelia-hadfield-governance-reform',
        relatedLabel: 'Professor Amelia Hadfield profile',
      },
      {
        question: 'What expertise does Professor Hadfield contribute to Local Government Reorganisation analysis?',
        answer: 'Her scholarship covers sovereignty, institutional restructuring and multi level governance systems, offering comparative perspective on structural reform in the United Kingdom.',
        relatedPath: '/professor-amelia-hadfield-governance-reform',
        relatedLabel: 'Professor Amelia Hadfield profile',
      },
      {
        question: 'Why is comparative governance relevant to English council restructuring?',
        answer: 'Comparative analysis demonstrates how institutional design choices affect democratic accountability, executive authority and public legitimacy during structural transition.',
        relatedPath: '/professor-amelia-hadfield-governance-reform',
        relatedLabel: 'Professor Amelia Hadfield profile',
      },
      {
        question: "What is Professor Hadfield's experience in policy advisory environments?",
        answer: 'She holds senior university leadership roles and contributes to international governance and sustainability initiatives, linking academic research with applied policy contexts.',
        relatedPath: '/professor-amelia-hadfield-governance-reform',
        relatedLabel: 'Professor Amelia Hadfield profile',
      },
    ],
  },
  {
    label: 'Oliver Deed',
    profilePath: '/oliver-deed-strategic-communications-local-government',
    items: [
      {
        question: "What is Oliver Deed's role in the Local Government Reorganisation Initiative?",
        answer: 'Oliver Deed contributes strategic communications and stakeholder engagement expertise to the Initiative, focusing on how governance reform and council restructuring are communicated to residents and stakeholders.',
        relatedPath: '/oliver-deed-strategic-communications-local-government',
        relatedLabel: 'Oliver Deed profile',
      },
      {
        question: 'What experience does Oliver Deed have in public sector communications?',
        answer: 'He has led communications and engagement strategies for local authorities, regeneration bodies and infrastructure projects in the United Kingdom and Australia.',
        relatedPath: '/oliver-deed-strategic-communications-local-government',
        relatedLabel: 'Oliver Deed profile',
      },
      {
        question: 'Why is communications strategy important during Local Government Reorganisation?',
        answer: 'Structural reform can create uncertainty and political sensitivity. Clear, consistent communication helps maintain public confidence, democratic legitimacy and stakeholder trust during transition.',
        relatedPath: '/oliver-deed-strategic-communications-local-government',
        relatedLabel: 'Oliver Deed profile',
      },
      {
        question: 'What sectors has Oliver Deed worked across?',
        answer: 'He has worked across residential development, infrastructure, regeneration and public sector projects, advising both public authorities and private sector partners.',
        relatedPath: '/oliver-deed-strategic-communications-local-government',
        relatedLabel: 'Oliver Deed profile',
      },
    ],
  },
];

/** All FAQ items flattened for FAQPage schema (LGR + about) */
export function getAllFaqItemsForSchema(): { question: string; answer: string }[] {
  const lgr = faqData.map((item) => ({
    question: item.question,
    answer: stripHtmlForSchema(item.answer),
  }));
  const about = aboutFaqData.flatMap((section) => section.items);
  return [...lgr, ...about];
}

/** Strip HTML for schema.org (text fields should be plain text) */
export function stripHtmlForSchema(html: string): string {
  let text = html.replace(/<[^>]*>/g, '');
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\s+/g, ' ').trim();
}
