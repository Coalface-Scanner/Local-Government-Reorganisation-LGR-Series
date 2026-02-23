// Utility to generate sitemap XML
// This can be called server-side or client-side to generate sitemap

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(urls: SitemapUrl[]): string {
  const baseUrl = 'https://localgovernmentreorganisation.co.uk';
  
  const urlEntries = urls.map(url => {
    const loc = url.loc.startsWith('http') ? url.loc : `${baseUrl}${url.loc}`;
    let entry = `  <url>\n    <loc>${escapeXml(loc)}</loc>`;
    
    if (url.lastmod) {
      entry += `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>`;
    }
    
    if (url.changefreq) {
      entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority !== undefined) {
      entry += `\n    <priority>${url.priority}</priority>`;
    }
    
    entry += '\n  </url>';
    return entry;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Static routes for sitemap (canonical URLs only; no aliases or noindex pages)
export const staticRoutes: SitemapUrl[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/learn', changefreq: 'monthly', priority: 0.9 },
  { loc: '/discover', changefreq: 'monthly', priority: 0.9 },
  { loc: '/research', changefreq: 'monthly', priority: 0.9 },
  { loc: '/insights', changefreq: 'daily', priority: 0.9 },
  { loc: '/insights/reports', changefreq: 'weekly', priority: 0.8 },
  { loc: '/tools', changefreq: 'monthly', priority: 0.8 },
  { loc: '/about', changefreq: 'monthly', priority: 0.8 },
  { loc: '/about/overview', changefreq: 'monthly', priority: 0.7 },
  { loc: '/about/leadership', changefreq: 'monthly', priority: 0.7 },
  { loc: '/about/methodology', changefreq: 'monthly', priority: 0.6 },
  { loc: '/about/contribute', changefreq: 'monthly', priority: 0.6 },
  { loc: '/about/coalface', changefreq: 'monthly', priority: 0.6 },
  { loc: '/about/contributors', changefreq: 'monthly', priority: 0.6 },
  { loc: '/what-is-lgr', changefreq: 'monthly', priority: 0.8 },
  { loc: '/beginners-guide', changefreq: 'monthly', priority: 0.8 },
  { loc: '/questions-and-answers', changefreq: 'monthly', priority: 0.8 },
  { loc: '/councilopedia', changefreq: 'monthly', priority: 0.7 },
  { loc: '/glossary', changefreq: 'weekly', priority: 0.7 },
  { loc: '/first-100-days', changefreq: 'monthly', priority: 0.7 },
  { loc: '/topics', changefreq: 'weekly', priority: 0.8 },
  { loc: '/topics/governance-and-reform', changefreq: 'weekly', priority: 0.8 },
  { loc: '/topics/democratic-legitimacy', changefreq: 'weekly', priority: 0.8 },
  { loc: '/topics/statecraft-and-system-design', changefreq: 'weekly', priority: 0.8 },
  { loc: '/topics/local-government', changefreq: 'weekly', priority: 0.8 },
  { loc: '/topics/democracy', changefreq: 'weekly', priority: 0.8 },
  { loc: '/reorganisations', changefreq: 'weekly', priority: 0.8 },
  { loc: '/councils', changefreq: 'weekly', priority: 0.8 },
  { loc: '/council-profiles', changefreq: 'weekly', priority: 0.8 },
  { loc: '/facts-and-data', changefreq: 'weekly', priority: 0.8 },
  { loc: '/facts/key-facts', changefreq: 'weekly', priority: 0.8 },
  { loc: '/facts/timescales', changefreq: 'monthly', priority: 0.7 },
  { loc: '/facts/councils-involved', changefreq: 'monthly', priority: 0.7 },
  { loc: '/facts/lgr-timeline', changefreq: 'monthly', priority: 0.7 },
  { loc: '/facts/council-cases', changefreq: 'monthly', priority: 0.7 },
  { loc: '/facts/methodology', changefreq: 'monthly', priority: 0.6 },
  { loc: '/facts/sources', changefreq: 'monthly', priority: 0.6 },
  { loc: '/facts/further-reading', changefreq: 'monthly', priority: 0.6 },
  { loc: '/library', changefreq: 'daily', priority: 0.8 },
  { loc: '/roadmap', changefreq: 'monthly', priority: 0.7 },
  { loc: '/news', changefreq: 'daily', priority: 0.7 },
  { loc: '/podcast', changefreq: 'weekly', priority: 0.7 },
  { loc: '/surrey', changefreq: 'weekly', priority: 0.7 },
  { loc: '/surrey/election-tracker', changefreq: 'monthly', priority: 0.6 },
  { loc: '/surrey/election-tracker/simulator', changefreq: 'monthly', priority: 0.6 },
  { loc: '/surrey/hub', changefreq: 'monthly', priority: 0.6 },
  { loc: '/lessons', changefreq: 'weekly', priority: 0.8 },
  { loc: '/lessons/insights', changefreq: 'weekly', priority: 0.8 },
  { loc: '/lessons/case-studies', changefreq: 'weekly', priority: 0.8 },
  { loc: '/lessons/best-practices', changefreq: 'weekly', priority: 0.8 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.6 },
  { loc: '/subscribe', changefreq: 'monthly', priority: 0.6 },
  { loc: '/partnerships', changefreq: 'monthly', priority: 0.6 },
];
