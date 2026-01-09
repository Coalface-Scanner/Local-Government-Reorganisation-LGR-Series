import { useEffect, useState } from 'react';
import SubscriptionForm from '../components/SubscriptionForm';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import OrganizationStructuredData from '../components/OrganizationStructuredData';
import WelcomeModal from '../components/WelcomeModal';
import { ArrowRight, BarChart3, MapPin, Quote, Download, FileText, BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ErrorDisplay from '../components/ErrorDisplay';

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

  useEffect(() => {
    const fetchRecentUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('site_updates')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching site updates:', error);
          // Site updates are not critical, so we continue without them
          return;
        }

        if (data) {
          setRecentUpdates(data);
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

    fetchRecentUpdates();
    fetchArticles();
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

  return (
    <div className="bg-neutral-50">
      <WelcomeModal onNavigate={onNavigate} />
      <MetaTags
        title="Home"
        description="In-depth analysis and research on local government reorganisation across the United Kingdom. Examining lessons learned, governance risks, and practical guidance for councils undergoing structural reform."
        keywords="local government reorganisation, LGR, council reform, unitary authorities, devolution, UK local government, local democracy"
      />
      <OrganizationStructuredData />
      <section className="relative bg-gradient-to-b from-teal-50 to-white border-b-4 border-neutral-900 py-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.23]"
          style={{
            backgroundImage: `url('/polling_station.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-8">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-3">
              FEATURED ANALYSIS
            </div>
          </div>

          <div className="max-w-5xl">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-neutral-900 leading-[0.95] mb-4">
              The LGR Series:{' '}
              <span className="text-xl sm:text-2xl md:text-3xl text-teal-700 font-serif italic block mt-2">
                Recentering communities & councillors in local decision-making
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed max-w-3xl mb-8">
              What local government reorganisation means for communities, elected members and the opportunities it creates for local leadership.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('lessons')}
                className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-full transition-all w-full sm:w-auto"
              >
                <span className="font-bold text-sm tracking-wide">LEARN THE LESSONS</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('facts')}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-neutral-900 hover:bg-neutral-50 text-neutral-900 font-bold text-sm tracking-wide rounded-full transition-all w-full sm:w-auto"
              >
                EXPLORE FACTS
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                    {featuredArticle.featured_image && (
                      <div className="relative h-64 md:h-auto md:col-span-3">
                        <img
                          src={featuredArticle.featured_image}
                          alt={featuredArticle.title}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                      </div>
                    )}
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
                      <div className="h-4 bg-neutral-200 rounded w-32 mb-3 animate-pulse"></div>
                      <div className="h-8 bg-neutral-200 rounded w-3/4 mb-3 animate-pulse"></div>
                      <div className="h-4 bg-neutral-200 rounded w-full mb-2 animate-pulse"></div>
                      <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : recentArticles.length > 0 ? (
                <div className="space-y-8">
                  {recentArticles.map((article, index) => (
                    <article key={article.id} className="border-b border-neutral-200 pb-8">
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

            <section className="bg-gradient-to-br from-teal-50 to-white border-2 border-teal-700 p-8 md:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold tracking-wider text-teal-700 mb-2">
                    INTERACTIVE TOOL
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-neutral-900 mb-3 leading-tight">
                    Surrey Election Simulator
                  </h3>
                  <p className="text-neutral-700 mb-6 leading-relaxed">
                    Model election outcomes for East and West Surrey unitary authorities. Use our interactive seat planner to explore different scenarios and understand the political composition of the new councils.
                  </p>
                  <button
                    onClick={() => onNavigate('surrey/election-simulator')}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm tracking-wide rounded-full transition-all"
                  >
                    OPEN SIMULATOR
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
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
                    ABOUT THIS SERIES
                  </h3>
                </div>
                <div className="text-sm sm:text-base text-neutral-700 leading-relaxed sm:leading-loose space-y-4">
                  <p>
                    <span className="font-bold text-neutral-900">The LGR Series exists to improve understanding of local government reorganisation</span> by examining what works, what fails and why governance matters more than structural change alone.
                  </p>
                  <p>
                    It treats reorganisation and devolution as intrinsically linked reforms, analysing how power, accountability and decision making shift together, and what that means in practice for planning, leadership and communities.
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

              <div className="bg-teal-800 text-white p-6">
                <h3 className="text-xl font-black mb-3">
                  The Dispatch
                </h3>
                <p className="text-sm text-white mb-4">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <SubscriptionForm variant="compact" />
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FAQSection page="home" />
    </div>
  );
}
