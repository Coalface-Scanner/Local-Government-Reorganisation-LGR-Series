import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Building2, Vote, Palette } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { supabase } from '../lib/supabase';
import FAQSection from '../components/FAQSection';
import { ContentContainer } from '../components/layout';

interface TopicsProps {
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
  featured_theme: boolean;
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

export default function Topics({ onNavigate }: TopicsProps) {
  const [themes, setThemes] = useState<ThemeData[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(true);
  const location = useLocation();

  useEffect(() => {
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
          .select('id, title, slug, excerpt, featured_image, published_date, featured, content_type, featured_theme, theme, category')
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

    fetchThemes();
  }, []);

  return (
    <div className="bg-academic-cream">
      <MetaTags
        title="Topics - Core Themes | LGR Initiative"
        description="Explore our research organised around key themes: Governance and Reform, Democratic Legitimacy, and Statecraft and System Design. Each theme features pillar pieces, essays, briefs, and related analysis."
        keywords="local government reorganisation, governance, democratic legitimacy, statecraft, system design, council reform, LGR themes"
      />
      
      <PageBanner
        heroLabel="EXPLORE BY THEME"
        heroTitle="Core Themes"
        heroSubtitle="Explore our research organised around key themes. Each theme features pillar pieces, essays, briefs, and related analysis."
        currentPath={location.pathname}
      />
      
      <ContentContainer variant="hub">
        {/* Theme Cards Section */}
        <section className="layout-section">
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
                          <h2 className="text-academic-2xl font-serif italic font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors leading-tight">
                            {theme.name}
                          </h2>
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
                          <h3 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
                            {theme.pillarArticle.title}
                          </h3>
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

        {/* Navigation Links */}
        <section className="layout-section">
          <div className="academic-card p-8 bg-teal-50 border-l-4 border-teal-600">
            <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
              Explore More
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('')}
                className="academic-button academic-button-outline inline-flex items-center gap-2"
              >
                Back to LGR Hub
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('tools')}
                className="academic-button academic-button-outline inline-flex items-center gap-2"
              >
                View all Tools
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </ContentContainer>
      <FAQSection page="topics" />
    </div>
  );
}
