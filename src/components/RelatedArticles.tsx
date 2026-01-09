import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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

  useEffect(() => {
    fetchRelatedArticles();
  }, [currentSlug, currentTheme, currentCategory]);

  const fetchRelatedArticles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('articles')
        .select('id, title, slug, excerpt, featured_image, published_date')
        .eq('status', 'published')
        .neq('slug', currentSlug)
        .limit(3);

      // Prioritize articles with same theme or category
      if (currentTheme) {
        query = query.or(`theme.eq.${currentTheme},category.eq.${currentCategory || currentTheme}`);
      }

      const { data, error } = await query.order('published_date', { ascending: false });

      if (!error && data) {
        setRelatedArticles(data);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (relatedArticles.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Related Articles</h3>
      <div className="space-y-4">
        {relatedArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => onNavigate('insights', article.slug)}
            className="group w-full text-left bg-white rounded-lg p-4 hover:shadow-md transition-all border border-slate-200 hover:border-teal-300"
          >
            <div className="flex items-start gap-4">
              {article.featured_image && (
                <img
                  src={article.featured_image}
                  alt=""
                  className="w-20 h-20 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                {article.excerpt && (
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-teal-700 font-medium">
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
