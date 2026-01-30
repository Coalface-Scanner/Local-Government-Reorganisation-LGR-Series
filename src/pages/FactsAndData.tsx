import { ArrowRight, FileText, BookOpen, MapPin } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';
import { useNavigate } from 'react-router-dom';

interface FactsAndDataProps {
  onNavigate: (page: string) => void;
}

const dataSections = [
  {
    id: 'key-facts',
    title: 'Key Facts',
    description: 'Comprehensive facts, statistics, and data about Local Government Reorganisation in England. Explore LGR timelines, councils involved, methodology, and sources.',
    route: '/facts',
    icon: FileText,
    color: 'from-teal-600 to-cyan-700'
  },
  {
    id: 'materials',
    title: 'Materials & Datasets',
    description: 'Access datasets, materials, and downloadable resources related to Local Government Reorganisation.',
    route: '/materials',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'councils',
    title: 'Council Map & Profiles',
    description: 'Interactive map and profiles of councils involved in Local Government Reorganisation across England.',
    route: '/councils',
    icon: MapPin,
    color: 'from-emerald-500 to-teal-600'
  }
];

export default function FactsAndData({ onNavigate: _onNavigate }: FactsAndDataProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Facts & Data - Local Government Reorganisation Evidence"
        description="Comprehensive facts, data, and evidence about Local Government Reorganisation. Access key facts, materials, datasets, and council profiles."
        keywords="LGR facts, local government reorganisation data, LGR evidence, council reorganisation data, LGR statistics, LGR datasets"
      />
      <CollectionPageStructuredData
        name="Facts & Data"
        description="Comprehensive facts, data, and evidence about Local Government Reorganisation including key facts, materials, and council profiles."
        url="/facts-and-data"
        numberOfItems={dataSections.length}
        items={dataSections.map(section => ({
          name: section.title,
          url: section.route,
          description: section.description
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
              Facts{' '}
              <span className="text-teal-700 font-serif italic">
                & Data
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Comprehensive evidence-based analysis of Local Government Reorganisation. Access key facts, materials, datasets, and council profiles.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {dataSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                onClick={() => navigate(section.route)}
                className="group academic-card p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] duration-300 cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${section.color} p-6 text-white min-h-[180px] flex flex-col justify-between mb-4 rounded-lg`}>
                  <div className="w-12 h-12 bg-white/20 flex items-center justify-center mb-4 transition-transform rounded-lg group-hover:scale-110">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h2 className="text-academic-lg md:text-academic-xl font-display font-bold text-white leading-tight">
                    {section.title}
                  </h2>
                </div>
                <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif leading-relaxed">
                  {section.description}
                </p>
                <div className="flex items-center gap-2 text-teal-700 font-display font-semibold group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto mb-12">
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

      <LastUpdated />
    </div>
  );
}
