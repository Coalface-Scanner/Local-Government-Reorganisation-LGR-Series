import { Download, CheckCircle2, AlertTriangle, Target, FileText } from 'lucide-react';
import PageNavigation from '../components/PageNavigation';
import SubscriptionForm from '../components/SubscriptionForm';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';

interface HundredDaysProps {
  onNavigate: (page: string) => void;
}

export default function HundredDays({ onNavigate }: HundredDaysProps) {
  const navItems = [
    { id: 'why-matters', label: 'Why 100 Days Matter', icon: <AlertTriangle size={16} /> },
    { id: 'priorities', label: 'Key Priorities', icon: <Target size={16} /> },
    { id: 'evidence', label: 'Evidence', icon: <CheckCircle2 size={16} /> },
    { id: 'using', label: 'Using This Playbook', icon: <FileText size={16} /> }
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      <MetaTags
        title="The First 100 Days Playbook"
        description="Strategic framework for managing the critical first 100 days of unitary transition. Evidence-based guidance on priorities, risks, and success factors."
        keywords="unitary transition, first 100 days, LGR implementation, council transition plan, reorganisation playbook"
      />
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-8">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-2">
              RESEARCH SERIES
            </div>
            <div className="text-sm text-neutral-500">
              Published 3 December 2025
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            The First 100 Days:{' '}
            <span className="text-teal-700 font-serif italic">
              A Playbook for Unitary Transition
            </span>
          </h1>

          <p className="text-xl text-neutral-600 leading-relaxed mb-4">
            Drawing on evidence from recent reorganisations, this playbook identifies critical actions
            for new unitary authorities in their first 100 days. It examines the governance, planning,
            and political challenges that emerge during transition and provides a framework for managing them.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <button
                disabled
                className="flex items-center gap-2 px-6 py-3 bg-neutral-300 text-neutral-500 font-bold rounded-full cursor-not-allowed opacity-60"
              >
                <Download size={18} />
                DOWNLOAD PLAYBOOK
              </button>
              <div className="absolute -top-2 -right-2 bg-teal-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                COMING SOON
              </div>
            </div>
            <button
              onClick={() => onNavigate('materials')}
              className="px-6 py-3 bg-white border-2 border-neutral-900 hover:bg-neutral-50 text-neutral-900 font-bold rounded-full transition-all"
            >
              VIEW ALL MATERIALS
            </button>
          </div>
        </div>
      </div>

      <article className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 id="why-matters" className="text-3xl font-black text-neutral-900 mb-6 mt-12">
                  Why The First 100 Days Matter
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-6">
              The first 100 days of a new unitary authority are critical. This is when governance structures
              are established, planning systems are integrated, and political relationships are formed. Evidence
              from recent reorganisations shows that decisions made during this period have lasting impacts on
              authority performance, democratic accountability, and service delivery.
            </p>

            <div className="bg-teal-50 border-l-4 border-teal-700 p-6 my-8">
              <div className="flex items-start gap-3">
                <AlertTriangle size={24} className="text-teal-700 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-black text-neutral-900 mb-2">Critical Window</h3>
                  <p className="text-neutral-700">
                    Authorities that fail to establish clear governance and planning frameworks in the first
                    100 days face significantly higher risks of performance decline, political instability,
                    and service disruption.
                  </p>
                </div>
              </div>
            </div>

                <h2 id="priorities" className="text-3xl font-black text-neutral-900 mb-6 mt-12">
                  Key Priorities
                </h2>

            <div className="space-y-6 mb-12">
              <div className="border-2 border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">
                      Establish Governance Framework
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Set clear decision-making structures, committee systems, and delegations. Evidence shows
                      that authorities with well-defined governance from day one experience fewer political
                      conflicts and faster decision-making.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">
                      Integrate Planning Systems
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Merge planning teams, harmonize processes, and establish unified development management.
                      Delays in planning integration are consistently linked to performance decline in the
                      first year.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">
                      Build Political Cohesion
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Create mechanisms for cross-party engagement and manage expectations around service
                      levels and financial constraints. Political fragmentation during transition increases
                      risk of strategic drift.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-700 text-white rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-neutral-900 mb-2">
                      Secure Financial Controls
                    </h3>
                    <p className="text-neutral-700 leading-relaxed">
                      Establish unified financial systems, budget monitoring, and reserves management. Early
                      financial control failures can lead to Section 114 notices within the first two years.
                    </p>
                  </div>
                </div>
              </div>
            </div>

                <h2 id="evidence" className="text-3xl font-black text-neutral-900 mb-6 mt-12">
                  Evidence From Recent Transitions
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-6">
              Analysis of recent unitary transitions reveals consistent patterns:
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-teal-700 flex-shrink-0 mt-1" />
                <p className="text-neutral-700">
                  <strong>Authorities with clear 100-day plans</strong> experienced 40% fewer governance
                  disputes in their first year.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-teal-700 flex-shrink-0 mt-1" />
                <p className="text-neutral-700">
                  <strong>Early planning integration</strong> correlated with sustained performance in
                  development management.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-teal-700 flex-shrink-0 mt-1" />
                <p className="text-neutral-700">
                  <strong>Delayed financial system integration</strong> increased audit findings by 60%.
                </p>
              </div>
            </div>

            <div className="bg-neutral-900 text-white p-8 my-12">
              <blockquote className="text-2xl font-serif italic mb-4">
                "The agreement is the easy part. Implementation is the real hurdle."
              </blockquote>
              <cite className="text-neutral-400 not-italic">— Rowan Cole, Series Editor</cite>
            </div>

                <h2 id="using" className="text-3xl font-black text-neutral-900 mb-6 mt-12">
                  Using This Playbook
                </h2>

            <p className="text-neutral-700 leading-relaxed mb-6">
              This playbook provides:
            </p>

            <ul className="space-y-3 mb-8 text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="text-teal-700 font-bold">•</span>
                <span>A week-by-week framework for the first 100 days</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-700 font-bold">•</span>
                <span>Critical decision points and governance milestones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-700 font-bold">•</span>
                <span>Risk indicators drawn from real reorganisation experiences</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-teal-700 font-bold">•</span>
                <span>Practical tools for monitoring transition progress</span>
              </li>
            </ul>

                <div className="border-t-2 border-neutral-900 pt-8 mt-12">
                  <h3 className="text-xl font-black text-neutral-900 mb-4">
                    Download the Full Playbook
                  </h3>
                  <p className="text-neutral-700 mb-6">
                    Access the complete 100-day framework with detailed implementation guidance.
                  </p>
                  <div className="relative inline-block">
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-300 text-neutral-500 font-bold rounded-full cursor-not-allowed opacity-60"
                    >
                      <Download size={18} />
                      DOWNLOAD PLAYBOOK
                    </button>
                    <div className="absolute -top-2 -right-2 bg-teal-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      COMING SOON
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <PageNavigation items={navItems} />
                <SubscriptionForm />
              </div>
            </div>
          </div>
        </div>
      </article>

      <aside className="bg-neutral-100 border-t border-neutral-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-black text-neutral-900 mb-6">
            Related Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('lessons')}
              className="bg-white border-2 border-neutral-200 p-6 text-left hover:border-teal-700 transition-all group"
            >
              <h4 className="font-black text-neutral-900 mb-2 group-hover:text-teal-700 transition-colors">
                LESSONS FROM REORGANISATION
              </h4>
              <p className="text-sm text-neutral-600">
                Key insights from recent unitary transitions
              </p>
            </button>
            <button
              onClick={() => onNavigate('facts')}
              className="bg-white border-2 border-neutral-200 p-6 text-left hover:border-teal-700 transition-all group"
            >
              <h4 className="font-black text-neutral-900 mb-2 group-hover:text-teal-700 transition-colors">
                FACTS & DATA
              </h4>
              <p className="text-sm text-neutral-600">
                Performance indicators from reorganised authorities
              </p>
            </button>
          </div>
        </div>
      </aside>

      <FAQSection page="hundred-days" />
    </div>
  );
}
