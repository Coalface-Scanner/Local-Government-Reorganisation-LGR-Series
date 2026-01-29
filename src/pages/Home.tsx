import { useEffect, useState, lazy, Suspense } from 'react';
import { ArrowRight, MapPin, Quote, FileText, BookOpen, Mail, Building2, Vote, Palette, HelpCircle, Calendar, Users, CheckCircle2, Sparkles, Headphones } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import OrganizationStructuredData from '../components/OrganizationStructuredData';
import WebSiteStructuredData from '../components/WebSiteStructuredData';
import InBriefSection from '../components/InBriefSection';
import ThemeChip from '../components/ThemeChip';
import { supabase } from '../lib/supabase';
import OptimizedImage from '../components/OptimizedImage';
import LoadingSkeleton from '../components/LoadingSkeleton';

// Lazy load heavy components
const SubscriptionForm = lazy(() => import('../components/SubscriptionForm'));

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

export default function Home({ onNavigate }: HomeProps) {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(true);
  const [editorsPicks, setEditorsPicks] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoadingArticles(true);
      
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
        }

        // Fetch recent articles (excluding featured one)
        const { data: recentData, error: recentError } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_site, theme, category')
          .eq('status', 'published')
          .order('published_date', { ascending: false })
          .limit(6);

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
    Promise.all([fetchArticles(), fetchThemes()]);
  }, []);

  const getThemeForArticle = (article: Article): string | null => {
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

  const getTopicSlugForTheme = (themeName: string | null): string | null => {
    if (!themeName) return null;
    const themeMap: Record<string, string> = {
      'Governance and Reform': '/topics/governance-and-reform',
      'Democratic Legitimacy': '/topics/democratic-legitimacy',
      'Statecraft and System Design': '/topics/statecraft-and-system-design',
    };
    return themeMap[themeName] || null;
  };

  return (
    <div className="bg-academic-cream">
      <MetaTags
        title="Local Government Reorganisation"
        description="The definitive specialist source on Local Government Reorganisation (LGR) and LGR governance. Expert analysis, evidence-based research, and practical insights on local government reorganisation, LGR timetable 2026, and council reform across England."
        keywords="LGR, Local Government Reorganisation, Local Government Reorganisation Series, LGR Series, LGR governance, LGR timetable 2026, council reform, English devolution, unitary authorities, council reorganisation, local government reform UK, local government reorganisation England, council restructuring, devolution England, local authority reorganisation"
      />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      
      {/* Hero Section */}
      <section className="relative bg-academic-warm py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/polling_station.png')",
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.5) 50%, rgba(14, 165, 233, 0.4) 100%)'
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-4xl">
            <h1 className="text-academic-4xl sm:text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-4">
              Local Government Reorganisation (LGR) Hub
            </h1>
            <p className="text-academic-lg sm:text-academic-xl md:text-academic-2xl text-academic-neutral-700 leading-relaxed mb-8 font-serif max-w-3xl">
              Clear, practical insight on Local Government Reorganisation in England – timelines, governance, elections and system design – for councillors, officers and partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('topics')}
                className="academic-button academic-button-primary group flex items-center justify-center gap-2 text-sm py-3 px-6 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                Explore the LGR Topics
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('lgr-journey-2026')}
                className="academic-button academic-button-outline group flex items-center justify-center gap-2 text-sm py-3 px-6 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                View the 2026–2028 LGR Roadmap
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* What is LGR Section - 2-Column Layout */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-8 items-stretch">
            {/* Left Column - Main Definition (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="academic-card p-8 md:p-12 bg-gradient-to-br from-teal-50 to-cyan-50 border-l-4 border-teal-600 shadow-md h-full flex flex-col">
                <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-academic-charcoal mb-6">
                  What is Local Government Reorganisation (LGR)?
                </h2>
                <p className="text-academic-lg text-academic-neutral-700 leading-relaxed font-serif flex-grow">
                  Local Government Reorganisation (LGR) is the process of restructuring local government structures in England, typically merging district and county councils to create unitary authorities. LGR aims to simplify governance, improve service delivery, and enable strategic decision-making at the right scale. The process involves shadow authorities, elections, and a transition period before the new unitary councils take full control on vesting day.
                </p>
              </div>
            </div>

            {/* Right Column - In Brief Card (1/3 width, matching height) */}
            <div className="lg:col-span-1 flex">
              <div className="w-full">
                <InBriefSection 
                  content="Local Government Reorganisation (LGR) is the process of restructuring councils and governance arrangements, often replacing two-tier counties and districts with new unitary authorities." 
                  className="mb-0 h-full"
                />
              </div>
            </div>
          </div>

          {/* Key Points Card - Full Width Below */}
          <div className="academic-card p-8 md:p-10 bg-gradient-to-br from-white to-teal-50 border border-teal-200 shadow-md mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal">
                Key Impacts
              </h3>
            </div>
            <ul className="space-y-4 text-academic-base text-academic-neutral-700 font-serif">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="text-teal-600" size={20} />
                </div>
                <span className="leading-relaxed">Creates or merges unitary councils</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="text-teal-600" size={20} />
                </div>
                <span className="leading-relaxed">Changes who makes planning, housing and care decisions</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="text-teal-600" size={20} />
                </div>
                <span className="leading-relaxed">Alters how residents are represented and who they vote for</span>
              </li>
            </ul>
          </div>

          {/* CTA Block - Full Width Below */}
          <div className="academic-card p-6 md:p-8 bg-gradient-to-r from-teal-100 to-cyan-100 border-2 border-teal-300 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">
                  Want to learn more?
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 font-serif">
                  Explore our comprehensive guide to Local Government Reorganisation
                </p>
              </div>
              <button
                onClick={() => onNavigate('facts/what-is-lgr')}
                className="academic-button academic-button-primary inline-flex items-center gap-2 whitespace-nowrap"
              >
                Learn more about LGR
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* Visual Separator */}
        <div className="my-12 border-t border-academic-neutral-200"></div>

        {/* Theme Cards Section - Content Hub */}
        <section id="themes" className="mb-16 scroll-mt-8">
          <div className="academic-section-header mb-8">
            <div className="academic-section-label">EXPLORE BY THEME</div>
            <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-academic-charcoal tracking-tight">
              LGR Topics and Themes
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
                  className="group academic-card p-6 text-left transition-all duration-300 flex flex-col relative overflow-hidden h-full hover:scale-[1.02] hover:shadow-xl hover:border-teal-300 border-2 border-transparent"
                  style={{
                    backgroundImage: banner ? `url(${banner.src})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: banner?.position || 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Background overlay for readability - allows 10% image visibility (90% transparent) */}
                  <div className="absolute inset-0 bg-white z-0 transition-opacity duration-300 group-hover:opacity-85" style={{ opacity: 0.9 }} aria-hidden="true"></div>
                  
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

                  <div className="mb-4 flex flex-wrap gap-2">
                    {theme.slug === 'governance-and-reform' && (
                      <>
                        <ThemeChip theme="Governance" variant="secondary" />
                        <ThemeChip theme="Planning" variant="secondary" />
                        <ThemeChip theme="Accountability" variant="secondary" />
                      </>
                    )}
                    {theme.slug === 'democratic-legitimacy' && (
                      <>
                        <ThemeChip theme="Elections" variant="secondary" />
                        <ThemeChip theme="Representation" variant="secondary" />
                        <ThemeChip theme="Trust" variant="secondary" />
                      </>
                    )}
                    {theme.slug === 'statecraft-and-system-design' && (
                      <>
                        <ThemeChip theme="Leadership" variant="secondary" />
                        <ThemeChip theme="Operating Model" variant="secondary" />
                        <ThemeChip theme="Risk" variant="secondary" />
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate(`topics/${theme.slug}`)}
                    className="academic-button academic-button-outline w-full mt-auto flex items-center justify-center gap-2 text-sm py-2.5"
                    aria-label={`View ${theme.name} topic`}
                  >
                    View topic
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

        {/* Visual Separator */}
        <div className="my-12 border-t border-academic-neutral-200"></div>

        {/* Timelines and Areas Affected */}
        <section className="mb-16">
          <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-academic-charcoal mb-8">
            LGR Timelines and Areas
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="academic-card p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <h3 className="text-academic-xl font-display font-bold text-academic-charcoal">
                  National LGR Roadmap 2026–2028
                </h3>
              </div>
              <p className="text-academic-base text-academic-neutral-700 leading-relaxed mb-6 font-serif">
                The LGR timetable 2026 represents a significant wave of reorganisations across England. Key milestones include shadow elections in 2026, with many new unitary authorities taking full control in 2027 or 2028. Understanding the timeline is essential for effective planning and transition management.
              </p>
              <button
                onClick={() => onNavigate('lgr-journey-2026')}
                className="academic-button academic-button-primary inline-flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              >
                Open the LGR Timetable & Governance Roadmap
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="academic-card p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-l-4 border-emerald-600 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <MapPin className="text-white" size={20} />
                </div>
                <h3 className="text-academic-xl font-display font-bold text-academic-charcoal">
                  Where LGR is Live or Proposed
                </h3>
              </div>
              <ul className="space-y-2 text-academic-base text-academic-neutral-700 font-serif mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold mt-1">•</span>
                  <span>Dorset</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold mt-1">•</span>
                  <span>Somerset</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold mt-1">•</span>
                  <span>Cumbria</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold mt-1">•</span>
                  <span>Buckinghamshire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold mt-1">•</span>
                  <span>Northamptonshire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold mt-1">•</span>
                  <span>Surrey</span>
                </li>
              </ul>
              <button
                onClick={() => onNavigate('facts/council-cases')}
                className="text-teal-700 hover:text-teal-800 font-display font-semibold inline-flex items-center gap-2 transition-colors"
              >
                See all case areas
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Visual Separator */}
        <div className="my-12 border-t border-academic-neutral-200"></div>

        {/* Latest Insights and Interviews */}
        <section className="mb-16">
          <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-academic-charcoal mb-8">
            Latest from the LGR Series
          </h2>
          
          {/* Row 1: Latest Articles */}
          {loadingArticles ? (
            <LoadingSkeleton variant="card" count={4} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" />
          ) : recentArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {recentArticles.map((article) => {
                const articleTheme = getThemeForArticle(article);
                return (
                  <button
                    key={article.id}
                    onClick={() => onNavigate('insights', article.slug)}
                    className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
                  >
                    {article.featured_image ? (
                      <div className="relative mb-4 aspect-video overflow-hidden rounded">
                        <OptimizedImage
                          src={article.featured_image}
                          alt={article.title}
                          variant="thumbnail"
                          loading="lazy"
                          className="image-zoom-effect"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ) : (
                      /* Placeholder if no featured image */
                      <div className="relative mb-4 aspect-video overflow-hidden rounded bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                        <FileText className="text-teal-600" size={48} />
                      </div>
                    )}
                    <h3 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-academic-sm text-academic-neutral-700 mb-3 font-serif line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    {articleTheme && (
                      <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                        <ThemeChip 
                          theme={articleTheme} 
                          variant="secondary" 
                          href={getTopicSlugForTheme(articleTheme) || undefined}
                        />
                      </div>
                    )}
                    <div className="text-academic-xs font-display font-semibold text-teal-600">
                      Read article →
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* Row 2: Editor's Picks */}
          {editorsPicks.length > 0 && (
            <div>
              <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Editor's Picks
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editorsPicks.map((article) => {
                  const articleTheme = getThemeForArticle(article);
                  return (
                    <button
                      key={article.id}
                      onClick={() => onNavigate('insights', article.slug)}
                      className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300 relative"
                    >
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-display font-bold shadow-lg z-10">
                        EDITOR'S PICK
                      </div>
                      {article.featured_image ? (
                        <div className="relative mb-4 aspect-video overflow-hidden rounded">
                          <OptimizedImage
                            src={article.featured_image}
                            alt={article.title}
                            variant="thumbnail"
                            loading="lazy"
                            className="image-zoom-effect"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        /* Placeholder if no featured image */
                        <div className="relative mb-4 aspect-video overflow-hidden rounded bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                          <FileText className="text-amber-600" size={48} />
                        </div>
                      )}
                      <h3 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-academic-sm text-academic-neutral-700 mb-3 font-serif line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      {articleTheme && (
                        <div className="mb-3">
                          <ThemeChip theme={articleTheme} variant="secondary" />
                        </div>
                      )}
                      <div className="text-academic-xs font-display font-semibold text-teal-600">
                        Read article →
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Visual Separator */}
        <div className="my-12 border-t border-academic-neutral-200"></div>

        {/* Tools and Practical Resources */}
        <section className="mb-16">
          <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-academic-charcoal mb-8">
            Tools and Practical Resources
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => onNavigate('lgr-journey-2026')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <Calendar size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                LGR Timetable & Governance Roadmap
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                Overview of key milestones from proposal to vesting day.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <ThemeChip theme="Governance and Reform" variant="secondary" />
              </div>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                Open roadmap →
              </div>
            </button>

            <button
              onClick={() => onNavigate('surrey/election-tracker/simulator')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <Vote size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                Election & Representation Models
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                How ward patterns and election timings change representation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <ThemeChip theme="Democratic Legitimacy" variant="secondary" />
              </div>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                Explore models →
              </div>
            </button>

            <button
              onClick={() => onNavigate('100days')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <BookOpen size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                First 100 Days Playbook
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                Guidance for leaders, cabinet members and senior officers in new authorities.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <ThemeChip theme="Statecraft and System Design" variant="secondary" />
                <ThemeChip theme="Governance and Reform" variant="secondary" />
              </div>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                Read playbook →
              </div>
            </button>

            <button
              onClick={() => onNavigate('lessons')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <Quote size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                Lessons Library
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                Curated reflections and case studies from recent reorganisations.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <ThemeChip theme="All themes" variant="secondary" />
              </div>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                Browse lessons →
              </div>
            </button>
          </div>

          {/* Additional Cards Row - 3 cards with equal heights */}
          <div className="grid md:grid-cols-3 gap-6 mt-8 items-stretch">
            {/* LGR Podcast and Audio Card */}
            <button
              onClick={() => onNavigate('interviews')}
              className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 rounded-lg shadow-md">
                  <Headphones size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                LGR Podcast and Audio
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif flex-grow">
                Conversations with leaders, practitioners and academics on how LGR works in practice.
              </p>
              <div className="text-academic-sm font-display font-semibold text-teal-700">
                View all episodes →
              </div>
            </button>

            {/* Who This Hub Is For Card */}
            <div className="academic-card p-6 text-left transition-all hover:shadow-xl duration-300 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center rounded-lg shadow-md">
                  <Users size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3">
                Who This Hub Is For
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 font-serif flex-grow">
                This hub is designed for councillors, senior officers, partners (NHS, police, universities, voluntary sector), developers, suppliers, and residents who need clear, practical insight on Local Government Reorganisation in England.
              </p>
            </div>

            {/* Stay Informed Card */}
            <div className="academic-card p-3 text-left transition-all hover:shadow-xl duration-300 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center rounded-lg shadow-md">
                  <Mail size={18} className="text-white" />
                </div>
              </div>
              <h3 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">
                Stay Informed on LGR
              </h3>
              <p className="text-academic-sm text-academic-neutral-700 mb-3 font-serif">
                Subscribe to receive updates and new insights from the LGR Series directly in your inbox.
              </p>
              <div className="flex-grow -m-3">
                <Suspense fallback={<div className="h-12 bg-slate-200/50 animate-pulse rounded" />}>
                  <div className="[&>div]:!p-4 [&>div>h3]:!text-base [&>div>h3]:!mb-2 [&>div>p]:!text-xs [&>div>p]:!mb-3 [&>div>form]:!space-y-2 [&>div>form>div>input]:!py-2 [&>div>form>div>input]:!px-3 [&>div>form>div>input]:!text-sm [&>div>form>button]:!py-2 [&>div>form>button]:!text-xs [&>div>form>button]:!min-h-[40px]">
                    <SubscriptionForm variant="default" />
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Section - Full Width */}
        <section className="mb-16">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is LGR?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Local Government Reorganisation (LGR) is the process of restructuring councils and governance arrangements, often replacing two-tier counties and districts with new unitary authorities."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What is the LGR timetable?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The LGR timetable 2026 represents a significant wave of reorganisations across England. Key milestones include shadow elections in 2026, with many new unitary authorities taking full control in 2027 or 2028."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Who decides when reorganisation happens?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Reorganisation proposals are typically initiated by local authorities or the Secretary of State, and require approval from Parliament before implementation."
                    }
                  }
                ]
              })
            }}
          />
          <div className="academic-card p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center rounded-lg shadow-md">
                <HelpCircle size={24} className="text-white" />
              </div>
              <h2 className="text-academic-2xl md:text-academic-3xl font-display font-bold text-academic-charcoal">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">
                  What is LGR?
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 font-serif leading-relaxed">
                  Local Government Reorganisation (LGR) is the process of restructuring councils and governance arrangements, often replacing two-tier counties and districts with new unitary authorities.
                </p>
              </div>
              <div>
                <h3 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">
                  What is the LGR timetable?
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 font-serif leading-relaxed">
                  The LGR timetable 2026 represents a significant wave of reorganisations across England. Key milestones include shadow elections in 2026, with many new unitary authorities taking full control in 2027 or 2028.
                </p>
              </div>
              <div>
                <h3 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">
                  Who decides when reorganisation happens?
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 font-serif leading-relaxed">
                  Reorganisation proposals are typically initiated by local authorities or the Secretary of State, and require approval from Parliament before implementation.
                </p>
              </div>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
}
