import { Calendar, BookOpen, Headphones, Route } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import PageBanner from '../components/PageBanner';
import ServiceCard from '../components/ServiceCard';

interface LGRHubProps {
  onNavigate: (page: string, slug?: string) => void;
}

const hubSections = [
  {
    id: 'overview',
    title: 'Overview',
    description: 'Welcome to the LGR Hub - your central resource for Local Government Reorganisation. Explore roadmap, tools, and podcast content.',
    route: '/lgr-hub',
    icon: Route,
    color: 'from-teal-600 to-cyan-700'
  },
  {
    id: 'roadmap',
    title: 'Roadmap',
    description: 'Interactive journey map visualizing the LGR journey for 2026, navigating key milestones, decisions, and transitions.',
    route: '/lgr-journey-2026',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'tools',
    title: 'Tools',
    description: 'Practical tools and resources including the LGR Timetable, Election Models, First 100 Days Playbook, and Lessons Library.',
    route: '/tools',
    icon: BookOpen,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'podcast',
    title: 'Podcast',
    description: 'Conversations with leaders, practitioners and academics on how Local Government Reorganisation works in practice.',
    route: '/interviews',
    icon: Headphones,
    color: 'from-violet-500 to-purple-600'
  }
];

export default function LGRHub({ onNavigate }: LGRHubProps) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="LGR Hub - Local Government Reorganisation Resources"
        description="Your central hub for Local Government Reorganisation (LGR) resources. Access roadmap, tools, podcast, and practical guidance for council reorganisation."
        keywords="LGR hub, local government reorganisation hub, LGR roadmap, LGR tools, LGR podcast, council reorganisation resources"
      />
      <CollectionPageStructuredData
        name="LGR Hub"
        description="Central hub for Local Government Reorganisation resources including roadmap, tools, and podcast content."
        url="/lgr-hub"
        numberOfItems={hubSections.length}
        items={hubSections.map(section => ({
          name: section.title,
          url: section.route,
          description: section.description
        }))}
      />
      
      <PageBanner
        heroLabel="LGR HUB"
        heroTitle="Local Government Reorganisation Hub"
        heroSubtitle="Your central resource for Local Government Reorganisation. Explore roadmap, tools, podcast, and practical guidance for council reorganisation."
        currentPath={location.pathname}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-stretch">
          {hubSections.map((section) => (
            <ServiceCard
              key={section.id}
              id={section.id}
              title={section.title}
              description={section.description}
              icon={section.icon}
              color={section.color}
              route={section.route === '/lgr-hub' ? undefined : section.route}
              asButton={section.id === 'overview'}
              onClick={section.id === 'overview' ? undefined : () => onNavigate(section.route.replace('/', ''))}
              showExplore={section.id !== 'overview'}
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
