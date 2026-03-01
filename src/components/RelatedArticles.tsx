import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';
import { ArrowRight } from 'lucide-react';

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_date: string | null;
}

interface RelatedArticlesProps {
  currentSlug: string;
  currentTheme?: string;
  currentCategory?: string;
  onNavigate: (page: string, slug?: string) => void;
}

export default function RelatedArticles({
  currentSlug,
  currentTheme,
  currentCategory,
  onNavigate
}: RelatedArticlesProps) {
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRelatedArticles = useCallback(async () => {
    setLoading(true);
    try {
      let data = null;
      let error = null;

      // First, try to get articles from the same theme
      if (currentTheme) {
        const { data: themeData, error: themeError } = await prerenderSafe(
          supabase.from('articles').select('id, title, slug, excerpt, featured_image, published_date').eq('status', 'published').neq('slug', currentSlug).eq('theme', currentTheme).order('published_date', { ascending: false }).limit(3),
          { data: [], error: null }
        );

        if (!themeError && themeData && themeData.length > 0) {
          data = themeData;
        } else {
          error = themeError;
        }
      }

      // If no theme matches or no theme provided, try category
      if ((!data || data.length === 0) && currentCategory) {
        const { data: categoryData, error: categoryError } = await prerenderSafe(
          supabase.from('articles').select('id, title, slug, excerpt, featured_image, published_date').eq('status', 'published').neq('slug', currentSlug).eq('category', currentCategory).order('published_date', { ascending: false }).limit(3),
          { data: [], error: null }
        );

        if (!categoryError && categoryData && categoryData.length > 0) {
          data = categoryData;
        }
      }

      // Fallback: get most recent articles
      if (!data || data.length === 0) {
        const { data: recentData, error: recentError } = await prerenderSafe(
          supabase.from('articles').select('id, title, slug, excerpt, featured_image, published_date').eq('status', 'published').neq('slug', currentSlug).order('published_date', { ascending: false }).limit(3),
          { data: [], error: null }
        );

        if (!recentError && recentData) {
          data = recentData;
        } else {
          error = recentError;
        }
      }

      if (!error && data) {
        setRelatedArticles(data);
      } else if (error) {
        console.error('Error fetching related articles:', error);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    } finally {
      setLoading(false);
    }
  }, [currentSlug, currentTheme, currentCategory]);

  useEffect(() => {
    fetchRelatedArticles();
  }, [fetchRelatedArticles, currentTheme, currentCategory]);

  if (loading) {
    return (
      <div className="academic-card p-8">
        <div className="academic-section-header mb-6">
          <div className="academic-section-label">READ NEXT</div>
          <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal">Related Articles</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-academic-neutral-200 rounded w-1/3"></div>
          <div className="h-20 bg-academic-neutral-200 rounded"></div>
          <div className="h-20 bg-academic-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (relatedArticles.length === 0) return null;

  return (
    <div className="academic-card p-8">
      <div className="academic-section-header mb-6">
        <div className="academic-section-label">READ NEXT</div>
        <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal">Related Articles</h3>
      </div>
      <div className="space-y-6">
        {relatedArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => onNavigate('insights', article.slug)}
            className="group w-full text-left academic-card p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-6">
              {article.featured_image && (
                <div className="flex-shrink-0 w-24 h-24 overflow-hidden border border-academic-neutral-300 rounded-sm">
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-600 transition-colors leading-tight">
                  {article.title}
                </h4>
                {article.excerpt && (
                  <p className="text-academic-sm text-academic-neutral-700 line-clamp-2 mb-3 font-serif leading-relaxed">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-2 text-academic-sm text-teal-600 font-display font-semibold">
                  <span>Read more</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
