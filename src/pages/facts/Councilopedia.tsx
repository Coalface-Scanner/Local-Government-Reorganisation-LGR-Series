import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft, ArrowRight, GraduationCap, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  route?: string;
  disabled?: boolean;
}

const serviceCards: ServiceCard[] = [
  {
    id: 'beginners-guide',
    title: 'A beginners guide',
    description: 'An introduction to UK government structure, local councils, and how councillors are elected. Learn the basics of governance and electoral systems.',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-600',
    route: '/facts/councilopedia/beginners-guide'
  }
];

export default function Councilopedia() {
  const navigate = useNavigate();
  const activeServiceCards = serviceCards;

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Councylopedia - Facts & Data"
        description="Comprehensive guide to local government reorganisation terminology, concepts, and resources."
        keywords="councilopedia, LGR glossary, local government terms, reorganisation guide"
      />
      
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-3 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts & Data
          </button>
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              COMPREHENSIVE GUIDE
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Councilopedia
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Your comprehensive guide to local government reorganisation terminology, concepts, and resources.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeServiceCards.map((card) => {
            const Icon = card.icon;
            const isDisabled = card.disabled;
            return (
              <div
                key={card.id}
                onClick={isDisabled ? undefined : () => card.route && navigate(card.route)}
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
      </div>

      <FAQSection page="facts" />
      <LastUpdated />
    </div>
  );
}
