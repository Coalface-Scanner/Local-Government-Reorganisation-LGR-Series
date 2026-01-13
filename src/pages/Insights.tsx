import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import LastUpdated from '../components/LastUpdated';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  featured_image: string | null;
  status: string;
  published_date: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface InsightsProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const ITEMS_PER_PAGE = 9;

export default function Insights({ onNavigate }: InsightsProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false });

    if (error) {
      // Silently fail - articles will show empty state
    } else if (data) {
      setArticles(data);
    }
    setLoading(false);
  };

  const paginatedArticles = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);

  const handleArticleClick = (slug: string) => {
    onNavigate('insights', { slug });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-slate-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MetaTags
        title="Insights & Analysis - LGR Expert Articles"
        description="Expert insights on local government reorganisation, planning, and governance. In-depth articles examining council reform, unitary authorities, and devolution."
        keywords="local government, reorganisation, insights, articles, analysis, LGR, council reform, unitary authorities"
      />

      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              EXPERT ANALYSIS
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Insights{' '}
            <span className="text-teal-700 font-serif italic">
              & Analysis
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Expert perspectives on local government reorganisation, planning policy, and democratic governance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="text-slate-600">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </div>
        </div>

        {paginatedArticles.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-600 text-lg">No articles available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedArticles.map(article => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article.slug)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group border border-slate-200"
                >
                  {article.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={400}
                        height={192}
                      />
                      {article.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-lg">
                            Exclusive
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start gap-2 mb-2">
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 flex-1">
                        {article.title}
                      </h2>
                      {article.featured && !article.featured_image && (
                        <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md whitespace-nowrap">
                          Exclusive
                        </span>
                      )}
                    </div>
                    {article.excerpt && (
                      <p className="text-slate-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      {article.published_date && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(article.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-teal-600 text-white'
                          : 'border border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <LastUpdated />
    </div>
  );
}
