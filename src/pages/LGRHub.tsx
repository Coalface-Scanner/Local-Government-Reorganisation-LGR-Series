import { Calendar, BookOpen, Headphones, Route } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import PageBanner from '../components/PageBanner';
import ServiceCard from '../components/ServiceCard';
import FAQSection from '../components/FAQSection';
import { ContentContainer } from '../components/layout';

interface LGRHubProps {
  onNavigate: (page: string, slug?: string) => void;
}

const hubSections = [
  {
    id: 'roadmap',
    title: 'Roadmap',
    description: 'Interactive journey map visualizing the LGR journey for 2026, navigating key milestones, decisions, and transitions.',
    route: '/roadmap',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'overview',
    title: 'Overview',
    description: 'Welcome to the LGR Hub - your central resource for Local Government Reorganisation. Explore roadmap, tools, and podcast content.',
    route: '/lgr-hub',
    icon: Route,
    color: 'from-teal-600 to-cyan-700'
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
    route: '/podcast',
    icon: Headphones,
    color: 'from-violet-500 to-purple-600'
  }
];

export default function LGRHub({ onNavigate }: LGRHubProps) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="lgrHub" />
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

      <ContentContainer variant="hub">
        <section className="layout-section">
          <div className="academic-card p-8 mb-6">
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed mb-4">
              The LGR Hub is your central resource for Local Government Reorganisation. Use the cards below to explore the roadmap, tools, podcast, and practical guidance for council reorganisation.
            </p>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 font-display font-semibold text-teal-700 hover:text-teal-800"
            >
              <Calendar size={20} aria-hidden="true" />
              Explore the Journey Map
            </Link>
          </div>
        </section>
        <div className="layout-section grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
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

        <section className="layout-section">
          <div className="max-w-2xl mx-auto">
            <div className="lgr-insights-cta">
              <h3 className="lgr-insights-cta__title">LGR Insights & Updates</h3>
              <p className="lgr-insights-cta__body">
                Receive our regular update direct to your inbox. Subscribe here.
              </p>
              <Link to="/subscribe" className="lgr-insights-cta__btn">
                Subscribe
              </Link>
            </div>
          </div>
        </section>
      </ContentContainer>

      <FAQSection page="lgr-hub" />
    </div>
  );
}
