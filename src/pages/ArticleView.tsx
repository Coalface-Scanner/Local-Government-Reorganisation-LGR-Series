import { useEffect, useState, useCallback, useMemo } from 'react';
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
import SeeAlsoSection from '../components/SeeAlsoSection';
import ReadingProgress from '../components/ReadingProgress';
import ErrorDisplay from '../components/ErrorDisplay';
import Breadcrumbs from '../components/Breadcrumbs';
import Standfirst from '../components/Standfirst';
import AuthorBio from '../components/AuthorBio';
import PrintButton from '../components/PrintButton';
import ArticleNavigation from '../components/ArticleNavigation';
import ContentTypeTag from '../components/ContentTypeTag';
import { trackArticleView } from '../utils/analytics';
import { ArrowLeft, Calendar } from 'lucide-react';
import { retryWithBackoff, generateSlug, getThemeDisplayName, getThemeSlug } from '../lib/utils';

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
  author: string | null;
  category: string | null;
  region: string | null;
  geography: string | null;
  theme: string | null;
  lgr_phase: string | null;
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
      
      // Track article view
      if (data) {
        trackArticleView(data.slug, data.title);
      }
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

  // Process article body to add IDs to headings
  const processedBody = useMemo(() => {
    if (!article?.body) return '';
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.body, 'text/html');
    const headings = doc.querySelectorAll('h2, h3, h4, h5, h6');
    
    headings.forEach((heading) => {
      if (!heading.id) {
        const text = heading.textContent || '';
        const slug = generateSlug(text);
        heading.id = slug || `heading-${Math.random().toString(36).substr(2, 9)}`;
      }
    });
    
    return doc.body.innerHTML;
  }, [article?.body]);

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
          <p className="text-academic-neutral-600 font-serif">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-academic-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => onNavigate('insights')}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-display font-medium mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </button>
          <div className="academic-card p-12 text-center">
            <h1 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-4">Article Not Found</h1>
            <p className="text-academic-neutral-600 mb-6 font-serif">The article you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => onNavigate('insights')}
              className="academic-button academic-button-primary"
            >
              Browse All Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhance title with geography when available, ensuring it stays under 70 chars total
  const getTitle = () => {
    const maxTitleLength = 56; // 70 - 14 (" | LGR Series")
    let title = article.title;
    
    // Add geography prefix if available and not already in title
    if (article.geography && article.geography !== 'National') {
      const geographyPrefix = `${article.geography}: `;
      const geographyInTitle = title.toLowerCase().includes(article.geography.toLowerCase());
      
      if (!geographyInTitle && (geographyPrefix.length + title.length) <= maxTitleLength) {
        title = geographyPrefix + title;
      }
    } else if (article.region && article.region !== 'National') {
      // Fallback to region if geography not set
      const regionPrefix = `${article.region}: `;
      const regionInTitle = title.toLowerCase().includes(article.region.toLowerCase());
      
      if (!regionInTitle && (regionPrefix.length + title.length) <= maxTitleLength) {
        title = regionPrefix + title;
      }
    }
    
    // Truncate if still too long
    if (title.length > maxTitleLength) {
      title = title.substring(0, maxTitleLength - 3) + '...';
    }
    
    return title;
  };

  // Generate description from excerpt or body content, including geography context (25-160 chars)
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
    
    // Ensure description is between 25-160 chars and includes geography context
    if (desc.length < 25) {
      const geographyContext = article.geography && article.geography !== 'National' 
        ? ` in ${article.geography}` 
        : article.region && article.region !== 'National'
        ? ` in ${article.region}`
        : '';
      
      const phaseContext = article.lgr_phase ? ` during ${article.lgr_phase.toLowerCase()}` : '';
      
      desc = `Expert analysis on ${article.title}${geographyContext}${phaseContext}. Read insights on local government reorganisation and council reform.`;
    } else {
      // Add geography context to existing description if not present and space allows
      if (article.geography && article.geography !== 'National') {
        const geographyInDesc = desc.toLowerCase().includes(article.geography.toLowerCase());
        if (!geographyInDesc && (desc.length + article.geography.length + 10) <= 160) {
          desc = `${desc} Analysis focuses on ${article.geography}.`;
        }
      } else if (article.region && article.region !== 'National') {
        const regionInDesc = desc.toLowerCase().includes(article.region.toLowerCase());
        if (!regionInDesc && (desc.length + article.region.length + 10) <= 160) {
          desc = `${desc} Analysis focuses on ${article.region}.`;
        }
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
    <div className="min-h-screen bg-academic-cream">
      <ReadingProgress />
      <MetaTags
        title={getTitle()}
        description={getDescription()}
        keywords={`local government, reorganisation, LGR, insights, article${article.geography ? `, ${article.geography}` : ''}${article.theme ? `, ${article.theme}` : ''}${article.region ? `, ${article.region}` : ''}`}
        ogType="article"
        ogImage={article.featured_image || undefined}
        article={{
          publishedTime: article.published_date || article.created_at,
          author: article.author || 'LGR Series Editorial Team',
          section: article.theme || article.category || 'Insights',
          tags: [
            'LGR',
            'Local Government',
            'Reorganisation',
            ...(article.geography && article.geography !== 'National' ? [article.geography] : []),
            ...(article.theme ? [article.theme] : []),
            ...(article.lgr_phase ? [article.lgr_phase] : [])
          ]
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
        geography={article.geography}
        region={article.region}
        theme={article.theme}
      />

      <div className="bg-gradient-to-r from-teal-700 via-teal-400 to-teal-100 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: 'Home', path: '/' },
              ...(article.theme ? [{ label: 'Topics', path: '/topics' }, { label: getThemeDisplayName(article.theme), path: `/topics/${getThemeSlug(article.theme)}` }] : [{ label: 'Insights', path: '/insights' }]),
              { label: article.title }
            ]}
            className="mb-8 text-white/80"
          />
          <button
            onClick={() => onNavigate('insights')}
            className="flex items-center gap-2 text-white/90 hover:text-white font-display font-medium mb-8 group"
            aria-label="Back to Insights"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </button>

          <div className="flex items-start gap-6 mb-6">
            <h1 className="text-academic-4xl md:text-academic-5xl lg:text-academic-6xl font-display font-bold leading-tight flex-1 text-white">{article.title}</h1>
            <div className="flex flex-col gap-2 items-end">
              {article.featured && (
                <span className="px-4 py-2 bg-blue-700 text-white text-academic-xs font-display font-bold uppercase tracking-wider">
                  Exclusive
                </span>
              )}
              {article.content_type && (
                <ContentTypeTag contentType={article.content_type} />
              )}
            </div>
          </div>
          {/* Excerpt will be shown as standfirst in the article body */}

          <div className="flex flex-wrap items-center gap-6 text-academic-sm text-white/90 font-serif">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <ErrorDisplay
            message={error}
            onRetry={fetchArticle}
            className="mb-8"
          />
        )}

        {article.featured_image && (
          <div className="mb-16">
            <OptimizedImage
              src={article.featured_image}
              alt={article.title}
              variant="hero"
              className="w-full"
              priority={true}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <article className="editorial-layout academic-prose max-w-none" id="article-content">
              {/* Standfirst - Large introductory paragraph */}
              {article.excerpt && (
                <Standfirst>
                  {article.excerpt}
                </Standfirst>
              )}
              <div dangerouslySetInnerHTML={{ __html: processedBody }} />
            </article>

            {/* Author Bio */}
            {article.author && (
              <div className="mt-16">
                <AuthorBio
                  name={article.author}
                  affiliation={article.theme ? `LGR Series - ${getThemeDisplayName(article.theme)}` : 'LGR Series'}
                />
              </div>
            )}

            <div className="mt-20 pt-12 border-t border-academic-neutral-300 print:hidden">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <ShareButtons 
                  title={article.title}
                  url={window.location.href}
                />
                <PrintButton variant="outline" />
              </div>
            </div>

            <ArticleNavigation
              currentSlug={article.slug}
              currentPublishedDate={article.published_date}
              onNavigate={onNavigate}
            />

            <div className="mt-12">
              <RelatedArticles
                currentSlug={article.slug}
                currentTheme={article.theme || undefined}
                currentCategory={article.category || undefined}
                onNavigate={onNavigate}
              />
            </div>
            <SeeAlsoSection
              currentSlug={article.slug}
              contentType="article"
              geography={article.geography ?? undefined}
              theme={article.theme ?? undefined}
              lgrPhase={article.lgr_phase ?? undefined}
              category={article.category ?? undefined}
              currentContent={article.body ?? undefined}
              currentExcerpt={article.excerpt ?? undefined}
              maxItems={4}
            />

            <RelatedContent
              currentSlug={article.slug}
              contentType="article"
              geography={article.geography ?? undefined}
              theme={article.theme ?? undefined}
              lgrPhase={article.lgr_phase ?? undefined}
              category={article.category ?? undefined}
              currentContent={article.body ?? undefined}
              currentExcerpt={article.excerpt ?? undefined}
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
