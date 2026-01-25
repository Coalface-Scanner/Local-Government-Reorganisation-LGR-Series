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

// Static routes for sitemap
export const staticRoutes: SitemapUrl[] = [
  { loc: '/', changefreq: 'daily', priority: 1.0 },
  { loc: '/insights', changefreq: 'daily', priority: 0.9 },
  { loc: '/topics/governance-and-reform', changefreq: 'weekly', priority: 0.8 },
  { loc: '/topics/democratic-legitimacy', changefreq: 'weekly', priority: 0.8 },
  { loc: '/topics/statecraft-and-system-design', changefreq: 'weekly', priority: 0.8 },
  { loc: '/facts', changefreq: 'weekly', priority: 0.8 },
  { loc: '/lessons', changefreq: 'weekly', priority: 0.8 },
  { loc: '/100days', changefreq: 'monthly', priority: 0.7 },
  { loc: '/materials', changefreq: 'daily', priority: 0.8 },
  { loc: '/news', changefreq: 'daily', priority: 0.7 },
  { loc: '/interviews', changefreq: 'weekly', priority: 0.7 },
  { loc: '/surrey', changefreq: 'weekly', priority: 0.7 },
  { loc: '/contact', changefreq: 'monthly', priority: 0.6 },
  { loc: '/subscribe', changefreq: 'monthly', priority: 0.6 },
  { loc: '/about', changefreq: 'monthly', priority: 0.7 },
  { loc: '/about/editor', changefreq: 'monthly', priority: 0.6 },
  { loc: '/about/methodology', changefreq: 'monthly', priority: 0.6 },
  { loc: '/about/contribute', changefreq: 'monthly', priority: 0.6 },
  { loc: '/about/coalface', changefreq: 'monthly', priority: 0.6 },
  { loc: '/library', changefreq: 'daily', priority: 0.7 },
];
