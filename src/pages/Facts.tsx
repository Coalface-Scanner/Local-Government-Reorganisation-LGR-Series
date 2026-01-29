import MetaTags from '../components/MetaTags';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import SubscriptionForm from '../components/SubscriptionForm';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import { Calendar, MapPin, HelpCircle, CheckCircle, FileText, BookOpen, ArrowRight, Route, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FactsProps {
  onNavigate: (page: string) => void;
}

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  route: string;
  disabled?: boolean;
}

const serviceCards: ServiceCard[] = [
  {
    id: 'what-is-lgr',
    title: 'What is Local Government Reorganisation? (LGR)',
    description: 'The definitive guide to Local Government Reorganisation (LGR). Learn what LGR is, how it works, LGR governance, and the LGR timetable 2026. Your hub for understanding local government reorganisation.',
    icon: HelpCircle,
    color: 'from-teal-600 to-cyan-700',
    route: '/facts/what-is-lgr'
  },
  {
    id: 'timescales',
    title: 'Timescales',
    description: 'Implementation timeline for local government reorganisation proposals across England, including final proposals, decisions, shadow councils, and go-live dates.',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-600',
    route: '/lgr-journey-2026'
  },
  {
    id: 'councils',
    title: 'Councils Involved',
    description: 'Overview of councils affected by local government reorganisation proposals across England, organised by region.',
    icon: MapPin,
    color: 'from-emerald-500 to-teal-600',
    route: '/facts/councils-involved'
  },
  {
    id: 'questions-and-answers',
    title: 'Questions & Answers',
    description: 'Comprehensive FAQ covering all aspects of Local Government Reorganisation, including timelines, processes, finance, governance, and service impacts.',
    icon: HelpCircle,
    color: 'from-purple-500 to-indigo-600',
    route: '/facts/questions-and-answers'
  },
  {
    id: 'methodology',
    title: 'Methodology',
    description: 'How the Local Government Reorganisation Series analysis has been developed, including evidence base, approach, and limitations.',
    icon: CheckCircle,
    color: 'from-amber-500 to-orange-600',
    route: '/facts/methodology'
  },
  {
    id: 'sources',
    title: 'Sources',
    description: 'Evidence from recent reorganisations across England, including illustrative council experience and sources from Dorset, Buckinghamshire, Somerset, North Yorkshire, and Cumbria.',
    icon: FileText,
    color: 'from-rose-500 to-pink-600',
    route: '/facts/sources'
  },
  {
    id: 'further-reading',
    title: 'Further Reading',
    description: 'Additional resources, reports, and publications on local government reorganisation, unitary authorities, and local government reform.',
    icon: BookOpen,
    color: 'from-slate-500 to-slate-700',
    route: '/facts/further-reading'
  },
  {
    id: 'lgr-journey-2026',
    title: 'LGR Journey 2026',
    description: 'Interactive journey map visualizing the LGR journey for 2026, navigating the key milestones, decisions, and transitions in local government reorganisation.',
    icon: Route,
    color: 'from-indigo-500 to-purple-600',
    route: '/lgr-journey-2026'
  },
  {
    id: 'councilopedia',
    title: 'Councylopedia',
    description: 'Comprehensive guide to local government reorganisation terminology, concepts, and resources for understanding LGR processes.',
    icon: BookOpen,
    color: 'from-violet-500 to-purple-600',
    route: '/facts/councilopedia'
  }
];

export default function Facts({ onNavigate: _onNavigate }: FactsProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Local Government Reorganisation Facts & Data - LGR Series"
        description="Comprehensive facts, statistics, and data about Local Government Reorganisation (LGR) in England. Explore LGR timelines, councils involved, methodology, and sources from the LGR Series."
        keywords="LGR facts, Local Government Reorganisation data, LGR Series facts, reorganisation data, unitary authority evidence, local government reorganisation analysis, LGR statistics, LGR timetable"
      />
      <CollectionPageStructuredData
        name="Facts & Figures"
        description="Key statistics, data, and facts about local government reorganisation in England. Explore timelines, councils involved, methodology, and sources."
        url="/facts"
        numberOfItems={serviceCards.length}
        items={serviceCards.map(card => ({
          name: card.title,
          url: card.route,
          description: card.description
        }))}
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
            <div className="academic-section-label">EVIDENCE-BASED ANALYSIS</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              Local Government Reorganisation{' '}
              <span className="text-teal-700 font-serif italic">
                Facts & Data
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Comprehensive evidence-based analysis of Local Government Reorganisation (LGR) in England. Explore LGR timelines, councils, key facts, methodology, sources, and additional resources from the LGR Series.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            const isDisabled = card.disabled;
            return (
              <div
                key={card.id}
                onClick={isDisabled ? undefined : () => navigate(card.route)}
                className={`group academic-card overflow-hidden transition-all duration-300 text-left h-full flex flex-col ${
                  isDisabled
                    ? 'bg-academic-warm border-academic-neutral-300 cursor-not-allowed opacity-60'
                    : 'cursor-pointer hover:border-teal-700'
                }`}
              >
                <div className={`bg-teal-700 p-10 text-white ${isDisabled ? 'opacity-50' : ''}`}>
                  <div className={`w-16 h-16 bg-white/20 flex items-center justify-center mb-5 transition-transform ${isDisabled ? '' : 'group-hover:scale-110'}`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h2 className="text-academic-2xl font-display font-bold text-white leading-tight">{card.title}</h2>
                  {isDisabled && (
                    <p className="text-academic-sm text-white/80 mt-3 italic font-serif">Coming soon</p>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <p className={`leading-relaxed mb-5 flex-1 font-serif text-academic-base ${isDisabled ? 'text-academic-neutral-500' : 'text-academic-neutral-700'}`}>
                    {card.description}
                  </p>
                  {!isDisabled && (
                    <div className="flex items-center gap-2 text-teal-700 font-display font-semibold group-hover:gap-3 transition-all">
                      <span>Explore</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
                    </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-teal-800 text-white p-8">
            <h3 className="text-academic-xl font-display font-bold text-white mb-4">
              The Dispatch
            </h3>
            <p className="text-academic-sm text-white mb-5 font-serif">
              Get the LGR Series directly in your inbox. No fluff, just deep analysis.
            </p>
            <SubscriptionForm variant="compact" />
          </div>
        </div>
      </div>

      <FAQSection page="facts" />
      <LastUpdated />
    </div>
  );
}
