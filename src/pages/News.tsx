import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import SubscriptionForm from '../components/SubscriptionForm';
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

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true })
        .order('published_date', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        // Still set loading to false even on error
        setLoading(false);
        return;
      }

      if (data) {
        setNewsItems(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching news:', err);
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
    <div id="main-content" className="min-h-screen bg-neutral-50">
      <MetaTags
        title="News & Updates"
        description="Latest news, announcements, and updates from the LGR Insights Series. Stay informed about local government reorganisation developments."
        keywords="LGR news, local government updates, council reform news, reorganisation announcements"
      />

      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              LATEST UPDATES
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            News{' '}
            <span className="text-teal-700 font-serif italic">
              & Updates
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Stay informed with the latest announcements, analysis, and commentary on local government reorganisation
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal-700 mb-4"></div>
                <p className="text-neutral-600 font-medium">Loading news...</p>
              </div>
            ) : newsItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-neutral-200 text-center">
                <Newspaper className="mx-auto mb-4 text-neutral-300" size={56} />
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">No news yet</h3>
                <p className="text-neutral-600">Check back soon for updates</p>
              </div>
            ) : (
              <div className="space-y-12 lg:space-y-16">
                {newsItems.map((item, index) => (
                  <article
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-8 md:p-10 lg:p-12">
                      {/* Date and Time Header */}
                      <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                          <Calendar size={16} className="text-teal-700" />
                          <time dateTime={item.published_date}>
                            {formatDate(item.published_date)}
                          </time>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
                          <Clock size={14} className="text-neutral-400" />
                          <span>{formatTime(item.published_date)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 mb-6 leading-[1.1] tracking-tight">
                        {item.title}
                      </h2>

                      {/* Excerpt */}
                      {item.excerpt && (
                        <div className="bg-gradient-to-r from-teal-50 to-white border-l-4 border-teal-700 pl-6 pr-4 py-4 mb-8 rounded-r-lg">
                          <p className="text-lg md:text-xl text-neutral-700 leading-relaxed font-medium">
                            {item.excerpt}
                          </p>
                        </div>
                      )}

                      {/* Main Content */}
                      <div
                        className="prose prose-lg md:prose-xl max-w-none mb-8
                        prose-headings:font-black prose-headings:text-neutral-900 prose-headings:tracking-tight
                        prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:font-black prose-h1:leading-tight
                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:font-black prose-h2:leading-tight
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-bold prose-h3:leading-snug
                        prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-bold prose-h4:leading-snug
                        prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base md:prose-p:text-lg
                        prose-strong:text-neutral-900 prose-strong:font-bold
                        prose-a:text-teal-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-a:decoration-2
                        prose-blockquote:border-l-4 prose-blockquote:border-teal-700 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-neutral-700 prose-blockquote:text-lg prose-blockquote:bg-neutral-50 prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:font-medium
                        prose-hr:border-neutral-200 prose-hr:my-10 prose-hr:border-t-2
                        prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-3 prose-ul:mb-6 prose-ul:pl-2
                        prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-3 prose-ol:mb-6 prose-ol:pl-2
                        prose-li:text-neutral-700 prose-li:leading-relaxed prose-li:marker:text-teal-700 prose-li:marker:font-bold
                        prose-code:text-neutral-900 prose-code:bg-neutral-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                        prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:shadow-lg prose-pre:my-8
                        prose-img:rounded-xl prose-img:shadow-md prose-img:my-8 prose-img:border prose-img:border-neutral-200
                        prose-table:border-collapse prose-table:w-full prose-table:my-6
                        prose-th:border prose-th:border-neutral-300 prose-th:bg-neutral-100 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-bold prose-th:text-neutral-900
                        prose-td:border prose-td:border-neutral-300 prose-td:px-4 prose-td:py-3 prose-td:text-neutral-700"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />

                      {/* Embed Code */}
                      {item.embed_code && (
                        <div className="my-10 p-6 bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm" dangerouslySetInnerHTML={{ __html: item.embed_code }} />
                      )}
                    </div>

                    {/* Divider */}
                    {index < newsItems.length - 1 && (
                      <div className="px-8 md:px-10 lg:px-12 pb-8">
                        <div className="border-t border-neutral-200"></div>
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
                <h3 className="text-xl font-black mb-3">
                  The Dispatch
                </h3>
                <p className="text-sm text-white mb-4">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <SubscriptionForm variant="compact" />
              </div>

              <div className="border-2 border-neutral-900 bg-white p-6">
                <h4 className="font-black text-neutral-900 mb-4 text-sm tracking-wider border-b-2 border-neutral-200 pb-3">
                  RELATED CONTENT
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '/insights'}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    View Insights & Analysis →
                  </button>
                  <button
                    onClick={() => window.location.href = '/facts'}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    View the Facts & Data →
                  </button>
                  <button
                    onClick={() => window.location.href = '/lessons'}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
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
