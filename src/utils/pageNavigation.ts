import { NavItem } from '../components/PageBanner';

// Standard primary navigation items – six hubs (green bar)
export function getStandardPrimaryNavItems(): NavItem[] {
  return [
    { label: 'LEARN', path: '/learn' },
    { label: 'DISCOVER', path: '/discover' },
    { label: 'RESEARCH', path: '/research' },
    { label: 'INSIGHTS', path: '/insights' },
    { label: 'TOOLS', path: '/tools' },
    { label: 'ABOUT', path: '/about' },
  ];
}

// Get secondary nav items for a specific primary nav item (grey bar – sub-pages)
export function getSecondaryNavItemsForPrimaryNav(primaryNavId: string, pathname: string): NavItem[] {
  const fullPath = pathname;

  switch (primaryNavId) {
    case 'learn':
      return [
        { label: 'LEARN', path: '/learn', active: fullPath === '/learn' },
        { label: 'WHAT IS LGR', path: '/what-is-lgr', active: fullPath.startsWith('/what-is-lgr') },
        { label: 'BEGINNERS GUIDE', path: '/beginners-guide', active: fullPath.startsWith('/beginners-guide') },
        { label: 'QUESTIONS & ANSWERS', path: '/questions-and-answers', active: fullPath.startsWith('/questions-and-answers') },
        { label: 'GLOSSARY', path: '/glossary', active: fullPath.startsWith('/glossary') },
        { label: 'FIRST 100 DAYS', path: '/first-100-days', active: fullPath.startsWith('/first-100-days') },
      ];

    case 'discover':
      return [
        { label: 'DISCOVER', path: '/discover', active: fullPath === '/discover' },
        {
          label: 'TOPICS',
          path: '/topics',
          active: fullPath === '/topics' || fullPath.startsWith('/topics/'),
          children: [
            { label: 'Governance and Reform', path: '/topics/governance-and-reform', active: fullPath.startsWith('/topics/governance-and-reform') },
            { label: 'Democratic Legitimacy and Statecraft', path: '/topics/democratic-legitimacy', active: fullPath.startsWith('/topics/democratic-legitimacy') },
            { label: 'System Design', path: '/topics/statecraft-and-system-design', active: fullPath.startsWith('/topics/statecraft-and-system-design') },
          ],
        },
        { label: 'REORGANISATIONS', path: '/reorganisations', active: fullPath.startsWith('/reorganisations') },
        { label: 'PODCAST', path: '/podcast', active: fullPath.startsWith('/podcast') || fullPath.startsWith('/interviews') },
      ];

    case 'research':
      return [
        { label: 'RESEARCH', path: '/research', active: fullPath === '/research' },
        { label: 'FACTS & DATA', path: '/facts-and-data', active: fullPath === '/facts-and-data' },
        { label: 'KEY FACTS', path: '/facts/key-facts', active: fullPath.startsWith('/facts/key-facts') },
        { label: 'LIBRARY', path: '/library', active: fullPath.startsWith('/library') },
        { label: 'LESSONS', path: '/lessons', active: fullPath.startsWith('/lessons') },
      ];

    case 'insights':
      return [
        { label: 'INSIGHTS', path: '/insights', active: fullPath === '/insights' },
        { label: 'REPORTS', path: '/insights/reports', active: fullPath.startsWith('/insights/reports') },
        { label: 'ARTICLES', path: '/insights', active: fullPath.startsWith('/insights/') && !fullPath.startsWith('/insights/reports') },
        { label: 'NEWS', path: '/news', active: fullPath.startsWith('/news') },
        {
          label: 'SURREY LGR HUB',
          path: '/surrey',
          active: fullPath.startsWith('/surrey'),
          children: [
            { label: 'Lessons', path: '/surrey/lessons', active: fullPath === '/surrey/lessons' },
            { label: 'Area profile', path: '/surrey/area-profile', active: fullPath.startsWith('/surrey/area-profile') },
            { label: 'Election tracker', path: '/surrey/election-tracker', active: fullPath.startsWith('/surrey/election-tracker') },
            { label: 'Hub', path: '/surrey/hub' },
          ],
        },
      ];

    case 'tools':
      return [
        { label: 'TOOLS', path: '/tools', active: fullPath === '/tools' },
        { label: 'ROADMAP', path: '/roadmap', active: fullPath.startsWith('/roadmap') },
        { label: 'LIBRARY', path: '/library', active: fullPath.startsWith('/library') },
        { label: 'FIRST 100 DAYS', path: '/first-100-days', active: fullPath.startsWith('/first-100-days') },
      ];

    case 'about':
      return [
        { label: 'ABOUT', path: '/about', active: fullPath === '/about' },
        { label: 'OVERVIEW', path: '/about/overview', active: fullPath === '/about/overview' },
        { label: 'LEADERSHIP', path: '/about/leadership', active: fullPath.startsWith('/about/leadership') },
        { label: 'PARTNERSHIP', path: '/about/partnership', active: fullPath.startsWith('/about/partnership') },
        {
          label: 'CONTRIBUTORS',
          path: '/about/contributors',
          active: fullPath === '/about/contributors' || fullPath.startsWith('/about/contributors/'),
          children: [
            { label: 'Contribute', path: '/about/contributors/contribute', active: fullPath === '/about/contributors/contribute' },
          ],
        },
        { label: 'CONTACT', path: '/contact', active: fullPath === '/contact' },
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
      { label: 'ABOUT', path: '/about', active: fullPath === '/about' },
      { label: 'OVERVIEW', path: '/about/overview', active: fullPath === '/about/overview' },
      { label: 'LEADERSHIP', path: '/about/leadership', active: fullPath.startsWith('/about/leadership') },
      { label: 'PARTNERSHIP', path: '/about/partnership', active: fullPath.startsWith('/about/partnership') },
      {
        label: 'CONTRIBUTORS',
        path: '/about/contributors',
        active: fullPath === '/about/contributors' || fullPath.startsWith('/about/contributors/'),
        children: [
          { label: 'Contribute', path: '/about/contributors/contribute', active: fullPath === '/about/contributors/contribute' },
        ],
      },
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

  // Lessons page (hub and sub-pages)
  if (basePath === 'lessons') {
    return [
      { label: 'OVERVIEW', path: '/lessons', active: fullPath === '/lessons' },
      { label: 'INSIGHTS', path: '/lessons/insights', active: fullPath === '/lessons/insights' },
      { label: 'CASE GROUNDED LESSONS', path: '/lessons/case-studies', active: fullPath === '/lessons/case-studies' },
      { label: 'BEST PRACTICES', path: '/lessons/best-practices', active: fullPath === '/lessons/best-practices' },
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
      { label: 'SURREY LGR HUB', path: '/surrey', active: fullPath === '/surrey' },
      { label: 'LESSONS', path: '/surrey/lessons', active: fullPath === '/surrey/lessons' },
      { label: 'AREA PROFILE', path: '/surrey/area-profile', active: fullPath === '/surrey/area-profile' },
      { label: 'ELECTION TRACKER', path: '/surrey/election-tracker', active: fullPath.startsWith('/surrey/election-tracker') },
      { label: 'HUB', path: '/surrey/hub' },
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
      { label: 'Overview', path: '/lessons', active: fullPath === '/lessons' },
      { label: 'Insights', path: '/lessons/insights', active: fullPath === '/lessons/insights' },
      { label: 'Case Grounded Lessons', path: '/lessons/case-studies', active: fullPath === '/lessons/case-studies' },
      { label: 'Best Practices', path: '/lessons/best-practices', active: fullPath === '/lessons/best-practices' },
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
      { label: 'About', path: '/about', active: fullPath === '/about' },
      { label: 'Overview', path: '/about/overview', active: fullPath === '/about/overview' },
      { label: 'Leadership', path: '/about/leadership', active: fullPath.startsWith('/about/leadership') },
      { label: 'Partnership', path: '/about/partnership', active: fullPath.startsWith('/about/partnership') },
      {
        label: 'Contributors',
        path: '/about/contributors',
        active: fullPath === '/about/contributors' || fullPath.startsWith('/about/contributors/'),
        children: [
          { label: 'Contribute', path: '/about/contributors/contribute', active: fullPath === '/about/contributors/contribute' },
        ],
      },
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
      { label: 'Surrey LGR Hub', path: '/surrey', active: fullPath === '/surrey' },
      { label: 'Lessons', path: '/surrey/lessons', active: fullPath === '/surrey/lessons' },
      { label: 'Area profile', path: '/surrey/area-profile', active: fullPath === '/surrey/area-profile' },
      { label: 'Election Tracker', path: '/surrey/election-tracker', active: fullPath.startsWith('/surrey/election-tracker') },
      { label: 'Hub', path: '/surrey/hub' },
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
