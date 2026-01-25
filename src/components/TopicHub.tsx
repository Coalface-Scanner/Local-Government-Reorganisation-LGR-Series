import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import OptimizedImage from './OptimizedImage';
import FollowTopic from './FollowTopic';
import Breadcrumbs from './Breadcrumbs';
import { useTopicPage } from '../hooks/useTopicPage';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_date: string | null;
  featured: boolean;
  featured_theme?: boolean;
}

interface TopicHubProps {
  themeName: string; // Used for fetching content (database theme value)
  displayName?: string; // Used for display (defaults to themeName)
  themeSlug: string;
  description?: string; // Optional, will fetch from CMS if not provided
  keyQuestion?: string; // Optional, will fetch from CMS if not provided
  secondaryQuestions?: string[]; // Optional, will fetch from CMS if not provided
  relatedThemes?: Array<{ name: string; slug: string }>; // Optional, will fetch from CMS if not provided
  onNavigate: (page: string, data?: unknown) => void;
}

export default function TopicHub({
  themeName,
  displayName,
  themeSlug,
  description: propDescription,
  keyQuestion: propKeyQuestion,
  secondaryQuestions: propSecondaryQuestions = [],
  relatedThemes: propRelatedThemes = [],
  onNavigate,
}: TopicHubProps) {
  // Fetch CMS content for this topic page
  const { page: cmsPage } = useTopicPage(themeSlug);
  
  // Use CMS content if available, otherwise use props
  const displayThemeName = cmsPage?.display_name || displayName || themeName;
  const description = cmsPage?.description || propDescription || '';
  const keyQuestion = cmsPage?.key_question || propKeyQuestion || '';
  const secondaryQuestions = cmsPage?.secondary_questions ?? propSecondaryQuestions ?? [];
  const relatedThemes = cmsPage?.related_themes && cmsPage.related_themes.length > 0
    ? cmsPage.related_themes.map((slug: string) => {
        // Map slug to display name
        const themeMap: Record<string, string> = {
          'governance-and-reform': 'Governance and Reform',
          'democratic-legitimacy': 'Democratic Legitimacy',
          'statecraft-and-system-design': 'Statecraft and System Design',
        };
        return { name: themeMap[slug] || slug, slug };
      })
    : propRelatedThemes;
  const [pillarArticle, setPillarArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const BANNER_IMAGES: Record<string, { src: string; position: string }> = {
    'democratic-legitimacy': { src: '/Democracy_Banner_Image.jpg', position: 'center' },
    'governance-and-reform': { src: '/Governance_Banner_Image.jpg', position: 'center bottom' },
    'statecraft-and-system-design': { src: '/Statecraft_Banner_Image.jpg', position: 'center' },
  };
  const banner = BANNER_IMAGES[themeSlug];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Map theme slugs to possible theme/category values
        const themeMapping: Record<string, string[]> = {
          'local-government': ['Local Government', 'Governance', 'local government', 'governance'],
          'governance-and-reform': ['Local Government', 'Governance', 'local government', 'governance'],
          'democracy': ['Democracy', 'democracy'],
          // Democratic Legitimacy should ONLY match articles with "Democratic Legitimacy" theme, not "Democracy"
          'democratic-legitimacy': ['Democratic Legitimacy', 'Democratic legitimacy', 'democratic legitimacy'],
          'statecraft-and-system-design': ['Statecraft and System Design', 'Public Design', 'public design', 'Public Engagement', 'Public', 'public'],
        };

        const themeValues = themeMapping[themeSlug] || [themeName];

        if (import.meta.env.DEV) {
          console.log(`[TopicHub] Fetching content for theme: ${themeName} (${themeSlug})`);
          console.log(`[TopicHub] Theme values to match:`, themeValues);
        }

        // Fetch pillar article (featured article for this theme, or most recent if none featured)
        let pillarData = null;
        
        // Build OR conditions: try exact match first, then ILIKE for partial matches
        const exactThemeConditions = themeValues.map(v => `theme.eq.${v}`).join(',');
        const exactCategoryConditions = themeValues.map(v => `category.eq.${v}`).join(',');
        const ilikeThemeConditions = themeValues.map(v => `theme.ilike.%${v}%`).join(',');
        const ilikeCategoryConditions = themeValues.map(v => `category.ilike.%${v}%`).join(',');
        const allConditions = `${exactThemeConditions},${exactCategoryConditions},${ilikeThemeConditions},${ilikeCategoryConditions}`;
        
        // Try featured articles first - check theme OR category field
        const { data: featuredData, error: featuredError } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_date, featured, featured_theme, theme, category')
          .eq('status', 'published')
          .eq('featured_theme', true)
          .or(allConditions)
          .order('published_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (featuredError && import.meta.env.DEV) {
          console.error('[TopicHub] Error fetching featured article:', featuredError);
        }

        if (featuredData) {
          if (import.meta.env.DEV) {
            console.log('[TopicHub] Found featured article:', featuredData.title);
          }
          pillarData = featuredData;
        } else {
          // If no featured article, get the most recent one
          const { data: recentData, error: recentError } = await supabase
            .from('articles')
            .select('id, title, slug, excerpt, featured_image, published_date, featured, featured_theme, theme, category')
            .eq('status', 'published')
            .or(allConditions)
            .order('published_date', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          if (recentError && import.meta.env.DEV) {
            console.error('[TopicHub] Error fetching recent article:', recentError);
          }
          
          if (recentData) {
            if (import.meta.env.DEV) {
              console.log('[TopicHub] Found recent article:', recentData.title);
            }
            pillarData = recentData;
          }
        }

        if (pillarData) {
          setPillarArticle(pillarData);
        }

        // Fetch related articles (excluding pillar if it exists)
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_date, featured, featured_theme, theme, category')
          .eq('status', 'published')
          .or(allConditions)
          .order('published_date', { ascending: false })
          .limit(12);

        if (articlesError && import.meta.env.DEV) {
          console.error('[TopicHub] Error fetching related articles:', articlesError);
        }

        if (articlesData && articlesData.length > 0) {
          // Filter out pillar article if it exists
          const filtered = pillarData
            ? articlesData.filter(a => a.id !== pillarData.id)
            : articlesData;
          setRelatedArticles(filtered.slice(0, 11));
        }
      } catch (error) {
        console.error('Error fetching topic content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [themeName, themeSlug, cmsPage]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-academic-cream">
      {/* Hero Section */}
      <section className="relative bg-academic-warm py-12 lg:py-16 overflow-hidden">
        {banner && (
          // Inline styles necessary for dynamic CSS custom properties (banner image URL and position vary by theme)
          <div
            className="absolute inset-0 bg-cover opacity-30 topic-banner-bg"
            style={{
              '--banner-image': `url(${banner.src})`,
              '--banner-position': banner.position,
            } as React.CSSProperties & { '--banner-image': string; '--banner-position': string }}
            aria-hidden="true"
          />
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Topics', path: '/' },
              { label: displayThemeName }
            ]}
            className="mb-6"
          />

          <div className="max-w-4xl">
            <div className="academic-section-label mb-4">Core Theme</div>
            <h1 className="text-academic-4xl md:text-academic-5xl font-display font-black text-academic-charcoal leading-[1.1] mb-4">
              {displayThemeName}
            </h1>
            {description && (
              <div className="rounded-lg bg-white/80 backdrop-blur-sm px-6 py-5 mb-6 shadow-sm border border-academic-neutral-200/60">
                <div className="text-academic-lg md:text-academic-xl text-academic-charcoal leading-loose font-serif space-y-5 max-w-3xl">
                  {description.split(/\n\n+/).filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}
            <FollowTopic topic={displayThemeName} topicSlug={themeSlug} />
          </div>
        </div>
      </section>

      {/* Questions – Primary and Secondary side by side */}
      {(keyQuestion || secondaryQuestions.length > 0) && (
        <section className="py-12 lg:py-16 border-b border-academic-neutral-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 items-stretch">
              {keyQuestion && (
                <div className="bg-teal-50/80 border-l-4 border-teal-600 shadow-md rounded-r-lg pl-6 pr-8 py-6 ring-1 ring-teal-200/60 h-full flex flex-col justify-center">
                  <div className="academic-section-label mb-3 text-teal-700">Primary question</div>
                  <p className="text-academic-3xl md:text-academic-4xl lg:text-academic-5xl text-academic-charcoal font-serif italic font-medium leading-tight">
                    {keyQuestion}
                  </p>
                </div>
              )}
              {secondaryQuestions.length > 0 && (
                <div className="bg-white border-l-4 border-teal-500 shadow-sm rounded-r-lg pl-6 pr-8 py-6 h-full">
                  <div className="academic-section-label mb-2">Secondary questions</div>
                  <ul className="list-disc pl-6 space-y-2 text-academic-lg text-academic-neutral-700 font-serif">
                    {secondaryQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Pillar Content Section */}
      {pillarArticle && (
        <section className="py-12 lg:py-16 border-b-2 border-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="academic-section-header mb-8">
            <div className="academic-section-label">PILLAR PIECE</div>
            <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal tracking-tight">
              Featured Work
            </h2>
          </div>

          <button
            onClick={() => onNavigate('insights', { slug: pillarArticle.slug })}
            className="group block w-full text-left"
          >
            <div className="grid md:grid-cols-5 gap-8 academic-card overflow-hidden transition-all">
              {pillarArticle.featured_image && (
                <div className="relative md:col-span-3 overflow-hidden">
                  <OptimizedImage
                    src={pillarArticle.featured_image}
                    alt={pillarArticle.title}
                    variant="hero"
                    loading="lazy"
                    className="image-zoom-effect"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              )}
              <div className={`p-8 md:p-10 flex flex-col justify-center ${pillarArticle.featured_image ? 'md:col-span-2' : 'md:col-span-5'}`}>
                <div className="text-academic-xs font-display font-bold tracking-wider text-teal-600 mb-2">
                  {pillarArticle.published_date && formatDate(pillarArticle.published_date)}
                  {pillarArticle.featured_theme && ' • FEATURED'}
                </div>
                <h3 className="text-academic-2xl md:text-academic-3xl font-display font-bold text-academic-charcoal mb-4 group-hover:text-teal-500 transition-colors leading-tight">
                  {pillarArticle.title}
                </h3>
                {pillarArticle.excerpt && (
                  <p className="text-academic-base text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                    {pillarArticle.excerpt}
                  </p>
                )}
                <div className="text-academic-sm font-display font-semibold text-teal-600">
                  READ THE FULL PIECE →
                </div>
              </div>
            </div>
          </button>
        </div>
      </section>
      )}

      {/* Related Content Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="academic-section-header mb-8">
            <div className="academic-section-label">EXPLORE</div>
            <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal tracking-tight">
              Related Content
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
              <p className="text-academic-neutral-600 font-serif">Loading content...</p>
            </div>
          ) : relatedArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => onNavigate('insights', { slug: article.slug })}
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
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-academic-xs font-display font-bold tracking-wider text-academic-neutral-600 mb-2">
                      {article.published_date && formatDate(article.published_date)}
                    </div>
                    <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-500 transition-colors leading-tight">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-academic-sm text-academic-neutral-700 line-clamp-3 font-serif leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-4 text-academic-sm font-display font-semibold text-teal-600">
                      Read more →
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 academic-card p-12">
              <p className="text-academic-lg text-academic-neutral-700 font-serif mb-4">
                No content available for this theme yet.
              </p>
              <p className="text-academic-sm text-academic-neutral-600 font-serif">
                Content will appear here as articles are published and tagged with this theme.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Series Navigation */}
      {relatedThemes.length > 0 && (
        <section className="py-12 lg:py-16 bg-academic-warm border-t border-academic-neutral-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="academic-section-header mb-8">
              <div className="academic-section-label">EXPLORE</div>
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal tracking-tight">
                Related Themes
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {relatedThemes.map((theme) => (
                <Link
                  key={theme.slug}
                  to={`/topics/${theme.slug}`}
                  className="academic-button academic-button-secondary inline-flex items-center gap-2"
                >
                  {theme.name}
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
