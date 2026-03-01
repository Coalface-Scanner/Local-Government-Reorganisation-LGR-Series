import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, FileText, Building2, Vote, Palette, CheckCircle2 } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import OrganizationStructuredData from '../components/OrganizationStructuredData';
import WebSiteStructuredData from '../components/WebSiteStructuredData';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ContentTypeTag from '../components/ContentTypeTag';
import { parseRSSFeed, extractGuestName, generateIdFromString } from '../lib/rssParser';
import { useScrollDepthTracking } from '../hooks/useScrollDepthTracking';
import { useTimeOnPageTracking } from '../hooks/useTimeOnPageTracking';


interface HomeProps {
  onNavigate: (page: string, slug?: string) => void;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_date: string | null;
  featured: boolean;
  content_type: string | null;
  featured_site: boolean;
  theme?: string | null;
  category?: string | null;
}

interface ThemeData {
  name: string;
  slug: string;
  description: string;
  icon: React.ReactNode;
  pillarArticle: Article | null;
}

interface Interview {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  interview_type: string;
}

const RSS_FEED_URL = import.meta.env.PROD 
  ? '/rss-proxy' 
  : 'https://anchor.fm/s/10d7de5ac/podcast/rss';

export default function Home({ onNavigate }: HomeProps) {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [_loadingArticles, setLoadingArticles] = useState(true);
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(true);
  const [_editorsPicks, setEditorsPicks] = useState<Article[]>([]);
  const [latestEpisodes, setLatestEpisodes] = useState<Interview[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const location = useLocation();

  // Track scroll depth and time on page
  useScrollDepthTracking();
  useTimeOnPageTracking();

  // Convert YouTube URL to embed format
  const convertToEmbedUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    // YouTube short URL: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    
    // Already an embed URL or other format
    if (url.includes('youtube.com/embed') || url.includes('spotify.com/embed')) {
      return url;
    }
    
    return url;
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingArticles(true);
      
      try {
        // Fetch featured site material (featured_site takes priority over featured)
        const { data: featuredData, error: featuredError } = await prerenderSafe(
          supabase.from('articles').select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site').eq('status', 'published').eq('featured_site', true).order('published_date', { ascending: false }).limit(1).maybeSingle(),
          { data: null, error: null }
        );

        // Fallback to legacy featured if no featured_site exists
        let finalFeaturedData = featuredData;
        if (!featuredData) {
          const { data: legacyFeatured } = await prerenderSafe(
            supabase.from('articles').select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site').eq('status', 'published').eq('featured', true).order('published_date', { ascending: false }).limit(1).maybeSingle(),
            { data: null, error: null }
          );
          finalFeaturedData = legacyFeatured;
        }

        if (featuredError) {
          console.error('Error fetching featured material:', featuredError);
        }

        // Fetch recent articles (excluding featured one)
        const { data: recentData, error: recentError } = await prerenderSafe(
          supabase.from('articles').select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site, theme, category').eq('status', 'published').order('published_date', { ascending: false }).limit(6),
          { data: [], error: null }
        );

        // Handle data and error independently - use data if available even if error exists
        if (recentData && recentData.length > 0) {
          // Filter out featured material if it exists
          const filtered = finalFeaturedData 
            ? recentData.filter(a => a.id !== finalFeaturedData.id)
            : recentData;
          setRecentArticles(filtered.slice(0, 4));
          
          // Get editor's picks (featured articles)
          const picks = filtered.filter(a => a.featured || a.featured_site).slice(0, 3);
          setEditorsPicks(picks);
          
          // If there was an error but we got data, silently continue (data is available)
        } else if (recentError) {
          // Only show error if we have no data
          console.error('Error fetching recent articles:', recentError);
        }
      } catch (err) {
        console.error('Unexpected error fetching articles:', err);
      } finally {
        setLoadingArticles(false);
      }
    };

    const fetchThemes = async () => {
      setLoadingThemes(true);
      try {
        // Define theme configurations with fallback descriptions
        const themeConfigs = [
          {
            name: 'Governance and Reform',
            slug: 'governance-and-reform',
            description: 'Analysis of how local government reorganisation reshapes decision making, accountability and planning performance, and what governance discipline is required to make reform work in practice.',
            icon: <Building2 size={24} />,
            themeValues: ['Local Government', 'Governance', 'local government', 'governance'], // Match existing articles
          },
          {
            name: 'Democratic Legitimacy',
            slug: 'democratic-legitimacy',
            description: 'Exploring how scale, electoral systems and institutional design affect representation, public trust and the authority of decision making in newly formed councils.',
            icon: <Vote size={24} />,
            themeValues: ['Democracy', 'democracy', 'Democratic legitimacy', 'Democracy '], // Match existing articles (including trailing space)
          },
          {
            name: 'Statecraft and System Design',
            slug: 'statecraft-and-system-design',
            description: 'Examining how political judgment, institutional design and operational systems combine to determine whether new councils function with clarity, confidence and control.',
            icon: <Palette size={24} />,
            themeValues: ['Public Design', 'public design', 'Public Engagement', 'Public', 'public'], // Match existing articles
          },
        ];

          // Fetch all published articles once
        const { data: allArticles } = await prerenderSafe(
          supabase.from('articles').select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site, featured_theme, theme, category').eq('status', 'published').order('published_date', { ascending: false }),
          { data: [], error: null }
        );

        // Helper function to check if an article matches a theme
        // Returns a score: 2 = exact theme match, 1 = category match, 0 = no match
        const articleMatchesTheme = (article: Article, themeValues: string[]): number => {
          const articleTheme = (article.theme || '').trim().toLowerCase();
          const articleCategory = (article.category || '').trim().toLowerCase();
          
          // Split category by comma for more precise matching
          const categoryParts = articleCategory.split(',').map(c => c.trim().toLowerCase());
          
          for (const themeValue of themeValues) {
            const lowerValue = themeValue.toLowerCase();
            
            // Priority 1: Exact theme match (highest priority)
            if (articleTheme === lowerValue) {
              return 2;
            }
            
            // Priority 2: Category exact match or contains as a whole word
            if (articleCategory === lowerValue || 
                categoryParts.includes(lowerValue) ||
                categoryParts.some(part => part === lowerValue)) {
              return 1;
            }
          }
          
          return 0;
        };

        // Track which articles have been assigned to prevent duplicates
        const assignedArticleIds = new Set<string>();
        
        // Process each theme config and find matching articles
        const themesData: ThemeData[] = themeConfigs.map((config) => {
          if (!allArticles || allArticles.length === 0) {
            return null;
          }

          // Find articles matching this theme, excluding already assigned ones
          const candidateArticles = allArticles
            .filter(article => !assignedArticleIds.has(article.id))
            .map(article => ({
              article,
              matchScore: articleMatchesTheme(article, config.themeValues)
            }))
            .filter(item => item.matchScore > 0)
            .sort((a, b) => {
              // Sort by: match score (higher first), then featured_theme, then featured, then date
              if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
              if (b.article.featured_theme !== a.article.featured_theme) return b.article.featured_theme ? 1 : -1;
              if (b.article.featured !== a.article.featured) return b.article.featured ? 1 : -1;
              return new Date(b.article.published_date || 0).getTime() - new Date(a.article.published_date || 0).getTime();
            });

          if (candidateArticles.length === 0) {
            return null;
          }

          // Get the best matching article
          const pillarArticle = candidateArticles[0].article;
          
          // Mark this article as assigned
          assignedArticleIds.add(pillarArticle.id);

          return {
            name: config.name,
            slug: config.slug,
            description: config.description,
            icon: config.icon,
            pillarArticle: pillarArticle,
          } as ThemeData;
        }).filter((theme): theme is ThemeData => theme !== null);

        // Set themes (already filtered)
        setThemes(themesData);
      } catch (err) {
        console.error('Error fetching themes:', err);
      } finally {
        setLoadingThemes(false);
      }
    };

    // Run queries in parallel for faster loading
    Promise.all([fetchArticles(), fetchThemes()]);
  }, []);

  const fetchLatestEpisodes = useCallback(async () => {
    setLoadingEpisodes(true);
    try {
      // Try database first - get episodes with video URLs
      const { data: dbInterviews } = await prerenderSafe(
        supabase.from('interviews').select('*').eq('status', 'published').not('video_url', 'is', null).order('order_index').limit(5),
        { data: [], error: null }
      );

      if (dbInterviews && dbInterviews.length > 0) {
        const episodes = dbInterviews.map(interview => ({
          id: interview.id,
          name: interview.name,
          title: interview.title,
          description: interview.description || '',
          image_url: interview.image_url,
          audio_url: interview.audio_url,
          video_url: interview.video_url,
          interview_type: interview.interview_type,
        }));
        setLatestEpisodes(episodes);
        setLoadingEpisodes(false);
        return;
      }

      // Fallback to RSS feed - get latest episodes
      const response = await fetch(RSS_FEED_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        },
        mode: 'cors',
      });

      if (response.ok) {
        const xmlText = await response.text();
        if (xmlText && xmlText.trim().length > 0) {
          const rssData = parseRSSFeed(xmlText);
          const episodes = rssData.items.slice(0, 5).map(item => {
            const guestName = extractGuestName(item.title);
            return {
              id: generateIdFromString(item.guid || item.title),
              name: guestName,
              title: item.title,
              description: item.description || '',
              image_url: item.imageUrl || null,
              audio_url: item.audioUrl || null,
              video_url: null,
              interview_type: 'voice_only' as string,
            };
          });
          setLatestEpisodes(episodes);
        }
      }
    } catch (err) {
      console.error('Error fetching latest episodes:', err);
    } finally {
      setLoadingEpisodes(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestEpisodes();
  }, [fetchLatestEpisodes]);

  const _getThemeForArticle = (article: Article): string | null => {
    if (article.theme) {
      const themeLower = article.theme.toLowerCase().trim();
      if (themeLower.includes('governance') || themeLower.includes('local government')) {
        return 'Governance and Reform';
      }
      if (themeLower.includes('democracy') || themeLower.includes('democratic')) {
        return 'Democratic Legitimacy';
      }
      if (themeLower.includes('public design') || themeLower.includes('statecraft')) {
        return 'Statecraft and System Design';
      }
    }
    if (article.category) {
      const categoryLower = article.category.toLowerCase().trim();
      if (categoryLower.includes('governance') || categoryLower.includes('planning')) {
        return 'Governance and Reform';
      }
      if (categoryLower.includes('democracy')) {
        return 'Democratic Legitimacy';
      }
    }
    return null;
  };

  const _getTopicSlugForTheme = (themeName: string | null): string | null => {
    if (!themeName) return null;
    const themeMap: Record<string, string> = {
      'Governance and Reform': '/topics/governance-and-reform',
      'Democratic Legitimacy': '/topics/democratic-legitimacy',
      'Statecraft and System Design': '/topics/statecraft-and-system-design',
    };
    return themeMap[themeName] || null;
  };

  // Format date for article cards (e.g., "2 FEBRUARY 2026")
  const formatArticleDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  };

  return (
    <div className="bg-academic-cream">
      <SEOHead page="home" />
      <MetaTags
        title="Local Government Reorganisation Initiative | Governance & Devolution"
        description="Independent analysis and practical guidance on local government reorganisation, governance reform and devolution, supporting the design of effective new unitary councils."
        keywords="LGR, Local Government Reorganisation, LGR Initiative, LGR governance, LGR timetable 2026, council reform, English devolution, unitary authorities, council reorganisation, local government reform UK, local government reorganisation England, council restructuring, devolution England, local authority reorganisation"
      />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      
      {/* Page Banner with Mission Statement */}
      <PageBanner
        isHomepage={true}
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-hub">
        {/* Article Grid Section */}
        {recentArticles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-start mb-8 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-teal-600 via-teal-600 to-transparent opacity-30"></div>
              <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-teal-700 relative z-10 bg-academic-cream pr-4">
                LATEST
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {recentArticles.slice(0, 6).map((article) => (
                <Link
                  key={article.id}
                  to={`/insights/${article.slug}`}
                  className="group academic-card overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 bg-academic-neutral-200 overflow-hidden rounded relative">
                      {article.featured_image ? (
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          style={{ 
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            display: 'block'
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                          <FileText className="text-teal-600" size={32} />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col py-2">
                      <div className="flex items-center gap-2 mb-2">
                        {article.content_type && (
                          <ContentTypeTag contentType={article.content_type} />
                        )}
                        {article.published_date && (
                          <span className="text-academic-xs text-academic-neutral-500 font-display">
                            {formatArticleDate(article.published_date)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-academic-lg sm:text-academic-xl font-display font-bold text-academic-charcoal group-hover:text-teal-700 transition-colors line-clamp-3 mb-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-academic-sm text-academic-neutral-600 font-serif line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* What is LGR Section - Redesigned */}
        <section className="mb-16">
          <div className="flex items-center justify-start mb-6 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-teal-600 via-teal-600 to-transparent opacity-30"></div>
            <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-teal-700 relative z-10 bg-academic-cream pr-4">
              What is Local Government Reorganisation (LGR)?
            </h2>
          </div>
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 p-8 min-h-[200px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="relative z-10">
              <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-4">What is Local Government Reorganisation?</h3>
              <p className="text-white/90 text-academic-sm md:text-academic-base font-serif mb-6 leading-relaxed">
                Local Government Reorganisation (LGR) is the process of restructuring local government structures in England, typically merging district and county councils to create unitary authorities. LGR aims to simplify governance, improve service delivery, and enable strategic decision-making at the right scale. The process involves shadow authorities, elections, and a transition period before the new unitary councils take full control on vesting day.
              </p>
              <h4 className="text-academic-lg md:text-academic-xl font-display font-bold text-white mb-4">What Does LGR Change?</h4>
              <ul className="space-y-4 text-white/90 text-academic-sm md:text-academic-base font-serif mb-6">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                  <span className="leading-relaxed"><strong>Council structure:</strong> Creates or merges unitary councils, eliminating the two-tier system</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                  <span className="leading-relaxed"><strong>Decision-making:</strong> Changes who makes planning, housing and care decisions</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="text-white" size={20} />
                  </div>
                  <span className="leading-relaxed"><strong>Representation:</strong> Alters how residents are represented and who they vote for</span>
                </li>
              </ul>
              <div className="pt-6 border-t border-white/20">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-2">
                      Want to learn more?
                    </h3>
                    <p className="text-white/90 text-academic-sm md:text-academic-base font-serif">
                      Explore our comprehensive guide to Local Government Reorganisation
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('facts/what-is-lgr')}
                    className="bg-white text-teal-900 px-6 py-3 rounded-lg font-display font-bold text-academic-sm hover:bg-teal-50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    Learn more about LGR
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Current Research Streams Section */}
        <section className="mb-16">
          <div className="flex items-center justify-start mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-teal-600 via-teal-600 to-transparent opacity-30"></div>
            <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-teal-700 relative z-10 bg-academic-cream pr-4">
              CURRENT RESEARCH STREAMS
            </h2>
          </div>
          {loadingThemes ? (
            <LoadingSkeleton variant="card" count={4} className="grid sm:grid-cols-2 gap-6" />
          ) : themes.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {themes.map((theme) => {
                const gradientColors = {
                  'governance-and-reform': 'from-purple-900 via-purple-800 to-purple-900',
                  'democratic-legitimacy': 'from-blue-900 via-blue-800 to-blue-900',
                  'statecraft-and-system-design': 'from-teal-900 via-teal-800 to-teal-900',
                };
                const bgGradient = gradientColors[theme.slug as keyof typeof gradientColors] || 'from-slate-900 via-slate-800 to-slate-900';
                
                // Map theme slugs to banner images (same as theme cards section)
                const bannerImages: Record<string, { src: string; position: string }> = {
                  'democratic-legitimacy': { src: '/Democracy_Banner_Image.jpg', position: 'center' },
                  'governance-and-reform': { src: '/Governance_Banner_Image.jpg', position: 'center bottom' },
                  'statecraft-and-system-design': { src: '/Statecraft_Banner_Image.jpg', position: 'center' },
                };
                const banner = bannerImages[theme.slug];

                return (
                  <div
                    key={theme.slug}
                    onClick={() => onNavigate(`topics/${theme.slug}`)}
                    className={`group relative overflow-hidden rounded-lg bg-gradient-to-br ${bgGradient} p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-between`}
                    style={{
                      backgroundImage: banner ? `url(${banner.src})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: banner?.position || 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Gradient overlay to retain colors */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-80 group-hover:opacity-70 transition-opacity duration-300`}></div>
                    <div className="relative z-10">
                      <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                        {theme.name}
                      </h3>
                      <p className="text-white/90 text-academic-sm md:text-academic-base font-serif">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                );
              })}
              {/* All our materials card */}
              {themes.length < 4 && (
                <Link
                  to="/materials"
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-8 min-h-[200px] flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="relative z-10">
                    <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                      All our materials
                    </h3>
                    <p className="text-white/90 text-academic-sm md:text-academic-base font-serif">
                      Explore all research, insights, case studies, and resources from the LGR Initiative
                    </p>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Placeholder cards */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 min-h-[200px] flex flex-col justify-between"
                >
                  <div className="relative z-10">
                    <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                      Research Stream {i}
                    </h3>
                    <p className="text-white/90 text-academic-sm md:text-academic-base font-serif">
                      Evidence and analysis from the LGR research programme.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Meet LGR Initiative Section */}
        <section className="mb-16">
          <div className="flex items-center justify-start mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-teal-600 via-teal-600 to-transparent opacity-30"></div>
            <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-teal-700 relative z-10 bg-academic-cream pr-4">
              MEET LGR SERIES
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/rowan-cole-local-government-reorganisation"
              className="group relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-teal-800 p-6 rounded-lg transition-all duration-300 hover:scale-105 text-center min-h-[140px] flex flex-col justify-center"
              style={{
                backgroundImage: "url('/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Gradient overlay to maintain readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-800 opacity-80 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <h3 className="text-academic-lg font-display font-bold text-white mb-2">
                  Our Team
                </h3>
                <p className="text-white/90 text-academic-xs font-serif">
                  Learn about the people behind the LGR Initiative
                </p>
              </div>
            </Link>
            <Link
              to="/about/contributors/contribute"
              className="group relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-teal-800 p-6 rounded-lg transition-all duration-300 hover:scale-105 text-center min-h-[140px] flex flex-col justify-center"
              style={{
                backgroundImage: "url('/Oliver_TNail_Article.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Gradient overlay to maintain readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-800 opacity-80 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <h3 className="text-academic-lg font-display font-bold text-white mb-2">
                  Contributors
                </h3>
                <p className="text-white/90 text-academic-xs font-serif">
                  How to contribute to the LGR Initiative
                </p>
              </div>
            </Link>
            <Link
              to="/about/contributors"
              className="group relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-teal-800 p-6 rounded-lg transition-all duration-300 hover:scale-105 text-center min-h-[140px] flex flex-col justify-center"
              style={{
                backgroundImage: "url('/coalface-logo.png')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Gradient overlay to maintain readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-800 opacity-80 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <h3 className="text-academic-lg font-display font-bold text-white mb-2">
                  Partners
                </h3>
                <p className="text-white/90 text-academic-xs font-serif">
                  Meet the organisations supporting our work
                </p>
              </div>
            </Link>
            <Link
              to="/about"
              className="group bg-teal-600 hover:bg-teal-700 p-6 rounded-lg transition-all duration-300 hover:scale-105 text-center"
            >
              <h3 className="text-academic-lg font-display font-bold text-white mb-2">
                About
              </h3>
              <p className="text-white/90 text-academic-xs font-serif">
                Learn more about the LGR Initiative
              </p>
            </Link>
          </div>
        </section>

        {/* Timelines and Areas Affected */}
        <section className="mb-16">
          <div className="flex items-center justify-start mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-teal-600 via-teal-600 to-transparent opacity-30"></div>
            <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-teal-700 relative z-10 bg-academic-cream pr-4">
              LGR Timelines and Areas
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('lgr-journey-2026')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-between"
            >
              <div className="relative z-10">
                <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                  National LGR Roadmap 2026–2028
                </h3>
                <p className="text-white/90 text-academic-sm md:text-academic-base font-serif mb-4">
                  The LGR timetable 2026 represents a significant wave of reorganisations across England. Key milestones include shadow elections in 2026, with many new unitary authorities taking full control in 2027 or 2028. Understanding the timeline is essential for effective planning and transition management.
                </p>
                <div className="text-white/90 text-academic-xs font-display font-semibold">
                  Open the LGR Timetable & Governance Roadmap →
                </div>
              </div>
            </button>
            <button
              onClick={() => onNavigate('facts/council-cases')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-between"
            >
              <div className="relative z-10">
                <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                  Where LGR is Live or Proposed
                </h3>
                <ul className="space-y-2 text-white/90 text-academic-sm md:text-academic-base font-serif mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold mt-1">•</span>
                    <span>Dorset</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold mt-1">•</span>
                    <span>Somerset</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold mt-1">•</span>
                    <span>Cumbria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold mt-1">•</span>
                    <span>Buckinghamshire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold mt-1">•</span>
                    <span>Northamptonshire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold mt-1">•</span>
                    <span>Surrey</span>
                  </li>
                </ul>
                <div className="text-white/90 text-academic-xs font-display font-semibold">
                  See all case areas →
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* First 100 Days Podcast */}
        <section className="mb-16">
          <div className="flex items-center justify-start mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-teal-600 via-teal-600 to-transparent opacity-30"></div>
            <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-teal-700 relative z-10 bg-academic-cream pr-4">
              First 100 Days Podcast
            </h2>
          </div>
          
          {/* Banner Image - Cropped */}
          <Link
            to="/interviews"
            className="block mb-8 group overflow-hidden rounded-lg"
          >
            <div className="w-full h-48 md:h-64 overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
              <img
                src="/LGR-100Podcast-Youtube-Banner.png"
                alt="First 100 Days Podcast"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex flex-col items-center justify-center text-white p-8 text-center">
                        <h3 class="text-2xl md:text-3xl font-bold mb-2">First 100 Days Podcast</h3>
                        <p class="text-lg opacity-90">Listen to expert interviews on Local Government Reorganisation</p>
                        <span class="mt-4 text-sm opacity-75">Click to view all episodes →</span>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </Link>

          {/* Latest Episodes - Video Embeds */}
          {loadingEpisodes ? (
            <div className="mb-8">
              <LoadingSkeleton variant="article" count={3} />
            </div>
          ) : latestEpisodes.length > 0 ? (
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-academic-charcoal mb-6 text-center">
                Latest Episodes
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestEpisodes.map((episode) => {
                  const embedUrl = convertToEmbedUrl(episode.video_url);
                  if (!embedUrl) return null;
                  
                  return (
                    <div key={episode.id} className="space-y-3">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          style={{
                            borderRadius: '12px',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                          }}
                          src={embedUrl}
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          title={episode.title}
                        />
                      </div>
                      <h4 className="text-lg font-bold text-academic-charcoal line-clamp-2">
                        {episode.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>

        {/* Tools and Practical Resources */}
        <section className="mb-16">
          <div className="flex items-center justify-start mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-teal-600 via-teal-600 to-transparent opacity-30"></div>
            <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-teal-700 relative z-10 bg-academic-cream pr-4">
              Tools and Practical Resources
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => onNavigate('lgr-journey-2026')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-between"
            >
              <div className="relative z-10">
                <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                  LGR Timetable & Governance Roadmap
                </h3>
                <p className="text-white/90 text-academic-sm md:text-academic-base font-serif mb-4">
                  Overview of key milestones from proposal to vesting day.
                </p>
                <div className="text-white/90 text-academic-xs font-display font-semibold">
                  Open roadmap →
                </div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('surrey/election-tracker/simulator')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-between"
            >
              <div className="relative z-10">
                <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                  Election & Representation Models
                </h3>
                <p className="text-white/90 text-academic-sm md:text-academic-base font-serif mb-4">
                  How ward patterns and election timings change representation.
                </p>
                <div className="text-white/90 text-academic-xs font-display font-semibold">
                  Explore models →
                </div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('100days')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-between"
            >
              <div className="relative z-10">
                <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                  First 100 Days Playbook
                </h3>
                <p className="text-white/90 text-academic-sm md:text-academic-base font-serif mb-4">
                  Guidance for leaders, cabinet members and senior officers in new authorities.
                </p>
                <div className="text-white/90 text-academic-xs font-display font-semibold">
                  Read playbook →
                </div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('lessons')}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-h-[200px] flex flex-col justify-between"
            >
              <div className="relative z-10">
                <h3 className="text-academic-xl md:text-academic-2xl font-display font-bold text-white mb-3">
                  Lessons Library
                </h3>
                <p className="text-white/90 text-academic-sm md:text-academic-base font-serif mb-4">
                  Curated reflections and case studies from recent reorganisations.
                </p>
                <div className="text-white/90 text-academic-xs font-display font-semibold">
                  Browse lessons →
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection page="home" />

      </div>
    </div>
  );
}
