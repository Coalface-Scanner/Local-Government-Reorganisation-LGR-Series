export interface BreadcrumbItem {
  label: string;
  path?: string;
}

/** Map path segments (or segment in context) to display labels for breadcrumbs */
const SEGMENT_LABELS: Record<string, string> = {
  about: 'About',
  overview: 'Overview',
  leadership: 'LGR Initiative Leadership',
  partnership: 'Our Partnership',
  methodology: 'Research Methodology',
  contribute: 'How to Contribute',
  contributors: 'Contributors & Authors',
  partnerships: 'Partnerships',
  learn: 'Learn',
  discover: 'Discover',
  research: 'Research',
  insights: 'Insights',
  reports: 'Reports',
  tools: 'Tools',
  'facts-and-data': 'Facts & Data',
  'what-is-lgr': 'What is LGR?',
  'beginners-guide': 'Beginners Guide',
  'questions-and-answers': 'Questions & Answers',
  library: 'Search & Browse',
  roadmap: 'Journey Map',
  'lgr-hub': 'LGR Hub',
  reorganisations: 'Reorganisations',
  lessons: 'Lessons',
  topics: 'Topics',
  glossary: 'Glossary',
  contact: 'Contact',
  subscribe: 'Subscribe',
  unsubscribe: 'Unsubscribe',
  councils: 'Councils',
  'council-profiles': 'Council Profiles',
  surrey: 'Surrey LGR Hub',
  'area-profile': 'Area profile',
  'election-tracker': 'Election Tracker',
  hub: 'Surrey Hub',
  simulator: 'Simulator',
  'hundred-days': 'First 100 Days',
  'first-100-days': 'First 100 Days',
  news: 'News',
  podcast: 'Podcast',
  facts: 'Facts & Data',
  'key-facts': 'Key Facts',
  timescales: 'Timescales',
  sources: 'Sources',
  'further-reading': 'Further Reading',
  councilopedia: 'Councilopedia',
  'lgr-timeline': 'LGR Timeline',
  'council-cases': 'Council Cases',
  'councils-involved': 'Councils Involved',
  'local-government': 'Local Government',
  democracy: 'Democracy',
  'governance-and-reform': 'Governance and Reform',
  'democratic-legitimacy': 'Democratic Legitimacy',
  'statecraft-and-system-design': 'Statecraft and System Design',
  reasons: 'Reasons',
  'rowan-cole-local-government-reorganisation': 'Rowan Cole',
  'professor-amelia-hadfield-governance-reform': 'Professor Amelia Hadfield',
  'oliver-deed-strategic-communications-local-government': 'Oliver Deed',
  'matthew-masters-local-government-leadership': 'Matthew Masters',
  'charlie-moir-digital-engagement-local-government': 'Charlie Moir',
  admin: 'Admin',
  login: 'Login',
  dashboard: 'Dashboard',
  articles: 'Articles',
};

/** Convert slug to title case (e.g. "rowan-cole" -> "Rowan Cole") */
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get breadcrumb items for a pathname (trail after Home).
 * Home is not included; Breadcrumbs component prepends it.
 *
 * @param pathname - Current location pathname (e.g. /about/leadership/rowan-cole)
 * @param currentPageLabel - Optional label for the last segment (e.g. person name, article title)
 */
export function getBreadcrumbItems(
  pathname: string,
  currentPageLabel?: string
): BreadcrumbItem[] {
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (normalized === '/') return [];

  const segments = normalized.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];
  let accPath = '';

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const isLast = i === segments.length - 1;
    accPath += `/${segment}`;

    const label =
      isLast && currentPageLabel !== undefined
        ? currentPageLabel
        : SEGMENT_LABELS[segment] ?? slugToTitle(segment);

    if (isLast) {
      items.push({ label });
    } else {
      items.push({ label, path: accPath });
    }
  }

  return items;
}
