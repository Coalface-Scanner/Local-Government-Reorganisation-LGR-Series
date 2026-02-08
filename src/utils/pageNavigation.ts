import { NavItem } from '../components/PageBanner';

// Standard primary navigation items (same as old Navigation component)
// Primary nav items link to their hub pages, except Glossary which links directly
export function getStandardPrimaryNavItems(): NavItem[] {
  return [
    { label: 'LGR HUB', path: '/lgr-hub' },
    { label: 'TOPICS', path: '/topics' },
    { label: 'INSIGHTS', path: '/insights' },
    { label: 'FACTS & DATA', path: '/facts-and-data' },
    { label: 'GLOSSARY', path: '/glossary' }, // Glossary links directly, not to a hub
    { label: 'LESSONS', path: '/lessons' },
    { label: 'FOCUS: SURREY', path: '/surrey/hub' },
    { label: 'ABOUT', path: '/about' },
  ];
}

// Get secondary nav items for a specific primary nav item (dropdown content)
export function getSecondaryNavItemsForPrimaryNav(primaryNavId: string, pathname: string): NavItem[] {
  const fullPath = pathname;
  
  switch (primaryNavId) {
    case 'lgr-hub':
      return [
        { label: 'OVERVIEW', path: '/lgr-hub', active: fullPath === '/lgr-hub' || fullPath === '/' },
        { label: 'ROADMAP', path: '/roadmap' },
        { label: 'TOOLS', path: '/tools' },
        { label: 'PODCAST', path: '/podcast' },
        { label: '100 DAYS PLAYBOOK', path: '/100days' },
      ];
    
    case 'topics':
      return [
        { label: 'GOVERNANCE', path: '/topics/governance-and-reform', active: fullPath === '/topics/governance-and-reform' },
        { label: 'DEMOCRACY', path: '/topics/democratic-legitimacy', active: fullPath === '/topics/democratic-legitimacy' },
        { label: 'STATECRAFT', path: '/topics/statecraft-and-system-design', active: fullPath === '/topics/statecraft-and-system-design' },
        { label: 'BY GEOGRAPHY', path: '/topics' },
      ];
    
    case 'insights':
      return [
        { label: 'ALL INSIGHTS', path: '/insights', active: fullPath === '/insights' },
        { label: 'ARTICLES', path: '/insights', active: fullPath.startsWith('/insights/') && !fullPath.startsWith('/insights/reports') },
        { label: 'REPORTS', path: '/insights/reports', active: fullPath.startsWith('/insights/reports') },
        { label: 'NEWS', path: '/news', active: fullPath.startsWith('/news') },
        { label: 'PODCAST', path: '/podcast', active: fullPath.startsWith('/podcast') || fullPath.startsWith('/interviews') },
        { label: 'LIBRARY', path: '/library', active: fullPath === '/library' },
      ];
    
    case 'facts':
      return [
        { label: 'KEY FACTS', path: '/facts', active: fullPath.startsWith('/facts') && !fullPath.startsWith('/facts-and-data') },
        { label: 'FACTS & DATA', path: '/facts-and-data', active: fullPath === '/facts-and-data' },
        { label: 'MATERIALS & DATASETS', path: '/materials', active: fullPath.startsWith('/materials') },
        { label: 'COUNCIL MAP & PROFILES', path: '/councils', active: fullPath.startsWith('/councils') },
        { label: 'COUNCIL PROFILES', path: '/council-profiles', active: fullPath.startsWith('/council-profiles') },
        { label: 'REORGANISATIONS', path: '/reorganisations', active: fullPath.startsWith('/reorganisations') },
        { label: 'GLOSSARY', path: '/glossary', active: fullPath.startsWith('/glossary') },
      ];
    
    case 'surrey':
      return [
        { label: 'OVERVIEW', path: '/surrey', active: fullPath === '/surrey' },
        { label: 'SURREY HUB', path: '/surrey/hub', active: fullPath.startsWith('/surrey/hub') },
        { label: 'ELECTION TRACKER', path: '/surrey/election-tracker', active: fullPath.startsWith('/surrey/election-tracker') },
        { label: 'COUNCIL PROFILES', path: '/council-profiles', active: fullPath.startsWith('/council-profiles') },
      ];
    
    case 'about':
      return [
        { label: 'ABOUT THE LGR SERIES', path: '/about', active: fullPath === '/about' },
        { label: 'EDITOR PROFILE', path: '/editor/rowan-cole', active: fullPath === '/editor/rowan-cole' },
        { label: 'CONTRIBUTORS', path: '/about/contributors', active: fullPath === '/about/contributors' },
        { label: 'CONTRIBUTE', path: '/about/contribute', active: fullPath === '/about/contribute' },
        { label: 'ABOUT COALFACE', path: '/about/coalface', active: fullPath === '/about/coalface' },
        { label: 'METHODOLOGY', path: '/about/methodology', active: fullPath === '/about/methodology' },
        { label: 'CONTACT', path: '/contact', active: fullPath === '/contact' },
        { label: 'SUBSCRIBE', path: '/subscribe', active: fullPath === '/subscribe' },
      ];
    
    default:
      return [];
  }
}

