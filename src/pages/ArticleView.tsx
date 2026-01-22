import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import LastUpdated from '../components/LastUpdated';
import ShareButtons from '../components/ShareButtons';
import MetaTags from '../components/MetaTags';
import ArticleStructuredData from '../components/ArticleStructuredData';
import ArticleQASection from '../components/ArticleQASection';
import OptimizedImage from '../components/OptimizedImage';
import ReadingTime from '../components/ReadingTime';
import TableOfContents from '../components/TableOfContents';
import RelatedArticles from '../components/RelatedArticles';
import RelatedContent from '../components/RelatedContent';
import ReadingProgress from '../components/ReadingProgress';
import ErrorDisplay from '../components/ErrorDisplay';
import Breadcrumbs from '../components/Breadcrumbs';
import { ArrowLeft, Calendar } from 'lucide-react';
import { retryWithBackoff } from '../lib/utils';

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
  author: string | null;
}

interface ArticleViewProps {
  slug?: string;
  onNavigate: (page: string, data?: unknown) => void;
}

export default function ArticleView({ slug, onNavigate }: ArticleViewProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (error) throw error;
        return data;
      });

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setArticle(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load article. Please try again.');
      setLoading(false);
      console.error('Error fetching article:', err);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug, fetchArticle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => onNavigate('insights')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </button>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => onNavigate('insights')}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Browse All Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Truncate title to ensure full title (with " | LGR Series") stays under 70 chars
  const getTitle = () => {
    const maxTitleLength = 56; // 70 - 14 (" | LGR Series")
    if (article.title.length > maxTitleLength) {
      return article.title.substring(0, maxTitleLength - 3) + '...';
    }
    return article.title;
  };

  // Generate description from excerpt or body content (25-160 chars)
  const getDescription = () => {
    let desc = '';
    
    if (article.excerpt && article.excerpt.trim().length >= 25) {
      desc = article.excerpt.trim();
    } else if (article.body) {
      // Strip HTML and get text content
      const textContent = article.body.replace(/<[^>]*>/g, '').trim();
      if (textContent.length >= 25) {
        desc = textContent;
      }
    }
    
    // Ensure description is between 25-160 chars
    if (desc.length < 25) {
      desc = `Expert analysis on ${article.title}. Read insights on local government reorganisation and council reform.`;
    }
    if (desc.length > 160) {
      desc = desc.substring(0, 157) + '...';
    }
    
    return desc;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ReadingProgress />
      <MetaTags
        title={getTitle()}
        description={getDescription()}
        keywords="local government, reorganisation, LGR, insights, article"
        ogType="article"
        ogImage={article.featured_image || undefined}
        article={{
          publishedTime: article.published_date || article.created_at,
          author: article.author || 'LGR Series Editorial Team',
          section: 'Insights',
          tags: ['LGR', 'Local Government', 'Reorganisation']
        }}
      />
      <ArticleStructuredData
        title={article.title}
        description={article.excerpt || ''}
        author={article.author || "LGR Series Editorial Team"}
        publishedDate={article.published_date || article.created_at}
        updatedDate={article.updated_at}
        imageUrl={article.featured_image || undefined}
        slug={article.slug}
      />

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: 'Insights', path: '/insights' },
              { label: article.title }
            ]}
            className="mb-6 text-slate-300"
          />
          <button
            onClick={() => onNavigate('insights')}
            className="flex items-center gap-2 text-slate-300 hover:text-white font-medium mb-6 group"
            aria-label="Back to Insights"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </button>

          <div className="flex items-start gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight flex-1">{article.title}</h1>
            {article.featured && (
              <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold uppercase tracking-wider rounded-lg shadow-lg">
                Exclusive
              </span>
            )}
          </div>
          {article.excerpt && (
            <p className="text-xl text-slate-300 mb-6 leading-relaxed">{article.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
            {article.published_date && (
              <div className="flex items-center gap-2">
                <Calendar size={16} aria-hidden="true" />
                <span>{new Date(article.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            )}
            <ReadingTime content={article.body} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <ErrorDisplay
            message={error}
            onRetry={fetchArticle}
            className="mb-8"
          />
        )}

        {article.featured_image && (
          <OptimizedImage
            src={article.featured_image}
            alt={article.title}
            className="w-full h-auto rounded-2xl shadow-lg mb-8"
            priority={false}
          />
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article className="prose prose-lg max-w-none print:prose-sm">
          <style>{`
            .prose h2 {
              font-size: 1.875rem;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
              line-height: 1.2;
              color: #171717;
            }

            .prose h3 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 1.75rem;
              margin-bottom: 0.75rem;
              line-height: 1.3;
              color: #262626;
            }

            .prose p {
              font-size: 1.125rem;
              line-height: 1.75;
              margin-bottom: 1.25rem;
              color: #404040;
            }

            .prose blockquote {
              border-left: 4px solid #0f766e;
              padding-left: 1.5rem;
              margin: 2rem 0;
              font-style: italic;
              color: #525252;
              font-size: 1.25rem;
            }

            .prose img {
              max-width: 100%;
              height: auto;
              margin: 2rem 0;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }

            .prose ul,
            .prose ol {
              padding-left: 1.75rem;
              margin: 1.5rem 0;
            }

            .prose li {
              margin-bottom: 0.75rem;
              line-height: 1.75;
              color: #404040;
            }

            .prose a {
              color: #0f766e;
              text-decoration: underline;
              font-weight: 500;
            }

            .prose a:hover {
              color: #115e59;
            }

            .prose strong {
              color: #171717;
              font-weight: 600;
            }

            .prose em {
              font-style: italic;
            }
          `}</style>
              <div dangerouslySetInnerHTML={{ __html: article.body || '' }} />
            </article>

            <div className="mt-12 pt-8 border-t border-slate-200 print:hidden">
              <ShareButtons 
                title={article.title}
                url={window.location.href}
              />
            </div>

            <div className="mt-8">
              <RelatedArticles
                currentSlug={article.slug}
                onNavigate={onNavigate}
              />
            </div>
            <RelatedContent
              currentSlug={article.slug}
              contentType="article"
              maxItems={6}
            />
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <TableOfContents content={article.body} />
            </div>
          </aside>
        </div>
      </div>

      <ArticleQASection articleSlug={article.slug} />

      <LastUpdated />
    </div>
  );
}
