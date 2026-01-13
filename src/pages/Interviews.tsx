import { useEffect, useState } from 'react';
import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import { Mic, Calendar, Users, FileText, Headphones, ExternalLink, Video } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

export default function Interviews({ onNavigate }: InterviewsProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      const { data, error} = await supabase
        .from('interviews')
        .select('*')
        .order('order_index');

      if (!error && data) {
        setInterviews(data);
      }
      setLoading(false);
    };

    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Interviews - Council Leaders & Practitioners"
        description="In-depth interviews with council leaders, officers, and practitioners on local government reorganisation. First-hand accounts and expert perspectives on structural reform, governance challenges, and transition management."
        keywords="LGR interviews, council leader interviews, local government insights, reorganisation experiences, practitioner perspectives"
      />
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url('/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              EXPERT PERSPECTIVES
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Interviews{' '}
            <span className="text-teal-700 font-serif italic">
              Series
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            In-depth conversations with leaders and practitioners who have experienced local government reorganisation firsthand
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200">
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

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            <div className="col-span-3 text-center py-6 text-slate-600">Loading interviews...</div>
          ) : interviews.length === 0 ? (
            <div className="col-span-3 text-center py-6 text-slate-600">No interviews available yet.</div>
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

        <div className="grid lg:grid-cols-3 gap-8">
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
            <div className="sticky top-24">
              <SubscriptionForm />

              <div className="mt-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={20} />
                  <h4 className="font-bold">Read on Substack</h4>
                </div>
                <p className="text-sm text-orange-50 mb-4">
                  Get full articles and analysis delivered to your inbox
                </p>
                <a
                  href="https://rowancole.substack.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-white text-orange-600 rounded-lg hover:shadow-xl transition-all font-semibold text-sm"
                >
                  Visit Substack
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="mt-6 bg-cyan-50 rounded-xl p-6 border border-cyan-200">
                <h4 className="font-bold text-slate-900 mb-3">Related Content</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg hover:shadow-md transition-all text-sm font-medium text-slate-700 hover:text-cyan-600"
                  >
                    Key Lessons →
                  </button>
                  <button
                    onClick={() => onNavigate('facts')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg hover:shadow-md transition-all text-sm font-medium text-slate-700 hover:text-cyan-600"
                  >
                    Facts & Data →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="interviews" />

      <LastUpdated />
    </div>
  );
}
