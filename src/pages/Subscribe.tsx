import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import { Mail, FileText, Bell, ArrowRight } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';
import { useNavigate, useLocation } from 'react-router-dom';

interface SubscribeProps {
  onNavigate: (page: string) => void;
}

export default function Subscribe({ onNavigate }: SubscribeProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSection } = usePageContent('subscribe');

  // Get CMS content with fallbacks
  const heroLabel = getSection('hero_label');
  const heroTitle = getSection('hero_title');
  const heroDescription = getSection('hero_description');
  const cardNewArticlesTitle = getSection('card_new_articles_title');
  const cardNewArticlesDescription = getSection('card_new_articles_description');
  const cardExtendedNotesTitle = getSection('card_extended_notes_title');
  const cardExtendedNotesDescription = getSection('card_extended_notes_description');
  const cardPlaybookTitle = getSection('card_playbook_title');
  const cardPlaybookDescription = getSection('card_playbook_description');
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MetaTags
        title="Subscribe - The Dispatch Newsletter"
        description="Subscribe to The Dispatch for weekly insights on local government reorganisation. Get notified about new articles, exclusive content, and case studies."
        keywords="LGR newsletter, subscribe to LGR series, weekly insights, local government reorganisation updates, dispatch newsletter"
      />
      <PageBanner
        heroLabel={heroLabel?.content || 'STAY INFORMED'}
        heroTitle={`${heroTitle?.title || 'Subscribe'} ${heroTitle?.content || 'for Updates'}`}
        heroSubtitle={heroDescription?.content || "Receive each article as it's released, plus access to extended notes, case material, and the 100 Day Playbook"}
        currentPath={location.pathname}
      />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <SubscriptionForm />
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div className="group bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="text-white" size={26} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">
                    {cardNewArticlesTitle?.title || cardNewArticlesTitle?.content || 'New Articles'}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {cardNewArticlesDescription?.content || 'Get notified when new insights and analysis are published'}
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="text-white" size={26} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">
                    {cardExtendedNotesTitle?.title || cardExtendedNotesTitle?.content || 'Exclusive Content'}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {cardExtendedNotesDescription?.content || 'Access extended case studies and the 100 Day Playbook'}
                  </p>
                </div>

                <div className="group bg-gradient-to-br from-white to-slate-50/80 rounded-2xl p-6 shadow-lg border border-slate-200/60 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Bell className="text-white" size={26} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">
                    {cardPlaybookTitle?.title || cardPlaybookTitle?.content || 'Latest Updates'}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {cardPlaybookDescription?.content || 'Stay current with research findings and governance insights'}
                  </p>
                </div>
              </div>

              <div className="text-center border-t border-slate-200 pt-8">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 text-teal-700 font-bold hover:gap-3 transition-all group hover:text-teal-800"
                >
                  <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
                  Back to Home
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                <div className="bg-teal-800 text-white p-5">
                  <h3 className="text-xl font-black text-white mb-3">
                    The Dispatch
                  </h3>
                  <p className="text-sm text-white mb-4">
                    Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                  </p>
                  <SubscriptionForm variant="compact" />
                </div>

                <div className="border-2 border-neutral-900 bg-white p-5">
                  <h4 className="font-black text-neutral-900 mb-3 text-sm tracking-wider border-b-2 border-neutral-200 pb-2">
                    RELATED CONTENT
                  </h4>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => onNavigate('insights')}
                      className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                    >
                      View Insights & Analysis →
                    </button>
                    <button
                      onClick={() => onNavigate('facts')}
                      className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                    >
                      View the Facts & Data →
                    </button>
                    <button
                      onClick={() => onNavigate('lessons')}
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
      </section>

      <LastUpdated />
    </div>
  );
}
