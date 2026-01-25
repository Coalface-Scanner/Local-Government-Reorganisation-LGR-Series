import { Link } from 'react-router-dom';
import { User, FileText, MessageSquare, Info, ArrowRight } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import SubscriptionForm from '../../components/SubscriptionForm';
import LastUpdated from '../../components/LastUpdated';
import FAQSection from '../../components/FAQSection';

interface AboutProps {
  onNavigate: (page: string) => void;
}

export default function About({ onNavigate: _onNavigate }: AboutProps) {
  const aboutSections = [
    {
      id: 'overview',
      title: 'About This Research Programme',
      icon: <Info size={24} className="text-teal-700" />,
      description: 'The LGR Series is a dedicated research and analysis programme examining the 2024-2025 wave of English local government reorganisation, with particular focus on its implications for planning, governance, and development delivery.',
      link: '/about',
      linkText: 'Learn more'
    },
    {
      id: 'editor',
      title: "Editor's Letter & Editorial Team",
      icon: <User size={24} className="text-teal-700" />,
      description: 'Meet the editor and read the editorial letter introducing the LGR Series and its mission.',
      link: '/about/editor',
      linkText: 'Read the letter'
    },
    {
      id: 'methodology',
      title: 'Research Methodology',
      icon: <FileText size={24} className="text-teal-700" />,
      description: 'Learn about our research approach, data sources, analytical framework, and quality standards.',
      link: '/about/methodology',
      linkText: 'View methodology'
    },
    {
      id: 'contribute',
      title: 'How to Contribute',
      icon: <MessageSquare size={24} className="text-teal-700" />,
      description: 'Get involved in the LGR Series by sharing your experience, suggesting topics, or providing data.',
      link: '/about/contribute',
      linkText: 'Get involved'
    },
    {
      id: 'coalface',
      title: 'About COALFACE',
      icon: <Info size={24} className="text-teal-700" />,
      description: 'Learn about COALFACE, the research and engagement practice behind the LGR Series.',
      link: '/about/coalface',
      linkText: 'About COALFACE'
    }
  ];

  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="About the LGR Series - Research Programme Overview"
        description="Learn about the LGR Series research programme examining local government reorganisation and its implications for planning, governance, and development delivery."
        keywords="LGR series, local government reorganisation, council reform research, COALFACE insights, research programme"
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
            <div className="academic-section-label">ABOUT</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              About the{' '}
              <span className="text-teal-700 font-serif italic">
                LGR Series
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              A dedicated research programme examining local government reorganisation and its impact on planning, governance, and development delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Our Mission Section */}
            <section className="academic-card p-8">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-academic-neutral-300">
                <div className="w-12 h-12 bg-gradient-teal flex items-center justify-center flex-shrink-0">
                  <Info size={24} className="text-white" />
                </div>
                <h2 className="text-academic-sm font-display font-bold tracking-wider text-academic-charcoal">
                  OUR MISSION
                </h2>
              </div>
              <div className="academic-prose space-y-4">
                <p>
                  The LGR Series provides independent, governance led insight into local government reorganisation and devolution, with a clear focus on democratic leadership and community confidence.
                </p>
                <p>
                  It examines what works, what fails, and how changes in power, accountability and decision making shape the ability of elected representatives and communities to influence outcomes. The Series explores the implications for political leadership, planning, housing and service delivery, public trust and local economic decision making.
                </p>
                <p>
                  The Series is informed by the Editor's experience as an elected councillor and as a council officer, offering practical insight into how governance change is experienced by those accountable to communities and those responsible for delivery. It is intended to support reform that works in practice, strengthens democratic authority, and is capable of commanding public confidence rather than existing only on paper.
                </p>
              </div>
            </section>

            {/* Overview Section */}
            <section className="academic-card p-8">
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-4">
                About This Research Programme
              </h2>
              <div className="academic-prose space-y-4">
                <p>
                  The LGR Series is a dedicated research and analysis programme examining the current wave of English local government reorganisation, initiated in 2024.
                </p>
                <p>
                  It explores one of the most significant structural changes to local government in a generation, focusing on how new council arrangements affect governance, democratic legitimacy and delivery in practice. The Series is intended to support authorities, practitioners and stakeholders to understand both the opportunities created by reorganisation and the risks that can undermine confidence, performance and trust if governance is not designed and exercised well.
                </p>
                <p>
                  The analysis prioritises how reorganised councils operate in reality rather than in theory, using planning, development and service delivery as critical test cases for decision making under political, financial and organisational pressure.
                </p>
              </div>
            </section>

            {/* The Central Question Section */}
            <section className="academic-card p-8">
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-6">
                The Central Question
              </h2>
              <div className="academic-prose space-y-4">
                <p className="text-academic-xl font-serif italic text-academic-charcoal font-medium">
                  At its core, the LGR Series is driven by a single question:
                </p>
                <div className="bg-teal-50 border-l-4 border-teal-600 pl-6 pr-6 py-4 my-6">
                  <p className="text-academic-xl font-serif font-semibold text-academic-charcoal leading-relaxed">
                    Does local government reorganisation strengthen or weaken the ability of communities and their elected representatives to shape decisions and deliver outcomes at scale?
                  </p>
                </div>
                <p>
                  Local government reorganisation is often framed in terms of efficiency, resilience and strategic capacity. Far less attention is given to how changes in scale, structure and executive power affect democratic leadership, community influence and the quality of decision making in practice.
                </p>
                <p>
                  This question reflects a deliberate choice. The Series does not treat reorganisation as a purely technical exercise, nor does it assume that larger authorities automatically govern better. Instead, it examines whether new council arrangements enhance or dilute the ability of elected representatives to lead with authority, and whether communities retain meaningful routes to influence decisions that affect their places.
                </p>
              </div>
            </section>

            {/* How the Core Themes Address The Central Question Section */}
            <section className="academic-card p-8">
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-6">
                How the Core Themes Address The Central Question
              </h2>
              <div className="academic-prose space-y-6">
                <p>
                  The three core themes of the LGR Series act as analytical lenses on this central question.
                </p>
                
                <div className="space-y-6">
                  <div className="border-l-4 border-teal-600 pl-6">
                    <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-3">
                      <Link 
                        to="/topics/democratic-legitimacy" 
                        className="text-academic-charcoal hover:text-teal-700 transition-colors"
                      >
                        Democratic Legitimacy
                      </Link>
                    </h3>
                    <p>
                      Examines how reorganisation affects representation, mandate and public confidence. It asks whether electoral systems, ward structures and participation mechanisms remain credible at a larger scale, and what happens when new councils begin life with fragile legitimacy.
                    </p>
                  </div>

                  <div className="border-l-4 border-teal-600 pl-6">
                    <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-3">
                      <Link 
                        to="/topics/governance-and-reform" 
                        className="text-academic-charcoal hover:text-teal-700 transition-colors"
                      >
                        Governance and Reform
                      </Link>
                    </h3>
                    <p>
                      Focuses on whether governance structures enable or constrain democratic leadership. It explores how committee systems, schemes of delegation, accountability arrangements and internal controls shape the ability of elected members to take timely, defensible decisions and oversee delivery.
                    </p>
                  </div>

                  <div className="border-l-4 border-teal-600 pl-6">
                    <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-3">
                      <Link 
                        to="/topics/statecraft-and-system-design" 
                        className="text-academic-charcoal hover:text-teal-700 transition-colors"
                      >
                        Statecraft and System Design
                      </Link>
                    </h3>
                    <p>
                      Looks at how political judgment, institutional design and operational systems interact in practice. It considers why councils with similar formal structures experience very different outcomes, and how leadership choices determine whether authority is exercised with clarity or lost in complexity.
                    </p>
                  </div>
                </div>

                <p className="mt-6">
                  Taken together, these themes allow the Series to move beyond abstract debate and assess reorganisation on its real test: whether it improves the capacity of councils to govern democratically and deliver effectively in the environments they now operate in.
                </p>
              </div>
            </section>

            {/* Navigation Cards */}
            <section>
              <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Explore Further
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {aboutSections.slice(1).map((section) => (
                  <Link
                    key={section.id}
                    to={section.link}
                    className="group academic-card p-6 hover:border-teal-700 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-teal-50 flex items-center justify-center rounded-lg group-hover:bg-teal-100 transition-colors">
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif leading-relaxed">
                          {section.description}
                        </p>
                        <div className="flex items-center text-teal-700 font-display font-semibold text-sm group-hover:gap-2 transition-all">
                          {section.linkText}
                          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-6 border border-academic-neutral-300 rounded-sm shadow-sm">
                <h3 className="text-academic-xl font-display font-black text-academic-charcoal mb-3">
                  The Dispatch
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <SubscriptionForm variant="compact" />
              </div>

              <div className="academic-card p-6">
                <h4 className="font-display font-bold text-academic-charcoal mb-4 text-sm tracking-wider border-b-2 border-academic-neutral-300 pb-3">
                  RELATED CONTENT
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700 academic-button-secondary"
                  >
                    View the Lessons →
                  </button>
                  <button
                    onClick={() => onNavigate('facts')}
                    className="w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700 academic-button-secondary"
                  >
                    View the Facts & Data →
                  </button>
                  <button
                    onClick={() => onNavigate('surrey')}
                    className="w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700 academic-button-secondary"
                  >
                    Surrey Analysis →
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FAQSection page="reasons" />
      <LastUpdated />
    </div>
  );
}
