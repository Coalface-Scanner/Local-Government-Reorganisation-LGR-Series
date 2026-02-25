import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ArticleNavigationProps {
  currentSlug: string;
  currentPublishedDate: string | null;
  onNavigate: (page: string, data?: unknown) => void;
}

interface NavArticle {
  id: string;
  title: string;
  slug: string;
}

export default function ArticleNavigation({ currentSlug, currentPublishedDate, onNavigate }: ArticleNavigationProps) {
  const [previousArticle, setPreviousArticle] = useState<NavArticle | null>(null);
  const [nextArticle, setNextArticle] = useState<NavArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNavigationArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlug, currentPublishedDate]);

  const fetchNavigationArticles = async () => {
    if (!currentPublishedDate) {
      setLoading(false);
      return;
    }

    try {
      // Fetch previous article (older)
      const { data: prevData } = await supabase
        .from('articles')
        .select('id, title, slug')
        .eq('status', 'published')
        .lt('published_date', currentPublishedDate)
        .order('published_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch next article (newer)
      const { data: nextData } = await supabase
        .from('articles')
        .select('id, title, slug')
        .eq('status', 'published')
        .gt('published_date', currentPublishedDate)
        .order('published_date', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (prevData) {
        setPreviousArticle(prevData);
      }
      if (nextData) {
        setNextArticle(nextData);
      }
    } catch (error) {
      console.error('Error fetching navigation articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || (!previousArticle && !nextArticle)) {
    return null;
  }

  return (
    <nav className="mt-16 pt-12 border-t-2 border-academic-neutral-300 print:hidden" aria-label="Article navigation">
      <div className="grid md:grid-cols-2 gap-6">
        {previousArticle ? (
          <button
            onClick={() => onNavigate('insights', { slug: previousArticle.slug })}
            className="group text-left academic-card p-6 hover:border-teal-700 transition-all"
            aria-label={`Previous article: ${previousArticle.title}`}
          >
            <div className="flex items-center gap-2 text-academic-xs font-display font-bold text-teal-700 mb-3 uppercase tracking-wider">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Previous Article
            </div>
            <h3 className="text-academic-lg font-display font-bold text-academic-charcoal group-hover:text-teal-700 transition-colors line-clamp-2">
              {previousArticle.title}
            </h3>
          </button>
        ) : (
          <div></div>
        )}

        {nextArticle ? (
          <button
            onClick={() => onNavigate('insights', { slug: nextArticle.slug })}
            className="group text-left academic-card p-6 hover:border-teal-700 transition-all ml-auto"
            aria-label={`Next article: ${nextArticle.title}`}
          >
            <div className="flex items-center gap-2 text-academic-xs font-display font-bold text-teal-700 mb-3 uppercase tracking-wider justify-end">
              Next Article
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-academic-lg font-display font-bold text-academic-charcoal group-hover:text-teal-700 transition-colors line-clamp-2 text-right">
              {nextArticle.title}
            </h3>
          </button>
        ) : null}
      </div>
    </nav>
  );
}
