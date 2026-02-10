import { FileText, BookOpen, MapPin } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import PageBanner from '../components/PageBanner';
import ServiceCard from '../components/ServiceCard';

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
  const location = useLocation();

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
      
      <PageBanner
        heroLabel="EVIDENCE-BASED ANALYSIS"
        heroTitle="Facts & Data"
        heroSubtitle="Comprehensive evidence-based analysis of Local Government Reorganisation. Access key facts, materials, datasets, and council profiles."
        currentPath={location.pathname}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-stretch">
          {dataSections.map((section) => (
            <ServiceCard
              key={section.id}
              id={section.id}
              title={section.title}
              description={section.description}
              icon={section.icon}
              color={section.color}
              route={section.route}
            />
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-teal-800 text-white p-8">
            <h3 className="text-academic-xl font-display font-bold text-white mb-4">
              LGR Series Newsletter
            </h3>
            <p className="text-academic-sm text-white mb-5 font-serif">
              Get the LGR Series directly in your inbox. No fluff, just deep analysis.
            </p>
            <Link
              to="/subscribe"
              className="inline-block bg-white text-teal-700 px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider hover:bg-teal-50 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
