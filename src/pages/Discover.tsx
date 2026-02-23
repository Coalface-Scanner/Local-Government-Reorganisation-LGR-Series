import { Map, Layers, Building2, Compass } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';

interface DiscoverProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const discoverSections = [
  {
    id: 'topics',
    title: 'Topics',
    description: 'Explore the major governance, democracy, and system-design themes in LGR.',
    route: 'topics',
    icon: Layers,
  },
  {
    id: 'reorganisations',
    title: 'Reorganisations',
    description: 'Track where reorganisation is planned, proposed, or implemented.',
    route: 'reorganisations',
    icon: Map,
  },
  {
    id: 'councils',
    title: 'Councils Map',
    description: 'Navigate authority-level profiles, geography, and context.',
    route: 'councils',
    icon: Compass,
  },
  {
    id: 'council-profiles',
    title: 'Council Profiles',
    description: 'Review key metrics and characteristics for specific councils.',
    route: 'council-profiles',
    icon: Building2,
  },
];

export default function Discover({ onNavigate }: DiscoverProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Discover - Local Government Reorganisation"
        description="Explore topics, reorganisations, council maps, and profiles to understand the local government reform landscape."
        keywords="discover LGR, reorganisations, council profiles, local government reform topics"
      />

      <PageBanner
        heroVariant="discover"
        heroLabel="DISCOVER"
        heroTitle="Discover The LGR Landscape"
        heroSubtitle="Explore themes, places, and council-level context across current and emerging reorganisations."
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-hub py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {discoverSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onNavigate(section.route)}
                className="academic-card p-6 text-left hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon size={20} className="text-teal-700" />
                  <h2 className="text-academic-xl font-display font-bold text-academic-charcoal">{section.title}</h2>
                </div>
                <p className="text-academic-neutral-700 font-serif">{section.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
