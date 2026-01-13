import { useEffect, useState, lazy, Suspense } from 'react';
import { ArrowRight, BarChart3, MapPin, Quote, Download, FileText, BookOpen, Clock, Target, Route, TrendingUp, Mail } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import OrganizationStructuredData from '../components/OrganizationStructuredData';
import WebSiteStructuredData from '../components/WebSiteStructuredData';
import { supabase } from '../lib/supabase';
import ErrorDisplay from '../components/ErrorDisplay';

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
}

export default function Home({ onNavigate }: HomeProps) {
  const [recentUpdates, setRecentUpdates] = useState<SiteUpdate[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        // Fetch featured article
        const { data: featuredData, error: featuredError } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_date, featured')
          .eq('status', 'published')
          .eq('featured', true)
          .order('published_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (featuredError) {
          console.error('Error fetching featured article:', featuredError);
        } else if (featuredData) {
          setFeaturedArticle(featuredData);
        }

        // Fetch recent articles (excluding featured one)
        const { data: recentData, error: recentError } = await supabase
          .from('articles')
          .select('id, title, slug, excerpt, featured_image, published_date, featured')
          .eq('status', 'published')
          .order('published_date', { ascending: false })
          .limit(4);

        // Handle data and error independently - use data if available even if error exists
        if (recentData && recentData.length > 0) {
          // Filter out featured article if it exists
          const filtered = featuredData 
            ? recentData.filter(a => a.id !== featuredData.id)
            : recentData;
          setRecentArticles(filtered.slice(0, 4));
          
          // If there was an error but we got data, log a warning but don't show error to user
          if (recentError) {
            console.warn('Partial error fetching recent articles, but data was received:', recentError);
          }
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

    // Run queries in parallel for faster loading
    Promise.all([fetchRecentUpdates(), fetchArticles()]);
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
      <div
        className="absolute inset-0 opacity-[0.23] z-0"
        style={{
          backgroundImage: "url('/polling_station.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    );
  };

  return (
    <div className="bg-neutral-50">
      <MetaTags
        title="LGR - Local Government Reorganisation & Reform"
        description="Expert analysis on Local Government Reorganisation (LGR), council reform, and English devolution. Evidence-based research and practical insights."
        keywords="LGR, Local Government Reorganisation, Local Government Reform, Council Reform, English Devolution, unitary authorities, council reorganisation, local government reform UK, local government reorganisation England, council restructuring, devolution England, local authority reorganisation"
      />
      <OrganizationStructuredData />
      <WebSiteStructuredData />
      <section className="relative bg-gradient-to-b from-teal-50 to-white py-[43px] lg:py-[54px] overflow-hidden">
        <StaticBackgroundImage />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Banner Container */}
          <div className="relative min-h-[267px] md:min-h-[335px] flex items-center">
            {/* Banner 1 - What this is */}
            {currentBanner === 0 && (
              <div className={`w-full relative z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-5xl">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-neutral-900 leading-[0.95] mb-4">
                    LGR - Local Government Reorganisation & Council Reform
                  </h1>
                  <h2 className="text-xl sm:text-2xl md:text-3xl text-teal-700 font-bold mb-6">
                    Expert analysis on Local Government Reorganisation, Council Reform, and English Devolution
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl mb-8">
                    The leading resource on Local Government Reorganisation (LGR) and council reform. Evidence-led analysis of how reorganisation and local government reform are reshaping governance, planning, and decision-making across England.
                  </p>
                  <button
                    onClick={() => onNavigate('insights')}
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-full transition-all w-full sm:w-auto font-bold text-sm tracking-wide"
                  >
                    VIEW THE SERIES
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Banner 3 - Election Tracker */}
            {currentBanner === 1 && (
              <div className={`w-full relative z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-5xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 leading-[0.95] mb-4">
                    Election Track 2026
                  </h1>
                  <h2 className="text-xl sm:text-2xl md:text-3xl text-teal-700 font-bold mb-6">
                    Understanding political control, turnout risk and governance implications
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl mb-8">
                    Tracking and scenario modelling to test how election outcomes could shape decision making, legitimacy and early governance choices in the new Surrey councils.
                  </p>
                  <button
                    onClick={() => onNavigate('surrey/election-simulator')}
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-full transition-all w-full sm:w-auto font-bold text-sm tracking-wide"
                  >
                    OPEN ELECTION TRACK 2026
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Banner 2 - Why it matters */}
            {currentBanner === 2 && (
              <div className={`w-full relative z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-5xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 leading-[0.95] mb-4">
                    Putting communities and councillors back at the heart of decision making
                  </h1>
                  <h2 className="text-xl sm:text-2xl md:text-3xl text-teal-700 font-bold mb-6">
                    Why democratic legitimacy will determine whether LGR succeeds
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl mb-8">
                    Too much reorganisation is treated as systems change. This Series focuses on governance, leadership and accountability.
                  </p>
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-full transition-all w-full sm:w-auto font-bold text-sm tracking-wide"
                  >
                    WHY THIS MATTERS
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Banner 4 - Lessons */}
            {currentBanner === 3 && (
              <div className={`w-full relative z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="max-w-5xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 leading-[0.95] mb-4">
                    Lessons from recent reorganisations
                  </h1>
                  <h2 className="text-xl sm:text-2xl md:text-3xl text-teal-700 font-bold mb-6">
                    What Dorset, Somerset, Northumberland and Surrey show us
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl mb-8">
                    Practical lessons drawn from councils already living with reorganisation, before mistakes become fixed.
                  </p>
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-full transition-all w-full sm:w-auto font-bold text-sm tracking-wide"
                  >
                    READ THE INSIGHTS
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* Banner Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
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
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentBanner === index
                      ? 'bg-teal-700 w-8'
                      : 'bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Service Cards Section - Full Width */}
        <section className="grid md:grid-cols-3 gap-4 mb-8" aria-label="Featured services">
          {/* The LGR Road Ahead Card */}
          <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-xl p-4 text-left transition-all duration-300 rounded-xl flex flex-col relative overflow-hidden">
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
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/20">
                <Route size={18} className="text-white" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-neutral-900 mb-2 group-hover:text-indigo-700 transition-colors leading-tight relative z-10">
              The LGR Road Ahead
            </h3>
            <p className="text-xs text-neutral-700 mb-2 line-clamp-2 relative z-10 flex-grow">
              How 2026 is expected to unfold for LGR. Navigate the key milestones, decisions, and transitions.
            </p>
            <div className="mt-auto relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('forecast-2026-27');
              }}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-sm tracking-wide hover:shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] uppercase min-h-[52px] flex items-center justify-center"
            >
              Follow the Journey
            </button>
            </div>
          </div>

          {/* Election Tracker Card (Condensed) */}
          <div className="group bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 hover:border-teal-400 hover:shadow-xl p-4 text-left transition-all duration-300 rounded-xl flex flex-col relative overflow-hidden">
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
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-teal-500/20">
                <TrendingUp size={18} className="text-white" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-neutral-900 mb-2 group-hover:text-teal-700 transition-colors leading-tight relative z-10">
              Election Tracker
            </h3>
            <p className="text-xs text-neutral-700 mb-2 line-clamp-2 relative z-10 flex-grow">
              Track political control, turnout risk and governance scenarios for the new Surrey councils.
            </p>
            <div className="mt-auto relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('surrey/election-tracker');
              }}
              className="w-full bg-gradient-to-r from-teal-700 to-cyan-600 text-white py-4 px-6 rounded-xl font-bold text-sm tracking-wide hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] uppercase min-h-[52px] flex items-center justify-center"
            >
              Start your simulation
            </button>
            </div>
          </div>

          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-slate-50 to-neutral-50 border-2 border-slate-200 hover:border-slate-400 hover:shadow-xl p-4 transition-all duration-300 rounded-xl flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-neutral-800 rounded-lg flex items-center justify-center shadow-lg shadow-slate-500/20">
                <Mail size={18} className="text-white" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-neutral-900 mb-2 leading-tight">
              Weekly Insights
            </h3>
            <p className="text-xs text-neutral-700 mb-2 line-clamp-2 flex-grow">
              Get the LGR Series directly in your inbox. No fluff, just deep analysis.
            </p>
            <div className="mt-auto">
              <Suspense fallback={<div className="h-12 bg-slate-200/50 animate-pulse rounded" />}>
                <SubscriptionForm variant="compact" />
              </Suspense>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section className="border-t-2 border-teal-700 pt-8">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                  FEATURED
                </h2>
                <div className="h-px flex-grow bg-neutral-300"></div>
              </div>

              {loadingArticles ? (
                <div className="bg-white border-2 border-neutral-900 p-12 text-center">
                  <p className="text-neutral-600">Loading featured article...</p>
                </div>
              ) : featuredArticle ? (
                <button
                  onClick={() => onNavigate('insights', featuredArticle.slug)}
                  className="group block w-full"
                >
                  <div className="grid md:grid-cols-5 gap-6 bg-white border-2 border-neutral-900 hover:border-teal-700 overflow-hidden transition-all">
                    <div className="relative h-64 md:h-auto md:col-span-3">
                      <img
                        src={featuredArticle.featured_image || '/Oliver_TNail_Article.png'}
                        alt={featuredArticle.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        width={800}
                        height={600}
                      />
                    </div>
                    <div className={`p-6 md:p-8 flex flex-col justify-center ${featuredArticle.featured_image ? 'md:col-span-2' : 'md:col-span-5'}`}>
                      <div className="text-xs font-bold tracking-wider text-teal-700 mb-3">
                        {featuredArticle.published_date && formatArticleDate(featuredArticle.published_date)}
                        {featuredArticle.featured && ' • EXCLUSIVE'}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-neutral-900 mb-4 group-hover:text-teal-700 transition-colors leading-tight">
                        {featuredArticle.title}
                      </h3>
                      {featuredArticle.excerpt && (
                        <p className="text-neutral-700 leading-relaxed mb-4">
                          {featuredArticle.excerpt}
                        </p>
                      )}
                      <div className="text-sm font-bold text-teal-700">
                        READ THE FULL ARTICLE →
                      </div>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="bg-white border-2 border-neutral-200 p-12 text-center">
                  <p className="text-neutral-600">No featured article available</p>
                </div>
              )}
            </section>

            <section className="border-t-2 border-neutral-900 pt-8">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black text-neutral-900 tracking-tight">
                  MOST RECENT ARTICLES
                </h2>
                <div className="h-px flex-grow bg-neutral-300"></div>
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
                <div className="space-y-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-neutral-200 pb-8">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="h-4 bg-neutral-200 rounded w-32 mb-3 animate-pulse"></div>
                          <div className="h-8 bg-neutral-200 rounded w-3/4 mb-3 animate-pulse"></div>
                          <div className="h-4 bg-neutral-200 rounded w-full mb-2 animate-pulse"></div>
                          <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse"></div>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-48 lg:w-56">
                          <div className="aspect-video md:aspect-square bg-neutral-200 rounded-lg animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentArticles.length > 0 ? (
                <div className="space-y-8">
                  {recentArticles.map((article, index) => (
                    <article key={article.id} className="border-b border-neutral-200 pb-8">
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold tracking-wider text-neutral-700 mb-2">
                            {article.published_date && formatArticleDate(article.published_date)}
                            {article.featured && ' • EXCLUSIVE'}
                          </div>
                          <button
                            onClick={() => onNavigate('insights', article.slug)}
                            className="group text-left w-full"
                          >
                            <h3 className={`font-black text-neutral-900 mb-3 group-hover:text-teal-700 transition-colors leading-tight ${
                              index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'
                            }`}>
                              {article.title}
                            </h3>
                            {article.excerpt && (
                              <p className="text-neutral-700 leading-relaxed mb-3">
                                {article.excerpt}
                              </p>
                            )}
                            <div className="text-sm font-bold text-teal-700">READ MORE →</div>
                          </button>
                        </div>
                        {article.featured_image && (
                          <div className="flex-shrink-0 w-full md:w-48 lg:w-56">
                            <button
                              onClick={() => onNavigate('insights', article.slug)}
                              className="group block w-full"
                            >
                              <div className="relative aspect-video md:aspect-square overflow-hidden rounded-lg border-2 border-neutral-200 group-hover:border-teal-700 transition-colors">
                                <img
                                  src={article.featured_image}
                                  alt={article.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  width={224}
                                  height={224}
                                />
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-white border-2 border-neutral-200 p-12 text-center">
                  <p className="text-neutral-600">No recent articles available</p>
                  <button
                    onClick={() => onNavigate('insights')}
                    className="mt-4 text-teal-700 font-bold hover:text-teal-900 transition-colors"
                  >
                    View All Articles →
                  </button>
                </div>
              )}
            </section>

            <section className="bg-neutral-100 border-2 border-neutral-900 p-8">
              <div className="flex items-start gap-4 mb-6">
                <Quote size={32} className="text-teal-700 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold tracking-wider text-neutral-700 mb-2">
                    EDITOR'S PICK
                  </div>
                  <h3 className="text-2xl font-serif italic text-neutral-900 mb-4">
                    "The First 100 Days: A Playbook for Unitary Transition"
                  </h3>
                  <p className="text-neutral-700 mb-4">
                    Drawing on evidence from recent reorganisations, this playbook identifies critical actions
                    for new unitary authorities in their first 100 days.
                  </p>
                  <button
                    onClick={() => onNavigate('100days')}
                    className="text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors"
                  >
                    READ THE PLAYBOOK →
                  </button>
                </div>
              </div>
            </section>

            <section className="border-t-2 border-teal-700 pt-6">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                  MEET THE EDITOR
                </h2>
                <div className="h-px flex-grow bg-neutral-300"></div>
              </div>

              <div className="bg-white border-2 border-neutral-900 overflow-hidden">
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="relative h-48 md:h-full">
                    <img
                      src="/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg"
                      alt="Rowan Cole - Editor, LGR Series"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="md:col-span-2 p-5 md:p-6 flex flex-col justify-center">
                    <div className="text-xs font-bold tracking-wider text-teal-700 mb-2">
                      EDITOR'S LETTER
                    </div>
                    <h3 className="text-xl font-black text-neutral-900 mb-3 leading-tight">
                      Rowan Cole
                    </h3>
                    <div className="text-neutral-700 leading-relaxed space-y-3 mb-5 text-sm">
                      <p>
                        Local government reorganisation is not just about structures or efficiency savings. It's about power, accountability, and the future of community decision-making. Over the coming months, this series will examine what reorganisation means for communities, councillors, and local democracy itself.
                      </p>
                      <p>
                        Drawing on evidence from recent transitions and exclusive interviews with council leaders, we'll explore the lessons that must inform the next wave of change. Because getting this right matters—not just for councils, but for every community they serve.
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('article', 'editors-letter')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors inline-flex items-center gap-2"
                    >
                      READ THE FULL LETTER
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="border-t-2 border-neutral-900 pt-8 mb-6">
                <h2 className="text-2xl font-black text-neutral-900">
                  RESOURCES & DOWNLOADS
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => onNavigate('materials')}
                  className="group bg-white border-2 border-neutral-200 hover:border-teal-700 p-6 text-left transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-700 transition-colors">
                      <FileText size={24} className="text-teal-700 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 mb-2 group-hover:text-teal-700 transition-colors">
                    FACTSHEETS
                  </h3>
                  <p className="text-sm text-neutral-700 mb-3">
                    One-page summaries of key findings, governance risks, and performance data.
                  </p>
                  <div className="text-sm font-bold text-teal-700">DOWNLOAD →</div>
                </button>

                <button
                  onClick={() => onNavigate('materials')}
                  className="group bg-white border-2 border-neutral-200 hover:border-teal-700 p-6 text-left transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-700 transition-colors">
                      <Download size={24} className="text-teal-700 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-neutral-900 mb-2 group-hover:text-teal-700 transition-colors">
                    REPORTS
                  </h3>
                  <p className="text-sm text-neutral-700 mb-3">
                    Full research reports on reorganisation outcomes, case studies and analysis.
                  </p>
                  <div className="text-sm font-bold text-teal-700">DOWNLOAD →</div>
                </button>

                <div className="relative">
                  <button
                    onClick={() => onNavigate('100days')}
                    className="group bg-white border-2 border-neutral-200 hover:border-teal-700 p-6 text-left transition-all w-full"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-700 transition-colors">
                        <BookOpen size={24} className="text-teal-700 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-neutral-900 mb-2 group-hover:text-teal-700 transition-colors">
                      100 DAYS PLAYBOOK
                    </h3>
                    <p className="text-sm text-neutral-700 mb-3">
                      Framework for managing the critical first 100 days of unitary transition.
                    </p>
                    <div className="text-sm font-bold text-teal-700">ACCESS NOW →</div>
                  </button>
                  <div className="absolute top-4 right-4 bg-teal-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    COMING SOON
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white border-2 border-neutral-900 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-xs font-bold tracking-wider text-teal-700">
                    PODCAST
                  </div>
                </div>
                <h3 className="text-xl font-black text-neutral-900 mb-4">
                  Listen to the LGR Series Podcast
                </h3>
                <p className="text-sm text-neutral-700 mb-4">
                  In-depth conversations with council leaders, experts, and practitioners on local government reorganisation.
                </p>
                <div className="w-full">
                  <iframe
                    style={{ borderRadius: '12px', border: '0' }}
                    src="https://open.spotify.com/embed/show/54saaIzjjQUsW8cEghtmwz?utm_source=generator"
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="LGR Series Podcast on Spotify"
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="border-2 border-neutral-900 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-teal-200">
                  <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target size={20} className="text-white" />
                  </div>
                  <h3 className="text-sm font-black tracking-wider text-neutral-900">
                    PURPOSE OF THE SERIES
                  </h3>
                </div>
                <div className="text-sm sm:text-base text-neutral-700 leading-relaxed sm:leading-loose space-y-4">
                  <p>
                    The LGR Series provides independent, governance led insight into local government reorganisation and devolution.
                  </p>
                  <p>
                    It examines what works, what fails, and how changes in power, accountability and decision making affect political leadership, communities, housing delivery and the wider economy. Drawing on community insight, councillor experience and business perspective, the Series is intended to support reform that works in practice, not just on paper.
                  </p>
                  <p>
                    <button
                      onClick={() => onNavigate('about')}
                      className="text-teal-700 hover:text-teal-800 font-semibold underline transition-colors"
                    >
                      Find out more
                    </button>
                  </p>
                </div>
              </div>

              <div className="border-2 border-neutral-900 bg-white p-6">
                <h3 className="text-sm font-black tracking-wider text-neutral-900 mb-4 border-b-2 border-neutral-200 pb-3">
                  SERIES ROADMAP
                </h3>

                <nav className="space-y-4">
                  <button
                    onClick={() => onNavigate('facts')}
                    className="group flex items-start gap-3 w-full text-left hover:bg-neutral-50 p-2 -mx-2 rounded transition-colors"
                  >
                    <BarChart3 size={20} className="text-teal-700 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-neutral-900 mb-1 group-hover:text-teal-700 transition-colors">
                        FACTS & FIGURES
                      </div>
                      <div className="text-xs text-neutral-700">
                        Key numbers on reorganisation outcomes
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('lessons')}
                    className="group flex items-start gap-3 w-full text-left hover:bg-neutral-50 p-2 -mx-2 rounded transition-colors"
                  >
                    <Quote size={20} className="text-teal-700 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-neutral-900 mb-1 group-hover:text-teal-700 transition-colors">
                        LESSONS
                      </div>
                      <div className="text-xs text-neutral-700">
                        What recent reorganisations have taught us, so we can learn for the future.
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('surrey')}
                    className="group flex items-start gap-3 w-full text-left hover:bg-neutral-50 p-2 -mx-2 rounded transition-colors"
                  >
                    <MapPin size={20} className="text-teal-700 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-neutral-900 mb-1 group-hover:text-teal-700 transition-colors">
                        SURREY FOCUS
                      </div>
                      <div className="text-xs text-neutral-700">
                        The primary risks for Surrey and how they can be avoided before becoming an issue.
                      </div>
                    </div>
                  </button>
                </nav>
              </div>

              <div className="border-2 border-teal-700 bg-teal-50 p-6">
                <h3 className="text-sm font-black tracking-wider text-neutral-900 mb-4 border-b-2 border-teal-200 pb-3">
                  LATEST UPDATES
                </h3>

                {recentUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {recentUpdates.map((update) => {
                      const content = (
                        <>
                          <Clock size={14} className="text-teal-700 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-neutral-900 font-medium leading-snug mb-1">
                              {update.title}
                            </div>
                            <div className="text-teal-700 font-bold">
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
                            className="flex items-start gap-3 text-xs w-full text-left hover:bg-teal-100 p-2 -mx-2 rounded transition-colors cursor-pointer"
                          >
                            {content}
                          </button>
                        );
                      }

                      return (
                        <div key={update.id} className="flex items-start gap-3 text-xs">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-700 italic">No recent updates</p>
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
