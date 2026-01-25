import { useEffect, useState, lazy, Suspense } from 'react';
import { ArrowRight, BarChart3, MapPin, Quote, Download, FileText, BookOpen, Clock, Target, Route, TrendingUp, Mail, Building2, Vote, Palette, HelpCircle } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import OrganizationStructuredData from '../components/OrganizationStructuredData';
import WebSiteStructuredData from '../components/WebSiteStructuredData';
import { supabase } from '../lib/supabase';
import ErrorDisplay from '../components/ErrorDisplay';
import OptimizedImage from '../components/OptimizedImage';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ContentTypeTag from '../components/ContentTypeTag';

// Lazy load heavy components
const SubscriptionForm = lazy(() => import('../components/SubscriptionForm'));
const FAQSection = lazy(() => import('../components/FAQSection'));

interface HomeProps {
  onNavigate: (page: string, slug?: string) => void;
}

interface SiteUpdate {
  id: string;
  title: string;
  description: string | null;
  update_type: string;
  created_at: string;
  link_page: string | null;
  link_slug: string | null;
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

export default function Home({ onNavigate }: HomeProps) {
  const [recentUpdates, setRecentUpdates] = useState<SiteUpdate[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(true);

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('site_updates')
          .select('id, title, description, update_type, created_at, link_page, link_slug')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching site updates:', error);
          // Site updates are not critical, so we continue without them
          return;
        }

        if (data) {
          // Remove duplicates based on title and created_at
          const uniqueUpdates = data.filter((update, index, self) =>
            index === self.findIndex((u) => 
              u.title === update.title && 
              u.created_at === update.created_at
            )
          );
          setRecentUpdates(uniqueUpdates);
        }
      } catch (err) {
        console.error('Unexpected error fetching updates:', err);
      }
    };

    const fetchArticles = async () => {
      setLoadingArticles(true);
      setError(null);
      
      try {
        // Fetch featured site material (featured_site takes priority over featured)
        const { data: featuredData, error: featuredError } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site')
          .eq('status', 'published')
          .eq('featured_site', true)
          .order('published_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Fallback to legacy featured if no featured_site exists
        let finalFeaturedData = featuredData;
        if (!featuredData) {
          const { data: legacyFeatured } = await supabase
            .from('articles')
            .select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site')
            .eq('status', 'published')
            .eq('featured', true)
            .order('published_date', { ascending: false })
            .limit(1)
            .maybeSingle();
          finalFeaturedData = legacyFeatured;
        }

        if (featuredError) {
          console.error('Error fetching featured material:', featuredError);
        } else if (finalFeaturedData) {
          setFeaturedArticle(finalFeaturedData);
        }

        // Fetch recent articles (excluding featured one)
        const { data: recentData, error: recentError } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site')
          .eq('status', 'published')
          .order('published_date', { ascending: false })
          .limit(4);

        // Handle data and error independently - use data if available even if error exists
        if (recentData && recentData.length > 0) {
          // Filter out featured material if it exists
          const filtered = finalFeaturedData 
            ? recentData.filter(a => a.id !== finalFeaturedData.id)
            : recentData;
          setRecentArticles(filtered.slice(0, 4));
          
          // If there was an error but we got data, silently continue (data is available)
        } else if (recentError) {
          // Only show error if we have no data
          console.error('Error fetching recent articles:', recentError);
          setError('Unable to load articles. Please refresh the page.');
        }
      } catch (err) {
        console.error('Unexpected error fetching articles:', err);
        setError('Unable to load content. Please refresh the page.');
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
        const { data: allArticles } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site, featured_theme, theme, category')
          .eq('status', 'published')
          .order('published_date', { ascending: false });

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
    Promise.all([fetchRecentUpdates(), fetchArticles(), fetchThemes()]);
  }, []);

  // Banner rotation logic
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % 4);
        setIsTransitioning(false);
      }, 500); // Transition duration
    }, 8000); // Change banner every 8 seconds

    return () => clearInterval(bannerInterval);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatArticleDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).toUpperCase();
  };

  // Static background image - loads once and stays static while text rotates
  const StaticBackgroundImage = () => {
    return (
      <div className="absolute inset-0 z-0">
        {/* Background image with color overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/polling_station.png')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        {/* Colored gradient overlay */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.5) 50%, rgba(14, 165, 233, 0.4) 100%)'
          }}
        />
      </div>
    );
  };

  return (
    <div className="bg-academic-cream">
      <MetaTags
        title="LGR - Local Government Reorganisation & Reform"
        description="Expert analysis on Local Government Reorganisation (LGR), council reform, and English devolution. Evidence-based research and practical insights."
        keywords="LGR, Local Government Reorganisation, Local Government Reform, Council Reform, English Devolution, unitary authorities, council reorganisation, local government reform UK, local government reorganisation England, council restructuring, devolution England, local authority reorganisation"
      />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <section className="relative bg-academic-warm py-6 lg:py-10 overflow-hidden">
        <StaticBackgroundImage />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Banner Container */}
          <div className="relative h-[227px] md:h-[285px] flex items-center overflow-hidden">
            {/* Banner 1 - What this is */}
            {currentBanner === 0 && (
              <div className={`absolute inset-0 w-full flex items-center z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-5xl px-4">
                  <h1 className="text-academic-3xl sm:text-academic-4xl md:text-academic-5xl font-display font-black text-academic-charcoal leading-[1.1] mb-2">
                    Council Reform with Expert Insights
                  </h1>
                  <h2 className="text-academic-lg sm:text-academic-xl md:text-academic-2xl text-teal-700 font-display font-semibold mb-2">
                    Expert analysis on Council Reform, and English Devolution
                  </h2>
                  <p className="text-academic-base sm:text-academic-lg text-academic-neutral-700 leading-snug max-w-3xl mb-3 font-serif line-clamp-2">
                    The leading resource on Local Government Reorganisation (LGR) and council reform. Evidence-led analysis of how reorganisation and local government reform are reshaping governance, <span className="underline">planning</span>, and decision-making across England.
                  </p>
                  <button
                    onClick={() => onNavigate('insights')}
                    className="academic-button academic-button-primary group flex items-center justify-center gap-2 w-full sm:w-auto text-sm py-2 px-4"
                  >
                    VIEW THE SERIES
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Banner 3 - Election Tracker */}
            {currentBanner === 1 && (
              <div className={`absolute inset-0 w-full flex items-center z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-5xl px-4">
                  <h1 className="text-academic-3xl sm:text-academic-4xl md:text-academic-5xl font-display font-black text-academic-charcoal leading-[1.1] mb-2">
                    Election Tracker 2026
                  </h1>
                  <h2 className="text-academic-lg sm:text-academic-xl md:text-academic-2xl text-teal-700 font-display font-semibold mb-2">
                    Understanding political control, turnout risk and governance implications
                  </h2>
                  <p className="text-academic-base sm:text-academic-lg text-academic-neutral-700 leading-snug max-w-3xl mb-3 font-serif line-clamp-2">
                    Tracking and scenario modelling to test how election outcomes could shape decision making, legitimacy and early governance choices in the new Surrey councils.
                  </p>
                  <button
                    onClick={() => onNavigate('surrey/election-simulator')}
                    className="academic-button academic-button-primary group flex items-center justify-center gap-2 w-full sm:w-auto text-sm py-2 px-4"
                  >
                    OPEN ELECTION TRACK 2026
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Banner 2 - Why it matters */}
            {currentBanner === 2 && (
              <div className={`absolute inset-0 w-full flex items-center z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-5xl px-4">
                  <h1 className="text-academic-2xl sm:text-academic-3xl md:text-academic-4xl font-display font-black text-academic-charcoal leading-[1.1] mb-2">
                    Putting communities and councillors back at the heart of decision making
                  </h1>
                  <h2 className="text-academic-base sm:text-academic-lg md:text-academic-xl text-teal-700 font-display font-semibold mb-2">
                    Why democratic legitimacy will determine whether LGR succeeds
                  </h2>
                  <p className="text-academic-sm sm:text-academic-base text-academic-neutral-700 leading-snug max-w-3xl mb-3 font-serif line-clamp-2">
                    Too much reorganisation is treated as systems change. This Series focuses on governance, leadership and accountability.
                  </p>
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="academic-button academic-button-primary group flex items-center justify-center gap-2 w-full sm:w-auto text-sm py-2 px-4"
                  >
                    WHY THIS MATTERS
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Banner 4 - Lessons */}
            {currentBanner === 3 && (
              <div className={`absolute inset-0 w-full flex items-center z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-5xl px-4">
                  <h1 className="text-academic-3xl sm:text-academic-4xl md:text-academic-5xl font-display font-black text-academic-charcoal leading-[1.1] mb-2">
                    Lessons from recent reorganisations
                  </h1>
                  <h2 className="text-academic-lg sm:text-academic-xl md:text-academic-2xl text-teal-700 font-display font-semibold mb-2">
                    What Dorset, Somerset, Northumberland and Surrey show us
                  </h2>
                  <p className="text-academic-base sm:text-academic-lg text-academic-neutral-700 leading-snug max-w-3xl mb-3 font-serif line-clamp-2">
                    Practical lessons drawn from councils already living with reorganisation, before mistakes become fixed.
                  </p>
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="academic-button academic-button-primary group flex items-center justify-center gap-2 w-full sm:w-auto text-sm py-2 px-4"
                  >
                    READ THE INSIGHTS
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Banner Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentBanner(index);
                      setIsTransitioning(false);
                    }, 500);
                  }}
                  className={`h-3 transition-all rounded-xl ${
                    currentBanner === index
                      ? 'bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 w-8'
                      : 'bg-academic-neutral-300 hover:bg-academic-neutral-400 w-3'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Theme Cards Section - Content Hub */}
        <section className="mb-12">
          <div className="academic-section-header mb-8">
            <div className="academic-section-label">EXPLORE BY THEME</div>
            <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-academic-charcoal tracking-tight">
              Core Themes
            </h2>
            <p className="text-academic-lg text-academic-neutral-700 mt-4 font-serif max-w-3xl">
              Explore our research organised around key themes. Each theme features pillar pieces, essays, briefs, and related analysis.
            </p>
          </div>

          {loadingThemes ? (
            <LoadingSkeleton variant="card" count={3} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" />
          ) : themes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Theme cards">
              {themes.map((theme) => {
                // Map theme slugs to banner images
                const bannerImages: Record<string, { src: string; position: string }> = {
                  'democratic-legitimacy': { src: '/Democracy_Banner_Image.jpg', position: 'center' },
                  'governance-and-reform': { src: '/Governance_Banner_Image.jpg', position: 'center bottom' },
                  'statecraft-and-system-design': { src: '/Statecraft_Banner_Image.jpg', position: 'center' },
                };
                const banner = bannerImages[theme.slug];
                
                return (
                <div
                  key={theme.slug}
                  className="group academic-card p-6 text-left transition-all duration-300 flex flex-col relative overflow-hidden h-full"
                  style={{
                    backgroundImage: banner ? `url(${banner.src})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: banner?.position || 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Background overlay for readability - allows 10% image visibility (90% transparent) */}
                  <div className="absolute inset-0 bg-white z-0" style={{ opacity: 0.9 }} aria-hidden="true"></div>
                  
                  {/* Content layer */}
                  <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-teal-50 flex items-center justify-center transition-all duration-300 group-hover:bg-teal-100 group-hover:scale-110 rounded-lg text-teal-600">
                      {theme.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-academic-2xl font-serif italic font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors leading-tight">
                        {theme.name}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-academic-base text-academic-charcoal mb-4 font-serif leading-relaxed flex-grow font-medium">
                    {theme.description}
                  </p>

                  {theme.pillarArticle && (
                    <div className="mb-4 pb-4 border-b border-academic-neutral-300">
                      <div className="text-academic-xs font-display font-bold tracking-wider text-teal-700 mb-1">
                        FEATURED PIECE
                      </div>
                      <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
                        {theme.pillarArticle.title}
                      </h4>
                      {theme.pillarArticle.excerpt && (
                        <p className="text-academic-sm text-academic-neutral-800 line-clamp-2 font-serif">
                          {theme.pillarArticle.excerpt}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => onNavigate(`topics/${theme.slug}`)}
                    className="academic-button academic-button-outline w-full mt-auto flex items-center justify-center gap-2 text-sm py-2.5"
                    aria-label={`Explore ${theme.name} topic`}
                  >
                    Explore Topic
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="academic-card p-12 text-center">
              <p className="text-academic-lg text-academic-neutral-700 font-serif mb-4">
                No themes with content available yet.
              </p>
              <p className="text-academic-sm text-academic-neutral-600 font-serif">
                Theme cards will appear here as articles are published and tagged with themes.
              </p>
            </div>
          )}
        </section>

        {/* Legacy Service Cards Section - Keep for now but can be removed later */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 hidden" aria-label="Featured services">
          {/* The LGR Road Ahead Card */}
          <div className="group academic-card p-3 text-left transition-all duration-300 flex flex-col relative overflow-hidden">
            {/* Decorative Road Outline */}
            <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 40 L110 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M10 35 L110 35" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M10 45 L110 45" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="30" cy="40" r="4" fill="currentColor" />
                <circle cx="60" cy="40" r="4" fill="currentColor" />
                <circle cx="90" cy="40" r="4" fill="currentColor" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 mb-1 relative z-10">
              <div className="w-9 h-9 bg-gradient-teal flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <Route size={18} className="text-white" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-0.5 group-hover:text-academic-blue-700 transition-colors leading-tight relative z-10">
              The LGR Road Ahead
            </h3>
            <p className="text-academic-sm text-academic-neutral-700 mb-1.5 line-clamp-2 relative z-10 flex-grow font-serif leading-snug">
              How 2026 is expected to unfold for LGR. <span className="underline">Navigate</span> the key milestones, decisions, and transitions.
            </p>
            <div className="mt-auto relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('lgr-journey-2026');
              }}
              className="academic-button academic-button-primary w-full min-h-[40px] flex items-center justify-center text-xs py-2 px-4"
            >
              Follow the Journey
            </button>
            </div>
          </div>

          {/* Election Tracker Card (Condensed) */}
          <div className="group academic-card p-3 text-left transition-all duration-300 flex flex-col relative overflow-hidden">
            {/* Decorative Chart Outline */}
            <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="20" y1="70" x2="20" y2="10" stroke="currentColor" strokeWidth="2" />
                <line x1="20" y1="70" x2="110" y2="70" stroke="currentColor" strokeWidth="2" />
                <polyline points="30,60 50,45 70,35 90,25 110,20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="30" cy="60" r="3" fill="currentColor" />
                <circle cx="50" cy="45" r="3" fill="currentColor" />
                <circle cx="70" cy="35" r="3" fill="currentColor" />
                <circle cx="90" cy="25" r="3" fill="currentColor" />
                <circle cx="110" cy="20" r="3" fill="currentColor" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 mb-1 relative z-10">
              <div className="w-9 h-9 bg-gradient-teal flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <TrendingUp size={18} className="text-white" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-0.5 group-hover:text-teal-500 transition-colors leading-tight relative z-10">
              Election Tracker
            </h3>
            <p className="text-academic-sm text-academic-neutral-700 mb-1.5 line-clamp-2 relative z-10 flex-grow font-serif leading-snug">
              Track political control, turnout risk and governance scenarios for the new Surrey councils.
            </p>
            <div className="mt-auto relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('surrey/election-tracker');
              }}
              className="academic-button academic-button-primary w-full min-h-[40px] flex items-center justify-center text-xs py-2 px-4"
            >
              Start your simulation
            </button>
            </div>
          </div>

          {/* Articles & Reports Card */}
          <div className="group academic-card p-3 text-left transition-all duration-300 flex flex-col relative overflow-hidden">
            {/* Decorative Document Outline */}
            <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="15" width="60" height="50" stroke="currentColor" strokeWidth="2" fill="none" rx="2" />
                <line x1="40" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="1.5" />
                <line x1="40" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="1.5" />
                <line x1="40" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="35" cy="25" r="3" fill="currentColor" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 mb-1 relative z-10">
              <div className="w-9 h-9 bg-gradient-teal flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <FileText size={18} className="text-white" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-0.5 group-hover:text-teal-500 transition-colors leading-tight relative z-10">
              Articles & Reports
            </h3>
            <p className="text-academic-sm text-academic-neutral-700 mb-1.5 line-clamp-2 relative z-10 flex-grow font-serif leading-snug">
              In-depth analysis, research reports, and downloadable resources on LGR and council reform.
            </p>
            <div className="mt-auto relative z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('insights');
                }}
                className="academic-button academic-button-primary w-full min-h-[40px] flex items-center justify-center text-xs py-2 px-4"
              >
                Browse Articles
              </button>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="group academic-card p-3 transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1 relative z-10">
              <div className="w-9 h-9 bg-gradient-to-br from-academic-neutral-700 to-academic-neutral-800 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <Mail size={18} className="text-white" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-0.5 group-hover:text-academic-neutral-800 transition-colors leading-tight relative z-10">
              Weekly Insights
            </h3>
            <p className="text-academic-sm text-academic-neutral-700 mb-1.5 line-clamp-2 flex-grow font-serif leading-snug relative z-10">
              Get the LGR Series directly in your inbox. No fluff, just deep analysis.
            </p>
            <div className="mt-auto relative z-10">
              <Suspense fallback={<div className="h-12 bg-slate-200/50 animate-pulse rounded" />}>
                <SubscriptionForm variant="compact" />
              </Suspense>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <section className="border-t-2 border-teal-500 pt-8">
              <div className="academic-section-header mb-8">
                <div className="academic-section-label">FEATURED</div>
                <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal tracking-tight">
                  Featured Material
                </h2>
              </div>

              {loadingArticles ? (
                <LoadingSkeleton variant="article" count={1} />
              ) : featuredArticle ? (
                <button
                  onClick={() => onNavigate('insights', featuredArticle.slug)}
                  className="group block w-full"
                >
                  <div className="academic-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-transparent hover:border-teal-200">
                    <div className="grid md:grid-cols-5 gap-0">
                      <div className="relative md:col-span-3 overflow-hidden flex items-center justify-center min-h-[300px] md:min-h-[450px] bg-academic-neutral-100">
                        <OptimizedImage
                          src={featuredArticle.featured_image || '/Oliver_TNail_Article.png'}
                          alt={featuredArticle.title}
                          variant="hero"
                          loading="lazy"
                          className="image-zoom-effect w-full h-full object-cover"
                        />
                        {/* Featured badge */}
                        {featuredArticle.featured_site && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg z-10">
                            <div className="text-academic-xs font-display font-bold tracking-wider">FEATURED</div>
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        {/* Teal accent bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </div>
                      <div className={`p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-white ${featuredArticle.featured_image ? 'md:col-span-2' : 'md:col-span-5'}`}>
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <div className="text-academic-xs font-display font-bold tracking-wider text-teal-600 uppercase">
                            {featuredArticle.published_date && formatArticleDate(featuredArticle.published_date)}
                            {featuredArticle.featured && ' • EXCLUSIVE'}
                          </div>
                          {featuredArticle.content_type && (
                            <ContentTypeTag contentType={featuredArticle.content_type} />
                          )}
                        </div>
                        <h3 className="text-academic-2xl md:text-academic-3xl lg:text-academic-4xl font-display font-bold text-academic-charcoal mb-4 group-hover:text-teal-600 transition-colors duration-300 leading-tight">
                          {featuredArticle.title}
                        </h3>
                        {featuredArticle.excerpt && (
                          <p className="text-academic-base md:text-academic-lg text-academic-neutral-700 leading-relaxed mb-6 font-serif line-clamp-3">
                            {featuredArticle.excerpt}
                          </p>
                        )}
                        <div className="inline-flex items-center gap-2 text-academic-sm md:text-academic-base font-display font-semibold text-teal-600 group-hover:text-teal-700 transition-colors duration-300 mt-auto">
                          <span>READ THE FULL ARTICLE</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="academic-card p-12 text-center">
                  <p className="text-academic-neutral-600 font-serif">No featured material available</p>
                </div>
              )}
            </section>

            <section className="border-t-2 border-academic-neutral-900 pt-8">
              <div className="academic-section-header mb-8">
                <div className="academic-section-label">LATEST</div>
                <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal tracking-tight">
                  Most Recent Articles
                </h2>
              </div>

              {error && (
                <ErrorDisplay
                  message={error}
                  onRetry={() => {
                    setError(null);
                    window.location.reload();
                  }}
                  className="mb-8"
                />
              )}

              {loadingArticles ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-academic-neutral-300 pb-6">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        <div className="flex-1 min-w-0">
                          <div className="h-4 bg-academic-neutral-200 w-32 mb-4 animate-pulse"></div>
                          <div className="h-8 bg-academic-neutral-200 w-3/4 mb-4 animate-pulse"></div>
                          <div className="h-4 bg-academic-neutral-200 w-full mb-2 animate-pulse"></div>
                          <div className="h-4 bg-academic-neutral-200 w-2/3 animate-pulse"></div>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-48 lg:w-56">
                          <div className="aspect-video md:aspect-square bg-academic-neutral-200 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentArticles.length > 0 ? (
                <div className="space-y-6">
                  {recentArticles.map((article, index) => (
                    <article key={article.id} className="border-b border-academic-neutral-300 pb-6">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <div className="text-academic-xs font-display font-bold tracking-wider text-academic-neutral-700">
                              {article.published_date && formatArticleDate(article.published_date)}
                              {article.featured && ' • EXCLUSIVE'}
                            </div>
                            {article.content_type && (
                              <ContentTypeTag contentType={article.content_type} />
                            )}
                          </div>
                          <button
                            onClick={() => onNavigate('insights', article.slug)}
                            className="group text-left w-full"
                          >
                            <h3 className={`font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-500 transition-colors leading-tight ${
                              index === 0 ? 'text-academic-3xl md:text-academic-4xl' : 'text-academic-2xl'
                            }`}>
                              {article.title}
                            </h3>
                            {article.excerpt && (
                              <p className="text-academic-base text-academic-neutral-700 leading-relaxed mb-3 font-serif">
                                {article.excerpt}
                              </p>
                            )}
                            <div className="text-academic-sm font-display font-semibold text-teal-600">READ MORE →</div>
                          </button>
                        </div>
                        {article.featured_image && (
                          <div className="flex-shrink-0 w-full md:w-48 lg:w-56">
                            <button
                              onClick={() => onNavigate('insights', article.slug)}
                              className="group block w-full"
                              aria-label={`View article: ${article.title}`}
                            >
                              <div className="relative overflow-hidden group-hover:border-teal-500 transition-all duration-300 rounded-sm">
                                <OptimizedImage
                                  src={article.featured_image}
                                  alt={article.title}
                                  variant="thumbnail"
                                  loading="lazy"
                                  className="image-zoom-effect"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="academic-card p-12 text-center">
                  <p className="text-academic-neutral-600 font-serif">No recent articles available</p>
                    <button
                      onClick={() => onNavigate('insights')}
                      className="mt-4 text-teal-600 font-display font-semibold hover:text-teal-500 transition-colors"
                    >
                      View All Articles →
                    </button>
                </div>
              )}
            </section>

            <section className="bg-academic-warm border border-academic-neutral-300 p-8">
              <div className="flex items-start gap-6 mb-6">
                <Quote size={40} className="text-teal-500 flex-shrink-0" />
                <div>
                  <div className="text-academic-xs font-display font-bold tracking-wider text-academic-neutral-700 mb-2">
                    EDITOR'S PICK
                  </div>
                  <h3 className="text-academic-2xl font-serif italic text-academic-charcoal mb-4">
                    "The First 100 Days: A Playbook for Unitary Transition"
                  </h3>
                  <p className="text-academic-base text-academic-neutral-700 mb-4 font-serif leading-relaxed">
                    Drawing on evidence from recent reorganisations, this playbook identifies critical actions
                    for new unitary authorities in their first 100 days.
                  </p>
                  <button
                    onClick={() => onNavigate('100days')}
                    className="text-academic-sm font-display font-semibold text-teal-600 hover:text-teal-500 transition-colors"
                  >
                    READ THE PLAYBOOK →
                  </button>
                </div>
              </div>
            </section>

            <section className="border-t-2 border-teal-500 pt-8">
              <div className="academic-section-header mb-8">
                <div className="academic-section-label">EDITORIAL</div>
                <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal tracking-tight">
                  Meet the Editor
                </h2>
              </div>

              <div className="academic-card overflow-hidden">
                <div className="grid md:grid-cols-3 gap-0">
                  <div className="relative flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[400px]">
                    <OptimizedImage
                      src="/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg"
                      alt="Rowan Cole - Editor, LGR Series"
                      variant="thumbnail"
                      className="border-0 rounded-none w-full"
                    />
                  </div>
                  <div className="md:col-span-2 p-8 md:p-10 flex flex-col justify-center">
                    <div className="text-academic-xs font-display font-bold tracking-wider text-teal-700 mb-2">
                      EDITOR'S LETTER
                    </div>
                    <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4 leading-tight">
                      Rowan Cole
                    </h3>
                    <div className="text-academic-base text-academic-neutral-700 leading-relaxed space-y-3 mb-4 font-serif">
                      <p>
                        Local government reorganisation is not just about structures or efficiency savings. It's about power, accountability, and the future of community decision-making. Over the coming months, this series will examine what reorganisation means for communities, councillors, and local democracy itself.
                      </p>
                      <p>
                        Drawing on evidence from recent transitions and exclusive interviews with council leaders, we'll explore the lessons that must inform the next wave of change. Because getting this right matters—not just for councils, but for every community they serve.
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('article', 'editors-letter')}
                      className="text-academic-sm font-display font-semibold text-teal-700 hover:text-teal-800 transition-colors inline-flex items-center gap-2"
                    >
                      READ THE FULL LETTER
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="border-t-2 border-teal-700 pt-8 mb-8">
                <div className="academic-section-header mb-6">
                  <div className="academic-section-label">RESOURCES</div>
                  <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal tracking-tight">
                    Resources & Downloads
                  </h2>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => onNavigate('materials')}
                  className="group academic-card p-6 text-left transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center transition-colors">
                      <FileText size={24} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                    Factsheets
                  </h3>
                  <p className="text-academic-sm text-academic-neutral-700 mb-3 font-serif">
                    One-page summaries of key findings, governance risks, and performance data.
                  </p>
                  <div className="text-academic-sm font-display font-semibold text-teal-700">DOWNLOAD →</div>
                </button>

                <button
                  onClick={() => onNavigate('materials')}
                  className="group academic-card p-6 text-left transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center transition-colors">
                      <Download size={24} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                    Reports
                  </h3>
                  <p className="text-academic-sm text-academic-neutral-700 mb-3 font-serif">
                    Full research reports on reorganisation outcomes, case studies and analysis.
                  </p>
                  <div className="text-academic-sm font-display font-semibold text-teal-700">DOWNLOAD →</div>
                </button>

                <div className="relative">
                  <button
                    onClick={() => onNavigate('100days')}
                    className="group academic-card p-6 text-left transition-all w-full"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-teal-700 flex items-center justify-center transition-colors">
                        <BookOpen size={24} className="text-white" />
                      </div>
                    </div>
                    <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                      100 Days Playbook
                    </h3>
                    <p className="text-academic-sm text-academic-neutral-700 mb-3 font-serif">
                      Framework for managing the critical first 100 days of unitary transition.
                    </p>
                    <div className="text-academic-sm font-display font-semibold text-teal-700">ACCESS NOW →</div>
                  </button>
                  <div className="absolute top-4 right-4 bg-teal-700 text-white px-3 py-1 text-academic-xs font-display font-bold rounded-xl">
                    COMING SOON
                  </div>
                </div>
              </div>

              <div className="mt-8 academic-card p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-academic-xs font-display font-bold tracking-wider text-teal-700">
                    PODCAST
                  </div>
                </div>
                <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-3">
                  Listen to the LGR Series Podcast
                </h3>
                <p className="text-academic-base text-academic-neutral-700 mb-4 font-serif">
                  In-depth conversations with council leaders, experts, and practitioners on local government reorganisation.
                </p>
                <div className="w-full">
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/ryOhO6_rA8A?si=898pGIhVVWfTAasE"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              <div className="academic-card p-6">
                <div className="flex items-center gap-4 mb-4 pb-3 border-b border-academic-neutral-300">
                  <div className="w-12 h-12 bg-gradient-teal flex items-center justify-center flex-shrink-0">
                    <Target size={24} className="text-white" />
                  </div>
                  <h3 className="text-academic-sm font-display font-bold tracking-wider text-academic-charcoal">
                    OUR MISSION
                  </h3>
                </div>
                <div className="text-academic-base text-academic-neutral-700 leading-relaxed space-y-4 font-serif">
                  <p>
                    The LGR Series provides independent, governance led insight into local government reorganisation and devolution, with a clear focus on democratic leadership and community confidence.
                  </p>
                  <p>
                    It examines what works, what fails, and how changes in power, accountability and decision making shape the ability of elected representatives and communities to influence outcomes. The Series explores the implications for political leadership, planning, housing and service delivery, public trust and local economic decision making.
                  </p>
                  <p>
                    The Series is informed by the Editor's experience as an elected councillor and as a council officer, offering practical insight into how governance change is experienced by those accountable to communities and those responsible for delivery. It is intended to support reform that works in practice, strengthens democratic authority, and is capable of commanding public confidence rather than existing only on paper.
                  </p>
                  <p>
                    <button
                      onClick={() => onNavigate('about')}
                      className="text-teal-700 hover:text-teal-800 font-display font-semibold underline transition-colors"
                    >
                      Find out more
                    </button>
                  </p>
                </div>
              </div>

              <div className="academic-card p-6 bg-teal-50 border-2 border-teal-200">
                <div className="flex items-center gap-4 mb-4 pb-3 border-b border-teal-300">
                  <div className="w-12 h-12 bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <HelpCircle size={24} className="text-white" />
                  </div>
                  <h3 className="text-academic-sm font-display font-bold tracking-wider text-academic-charcoal">
                    THE CENTRAL QUESTION
                  </h3>
                </div>
                <p className="text-academic-base text-academic-charcoal leading-relaxed font-serif font-medium italic">
                  Does local government reorganisation strengthen or weaken the ability of communities and their elected representatives to shape decisions and deliver outcomes at scale?
                </p>
                <button
                  onClick={() => onNavigate('about')}
                  className="mt-4 text-teal-700 hover:text-teal-800 font-display font-semibold text-sm underline transition-colors"
                >
                  Learn more about our approach
                </button>
              </div>

              <div className="academic-card p-6">
                <h3 className="text-academic-sm font-display font-bold tracking-wider text-academic-charcoal mb-4 border-b-2 border-academic-neutral-300 pb-3">
                  SERIES ROADMAP
                </h3>

                <nav className="space-y-4">
                  <button
                    onClick={() => onNavigate('facts')}
                    className="group flex items-start gap-4 w-full text-left hover:bg-academic-warm p-3 -mx-3 transition-colors"
                  >
                    <BarChart3 size={24} className="text-teal-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-500 transition-colors text-academic-base">
                        Facts & Figures
                      </div>
                      <div className="text-academic-sm text-academic-neutral-600 font-serif">
                        Key numbers on reorganisation outcomes
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('lessons')}
                    className="group flex items-start gap-4 w-full text-left hover:bg-academic-warm p-3 -mx-3 transition-colors"
                  >
                    <Quote size={24} className="text-teal-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-500 transition-colors text-academic-base">
                        Lessons
                      </div>
                      <div className="text-academic-sm text-academic-neutral-600 font-serif">
                        What recent reorganisations have taught us, so we can learn for the future.
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('surrey')}
                    className="group flex items-start gap-4 w-full text-left hover:bg-academic-warm p-3 -mx-3 transition-colors"
                  >
                    <MapPin size={24} className="text-teal-500 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-500 transition-colors text-academic-base">
                        Surrey Focus
                      </div>
                      <div className="text-academic-sm text-academic-neutral-600 font-serif">
                        The primary risks for Surrey and how they can be avoided before becoming an issue.
                      </div>
                    </div>
                  </button>
                </nav>
              </div>

              <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-600 text-white p-6">
                <h3 className="text-academic-sm font-display font-bold tracking-wider text-white mb-4 border-b-2 border-white/30 pb-3">
                  LATEST UPDATES
                </h3>

                {recentUpdates.length > 0 ? (
                  <div className="space-y-3">
                    {recentUpdates.map((update) => {
                      const content = (
                        <>
                          <Clock size={14} className="text-white/80 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium leading-snug mb-1">
                              {update.title}
                            </div>
                            <div className="text-white/80 font-bold text-xs">
                              {formatTimeAgo(update.created_at)}
                            </div>
                          </div>
                        </>
                      );

                      if (update.link_page) {
                        return (
                          <button
                            key={update.id}
                            onClick={() => onNavigate(update.link_page!, update.link_slug || undefined)}
                            className="flex items-start gap-3 text-academic-sm w-full text-left hover:bg-teal-900/30 p-2 -mx-2 transition-colors cursor-pointer rounded"
                          >
                            {content}
                          </button>
                        );
                      }

                      return (
                        <div key={update.id} className="flex items-start gap-3 text-academic-sm">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-white/70 italic">No recent updates</p>
                )}
              </div>

            </div>
          </aside>
        </div>
      </div>

      <Suspense fallback={<div className="min-h-[400px] bg-slate-50 animate-pulse rounded-lg" />}>
        <FAQSection page="home" />
      </Suspense>
    </div>
  );
}
