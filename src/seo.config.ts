// src/seo.config.ts
// ============================================================
// Central SEO configuration for all pages.
// SEOHead.tsx, the sitemap generator, and the Vite prerender
// config all read from this file.
//
// DYNAMIC ROUTES (/insights/:slug, /glossary/:slug, etc.)
// are NOT listed here — they need to be generated at build
// time from Supabase. See generate-sitemap.ts for that.
// ============================================================

export interface PageSEO {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  schemaType?: "WebPage" | "Article" | "FAQPage" | "Organization" | "CollectionPage";
  datePublished?: string;
  dateModified?: string;
  sitemapPriority?: number;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  /** Set to false to exclude from sitemap (e.g. admin pages) */
  indexable?: boolean;
}

// ============================================================
// SITE-WIDE DEFAULTS
// ============================================================
export const SITE_URL = "https://localgovernmentreorganisation.co.uk";
export const SITE_NAME = "LGR Initiative";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;
export const TWITTER_HANDLE = "@LGRInitiative";
export const DEFAULT_LOCALE = "en_GB";

// ============================================================
// PAGE SEO DATA — STATIC ROUTES
// ============================================================
export const pages: Record<string, PageSEO> = {

  // ── CORE ────────────────────────────────────────────────
  home: {
    title: "Local Government Reorganisation | LGR Initiative — Research & Guidance",
    description: "Independent research and practical guidance on Local Government Reorganisation. Toolkits, the First 100 Days guide, governance analysis and data for councillors and officers navigating England's shift to unitary authorities.",
    path: "/",
    schemaType: "Organization",
    sitemapPriority: 1.0,
    changefreq: "weekly",
  },

  // ── HUBS ────────────────────────────────────────────────
  learn: {
    title: "Learn About LGR | Local Government Reorganisation Initiative",
    description: "Educational resources on local government reorganisation — what it means, how it works, and what councillors, officers and residents need to know.",
    path: "/learn",
    schemaType: "CollectionPage",
    sitemapPriority: 0.8,
    changefreq: "weekly",
  },
  discover: {
    title: "Discover | LGR Initiative",
    description: "Explore local government reorganisation topics, tools and insights across England's transition to unitary authorities.",
    path: "/discover",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "weekly",
  },
  research: {
    title: "Research | LGR Initiative — Local Government Reorganisation Research",
    description: "Cutting-edge research on local government reorganisation including surveys, governance analysis, and evidence from areas undergoing LGR across England.",
    path: "/research",
    schemaType: "CollectionPage",
    sitemapPriority: 0.8,
    changefreq: "weekly",
  },
  library: {
    title: "Library | LGR Initiative — Search Reports, Data & Resources",
    description: "Search the LGR Initiative library for reports, analysis, data and resources on local government reorganisation across England.",
    path: "/library",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "weekly",
  },

  // ── FACTS & DATA ────────────────────────────────────────
  factsTimescales: {
    title: "LGR Timescales | When Local Government Reorganisation Happens",
    description: "Key dates and timescales for local government reorganisation across England — from interim proposals to elections and vesting day for new unitary authorities.",
    path: "/facts/timescales",
    schemaType: "Article",
    sitemapPriority: 0.8,
    changefreq: "weekly",
  },
  factsCouncilsInvolved: {
    title: "Councils Involved in LGR | Which Areas Are Reorganising",
    description: "A complete list of councils involved in local government reorganisation, including two-tier areas invited to submit proposals for unitary authorities.",
    path: "/facts/councils-involved",
    schemaType: "Article",
    sitemapPriority: 0.8,
    changefreq: "weekly",
  },
  factsKeyFacts: {
    title: "Key Facts About LGR | Local Government Reorganisation Data",
    description: "Essential facts and figures on local government reorganisation — population thresholds, council numbers, cost estimates and the scale of structural change.",
    path: "/facts/key-facts",
    schemaType: "Article",
    sitemapPriority: 0.8,
    changefreq: "monthly",
  },
  factsMethodology: {
    title: "Methodology | How LGR Initiative Research Is Conducted",
    description: "Our research methodology for analysing local government reorganisation — data sources, analytical frameworks and approach to evidence-based guidance.",
    path: "/facts/methodology",
    schemaType: "WebPage",
    sitemapPriority: 0.4,
    changefreq: "yearly",
  },
  factsSources: {
    title: "Sources | LGR Initiative Data & Research Sources",
    description: "Data sources and references used across LGR Initiative research and analysis on local government reorganisation.",
    path: "/facts/sources",
    schemaType: "WebPage",
    sitemapPriority: 0.4,
    changefreq: "monthly",
  },
  factsFurtherReading: {
    title: "Further Reading on Local Government Reorganisation",
    description: "Recommended reading on LGR — reports, academic papers, government publications and sector commentary on local government reorganisation.",
    path: "/facts/further-reading",
    schemaType: "WebPage",
    sitemapPriority: 0.5,
    changefreq: "monthly",
  },
  factsCouncilopedia: {
    title: "Councilopedia | Council Profiles & LGR Data",
    description: "Detailed profiles of councils involved in local government reorganisation — population, services, political control and reorganisation status.",
    path: "/facts/councilopedia",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "weekly",
  },
  factsLgrTimeline: {
    title: "LGR Timeline | History of Local Government Reorganisation in England",
    description: "A timeline of local government reorganisation in England from the 1960s to the present wave of unitary authority creation.",
    path: "/facts/lgr-timeline",
    schemaType: "Article",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  factsCouncilCases: {
    title: "Council Cases | LGR Case Studies by Area",
    description: "Case studies of local government reorganisation across England — what happened, what worked, and lessons for areas currently undergoing change.",
    path: "/facts/council-cases",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  factsAndData: {
    title: "Facts and Data | LGR Initiative",
    description: "Data, statistics and factual analysis on local government reorganisation across England.",
    path: "/facts-and-data",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "weekly",
  },

  // ── GUIDES & EXPLAINERS ─────────────────────────────────
  whatIsLgr: {
    title: "What Is Local Government Reorganisation (LGR)? | Explained",
    description: "A clear explanation of local government reorganisation — what it means, why it's happening, and how two-tier councils are being replaced by unitary authorities across England.",
    path: "/what-is-lgr",
    schemaType: "Article",
    sitemapPriority: 0.9,
    changefreq: "monthly",
  },
  beginnersGuide: {
    title: "Beginner's Guide to LGR | Local Government Reorganisation Explained Simply",
    description: "New to local government reorganisation? A plain-English guide covering what LGR is, who's affected, and what it means for residents, councillors and council staff.",
    path: "/beginners-guide",
    schemaType: "Article",
    sitemapPriority: 0.9,
    changefreq: "monthly",
  },
  questionsAndAnswers: {
    title: "LGR Questions and Answers | Common Questions About Reorganisation",
    description: "Answers to the most common questions about local government reorganisation — from council tax to job security, elections and service changes.",
    path: "/questions-and-answers",
    schemaType: "FAQPage",
    sitemapPriority: 0.8,
    changefreq: "monthly",
  },
  faq: {
    title: "FAQ | Local Government Reorganisation Initiative",
    description: "Frequently asked questions about the LGR Initiative, our research, and local government reorganisation in England.",
    path: "/faq",
    schemaType: "WebPage",
    sitemapPriority: 0.3,
    changefreq: "monthly",
  },
  first100Days: {
    title: "First 100 Days of a New Unitary Council | LGR Playbook",
    description: "A practical guide for councillors and officers in new unitary authorities — priorities, governance setup, service continuity and stakeholder engagement from day one.",
    path: "/first-100-days",
    schemaType: "Article",
    sitemapPriority: 0.9,
    changefreq: "monthly",
  },
  glossary: {
    title: "LGR Glossary | Local Government Reorganisation Terms Explained",
    description: "A glossary of local government reorganisation terminology — from unitary authorities and vesting day to shadow councils, strategic authorities and devolution.",
    path: "/glossary",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },

  // ── NAVIGATION / TOPIC HUBS ─────────────────────────────
  councilopedia: {
    title: "Councilopedia | Council Profiles & LGR Data",
    description: "Detailed profiles of councils involved in local government reorganisation.",
    path: "/councilopedia",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "weekly",
  },
  roadmap: {
    title: "LGR Journey Map | Reorganisation Roadmap 2025–2028",
    description: "A visual roadmap of the local government reorganisation journey — key milestones from proposals through to elections and the launch of new unitary authorities.",
    path: "/roadmap",
    schemaType: "Article",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  lgrHub: {
    title: "LGR Hub | Central Resource for Local Government Reorganisation",
    description: "The central hub for LGR Initiative resources — research, guides, data, tools and analysis on local government reorganisation across England.",
    path: "/lgr-hub",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "weekly",
  },
  reorganisations: {
    title: "Reorganisations | Past and Present LGR Across England",
    description: "An overview of local government reorganisation programmes across England — current proposals, historical rounds, and outcomes.",
    path: "/reorganisations",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  reasons: {
    title: "Why Local Government Reorganisation? | The Case for LGR",
    description: "The arguments for and against local government reorganisation — efficiency savings, service improvement, democratic accountability and the risks of structural change.",
    path: "/reasons",
    schemaType: "Article",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },

  // ── LESSONS ─────────────────────────────────────────────
  lessons: {
    title: "Lessons from LGR | What Previous Reorganisations Teach Us",
    description: "Lessons from past rounds of local government reorganisation — what worked, what failed, and what current areas can learn from previous unitary transitions.",
    path: "/lessons",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "weekly",
  },
  lessonsInsights: {
    title: "LGR Insights | Analysis from Previous Reorganisations",
    description: "Analytical insights drawn from previous rounds of local government reorganisation across England.",
    path: "/lessons/insights",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  lessonsCaseStudies: {
    title: "LGR Case Studies | Lessons from Past Reorganisations",
    description: "Detailed case studies from past local government reorganisations — Somerset, Dorset, Buckinghamshire, North Yorkshire and more.",
    path: "/lessons/case-studies",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  lessonsBestPractices: {
    title: "LGR Best Practices | What Works in Local Government Reorganisation",
    description: "Evidence-based best practices for local government reorganisation — governance design, service integration, staff transitions and community engagement.",
    path: "/lessons/best-practices",
    schemaType: "Article",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },

  // ── INSIGHTS & NEWS ─────────────────────────────────────
  insights: {
    title: "Insights | LGR Initiative Commentary & Analysis",
    description: "Commentary, analysis and opinion on local government reorganisation from the LGR Initiative team and contributors.",
    path: "/insights",
    schemaType: "CollectionPage",
    sitemapPriority: 0.8,
    changefreq: "daily",
  },
  insightsReports: {
    title: "Reports | LGR Initiative Research Publications",
    description: "Published reports and research papers from the LGR Initiative on local government reorganisation, governance and devolution.",
    path: "/insights/reports",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  news: {
    title: "News | LGR Initiative — Local Government Reorganisation Updates",
    description: "The latest news on local government reorganisation across England — government announcements, council decisions, elections and analysis.",
    path: "/news",
    schemaType: "CollectionPage",
    sitemapPriority: 0.8,
    changefreq: "daily",
  },

  // ── TOPICS ──────────────────────────────────────────────
  topics: {
    title: "Topics | LGR Initiative — Local Government Reorganisation Themes",
    description: "Browse local government reorganisation by topic — governance, democracy, reform, devolution and more.",
    path: "/topics",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  topicsLocalGovernment: {
    title: "Local Government | LGR Initiative Topic",
    description: "Research and analysis on local government structure, services and reform in the context of reorganisation.",
    path: "/topics/local-government",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  topicsDemocracy: {
    title: "Democracy & Local Government Reorganisation | LGR Initiative",
    description: "How local government reorganisation affects democratic representation, councillor-to-resident ratios, and community voice.",
    path: "/topics/democracy",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  topicsGovernanceReform: {
    title: "Governance and Reform | LGR Initiative Topic",
    description: "Governance models, committee systems, cabinet structures and reform approaches in new unitary authorities.",
    path: "/topics/governance-and-reform",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  topicsDemocraticLegitimacy: {
    title: "Democratic Legitimacy in LGR | Accountability & Representation",
    description: "Analysis of democratic legitimacy challenges in local government reorganisation — larger wards, fewer councillors, and maintaining accountability.",
    path: "/topics/democratic-legitimacy",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  topicsStatecraft: {
    title: "Statecraft and System Design | LGR Initiative Topic",
    description: "How to design governance systems for new unitary authorities — balancing efficiency, accountability and local identity.",
    path: "/topics/statecraft-and-system-design",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },

  // ── SURREY ──────────────────────────────────────────────
  surrey: {
    title: "Surrey LGR Hub | Local Government Reorganisation in Surrey",
    description: "Surrey's local government reorganisation — the first area on the accelerated LGR timeline with elections in May 2026 and new East and West Surrey councils from April 2027.",
    path: "/surrey",
    schemaType: "WebPage",
    sitemapPriority: 0.9,
    changefreq: "weekly",
  },
  surreyLessons: {
    title: "Lessons for Surrey LGR | What Surrey Can Learn from Past Reorganisations",
    description: "Lessons from past reorganisations applied to Surrey's accelerated transition to unitary authorities.",
    path: "/surrey/lessons",
    schemaType: "Article",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  surreyAreaProfile: {
    title: "Surrey Council Profiles | Area Profiles for Surrey LGR",
    description: "Profiles of Surrey's district, borough and county councils — population, services, budgets and reorganisation status.",
    path: "/surrey/area-profile",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  surreyElectionTracker: {
    title: "Surrey Election Tracker 2026 | LGR Elections May 2026",
    description: "Track the May 2026 elections for Surrey's new unitary authorities — candidates, wards, results and analysis.",
    path: "/surrey/election-tracker",
    schemaType: "WebPage",
    sitemapPriority: 0.8,
    changefreq: "weekly",
  },
  surreyElectionSimulator: {
    title: "Surrey Election Simulator | Model LGR Election Outcomes",
    description: "An interactive simulator for modelling election outcomes in Surrey's new unitary authorities.",
    path: "/surrey/election-tracker/simulator",
    schemaType: "WebPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  surreyHub: {
    title: "Surrey Hub | Surrey LGR Resources & Updates",
    description: "Central hub for Surrey local government reorganisation resources, updates and analysis.",
    path: "/surrey/hub",
    schemaType: "WebPage",
    sitemapPriority: 0.7,
    changefreq: "weekly",
  },

  // ── ABOUT ───────────────────────────────────────────────
  about: {
    title: "About the LGR Initiative | COALFACE & University of Surrey",
    description: "The LGR Initiative is a partnership between Coalface Engagement and the University of Surrey's Centre for Britain and Europe, producing independent research on local government reorganisation.",
    path: "/about",
    schemaType: "WebPage",
    sitemapPriority: 0.7,
    changefreq: "monthly",
  },
  aboutOverview: {
    title: "Overview | About the LGR Initiative",
    description: "An overview of the LGR Initiative — our mission, approach and research programme on local government reorganisation.",
    path: "/about/overview",
    schemaType: "WebPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  partnerships: {
    title: "Partnerships | LGR Initiative",
    description: "The LGR Initiative's research and sector partnerships supporting local government reorganisation.",
    path: "/partnerships",
    schemaType: "WebPage",
    sitemapPriority: 0.5,
    changefreq: "monthly",
  },
  aboutPartnership: {
    title: "Our Partnership | COALFACE & Centre for Britain and Europe",
    description: "About the partnership between Coalface Engagement and the University of Surrey's Centre for Britain and Europe.",
    path: "/about/partnership",
    schemaType: "WebPage",
    sitemapPriority: 0.5,
    changefreq: "yearly",
  },
  aboutContributors: {
    title: "Contributors | LGR Initiative",
    description: "Meet the contributors to the LGR Initiative's research and analysis on local government reorganisation.",
    path: "/about/contributors",
    schemaType: "WebPage",
    sitemapPriority: 0.5,
    changefreq: "monthly",
  },
  aboutContribute: {
    title: "How to Contribute | LGR Initiative",
    description: "Contribute to the LGR Initiative — how researchers, practitioners and local government professionals can get involved.",
    path: "/about/contributors/contribute",
    schemaType: "WebPage",
    sitemapPriority: 0.4,
    changefreq: "yearly",
  },
  aboutLeadership: {
    title: "Leadership Team | LGR Initiative",
    description: "The leadership team behind the LGR Initiative — researchers, practitioners and sector specialists driving the programme.",
    path: "/about/leadership",
    schemaType: "WebPage",
    sitemapPriority: 0.5,
    changefreq: "monthly",
  },

  // ── PEOPLE PROFILES ─────────────────────────────────────
  rowanCole: {
    title: "Rowan Cole | Local Government Reorganisation — LGR Initiative Lead",
    description: "Rowan Cole is the co-lead of the LGR Initiative, former Surrey Councillor and founder of Coalface Engagement, specialising in local government reorganisation and governance.",
    path: "/rowan-cole-local-government-reorganisation",
    schemaType: "WebPage",
    sitemapPriority: 0.5,
    changefreq: "yearly",
  },
  ameliaHadfield: {
    title: "Professor Amelia Hadfield | Governance Reform — LGR Initiative",
    description: "Professor Amelia Hadfield is co-lead of the LGR Initiative and Director of the Centre for Britain and Europe at the University of Surrey.",
    path: "/professor-amelia-hadfield-governance-reform",
    schemaType: "WebPage",
    sitemapPriority: 0.5,
    changefreq: "yearly",
  },
  oliverDeed: {
    title: "Oliver Deed | Strategic Communications & Local Government",
    description: "Oliver Deed contributes strategic communications expertise to the LGR Initiative's work on local government reorganisation.",
    path: "/oliver-deed-strategic-communications-local-government",
    schemaType: "WebPage",
    sitemapPriority: 0.4,
    changefreq: "yearly",
  },
  matthewMasters: {
    title: "Matthew Masters | Local Government Leadership",
    description: "Matthew Masters brings local government leadership experience to the LGR Initiative.",
    path: "/matthew-masters-local-government-leadership",
    schemaType: "WebPage",
    sitemapPriority: 0.4,
    changefreq: "yearly",
  },
  charlieMoir: {
    title: "Charlie Moir | Digital Engagement & Local Government",
    description: "Charlie Moir leads digital engagement for the LGR Initiative's work on local government reorganisation.",
    path: "/charlie-moir-digital-engagement-local-government",
    schemaType: "WebPage",
    sitemapPriority: 0.4,
    changefreq: "yearly",
  },

  // ── TOOLS & UTILITIES ───────────────────────────────────
  tools: {
    title: "LGR Tools | Interactive Tools for Local Government Reorganisation",
    description: "Interactive tools for understanding and navigating local government reorganisation — election simulators, data explorers and more.",
    path: "/tools",
    schemaType: "CollectionPage",
    sitemapPriority: 0.6,
    changefreq: "monthly",
  },
  podcast: {
    title: "Podcast & Interviews | LGR Initiative",
    description: "Podcast episodes and interviews with local government leaders, councillors and experts on reorganisation and devolution.",
    path: "/podcast",
    schemaType: "CollectionPage",
    sitemapPriority: 0.7,
    changefreq: "weekly",
  },

  // ── CONTACT / SUBSCRIBE ─────────────────────────────────
  contact: {
    title: "Contact the LGR Initiative | Get in Touch",
    description: "Contact the LGR Initiative team for research partnerships, media enquiries, or to contribute to the programme.",
    path: "/contact",
    schemaType: "WebPage",
    sitemapPriority: 0.4,
    changefreq: "yearly",
  },
  subscribe: {
    title: "Subscribe | LGR Initiative Newsletter",
    description: "Subscribe to the LGR Initiative newsletter for weekly updates on local government reorganisation research and analysis.",
    path: "/subscribe",
    schemaType: "WebPage",
    sitemapPriority: 0.4,
    changefreq: "yearly",
  },
  unsubscribe: {
    title: "Unsubscribe | LGR Initiative",
    description: "Unsubscribe from the LGR Initiative mailing list.",
    path: "/unsubscribe",
    schemaType: "WebPage",
    sitemapPriority: 0.0,
    changefreq: "yearly",
    indexable: false,
  },

  // ── ADMIN (not indexed) ─────────────────────────────────
  adminLogin: {
    title: "Admin Login",
    description: "",
    path: "/admin/login",
    sitemapPriority: 0.0,
    changefreq: "yearly",
    indexable: false,
  },
  adminDashboard: {
    title: "Admin Dashboard",
    description: "",
    path: "/admin/dashboard",
    sitemapPriority: 0.0,
    changefreq: "yearly",
    indexable: false,
  },
  adminArticlesLogin: {
    title: "Article Editor Login",
    description: "",
    path: "/admin/articles/login",
    sitemapPriority: 0.0,
    changefreq: "yearly",
    indexable: false,
  },
  adminArticles: {
    title: "Article Editor",
    description: "",
    path: "/admin/articles",
    sitemapPriority: 0.0,
    changefreq: "yearly",
    indexable: false,
  },
};

// ============================================================
// HELPERS
// ============================================================

/** All paths that should be pre-rendered (excludes admin) */
export function getPrerenderPaths(): string[] {
  return Object.values(pages)
    .filter((p) => p.indexable !== false)
    .map((p) => p.path);
}

/** All paths for sitemap (excludes admin + noindex pages) */
export function getSitemapEntries(): PageSEO[] {
  return Object.values(pages).filter(
    (p) => p.indexable !== false && (p.sitemapPriority ?? 0.5) > 0
  );
}

/** All paths including admin (for the full prerender route list) */
export function getAllPaths(): string[] {
  return Object.values(pages).map((p) => p.path);
}