export function getSecondaryNavItems(pathname: string): NavItem[] {
  // Remove leading slash and get base path
  const basePath = pathname.split('/')[1] || '';
  const fullPath = pathname;

  // News page
  if (basePath === 'news') {
    return [
      { label: 'COMMENT', path: '/news', active: true },
      { label: 'SUBSTACK', path: '/subscribe' },
      { label: 'PRESS', path: '/about' },
      { label: 'ARCHIVE', path: '/news' },
    ];
  }

  // Insights page
  if (basePath === 'insights') {
    return [
      { label: 'LATEST', path: '/insights', active: true },
      { label: 'ANALYSIS', path: '/insights' },
      { label: 'COMMENTARY', path: '/insights' },
      { label: 'REPORTS', path: '/insights/reports' },
    ];
  }

  // Facts page
  if (basePath === 'facts' || basePath === 'facts-and-data') {
    return [
      { label: 'TIMELINES', path: '/facts/lgr-timeline' },
      { label: 'COUNCILS', path: '/facts/councils-involved' },
      { label: 'KEY FACTS', path: '/facts/key-facts' },
      { label: 'METHODOLOGY', path: '/facts/methodology' },
    ];
  }

  // Topics page
  if (basePath === 'topics') {
    return [
      { label: 'GOVERNANCE', path: '/topics/governance-and-reform' },
      { label: 'DEMOCRACY', path: '/topics/democratic-legitimacy' },
      { label: 'STATECRAFT', path: '/topics/statecraft-and-system-design' },
    ];
  }

  // About page
  if (basePath === 'about') {
    return [
      { label: 'OVERVIEW', path: '/about', active: fullPath === '/about' },
      { label: 'CONTRIBUTORS', path: '/about/contributors', active: fullPath === '/about/contributors' },
      { label: 'METHODOLOGY', path: '/about/methodology', active: fullPath === '/about/methodology' },
      { label: 'CONTACT', path: '/contact' },
    ];
  }

  // LGR Hub
  if (basePath === 'lgr-hub') {
    return [
      { label: 'OVERVIEW', path: '/lgr-hub', active: fullPath === '/lgr-hub' },
      { label: 'ROADMAP', path: '/roadmap' },
      { label: 'TOOLS', path: '/tools' },
      { label: 'PODCAST', path: '/podcast' },
    ];
  }

  // Lessons page
  if (basePath === 'lessons') {
    return [
      { label: 'OVERVIEW', path: '/lessons', active: true },
      { label: 'CASE STUDIES', path: '/lessons' },
      { label: 'BEST PRACTICES', path: '/lessons' },
    ];
  }

  // Materials page
  if (basePath === 'materials') {
    return [
      { label: 'ALL MATERIALS', path: '/materials', active: true },
      { label: 'ARTICLES', path: '/materials' },
      { label: 'REPORTS', path: '/materials' },
      { label: 'RESOURCES', path: '/materials' },
    ];
  }

  // Reorganisations page
  if (basePath === 'reorganisations') {
    return [
      { label: 'ALL REORGANISATIONS', path: '/reorganisations', active: true },
      { label: 'TIMELINE', path: '/reorganisations' },
      { label: 'MAP', path: '/reorganisations' },
    ];
  }

  // Surrey page
  if (basePath === 'surrey') {
    return [
      { label: 'OVERVIEW', path: '/surrey', active: fullPath === '/surrey' },
      { label: 'HUB', path: '/surrey/hub' },
      { label: 'ELECTION TRACKER', path: '/surrey/election-tracker' },
    ];
  }

  // Homepage - provide navigation options
  if (basePath === '' || basePath === 'home') {
    return [
      { label: 'LATEST', path: '/news' },
      { label: 'INSIGHTS', path: '/insights' },
      { label: 'TOPICS', path: '/topics' },
      { label: 'ABOUT', path: '/about' },
    ];
  }

  // Default fallback - provide general navigation
  return [
    { label: 'LATEST', path: '/news' },
    { label: 'INSIGHTS', path: '/insights' },
    { label: 'TOPICS', path: '/topics' },
    { label: 'ABOUT', path: '/about' },
  ];
}

