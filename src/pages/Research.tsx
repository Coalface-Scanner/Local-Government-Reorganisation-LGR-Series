import { Database, Search, GraduationCap, FileBarChart2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';

interface ResearchProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const researchSections = [
  {
    id: 'facts-and-data',
    title: 'Facts & Data',
    description: 'Evidence-based facts, reference material, and structured datasets for LGR.',
    route: 'facts-and-data',
    icon: Database,
  },
  {
    id: 'library',
    title: 'Library',
    description: 'Search articles, reports, and materials across the full content archive.',
    route: 'library',
    icon: Search,
  },
  {
    id: 'lessons',
    title: 'Lessons',
    description: 'Case-grounded insights and practical lessons from prior reorganisations.',
    route: 'lessons',
    icon: GraduationCap,
  },
  {
    id: 'insights-reports',
    title: 'Reports',
    description: 'Long-form analysis and report outputs from the LGRI programme.',
    route: 'insights/reports',
    icon: FileBarChart2,
  },
];

export default function Research({ onNavigate }: ResearchProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Research - Local Government Reorganisation"
        description="Access evidence, reports, library materials, and lessons that inform high-quality local government reorganisation decisions."
        keywords="LGR research, facts and data, local government reorganisation reports, lessons"
      />

      <PageBanner
        heroVariant="research"
        heroLabel="RESEARCH"
        heroTitle="Research and Evidence"
        heroSubtitle="Find the data, reports, and case-grounded lessons that support rigorous LGR decision-making."
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-hub py-10">
        <div className="grid md:grid-cols-2 gap-6">
          {researchSections.map((section) => {
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
