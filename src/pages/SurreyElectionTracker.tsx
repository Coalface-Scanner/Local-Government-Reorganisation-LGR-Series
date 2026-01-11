import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, BookOpen, ArrowRight, BarChart3, MapPin, ArrowLeft } from 'lucide-react';
import MetaTags from '../components/MetaTags';

interface SurreyElectionTrackerProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function SurreyElectionTracker({ onNavigate }: SurreyElectionTrackerProps) {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <MetaTags
        title="Surrey Election Tracker - LGR Modeller"
        description="Interactive tools for modelling Surrey's local government reorganisation. View aggregate totals, simulate election outcomes, and explore reference data."
        keywords="Surrey election tracker, Surrey LGR modeller, election simulation, Surrey reorganisation, election planning"
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/surrey')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-3 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Surrey
          </button>
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              SURREY LGR
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Election{' '}
            <span className="text-teal-700 font-serif italic">Tracker</span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Interactive tools for modelling Surrey's local government reorganisation. Explore aggregate totals, simulate election outcomes, and review reference data for East and West Surrey unitary authorities.
          </p>
        </div>
      </div>

      {/* Service Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
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
                <div className={`bg-gradient-to-br ${card.color} ${isMainCard ? 'p-10' : 'p-8'} text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  {isMainCard && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400/90 backdrop-blur-sm rounded-full text-xs font-black uppercase tracking-wider text-neutral-900 border-2 border-white/50 shadow-lg">
                      Main Tool
                    </div>
                  )}
                  <div className="relative z-10">
                    <div className={`${isMainCard ? 'w-20 h-20' : 'w-16 h-16'} bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg`}>
                      <Icon className="text-white" size={isMainCard ? 40 : 32} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className={`${isMainCard ? 'text-3xl' : 'text-2xl'} font-black leading-tight`}>{card.title}</h2>
                    </div>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider text-white/90 border border-white/30">
                      {card.badge}
                    </span>
                  </div>
                </div>
                <div className={`${isMainCard ? 'p-8' : 'p-6'} flex-1 flex flex-col ${isMainCard ? 'bg-gradient-to-br from-white/60 to-yellow-50/40' : 'bg-white/50'} backdrop-blur-sm`}>
                  <p className={`leading-relaxed mb-6 flex-1 ${isMainCard ? 'text-slate-800 text-lg' : 'text-slate-700'}`}>
                    {card.description}
                  </p>
                  <div className={`flex items-center gap-2 ${isMainCard ? 'text-yellow-600' : 'text-teal-600'} font-semibold group-hover:gap-3 transition-all`}>
                    <span>{isMainCard ? 'Launch Simulator' : 'Explore'}</span>
                    <ArrowRight size={isMainCard ? 20 : 18} className="group-hover:translate-x-1 transition-transform" />
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
    </div>
  );
}
