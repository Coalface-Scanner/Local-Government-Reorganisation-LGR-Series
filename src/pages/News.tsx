import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import { Newspaper, Calendar } from 'lucide-react';

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
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div id="main-content" className="min-h-screen bg-neutral-50">
      <MetaTags
        title="News & Updates"
        description="Latest news, announcements, and updates from the LGR Insights Series. Stay informed about local government reorganisation developments."
        keywords="LGR news, local government updates, council reform news, reorganisation announcements"
      />

      <div className="relative bg-gradient-to-b from-teal-50 to-white border-b-4 border-neutral-900 py-16">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-6">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-3">
              LATEST UPDATES
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-6">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
            <p className="mt-4 text-slate-600">Loading news...</p>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-lg border border-slate-200 text-center">
            <Newspaper className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No news yet</h3>
            <p className="text-slate-600">Check back soon for updates</p>
          </div>
        ) : (
          <div className="space-y-16">
            {newsItems.map((item, index) => (
              <article
                key={item.id}
                className="bg-white border-2 border-neutral-900 overflow-hidden"
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-teal-700 uppercase mb-6">
                    <Calendar size={16} />
                    {formatDate(item.published_date)}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-6 leading-tight">
                    {item.title}
                  </h2>

                  {item.excerpt && (
                    <div className="border-l-4 border-teal-700 pl-6 mb-8">
                      <p className="text-lg text-neutral-700 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                  )}

                  <div
                    className="prose prose-lg max-w-none mb-8
                    prose-headings:font-black prose-headings:text-neutral-900 prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:font-black
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-bold
                    prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3 prose-h4:font-bold
                    prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:mb-5 prose-p:text-base
                    prose-strong:text-neutral-900 prose-strong:font-bold
                    prose-a:text-teal-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-teal-700 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-neutral-700 prose-blockquote:text-lg prose-blockquote:my-6
                    prose-hr:border-neutral-300 prose-hr:my-10
                    prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2 prose-ul:mb-5
                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2 prose-ol:mb-5
                    prose-li:text-neutral-700 prose-li:leading-relaxed
                    prose-code:text-neutral-900 prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />

                  {item.embed_code && (
                    <div className="my-10 p-6 bg-neutral-50 rounded-lg border-2 border-neutral-200" dangerouslySetInnerHTML={{ __html: item.embed_code }} />
                  )}
                </div>

                {index < newsItems.length - 1 && (
                  <div className="border-t-4 border-neutral-900"></div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <FAQSection page="news" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LastUpdated />
      </div>
    </div>
  );
}