export function getPrimaryNavItems(pathname: string): NavItem[] {
  const basePath = pathname.split('/')[1] || '';
  const fullPath = pathname;

  // News page primary nav
  if (basePath === 'news') {
    return [
      { label: 'Latest', path: '/news', active: true },
      { label: 'Analysis', path: '/insights' },
      { label: 'Commentary', path: '/news' },
      { label: 'Updates', path: '/news' },
      { label: 'Archive', path: '/news' },
    ];
  }

  // Insights page primary nav
  if (basePath === 'insights') {
    return [
      { label: 'Latest', path: '/insights', active: true },
      { label: 'Analysis', path: '/insights', active: true },
      { label: 'Commentary', path: '/insights' },
      { label: 'Reports', path: '/insights/reports' },
    ];
  }

  // Facts page primary nav
  if (basePath === 'facts' || basePath === 'facts-and-data') {
    return [
      { label: 'Overview', path: '/facts-and-data', active: true },
      { label: 'Timeline', path: '/facts/lgr-timeline' },
      { label: 'Key Facts', path: '/facts/key-facts' },
      { label: 'Methodology', path: '/facts/methodology' },
    ];
  }

  // Topics page primary nav
  if (basePath === 'topics') {
    return [
      { label: 'All Topics', path: '/topics', active: true },
      { label: 'Governance', path: '/topics/governance-and-reform' },
      { label: 'Democracy', path: '/topics/democratic-legitimacy' },
      { label: 'Statecraft', path: '/topics/statecraft-and-system-design' },
    ];
  }

  // Lessons page primary nav
  if (basePath === 'lessons') {
    return [
      { label: 'Overview', path: '/lessons', active: true },
      { label: 'Case Studies', path: '/lessons' },
      { label: 'Best Practices', path: '/lessons' },
    ];
  }

  // Materials page primary nav
  if (basePath === 'materials') {
    return [
      { label: 'All Materials', path: '/materials', active: true },
      { label: 'Articles', path: '/materials' },
      { label: 'Reports', path: '/materials' },
      { label: 'Resources', path: '/materials' },
    ];
  }

  // LGR Hub primary nav
  if (basePath === 'lgr-hub') {
    return [
      { label: 'Overview', path: '/lgr-hub', active: true },
      { label: 'Roadmap', path: '/roadmap' },
      { label: 'Tools', path: '/tools' },
      { label: 'Podcast', path: '/podcast' },
    ];
  }

  // About page primary nav
  if (basePath === 'about') {
    return [
      { label: 'Overview', path: '/about', active: fullPath === '/about' },
      { label: 'Contributors', path: '/about/contributors', active: fullPath === '/about/contributors' },
      { label: 'Methodology', path: '/about/methodology', active: fullPath === '/about/methodology' },
      { label: 'Contact', path: '/contact' },
    ];
  }

  // Reorganisations page primary nav
  if (basePath === 'reorganisations') {
    return [
      { label: 'All Reorganisations', path: '/reorganisations', active: true },
      { label: 'Timeline', path: '/reorganisations' },
      { label: 'Map', path: '/reorganisations' },
    ];
  }

  // Surrey page primary nav
  if (basePath === 'surrey') {
    return [
      { label: 'Overview', path: '/surrey', active: fullPath === '/surrey' },
      { label: 'Hub', path: '/surrey/hub' },
      { label: 'Election Tracker', path: '/surrey/election-tracker' },
    ];
  }

  // Homepage primary nav
  if (basePath === '' || basePath === 'home') {
    return [
      { label: 'Latest', path: '/news' },
      { label: 'Insights', path: '/insights' },
      { label: 'Topics', path: '/topics' },
      { label: 'About', path: '/about' },
    ];
  }

  // Default - provide general navigation
  return [
    { label: 'Latest', path: '/news' },
    { label: 'Insights', path: '/insights' },
    { label: 'Topics', path: '/topics' },
    { label: 'About', path: '/about' },
  ];
}
