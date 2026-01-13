import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import PageNavigation from '../components/PageNavigation';
import { BookOpen, Lightbulb, Target, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface LessonsProps {
  onNavigate: (page: string) => void;
}

export default function Lessons({ onNavigate }: LessonsProps) {
  const navItems = [
    { id: 'insights', label: 'Key Insights', icon: <BookOpen size={16} /> },
    { id: 'coming-soon', label: 'Coming Soon', icon: <AlertTriangle size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Lessons from Recent Reorganisations"
        description="Critical lessons from recent local government reorganisations across England. Evidence-based insights on what works, what fails, and how to navigate reform."
        keywords="LGR lessons, council reform insights, reorganisation best practices, local government change management, unitary transition guidance"
      />
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              LEARNING FROM EXPERIENCE
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-6">
            Lessons from{' '}
            <span className="text-teal-700 font-serif italic">
              Reorganisation
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            What recent reorganisations have taught us about governance, planning, and delivery across England
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <div id="insights" className="bg-white border-2 border-neutral-900 p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-teal-100 border-2 border-teal-700 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-teal-700" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-neutral-900">Key Insights</h2>
                  <p className="text-neutral-600 mt-1">Evidence-based lessons from reorganisations</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-neutral-700 leading-relaxed">
                  The recent wave of local government reorganisation across England provides valuable evidence about
                  what works, what doesn't, and why outcomes vary so significantly between authorities.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="bg-teal-50 border-2 border-teal-200 p-6">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center mb-4">
                      <Lightbulb className="text-white" size={24} />
                    </div>
                    <h3 className="font-black text-neutral-900 mb-2 text-lg">Governance Matters</h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Clear decision-making structures and political stewardship are critical success factors
                    </p>
                  </div>

                  <div className="bg-teal-50 border-2 border-teal-200 p-6">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center mb-4">
                      <Target className="text-white" size={24} />
                    </div>
                    <h3 className="font-black text-neutral-900 mb-2 text-lg">Systems Integration</h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Technical convergence and data integration cannot be delayed or deprioritised
                    </p>
                  </div>

                  <div className="bg-teal-50 border-2 border-teal-200 p-6">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center mb-4">
                      <Users className="text-white" size={24} />
                    </div>
                    <h3 className="font-black text-neutral-900 mb-2 text-lg">Workforce Capacity</h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Staff retention and organisational culture determine whether change succeeds or stalls
                    </p>
                  </div>

                  <div className="bg-teal-50 border-2 border-teal-200 p-6">
                    <div className="w-12 h-12 bg-teal-700 flex items-center justify-center mb-4">
                      <TrendingUp className="text-white" size={24} />
                    </div>
                    <h3 className="font-black text-neutral-900 mb-2 text-lg">Financial Reality</h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Early transition costs must be properly funded, not absorbed from existing budgets
                    </p>
                  </div>
                </div>

                <p className="text-neutral-700 leading-relaxed">
                  Detailed analysis and case studies from recent reorganisations will be published here as part of
                  the ongoing research series. This content will examine specific governance models, planning system
                  transitions, and the political dynamics that shape outcomes.
                </p>
              </div>
            </div>

            <div id="coming-soon" className="border-t-2 border-neutral-900 pt-8">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-black text-neutral-900">COMING SOON</h3>
                <div className="h-px flex-grow bg-neutral-300"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border border-neutral-300 p-6 hover:border-teal-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-teal-700 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Governance Models</h4>
                      <p className="text-sm text-neutral-600">Comparative analysis of governance models across reorganised authorities</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-neutral-300 p-6 hover:border-teal-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-teal-700 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Planning Systems</h4>
                      <p className="text-sm text-neutral-600">Planning system integration challenges and solutions</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-neutral-300 p-6 hover:border-teal-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-teal-700 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Political Dynamics</h4>
                      <p className="text-sm text-neutral-600">Political dynamics and cross-party collaboration case studies</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-neutral-300 p-6 hover:border-teal-700 transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-teal-700 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Financial Resilience</h4>
                      <p className="text-sm text-neutral-600">Financial resilience strategies and budget management</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <PageNavigation items={navItems} />
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
                  <button
                    onClick={() => onNavigate('100days')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    100 Days Playbook →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="lessons" />

      <LastUpdated />
    </div>
  );
}
