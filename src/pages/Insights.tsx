import { useEffect, useState } from 'react';
import { supabase, hasValidSupabase } from '../lib/supabase';
import { useLocation } from 'react-router-dom';
import ErrorDisplay from '../components/ErrorDisplay';
import { Calendar } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import PageBanner from '../components/PageBanner';
import OptimizedImage from '../components/OptimizedImage';
import ContentTypeTag from '../components/ContentTypeTag';
import FAQSection from '../components/FAQSection';
import { ContentContainer } from '../components/layout';

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
  content_type: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setError(null);
      if (!hasValidSupabase) {
        setArticles([]);
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setArticles(data);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen bg-academic-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
          <p className="text-academic-neutral-600 font-serif">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-academic-cream py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorDisplay
            title="Unable to Load Articles"
            message={error}
            onRetry={fetchArticles}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Insights & Analysis - LGR Expert Articles"
        description="Expert insights on local government reorganisation, planning, and governance. In-depth articles examining council reform, unitary authorities, and devolution."
        keywords="local government, reorganisation, insights, articles, analysis, LGR, council reform, unitary authorities"
      />
      <CollectionPageStructuredData
        name="Insights & Analysis"
        description="Expert insights on local government reorganisation, planning, and governance. In-depth articles examining council reform, unitary authorities, and devolution."
        url="/insights"
        numberOfItems={articles.length}
        items={articles.map(article => ({
          name: article.title,
          url: `/insights/${article.slug}`,
          description: article.excerpt || undefined
        }))}
      />

      <PageBanner
        heroVariant="insights"
        heroLabel="INSIGHTS"
        heroTitle="Insights & Analysis on LGR"
        heroSubtitle="Expert perspectives on local government reorganisation, planning policy, and democratic governance"
        currentPath={location.pathname}
      />

      <ContentContainer variant="hub">
        <section className="layout-section">
          <div className="academic-card p-8">
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
              Insights & Analysis brings together expert perspectives on local government reorganisation, planning policy, and democratic governance. Browse articles below.
            </p>
          </div>
        </section>
        <div className="layout-section mb-6">
          <div className="text-academic-neutral-600 font-serif">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </div>
        </div>

        {paginatedArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-academic-neutral-600 text-academic-lg font-serif">No articles available yet.</p>
          </div>
        ) : (
          <>
            <div className="layout-card-grid gap-8 mb-8">
              {paginatedArticles.map(article => (
                <article
                  key={article.id}
                  onClick={() => handleArticleClick(article.slug)}
                  className="academic-card cursor-pointer overflow-hidden group"
                >
                  {article.featured_image && (
                    <div className="relative overflow-hidden border-b border-academic-neutral-300">
                      <OptimizedImage
                        src={article.featured_image}
                        alt={article.title}
                        variant="thumbnail"
                        loading="lazy"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      {article.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-teal-700 text-white text-academic-xs font-display font-bold uppercase tracking-wider" style={{ borderRadius: '2px' }}>
                            Exclusive
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-start gap-2 mb-3">
                      <h2 className="text-academic-base font-display font-bold text-academic-charcoal group-hover:text-teal-500 transition-colors line-clamp-3 flex-1">
                        {article.title}
                      </h2>
                      {article.featured && !article.featured_image && (
                        <span className="px-2 py-1 bg-teal-700 text-white text-academic-xs font-display font-bold uppercase tracking-wider whitespace-nowrap" style={{ borderRadius: '2px' }}>
                          Exclusive
                        </span>
                      )}
                    </div>
                    <div className="mb-3">
                      {article.content_type && (
                        <ContentTypeTag contentType={article.content_type} />
                      )}
                    </div>
                    {article.excerpt && (
                      <p className="text-academic-base text-academic-neutral-700 mb-5 line-clamp-3 font-serif leading-relaxed">{article.excerpt}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-academic-sm text-academic-neutral-600 font-serif">
                      {article.published_date && (
                        <div className="flex items-center gap-2">
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
                  className="academic-button academic-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 font-display font-semibold transition-colors rounded-xl ${
                        currentPage === page
                          ? 'bg-teal-700 text-white'
                          : 'border border-academic-neutral-300 hover:bg-academic-warm text-academic-charcoal'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="academic-button academic-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </ContentContainer>

      <FAQSection page="insights" />
    </div>
  );
}
