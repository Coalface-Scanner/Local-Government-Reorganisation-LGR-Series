import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import PageNavigation from '../components/PageNavigation';
import { Target, Users, BarChart, Shield, Clock, BookOpen, Calendar, TrendingUp } from 'lucide-react';

interface SurreyProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function Surrey({ onNavigate }: SurreyProps) {
  const navItems = [
    { id: 'playbook', label: 'The Playbook', icon: <BookOpen size={16} /> },
    { id: 'disciplines', label: 'Five Disciplines', icon: <Target size={16} /> },
    { id: 'timeline', label: 'First 100 Days', icon: <Calendar size={16} /> },
    { id: 'interviews', label: 'Interviews', icon: <Users size={16} /> },
    { id: 'takeaway', label: 'Key Takeaway', icon: <TrendingUp size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Surrey Focus - LGR Analysis & Transition Guide"
        description="Detailed analysis of Surrey's local government reorganisation. Risks, opportunities, and practical guidance for the transition to East and West Surrey unitary authorities."
        keywords="Surrey reorganisation, Surrey LGR, East Surrey council, West Surrey council, Surrey devolution, Surrey unitary"
      />
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              CASE STUDY
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Surrey:{' '}
            <span className="text-teal-700 font-serif italic">
              Lessons & Warnings
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Primary risks for Surrey based on evidence from elsewhere, with actionable guidance for the first 100 days
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <div id="playbook" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">The First 100 Days Playbook</h2>
              <p className="text-lg text-slate-600 mb-8">A blueprint for getting LGR right in Surrey</p>

              <div className="prose max-w-none">
                <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-6 border-l-4 border-amber-500 mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Clock className="text-amber-600" size={24} />
                    Why the First 100 Days Matter
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    East and West Surrey will hold their first elections in May 2026. Less than a year later on 1 April
                    2027, the two new unitary authorities will replace twelve existing councils. The period between the
                    elections and Vesting Day will determine whether the new councils begin with clarity, legitimacy and
                    operational stability, or inherit the avoidable delays seen elsewhere.
                  </p>
                </div>

                <h3 id="disciplines" className="text-2xl font-bold text-slate-900 mb-6">The Five Disciplines That Define Success</h3>

                <div className="space-y-6 mb-10">
                  {[
                    {
                      icon: Users,
                      title: 'Democratic Legitimacy & Cross-Party Stewardship',
                      description: 'New authorities only succeed when their political leadership builds legitimacy early, clearly explains how the new system works, and works cross-party in the interests of all communities.',
                      color: 'cyan'
                    },
                    {
                      icon: BarChart,
                      title: 'Systems Convergence & Performance Visibility',
                      description: 'Reorganisation only works when the new authorities operate through a single, coherent set of systems.',
                      color: 'blue'
                    },
                    {
                      icon: Shield,
                      title: 'Clear Accountability & Senior Leadership Discipline',
                      description: 'Reorganisation exposes gaps in accountability immediately. Without clarity, teams hesitate, decisions slow, and officers and members become risk-averse.',
                      color: 'emerald'
                    },
                    {
                      icon: Target,
                      title: 'Governance Clarity to Reduce Planning Delays',
                      description: 'Governance clarity is where early stability becomes operational reality. Councils succeed when they adopt clean, coherent decision-making arrangements from the outset.',
                      color: 'violet'
                    },
                    {
                      icon: Clock,
                      title: 'The Housing Crisis and Delivery Realism',
                      description: 'Reorganisation does not remove planning pressures; it reshapes them. Early honesty prevents future conflict.',
                      color: 'amber'
                    }
                  ].map((discipline, index) => {
                    const Icon = discipline.icon;
                    return (
                      <div key={index} className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-6 border-l-4 border-cyan-500">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className="text-cyan-600" size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 mb-2 text-lg">{index + 1}. {discipline.title}</h4>
                            <p className="text-slate-700 leading-relaxed">{discipline.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div id="timeline" className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-6">The First 100 Days: Essential Actions</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    period: 'Weeks 1–4',
                    actions: [
                      'Confirm delegations',
                      'Publish decision pathway',
                      'Begin workflow and data audit',
                      'Deliver member induction'
                    ]
                  },
                  {
                    period: 'Weeks 5–8',
                    actions: [
                      'Launch political narrative',
                      'Begin digital convergence',
                      'Establish Stabilisation Board',
                      'Publish resident-facing explainers'
                    ]
                  },
                  {
                    period: 'Weeks 9–12',
                    actions: [
                      'Publish performance dashboards',
                      'Review committee structures',
                      'Finalise 5YHLS communication',
                      'Sign off Vesting Day Operating Model'
                    ]
                  }
                ].map((phase, index) => (
                  <div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <h4 className="font-bold text-cyan-300 mb-4 text-lg">{phase.period}</h4>
                    <ul className="space-y-2">
                      {phase.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div id="interviews" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Interviews</h3>
              <p className="text-slate-600 mb-6">
                Insights from practitioners, leaders, and experts with direct experience of local government reorganisation
              </p>

              <div className="grid gap-6">
                <button
                  onClick={() => onNavigate('article', 'andrew-kelly-democracy-lgr')}
                  className="group bg-gradient-to-r from-slate-50 to-white rounded-xl p-6 border-2 border-slate-200 hover:border-cyan-400 transition-all text-left"
                >
                  <div className="flex gap-6">
                    <img
                      src="/akelly_infographic_article_democratic.jpg"
                      alt="Bigger Councils, Weaker Voice?"
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                        Bigger Councils, Weaker Voice? Andrew Kelly on Democracy and LGR
                      </h4>
                      <p className="text-sm text-slate-600 mb-3">
                        Former Elmbridge councillor Andrew Kelly examines how larger councils and reduced representation impact democratic engagement and local voice.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-cyan-600 font-semibold">
                        <span>READ INTERVIEW</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div id="takeaway" className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border-2 border-cyan-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Takeaway</h3>
              <p className="text-slate-800 leading-relaxed text-lg">
                The evidence from recent reorganisations shows that early decisions about governance, systems, and
                political leadership have lasting impacts. Surrey has the opportunity to learn from these experiences
                and build stable, effective new authorities from day one.
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <PageNavigation items={navItems} />
              <SubscriptionForm />

              <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200">
                <h4 className="font-bold text-slate-900 mb-3">Related Analysis</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('surrey/election-simulator')}
                    className="w-full text-left px-4 py-3 bg-yellow-100 rounded-lg hover:shadow-md transition-all text-sm font-bold text-slate-900 hover:text-yellow-700 border border-yellow-300"
                  >
                    🗳️ Election Simulator →
                  </button>
                  <button
                    onClick={() => onNavigate('facts')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg hover:shadow-md transition-all text-sm font-medium text-slate-700 hover:text-cyan-600"
                  >
                    View the Facts →
                  </button>
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg hover:shadow-md transition-all text-sm font-medium text-slate-700 hover:text-cyan-600"
                  >
                    Key Lessons →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="surrey" />

      <LastUpdated />
    </div>
  );
}
