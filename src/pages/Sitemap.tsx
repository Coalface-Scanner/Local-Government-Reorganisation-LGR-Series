import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateSitemap, staticRoutes } from '../utils/generateSitemap';
import { leadershipProfiles } from '../data/leadershipProfiles';

export default function Sitemap() {
  const [sitemapXml, setSitemapXml] = useState<string>('');

  useEffect(() => {
    generateDynamicSitemap();
  }, []);

  const generateDynamicSitemap = async () => {
    try {
      const urls = [...staticRoutes];

      // Fetch published articles
      const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at, published_date')
        .eq('status', 'published');

      if (articles) {
        articles.forEach(article => {
          urls.push({
            loc: `/insights/${article.slug}`,
            lastmod: article.updated_at || article.published_date || undefined,
            changefreq: 'monthly' as const,
            priority: 0.7,
          });
        });
      }

      // Fetch published materials
      const { data: materials } = await supabase
        .from('materials')
        .select('slug, updated_at, published_date')
        .eq('published', true);

      if (materials) {
        materials.forEach(material => {
          urls.push({
            loc: `/materials/${material.slug}`,
            lastmod: material.updated_at || material.published_date || undefined,
            changefreq: 'monthly' as const,
            priority: 0.6,
          });
        });
      }

      // Fetch published news
      const { data: news } = await supabase
        .from('news')
        .select('id, updated_at, published_date')
        .eq('published', true);

      if (news) {
        news.forEach(item => {
          urls.push({
            loc: `/news#${item.id}`,
            lastmod: item.updated_at || item.published_date || undefined,
            changefreq: 'weekly' as const,
            priority: 0.5,
          });
        });
      }

      leadershipProfiles.forEach(profile => {
        urls.push({
          loc: profile.link,
          changefreq: 'monthly' as const,
          priority: 0.6,
        });
      });

      const xml = generateSitemap(urls);
      setSitemapXml(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  };

  useEffect(() => {
    if (sitemapXml) {
      // Set content type and return XML
      const headers = new Headers();
      headers.set('Content-Type', 'application/xml');
      
      // In a real implementation, this would be handled server-side
      // For now, we'll just display it
    }
  }, [sitemapXml]);

  // Return XML content
  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {sitemapXml || 'Generating sitemap...'}
    </pre>
  );
}
