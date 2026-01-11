import MetaTags from '../components/MetaTags';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import SubscriptionForm from '../components/SubscriptionForm';
import { Calendar, MapPin, List, CheckCircle, FileText, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FactsProps {
  onNavigate: (page: string) => void;
}

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  route: string;
  disabled?: boolean;
}

const serviceCards: ServiceCard[] = [
  {
    id: 'timescales',
    title: 'Timescales',
    description: 'Implementation timeline for local government reorganisation proposals across England, including final proposals, decisions, shadow councils, and go-live dates.',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-600',
    route: '/facts/timescales'
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
    id: 'key-facts',
    title: 'Key Facts',
    description: 'Evidence-based analysis of local government reorganisation outcomes, including workforce impact, financial performance, service delivery, and democratic representation.',
    icon: List,
    color: 'from-purple-500 to-indigo-600',
    route: '/facts/key-facts',
    disabled: true
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
  }
];

export default function Facts({ onNavigate: _onNavigate }: FactsProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Facts & Data"
        description="Comprehensive evidence-based analysis of local government reorganisation in England. Timeline, councils involved, key facts, methodology, sources, and further reading."
        keywords="LGR facts, reorganisation data, unitary authority evidence, local government reorganisation analysis, LGR statistics"
      />
      
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              EVIDENCE-BASED ANALYSIS
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Facts &{' '}
            <span className="text-teal-700 font-serif italic">
              Data
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Comprehensive evidence-based analysis of local government reorganisation in England. Explore timelines, councils, key facts, methodology, sources, and additional resources.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            const isDisabled = card.disabled;
            return (
              <div
                key={card.id}
                onClick={isDisabled ? undefined : () => navigate(card.route)}
                className={`group rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-300 text-left h-full flex flex-col ${
                  isDisabled
                    ? 'bg-slate-100 border-slate-300 cursor-not-allowed opacity-60'
                    : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-2xl cursor-pointer'
                }`}
              >
                <div className={`bg-gradient-to-br ${card.color} p-8 text-white ${isDisabled ? 'opacity-50' : ''}`}>
                  <div className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 transition-transform ${isDisabled ? '' : 'group-hover:scale-110'}`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold leading-tight">{card.title}</h2>
                  {isDisabled && (
                    <p className="text-sm text-white/80 mt-2 italic">Coming soon</p>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className={`leading-relaxed mb-4 flex-1 ${isDisabled ? 'text-slate-500' : 'text-slate-600'}`}>
                    {card.description}
                  </p>
                  {!isDisabled && (
                    <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-3 transition-all">
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
              <SubscriptionForm />
        </div>
      </div>

      <FAQSection page="facts" />
      <LastUpdated />
    </div>
  );
}
