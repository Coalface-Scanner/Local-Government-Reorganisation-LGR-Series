import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import PageNavigation from '../components/PageNavigation';
import ErrorDisplay from '../components/ErrorDisplay';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Mic, Calendar, Users, FileText, Headphones, ExternalLink, Video, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { parseRSSFeed, extractGuestName, generateIdFromString, type RSSItem } from '../lib/rssParser';

interface InterviewsProps {
  onNavigate: (page: string) => void;
}

interface Interview {
  id: string;
  name: string;
  title: string;
  organization: string | null;
  description: string;
  image_url: string | null;
  video_url: string | null;
  interview_type: string;
  audio_url: string | null;
  transcript: string | null;
  status: string;
  order_index: number;
}

// RSS Feed URL - use Netlify Edge Function proxy to avoid CORS issues
// In production, use the edge function. In development, fallback to direct URL
// (Note: Direct URL may have CORS issues - use Netlify Dev for full functionality)
const RSS_FEED_URL = import.meta.env.PROD 
  ? '/rss-proxy' 
  : 'https://anchor.fm/s/10d7de5ac/podcast/rss';

export default function Interviews({ onNavigate }: InterviewsProps) {
  const location = useLocation();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navItems = [
    { id: 'interviews', label: 'Interviews', icon: <Mic size={16} /> }
  ];

  /**
   * Transform RSS item to Interview interface
   */
  const transformRSSItemToInterview = useCallback((item: RSSItem, _index: number): Interview => {
    const guestName = extractGuestName(item.title);
    const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
    
    return {
      id: generateIdFromString(item.guid || item.title),
      name: guestName,
      title: item.title,
      organization: item.author || null,
      description: item.description || '',
      image_url: item.imageUrl || null,
      video_url: null,
      interview_type: 'voice_only',
      audio_url: item.audioUrl || null,
      transcript: null,
      status: 'published',
      order_index: -pubDate.getTime(), // Negative timestamp for descending order (newest first)
    };
  }, []);

  /**
   * Fetch episodes from RSS feed
   */
  const fetchRSSFeed = useCallback(async (): Promise<Interview[]> => {
    try {
      const response = await fetch(RSS_FEED_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      
      if (!xmlText || xmlText.trim().length === 0) {
        throw new Error('RSS feed returned empty content');
      }

      const rssData = parseRSSFeed(xmlText);

      // Transform RSS items to Interview format
      const rssInterviews = rssData.items.map((item, index) =>
        transformRSSItemToInterview(item, index)
      );

      // Sort by order_index (newest first)
      return rssInterviews.sort((a, b) => b.order_index - a.order_index);
    } catch (err) {
      console.error('Error fetching RSS feed:', err);
      
      // Provide more specific error messages
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach RSS feed. Please check your internet connection.');
      } else if (err instanceof Error) {
        throw err;
      } else {
        throw new Error('Unknown error occurred while fetching RSS feed');
      }
    }
  }, [transformRSSItemToInterview]);

  /**
   * Fetch interviews from database
   */
  const fetchDatabaseInterviews = useCallback(async (): Promise<Interview[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('interviews')
        .select('*')
        .eq('status', 'published')
        .order('order_index');

      if (fetchError) {
        throw fetchError;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching database interviews:', err);
      throw err;
    }
  }, []);

  /**
   * Fetch interviews - try database first, fallback to RSS feed
   */
  const fetchInterviews = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      // Try database first
      let dbInterviews: Interview[] = [];
      try {
        dbInterviews = await fetchDatabaseInterviews();
        if (dbInterviews.length > 0) {
          setInterviews(dbInterviews);
          setLoading(false);
          return;
        }
      } catch (dbError) {
        console.warn('Database fetch failed, falling back to RSS feed:', dbError);
        // Continue to RSS feed fallback
      }

      // Fallback to RSS feed if database is empty or failed
      try {
        const rssInterviews = await fetchRSSFeed();
        if (rssInterviews.length > 0) {
          setInterviews(rssInterviews);
        } else {
          // Both sources returned empty - show empty state, not error
          setInterviews([]);
        }
      } catch (rssError) {
        console.error('RSS feed fetch failed:', rssError);
        // If database also failed, show error. Otherwise, show empty state
        if (dbInterviews.length === 0) {
          const errorMessage = rssError instanceof Error 
            ? rssError.message 
            : 'Failed to load interviews. Please check your connection and try again.';
          setError(errorMessage);
        } else {
          // Database worked but returned empty, RSS failed - just show empty state
          setInterviews([]);
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching interviews:', err);
      setError('Failed to load interviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fetchRSSFeed, fetchDatabaseInterviews]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="LGR Governance Interviews - Council Leaders & Practitioners"
        description="In-depth interviews with council leaders, officers, and practitioners on Local Government Reorganisation (LGR) and LGR governance. First-hand accounts and expert perspectives on local government reorganisation reform."
        keywords="LGR interviews, LGR governance interviews, Local Government Reorganisation interviews, council leader interviews, local government insights, reorganisation experiences, practitioner perspectives, LGR Series interviews"
      />
      <PageBanner
        heroLabel="EXPERT PERSPECTIVES"
        heroTitle="LGR Governance Interviews"
        heroSubtitle="In-depth conversations with leaders and practitioners who have experienced Local Government Reorganisation (LGR) firsthand. Expert insights on LGR governance and council reform."
        currentPath={location.pathname}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-12 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200 academic-card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mic className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">About the Interview Series</h2>
              <p className="text-slate-700 leading-relaxed mb-3">
                This series features candid conversations with political leaders, planning professionals, and senior officers
                who have navigated local government reorganisation. Each interview explores governance decisions, practical
                challenges, and lessons learned from the implementation process.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Interviews are available in multiple formats: <strong>on-camera video</strong>, <strong>voice-only audio</strong>,
                and <strong>written transcripts</strong>, giving you flexible ways to engage with expert insights on your schedule.
              </p>
            </div>
          </div>
        </div>

        {/* Spotify Video Embed */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 text-center">
            Latest Episode of LGR: Maps, Mayhem & The Lame Ducks
          </h2>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  data-testid="embed-iframe"
                  style={{
                    borderRadius: '12px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                  src="https://open.spotify.com/embed/episode/0pjXWahul3yCzOQU941lQ3/video?utm_source=generator"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Latest Episode of LGR: Maps, Mayhem & The Lame Ducks"
                />
              </div>
            </div>
          </div>
        </div>

        <div id="interviews" className="grid lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-3">
              <LoadingSkeleton variant="article" count={3} />
            </div>
          ) : error ? (
            <div className="col-span-3">
              <ErrorDisplay
                title="Unable to Load Interviews"
                message={error}
                onRetry={fetchInterviews}
              />
            </div>
          ) : interviews.length === 0 ? (
            <div className="col-span-3 text-center py-12 academic-card p-12">
              <Mic className="mx-auto mb-4 text-academic-neutral-300" size={48} />
              <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-3">No interviews available yet</h3>
              <p className="text-academic-neutral-600 font-serif">Check back soon for new interviews</p>
            </div>
          ) : (
            interviews.map((interview) => (
              <div key={interview.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300 group">
                {interview.image_url && (
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={interview.image_url}
                      alt={`${interview.name} interview`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width={400}
                      height={400}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {interview.status === 'coming_soon' && (
                        <span className="inline-block px-4 py-2 bg-slate-900/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-slate-700">
                          Coming Soon
                        </span>
                      )}
                      {interview.status === 'published' && (
                        <>
                          {interview.interview_type === 'on_camera' && (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-purple-500">
                              <Video size={14} />
                              Video
                            </span>
                          )}
                          {interview.interview_type === 'voice_only' && (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-orange-500">
                              <Headphones size={14} />
                              Audio
                            </span>
                          )}
                          {interview.interview_type === 'written_only' && (
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-cyan-500">
                              <FileText size={14} />
                              Written
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{interview.name}</h3>
                  <p className="text-cyan-600 font-semibold mb-1">{interview.title}</p>
                  {interview.organization && (
                    <p className="text-slate-600 text-sm mb-4">{interview.organization}</p>
                  )}

                  <div className="h-px bg-slate-200 my-4"></div>

                  <p className="text-slate-700 leading-relaxed text-sm mb-4">
                    {interview.description}
                  </p>

                  {interview.status === 'coming_soon' && (
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar size={16} />
                      <span>Publishing Soon</span>
                    </div>
                  )}

                  {interview.status === 'published' && (
                    <>
                      {interview.interview_type === 'on_camera' && interview.video_url && (
                        <a
                          href={interview.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Watch interview with ${interview.name}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                        >
                          <Video size={16} />
                          Watch Interview
                          <ExternalLink size={14} />
                        </a>
                      )}

                      {interview.interview_type === 'voice_only' && interview.audio_url && (
                        <a
                          href={interview.audio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Listen to interview with ${interview.name}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                        >
                          <Headphones size={16} />
                          Listen to Interview
                          <ExternalLink size={14} />
                        </a>
                      )}

                      {interview.interview_type === 'written_only' && interview.transcript && (
                        <button
                          onClick={() => {}}
                          aria-label={`Read interview with ${interview.name}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                        >
                          <FileText size={16} />
                          Read Interview
                        </button>
                      )}

                      {interview.transcript && interview.interview_type !== 'written_only' && (
                        <p className="text-xs text-slate-500 mt-2">Transcript available</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">What to Expect</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="text-cyan-300" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Practical Experience</h4>
                    <p className="text-slate-300 text-sm">
                      Real accounts from those who have led or supported reorganisation processes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText className="text-cyan-300" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Multiple Formats</h4>
                    <p className="text-slate-300 text-sm">
                      Read in-depth articles on Substack or listen to podcast episodes on Spotify
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="text-cyan-300" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Actionable Guidance</h4>
                    <p className="text-slate-300 text-sm">
                      Specific recommendations for authorities preparing for their own transitions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <PageNavigation items={navItems} />
              <div className="bg-teal-800 text-white p-6">
                <h3 className="text-xl font-black text-white mb-3">
                  The Dispatch
                </h3>
                <p className="text-sm text-white mb-4">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <Link
                  to="/subscribe"
                  className="inline-block bg-white text-teal-700 px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider hover:bg-teal-50 transition-colors"
                >
                  Subscribe
                </Link>
              </div>

              <div className="border-2 border-neutral-900 bg-white p-6">
                <h4 className="font-black text-neutral-900 mb-4 text-sm tracking-wider border-b-2 border-neutral-200 pb-3">
                  RELATED CONTENT
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    View the Lessons →
                  </button>
                  <button
                    onClick={() => onNavigate('facts')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    View the Facts & Data →
                  </button>
                  <button
                    onClick={() => onNavigate('surrey')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    Surrey Analysis →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="interviews" />

      {/* Related Resources - LGR Hub Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="academic-card p-8 bg-teal-50 border-l-4 border-teal-700">
          <div className="flex items-start gap-4">
            <BookOpen className="text-teal-700 flex-shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2">
                Learn More About Local Government Reorganisation
              </h3>
              <p className="text-academic-neutral-700 mb-4 font-serif">
                Explore the <a href="/facts/what-is-lgr" className="text-teal-700 hover:text-teal-800 underline font-medium">LGR Series hub</a> for comprehensive guides on Local Government Reorganisation, LGR governance, and the LGR timetable 2026.
              </p>
              <a
                href="/facts/what-is-lgr"
                className="academic-button academic-button-primary inline-flex items-center gap-2"
              >
                <BookOpen size={18} />
                What is LGR?
              </a>
            </div>
          </div>
        </div>
      </div>

      <LastUpdated />
    </div>
  );
}
