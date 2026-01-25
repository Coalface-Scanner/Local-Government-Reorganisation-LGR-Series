import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import SubscriptionForm from '../components/SubscriptionForm';
import ErrorDisplay from '../components/ErrorDisplay';
import { Newspaper, Calendar, Clock } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  published_date: string;
  content: string;
  embed_code: string | null;
  excerpt: string | null;
  published: boolean;
  display_order: number;
}

export default function News() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true })
        .order('published_date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setNewsItems(data);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div id="main-content" className="min-h-screen bg-academic-cream">
      <MetaTags
        title="News & Updates"
        description="Latest news, announcements, and updates from the LGR Insights Series. Stay informed about local government reorganisation developments."
        keywords="LGR news, local government updates, council reform news, reorganisation announcements"
      />

      <div className="relative bg-academic-warm py-8 overflow-hidden">
        {/* Colored gradient overlay */}
        <div 
          className="absolute inset-0 opacity-60 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.5) 50%, rgba(14, 165, 233, 0.4) 100%)'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">LATEST UPDATES</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              News{' '}
              <span className="text-teal-700 font-serif italic">
                & Updates
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Stay informed with the latest announcements, analysis, and commentary on local government reorganisation
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal-700 mb-4"></div>
                <p className="text-academic-neutral-600 font-serif">Loading news...</p>
              </div>
            ) : error ? (
              <ErrorDisplay
                title="Unable to Load News"
                message={error}
                onRetry={fetchNews}
              />
            ) : newsItems.length === 0 ? (
              <div className="academic-card p-12 text-center">
                <Newspaper className="mx-auto mb-4 text-academic-neutral-300" size={56} />
                <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-3">No news yet</h3>
                <p className="text-academic-neutral-600 font-serif">Check back soon for updates</p>
              </div>
            ) : (
              <div className="space-y-16">
                {newsItems.map((item, index) => (
                  <article
                    key={item.id}
                    className="academic-card overflow-hidden transition-shadow duration-300"
                  >
                    <div className="p-10 md:p-12 lg:p-14">
                      {/* Date and Time Header */}
                      <div className="flex flex-wrap items-center gap-4 mb-8 pb-5 border-b border-academic-neutral-300">
                        <div className="flex items-center gap-2 text-academic-sm font-display font-medium text-academic-neutral-600">
                          <Calendar size={16} className="text-teal-700" />
                          <time dateTime={item.published_date}>
                            {formatDate(item.published_date)}
                          </time>
                        </div>
                        <div className="flex items-center gap-2 text-academic-sm font-display font-medium text-academic-neutral-500">
                          <Clock size={14} className="text-academic-neutral-400" />
                          <span>{formatTime(item.published_date)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-academic-3xl md:text-academic-4xl lg:text-academic-5xl font-display font-bold text-academic-charcoal mb-8 leading-[1.1] tracking-tight">
                        {item.title}
                      </h2>

                      {/* Excerpt */}
                      {item.excerpt && (
                        <div className="bg-teal-50 border-l-4 border-teal-700 pl-8 pr-6 py-6 mb-10">
                          <p className="text-academic-lg md:text-academic-xl text-academic-neutral-700 leading-relaxed font-serif">
                            {item.excerpt}
                          </p>
                        </div>
                      )}

                      {/* Main Content */}
                      <div
                        className="academic-prose max-w-none mb-8"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />

                      {/* Embed Code */}
                      {item.embed_code && (
                        <div className="my-10 p-6 bg-academic-warm border border-academic-neutral-300" style={{ borderRadius: '2px' }} dangerouslySetInnerHTML={{ __html: item.embed_code }} />
                      )}
                    </div>

                    {/* Divider */}
                    {index < newsItems.length - 1 && (
                      <div className="px-10 md:px-12 lg:px-14 pb-10">
                        <div className="border-t border-academic-neutral-300"></div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-teal-800 text-white p-6">
                <h3 className="text-xl font-black text-white mb-3">
                  The Dispatch
                </h3>
                <p className="text-sm text-white mb-4">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <SubscriptionForm variant="compact" />
              </div>

              <div className="academic-card p-8">
                <h4 className="font-display font-bold text-academic-charcoal mb-6 text-academic-sm tracking-wider border-b-2 border-academic-neutral-300 pb-4">
                  RELATED CONTENT
                </h4>
                <div className="space-y-4">
                  <button
                    onClick={() => window.location.href = '/insights'}
                    className="w-full text-left px-5 py-4 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700 rounded-xl"
                  >
                    View Insights & Analysis →
                  </button>
                  <button
                    onClick={() => window.location.href = '/facts'}
                    className="w-full text-left px-5 py-4 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700 rounded-xl"
                  >
                    View the Facts & Data →
                  </button>
                  <button
                    onClick={() => window.location.href = '/lessons'}
                    className="w-full text-left px-5 py-4 bg-academic-warm hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-academic-sm font-display font-semibold text-academic-neutral-700 hover:text-teal-700 rounded-xl"
                  >
                    Lessons from Reorganisation →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="news" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LastUpdated />
      </div>
    </div>
  );
}
