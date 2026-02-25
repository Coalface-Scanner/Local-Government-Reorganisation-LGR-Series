import MetaTags from '../components/MetaTags';
import FAQSection from '../components/FAQSection';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import PageBanner from '../components/PageBanner';
import ServiceCard from '../components/ServiceCard';
import { Calendar, MapPin, HelpCircle, CheckCircle, FileText, BookOpen, Route, type LucideIcon } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useScrollDepthTracking } from '../hooks/useScrollDepthTracking';
import { useTimeOnPageTracking } from '../hooks/useTimeOnPageTracking';

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
  },
  {
    id: 'glossary',
    title: 'Glossary',
    description: 'Comprehensive glossary of Local Government Reorganisation terms and definitions. Search and browse key LGR concepts, governance terms, and reorganisation terminology.',
    icon: BookOpen,
    color: 'from-teal-500 to-emerald-600',
    route: '/glossary'
  }
];

export default function Facts({ onNavigate: _onNavigate }: FactsProps) {
  const location = useLocation();

  // Track scroll depth and time on page
  useScrollDepthTracking();
  useTimeOnPageTracking();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Local Government Reorganisation Facts & Data - LGR Initiative"
        description="Comprehensive facts, statistics, and data about Local Government Reorganisation (LGR) in England. Explore LGR timelines, councils involved, methodology, and sources from the LGR Initiative."
        keywords="LGR facts, Local Government Reorganisation data, LGR Initiative facts, reorganisation data, unitary authority evidence, local government reorganisation analysis, LGR statistics, LGR timetable"
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
      
      <PageBanner
        heroLabel="EVIDENCE-BASED ANALYSIS"
        heroTitle="Local Government Reorganisation Facts & Data"
        heroSubtitle="What is Local Government Reorganisation? Local Government Reorganisation (LGR) is the process of restructuring local government structures in England, typically moving from a two-tier system (county and district councils) to single-tier unitary authorities. This section provides comprehensive evidence-based analysis of LGR timelines, councils involved, key facts, methodology, sources, and additional resources from the LGR Initiative."
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          {serviceCards.map((card) => (
            <ServiceCard
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              color={card.color}
              route={card.route}
              disabled={card.disabled}
            />
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="lgr-insights-cta">
            <h3 className="lgr-insights-cta__title">LGR Insights & Updates</h3>
            <p className="lgr-insights-cta__body">
              Receive our regular update direct to your inbox. Subscribe here.
            </p>
            <Link to="/subscribe" className="lgr-insights-cta__btn">
              Subscribe
            </Link>
          </div>
        </div>
      </div>

      <FAQSection page="facts" />
    </div>
  );
}
