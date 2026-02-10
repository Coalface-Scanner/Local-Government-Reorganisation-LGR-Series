export interface CaseStudySource {
  title: string;
  url: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  context: string;
  whatWorked?: string;
  whatWentWrong?: string;
  whatHasNotWorked?: string;
  whyItMatters: string;
  keyLesson: string;
  sources: CaseStudySource[];
}

export const caseStudiesData: CaseStudy[] = [
  {
    id: 'northamptonshire',
    title: 'Case Study: North and West Northamptonshire',
    subtitle: 'A rescue reorganisation where governance discipline prevented further failure',
    context: 'North and West Northamptonshire Councils were established in April 2021 following the financial collapse of Northamptonshire County Council. The county became the first authority in two decades to issue a Section 114 notice in 2018. An independent inspection concluded that the authority had failed its best value duty and that reorganisation into two unitaries was the only viable route to restore control. This was not an efficiency driven reform. It was a corrective intervention designed to stabilise governance, finances and service delivery.',
    whatWorked: 'From the outset, both councils prioritised governance discipline over transformation rhetoric. Planning services were consolidated into single authority wide teams, reducing friction between legacy departments. Schemes of delegation were tightened, committee structures simplified, and decision making routes made explicit. Political stability following the 2021 elections enabled this approach. Clear majorities allowed leadership to impose clarity rather than compromise. While planning performance did not improve dramatically, it became more consistent and resilient after years of volatility. Governance discipline extended beyond planning. Children\'s Services, a major risk area, was deliberately separated into an arm\'s length trust to contain failure and protect the new councils.',
    whyItMatters: 'Success in Northamptonshire is best understood as failure avoided. The reorganisation stopped a pattern of systemic breakdown and restored basic institutional control.',
    keyLesson: 'Where governance clarity is imposed early and consistently, unitary structures can stabilise even severely distressed planning systems.',
    sources: [
      { title: 'Max Caller CBE, Independent Inspection of Northamptonshire County Council (2018)', url: 'https://www.gov.uk/government/publications/inspection-of-northamptonshire-county-council' },
      { title: 'Ministry of Housing, Communities and Local Government, Northamptonshire Structural Change Orders', url: 'https://www.legislation.gov.uk/uksi/2020/1501/contents/made' },
      { title: 'Grant Thornton, External Audit Reports – Northamptonshire successor councils', url: 'https://www.grantthornton.co.uk/insights/local-government-audit-reports/' },
      { title: 'Department for Levelling Up, Housing and Communities, Intervention and Oversight in Northamptonshire', url: 'https://www.gov.uk/government/collections/northamptonshire-county-council-intervention' },
      { title: 'West Northamptonshire Council, Strategic Plan and Planning Governance', url: 'https://www.westnorthants.gov.uk/your-council/strategies-plans-and-policies' },
      { title: 'North Northamptonshire Council, Planning Policy and Joint Planning Unit', url: 'https://www.northnorthants.gov.uk/planning-policy' },
      { title: 'Northamptonshire Children\'s Trust', url: 'https://www.nctrust.co.uk/' },
      { title: 'Local Government Association, Case study: Northamptonshire reorganisation', url: 'https://www.local.gov.uk/case-studies/northamptonshire-local-government-reform' },
    ],
  },
  {
    id: 'somerset',
    title: 'Case Study: Somerset Council',
    subtitle: 'When reorganisation embeds delay rather than removing it',
    context: 'Somerset Council became a unitary authority in April 2023, replacing one county and four district councils. The reform was driven by efficiency and savings, with a projected £18.5 million annual benefit. Unlike Northamptonshire, this was not a rescue exercise but a structural merger undertaken from a position of relative stability.',
    whatWentWrong: 'Early governance design prioritised continuity with legacy arrangements over operational clarity. Four area based planning committees were established broadly along former district lines. While intended to preserve local identity, this replicated silos and blurred accountability. The Scheme of Delegation proved weak for a unitary authority. Scrutiny reports noted excessive call ins to committee and inconsistent thresholds for decision making. Planning delays followed, affecting applications beyond known policy constraints such as nutrient neutrality. These issues were compounded by wider pressures. Somerset declared a financial emergency within its first year, triggering voluntary redundancies that reduced senior planning capacity. At the same time, multiple legacy planning IT systems were retained, embedding confusion and slowing validation and reporting.',
    whyItMatters: 'Somerset demonstrates that reorganisation can degrade planning performance where governance design is deferred or diluted. Structural change amplified existing complexity instead of resolving it.',
    keyLesson: 'Without firm delegation, clear reporting lines and unified systems, reorganisation scales up delay rather than removing it.',
    sources: [
      { title: 'One Somerset Business Case', url: 'https://www.somerset.gov.uk/organisation/one-somerset/' },
      { title: 'UK Government, Somerset Structural Change Order', url: 'https://www.legislation.gov.uk/uksi/2022/1139/contents/made' },
      { title: 'Somerset Council, Scrutiny Committee papers on planning performance', url: 'https://democracy.somerset.gov.uk/' },
      { title: 'Somerset Council, Scheme of Delegation and Constitution', url: 'https://www.somerset.gov.uk/organisation/constitution/' },
      { title: 'Somerset Council, Medium Term Financial Strategy and Financial Emergency Declaration', url: 'https://www.somerset.gov.uk/organisation/budget-and-financial-plans/' },
      { title: 'Local Government Chronicle, Somerset Council declares financial emergency', url: 'https://www.lgcplus.com/finance/somerset-declares-financial-emergency-05-12-2023/' },
      { title: 'Somerset Council, Planning Committees and Area Structures', url: 'https://www.somerset.gov.uk/planning-buildings-and-land/planning-committees/' },
      { title: 'Public Finance, Somerset\'s first year as a unitary authority', url: 'https://www.publicfinance.co.uk/' },
    ],
  },
  {
    id: 'dorset',
    title: 'Case Study: Dorset Council',
    subtitle: 'Stability achieved, reform slowed by political and policy inertia',
    context: 'Dorset Council became a unitary authority in April 2019, replacing one county council and six district and borough councils. Unlike Northamptonshire, the reorganisation was not triggered by financial collapse. Unlike Somerset, it was not a rapid efficiency merger. Dorset entered reorganisation with relatively stable finances but acute long term pressures, particularly an ageing population significantly above the national average and rising demand on frontline services. Reorganisation was intended to simplify governance, protect services and create a more coherent platform for planning and growth.',
    whatWorked: 'Dorset delivered substantial structural simplification. Senior management and back office functions were consolidated, generating reported cumulative savings of over £96 million by 2024–25. Governance arrangements are materially clearer than under the former two tier system. Digitally, Dorset has been a quiet success. The council completed the merger of six legacy planning systems into a single cloud based platform, migrating decades of historic data. This is widely cited as a strong example of digital first planning transformation and has improved operational resilience and customer access.',
    whatHasNotWorked: 'Policy convergence has stalled. Six years after vesting day, planning decisions are still taken against multiple legacy Local Plans. A single replacement Local Plan, originally intended for adoption by the mid 2020s, is now projected for 2027. This has contributed to uncertainty around housing supply, speculative applications and increased appeal risk. While early realism about the scale of convergence was sensible, it has hardened into inertia. Political resistance around housing numbers and Green Belt impacts has slowed progress, allowing complexity to persist.',
    whyItMatters: 'Dorset demonstrates that reorganisation can stabilise governance and modernise systems without delivering policy reform.',
    keyLesson: 'Unitary status buys time and coherence. Without sustained political resolve, it does not guarantee transformation.',
    sources: [
      { title: 'Dorset (Structural Changes) Order 2018', url: 'https://www.legislation.gov.uk/uksi/2018/1287/contents/made' },
      { title: 'Dorset Council Plan (post vesting strategic framework)', url: 'https://www.dorsetcouncil.gov.uk/council-and-democracy/our-council/council-plan' },
      { title: 'Dorset Council Medium Term Financial Plan', url: 'https://www.dorsetcouncil.gov.uk/council-and-democracy/budget-and-council-tax' },
      { title: 'Dorset Council Transformation and Savings Reports (Cabinet and Scrutiny)', url: 'https://moderngov.dorsetcouncil.gov.uk/' },
      { title: 'Local Government Association analysis on Dorset savings and reorganisation outcomes', url: 'https://www.local.gov.uk/topics/devolution-and-lgr' },
      { title: 'Dorset Council Planning Convergence and Transformation Programme', url: 'https://moderngov.dorsetcouncil.gov.uk/' },
      { title: 'Dorset Council Digital and IT Transformation Programme', url: 'https://www.dorsetcouncil.gov.uk/council-and-democracy/transformation' },
      { title: 'Local Government Association case studies on digital first planning', url: 'https://www.local.gov.uk/our-support/digital-and-technology' },
      { title: 'Dorset Council Local Development Scheme (latest edition)', url: 'https://www.dorsetcouncil.gov.uk/planning-buildings-land/planning-policy/local-development-scheme' },
      { title: 'Planning Inspectorate correspondence and examination updates', url: 'https://www.gov.uk/government/organisations/planning-inspectorate' },
      { title: 'National Planning Policy Framework and Planning Practice Guidance', url: 'https://www.gov.uk/government/collections/planning-practice-guidance' },
      { title: 'Office for National Statistics, Dorset population profile', url: 'https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates' },
      { title: 'Institute for Government, Local government reorganisation outcomes', url: 'https://www.instituteforgovernment.org.uk/explainer/local-government-reorganisation' },
    ],
  },
];
