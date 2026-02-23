import { useLocation } from 'react-router-dom';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import ServiceCard from '../components/ServiceCard';
import { BookOpen, Building2, FileText, type LucideIcon } from 'lucide-react';
import { useScrollDepthTracking } from '../hooks/useScrollDepthTracking';
import { useTimeOnPageTracking } from '../hooks/useTimeOnPageTracking';

interface LessonsProps {
  onNavigate: (page: string) => void;
}

interface HubCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  route: string;
  disabled?: boolean;
}

const hubCards: HubCard[] = [
  {
    id: 'insights',
    title: 'Key Insights',
    description: 'Evidence-based lessons from recent reorganisations. Governance, systems integration, workforce capacity, and financial planning—what works and what fails.',
    icon: BookOpen,
    color: 'from-teal-600 to-cyan-700',
    route: '/lessons/insights',
  },
  {
    id: 'case-studies',
    title: 'Case Based Insights',
    description: 'In-depth case studies from North and West Northamptonshire, Somerset, and Dorset. Rescue reorganisation, efficiency mergers, and stability with policy inertia.',
    icon: Building2,
    color: 'from-emerald-500 to-teal-600',
    route: '/lessons/case-studies',
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    description: 'Practical guidance drawn from the first wave of Local Government Reorganisation. Curated best practices, checklists and lessons from the LGRI.',
    icon: FileText,
    color: 'from-slate-500 to-slate-700',
    route: '/lessons/best-practices',
    disabled: false,
  },
];

export default function Lessons({ onNavigate: _onNavigate }: LessonsProps) {
  const location = useLocation();

  useScrollDepthTracking();
  useTimeOnPageTracking();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Lessons from Recent Reorganisations"
        description="Critical lessons and case studies from recent local government reorganisations across England. Key insights, case studies from Northamptonshire, Somerset, and Dorset."
        keywords="LGR lessons, LGR case studies, council reform insights, reorganisation best practices, local government change management, unitary transition guidance"
      />
      <CollectionPageStructuredData
        name="Lessons from Reorganisation"
        description="Key insights and case studies from recent local government reorganisations across England."
        url="/lessons"
        numberOfItems={hubCards.length}
        items={hubCards.filter(c => !c.disabled).map(card => ({
          name: card.title,
          url: card.route,
          description: card.description,
        }))}
      />
      <PageBanner
        heroLabel="LEARNING FROM EXPERIENCE"
        heroTitle="Lessons from Reorganisation"
        heroSubtitle="What recent reorganisations have taught us about governance, planning, and delivery across England"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-hub">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          {hubCards.map((card) => (
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
      </div>

      <FAQSection page="lessons" />
    </div>
  );
}
