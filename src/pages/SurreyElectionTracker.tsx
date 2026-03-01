import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, TrendingUp, BookOpen, ArrowRight, MapPin, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';

interface SurreyElectionTrackerProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function SurreyElectionTracker({ onNavigate: _onNavigate }: SurreyElectionTrackerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceCards = [
    {
      id: 'aggregate',
      title: 'Current Aggregate Totals',
      description: 'View mathematically combined district councillor totals. Reference data showing the current composition from existing districts.',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      route: '/surrey/election-tracker/simulator#aggregate',
      badge: 'Reference Only'
    },
    {
      id: 'simulator',
      title: 'Election Simulator',
      description: 'Model election outcomes for East and West Surrey unitary authorities. Adjust seat allocations and see majority projections in real-time.',
      icon: TrendingUp,
      color: 'from-yellow-400 to-amber-600',
      route: '/surrey/election-tracker/simulator#simulator',
      badge: 'Interactive'
    },
    {
      id: 'existing',
      title: 'Existing Councils',
      description: 'Reference data for Surrey County Council and all district councils. View current compositions and party control.',
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-600',
      route: '/surrey/election-tracker/simulator#existing',
      badge: 'Reference'
    }
  ];

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="surreyElectionTracker" />
      <MetaTags
        title="Surrey Election Tracker - LGR Modeller"
        description="Interactive tools for modelling Surrey's local government reorganisation. View aggregate totals, simulate election outcomes, and explore reference data."
        keywords="Surrey election tracker, Surrey LGR modeller, election simulation, Surrey reorganisation, election planning"
      />
      <PageBanner
        heroLabel="FOCUS: SURREY"
        heroTitle="Election Tracker"
        heroSubtitle="Interactive tools for modelling Surrey's local government reorganisation. Explore aggregate totals, simulate election outcomes, and review reference data for East and West Surrey unitary authorities."
        currentPath={location.pathname}
      />
      <div className="layout-container layout-content-sub">
        <button
          onClick={() => navigate('/surrey')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Surrey
        </button>
      </div>
      {/* Service Cards */}
      <div className="layout-container layout-content-sub">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-stretch">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            const isMainCard = card.id === 'simulator';
            return (
              <Link
                key={card.id}
                to={card.route}
                className={`group rounded-2xl overflow-hidden shadow-xl border-2 transition-all duration-300 text-left h-full flex flex-col backdrop-blur-sm hover:shadow-2xl hover:-translate-y-1 ${
                  isMainCard
                    ? 'md:col-span-2 lg:col-span-2 border-yellow-400 bg-gradient-to-br from-yellow-50/80 via-amber-50/80 to-yellow-50/80 hover:border-yellow-500 hover:scale-[1.02]'
                    : 'border-slate-200/50 bg-white/80 hover:border-teal-400'
                }`}
              >
                <div className={`service-card-header flex-shrink-0 bg-gradient-to-br ${card.color} p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" aria-hidden />
                  {isMainCard && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400/90 backdrop-blur-sm rounded-full text-xs font-black uppercase tracking-wider text-neutral-900 border-2 border-white/50 shadow-lg">
                      Main Tool
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col flex-1 min-h-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg flex-shrink-0">
                      <Icon className="text-white" size={28} />
                    </div>
                    <h2 className="text-lg md:text-xl font-display font-bold text-white leading-tight line-clamp-3 flex-1 min-h-0 [text-shadow:0_1px_2px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.25)]">
                      {card.title}
                    </h2>
                    <span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-white/90 border border-white/30 w-fit">
                      {card.badge}
                    </span>
                  </div>
                </div>
                <div className={`p-6 md:p-8 flex-1 flex flex-col min-h-0 ${isMainCard ? 'bg-gradient-to-br from-white/60 to-yellow-50/40' : 'bg-white/50'} backdrop-blur-sm`}>
                  <p className={`leading-relaxed mb-4 flex-1 font-serif text-academic-sm md:text-academic-base line-clamp-4 overflow-hidden ${isMainCard ? 'text-slate-800' : 'text-slate-700'}`}>
                    {card.description}
                  </p>
                  <div className={`flex items-center gap-2 ${isMainCard ? 'text-yellow-600' : 'text-teal-600'} font-semibold group-hover:gap-3 transition-all mt-auto pt-2`}>
                    <span>{isMainCard ? 'Launch Simulator' : 'Explore'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-200/50 mt-12">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <MapPin className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">About the Election Tracker</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                The Surrey Election Tracker provides interactive tools to model and understand the potential outcomes of Surrey's local government reorganisation. Use the simulator to project seat allocations for the new East and West Surrey unitary authorities, or explore reference data from existing councils.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold mt-0.5">•</span>
                  <span><strong>Aggregate Totals:</strong> Mathematically combined totals from existing district councils (reference only)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold mt-0.5">•</span>
                  <span><strong>Election Simulator:</strong> Interactive tool to model seat allocations and view majority projections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold mt-0.5">•</span>
                  <span><strong>Existing Councils:</strong> Reference data for Surrey County Council and all district councils</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <FAQSection page="surrey" />
    </div>
  );
}
