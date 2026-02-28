/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml from database content at build time
 * Includes all published articles, insights, and static pages
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Warning: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY not set. Generating static sitemap only.');
}
const baseUrl = 'https://localgovernmentreorganisation.co.uk';

// Static pages with priorities and change frequencies
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/insights', priority: '0.9', changefreq: 'weekly' },
  { url: '/facts', priority: '0.9', changefreq: 'weekly' },
  { url: '/lessons', priority: '0.9', changefreq: 'weekly' },
  { url: '/reasons', priority: '0.8', changefreq: 'monthly' },
  { url: '/interviews', priority: '0.9', changefreq: 'weekly' },
  { url: '/surrey', priority: '0.8', changefreq: 'weekly' },
  { url: '/surrey/election-simulator', priority: '0.9', changefreq: 'monthly' },
  { url: '/news', priority: '0.8', changefreq: 'daily' },
  { url: '/library', priority: '0.8', changefreq: 'weekly' },
  { url: '/materials', priority: '0.8', changefreq: 'weekly' },
  { url: '/councils', priority: '0.7', changefreq: 'monthly' },
  { url: '/100days', priority: '0.8', changefreq: 'monthly' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  { url: '/subscribe', priority: '0.6', changefreq: 'monthly' },
  { url: '/faq', priority: '0.9', changefreq: 'monthly' },
  { url: '/facts/timescales', priority: '0.8', changefreq: 'weekly' },
  { url: '/facts/councils-involved', priority: '0.8', changefreq: 'weekly' },
  { url: '/facts/key-facts', priority: '0.8', changefreq: 'weekly' },
  { url: '/facts/methodology', priority: '0.7', changefreq: 'monthly' },
  { url: '/facts/sources', priority: '0.7', changefreq: 'monthly' },
  { url: '/facts/further-reading', priority: '0.6', changefreq: 'monthly' },
];

async function generateSitemap() {
  console.log('Generating dynamic sitemap...');

  const urls = [];

  // Add static pages
  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.url}`,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString().split('T')[0]
    });
  });

  try {
    let articles = [];
    let materials = [];
    let news = [];
    let facts = [];

    if (supabase) {
      // Fetch published articles (insights)
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('slug, published_date, updated_at')
        .eq('status', 'published')
        .order('published_date', { ascending: false });

      if (!articlesError && articlesData) {
        articles = articlesData;
      } else if (articlesError) {
        console.error('Error fetching articles:', articlesError);
      }

      // Fetch published materials (legacy articles)
      const { data: materialsData, error: materialsError } = await supabase
        .from('materials')
        .select('slug, published_date, updated_at')
        .eq('status', 'published')
        .order('published_date', { ascending: false });

      if (!materialsError && materialsData) {
        materials = materialsData;
      } else if (materialsError) {
        console.error('Error fetching materials:', materialsError);
      }

      // Fetch facts
      const { data: factsData, error: factsError } = await supabase
        .from('facts')
        .select('id, title, created_at, updated_at')
        .order('order_index', { ascending: true });

      if (!factsError && factsData) {
        facts = factsData;
      } else if (factsError) {
        console.error('Error fetching facts:', factsError);
      }

      // Fetch news items
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('id, slug, created_at, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!newsError && newsData) {
        news = newsData;
      } else if (newsError) {
        console.error('Error fetching news:', newsError);
        console.error('News query failed - check that published field exists and is boolean');
      }
    } else {
      console.log('  Skipping database queries - using static sitemap only');
    }

    // Add articles to sitemap
    if (articles.length > 0) {
      articles.forEach(article => {
        urls.push({
          loc: `${baseUrl}/insights/${article.slug}`,
          changefreq: 'monthly',
          priority: '0.9',
          lastmod: (article.updated_at || article.published_date || new Date().toISOString()).split('T')[0]
        });
      });
      console.log(`  Added ${articles.length} published articles`);
    }

    // Add materials to sitemap
    if (materials.length > 0) {
      materials.forEach(material => {
        // Skip duplicates if material slug matches an article slug
        const isDuplicate = articles.some(a => a.slug === material.slug);
        if (!isDuplicate) {
          urls.push({
            loc: `${baseUrl}/article/${material.slug}`,
            changefreq: 'monthly',
            priority: '0.8',
            lastmod: (material.updated_at || material.published_date || new Date().toISOString()).split('T')[0]
          });
        }
      });
      console.log(`  Added ${materials.length} published materials`);
    }

    // Add facts to sitemap
    if (facts.length > 0) {
      const generateSlug = (title) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      };
      
      facts.forEach(fact => {
        const slug = generateSlug(fact.title);
        urls.push({
          loc: `${baseUrl}/facts/${slug}`,
          changefreq: 'monthly',
          priority: '0.7',
          lastmod: (fact.updated_at || fact.created_at || new Date().toISOString()).split('T')[0]
        });
      });
      console.log(`  Added ${facts.length} facts`);
    }

    // Add council profiles (from static data)
    const councilSlugs = [
      'elmbridge', 'epsom-and-ewell', 'guildford', 'mole-valley',
      'reigate-and-banstead', 'runnymede', 'spelthorne', 'surrey-heath',
      'tandridge', 'waverley', 'woking', 'surrey-county-council'
    ];
    councilSlugs.forEach(slug => {
      urls.push({
        loc: `${baseUrl}/council-profiles/${slug}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: new Date().toISOString().split('T')[0]
      });
    });
    console.log(`  Added ${councilSlugs.length} council profiles`);

    // News page is already in static pages
    if (news.length > 0) {
      console.log(`  Found ${news.length} news items (listed on /news page)`);
    }

  } catch (error) {
    console.error('Unexpected error fetching content:', error);
  }

  // Generate XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  // Write to public directory (will be copied to dist during build)
  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, sitemapXml, 'utf8');

  console.log(`✓ Sitemap generated successfully with ${urls.length} URLs`);
  console.log(`  Saved to: ${outputPath}`);
}

generateSitemap().catch(error => {
  console.error('Failed to generate sitemap:', error);
  process.exit(1);
});
