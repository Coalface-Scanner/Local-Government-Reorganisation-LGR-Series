import { useLocation, Link } from 'react-router-dom';
import FAQSection from '../components/FAQSection';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import PageNavigation from '../components/PageNavigation';
import LocalPlaceStructuredData from '../components/LocalPlaceStructuredData';
import InBriefSection from '../components/InBriefSection';
import { Target, Users, BarChart, Shield, Clock, BookOpen, Calendar, TrendingUp } from 'lucide-react';

interface SurreyProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function Surrey({ onNavigate }: SurreyProps) {
  const location = useLocation();
  const navItems = [
    { id: 'playbook', label: 'The Playbook', icon: <BookOpen size={16} /> },
    { id: 'disciplines', label: 'Five Disciplines', icon: <Target size={16} /> },
    { id: 'timeline', label: 'First 100 Days', icon: <Calendar size={16} /> },
    { id: 'interviews', label: 'Interviews', icon: <Users size={16} /> },
    { id: 'takeaway', label: 'Key Takeaway', icon: <TrendingUp size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="surreyLessons" />
      <MetaTags
        title="Surrey LGR Timetable 2026 - Analysis & Transition Guide"
        description="Detailed analysis of Surrey's local government reorganisation and LGR timetable 2026. Risks, opportunities, and practical guidance for the transition to East and West Surrey unitary authorities. Part of the LGR Initiative."
        keywords="Surrey reorganisation, Surrey LGR, LGR timetable 2026, Surrey reorganisation elections, East Surrey council, West Surrey council, Surrey devolution, Surrey unitary, Local Government Reorganisation Surrey"
      />
      <LocalPlaceStructuredData
        name="Surrey"
        description="Surrey is a county in South East England, currently undergoing local government reorganisation to form East Surrey and West Surrey unitary authorities."
        type="AdministrativeArea"
        address={{
          addressRegion: "Surrey",
          addressCountry: "GB"
        }}
        containedInPlace={{
          name: "South East England",
          type: "AdministrativeArea"
        }}
        areaServed={[
          "Elmbridge", "Epsom and Ewell", "Guildford", "Mole Valley", 
          "Reigate and Banstead", "Runnymede", "Spelthorne", "Surrey Heath",
          "Tandridge", "Waverley", "Woking", "Surrey County Council"
        ]}
        url="/surrey/lessons"
      />
      <PageBanner
        heroLabel="CASE STUDY"
        heroTitle="Surrey: Lessons & Warnings"
        heroSubtitle="Primary risks for Surrey based on evidence from elsewhere, with actionable guidance for the first 100 days"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <InBriefSection content="Surrey is undergoing Local Government Reorganisation (LGR) to form East Surrey and West Surrey unitary authorities, with shadow elections scheduled for May 2026 and go-live in May 2027. This fast-tracked LGR timetable 2026 creates both opportunities and risks, particularly around planning decisions, councillor transitions, and governance during the transition period. Evidence from recent reorganisations suggests careful management of the first 100 days is critical for success." />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <div id="playbook" className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">The First 100 Days Playbook</h2>
              <p className="text-lg text-slate-600 mb-6">A blueprint for getting LGR right in Surrey</p>

              <div className="prose max-w-none">
                <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-5 border-l-4 border-amber-500 mb-6">
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

                <h3 id="disciplines" className="text-2xl font-bold text-slate-900 mb-4">The Five Disciplines That Define Success</h3>

                <div className="space-y-5 mb-8">
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
              <h3 className="text-2xl font-bold mb-4">The First 100 Days: Essential Actions</h3>
              <div className="grid md:grid-cols-3 gap-6">
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
            <div className="sticky top-24 space-y-5">
              <PageNavigation items={navItems} />
              <div className="lgr-insights-cta">
                <h3 className="lgr-insights-cta__title">LGR Insights & Updates</h3>
                <p className="lgr-insights-cta__body">
                  Receive our regular update direct to your inbox. Subscribe here.
                </p>
                <Link to="/subscribe" className="lgr-insights-cta__btn">
                  Subscribe
                </Link>
              </div>

              <div className="border-2 border-neutral-900 bg-white p-5">
                <h4 className="font-black text-neutral-900 mb-3 text-sm tracking-wider border-b-2 border-neutral-200 pb-2">
                  RELATED CONTENT
                </h4>
                <div className="space-y-2.5">
                  <button
                    onClick={() => onNavigate('surrey/election-tracker/simulator')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    Election Simulator →
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

      <FAQSection page="surrey" />

    </div>
  );
}
