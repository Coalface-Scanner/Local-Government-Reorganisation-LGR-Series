import { Link, useLocation } from 'react-router-dom';
import { Map, Layers, Hand, Scale, Vote, LayoutGrid, Headphones } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import HubCtaBand from '../components/HubCtaBand';
import { ContentContainer } from '../components/layout';

interface DiscoverProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const featuredPathway = [
  { label: 'Topics', url: '/topics' },
  { label: 'Reorganisations', url: '/reorganisations' },
  { label: 'Podcast', url: '/podcast' },
];

const topicCards = [
  { title: 'Governance and Reform', path: '/topics/governance-and-reform', description: 'How governance arrangements hold up during transition: accountability, planning performance, and decision making.', icon: Scale },
  { title: 'Democratic Legitimacy and Statecraft', path: '/topics/democratic-legitimacy', description: 'Who is represented, how visible decision makers are, and how much confidence communities place in council outcomes.', icon: Vote },
  { title: 'System Design', path: '/topics/statecraft-and-system-design', description: 'How judgment, sequencing and political authority in practice shape outcomes beyond formal structures.', icon: LayoutGrid },
];

const subPageCards = [
  { title: 'Topics', path: '/topics', description: 'Browse by theme: governance, democracy, and system design.', icon: Layers },
  { title: 'Reorganisations', path: '/reorganisations', description: 'Explore current and recent reorganisation programmes.', icon: Map },
  { title: 'Podcast', path: '/podcast', description: 'Conversations with leaders and practitioners on LGR in practice.', icon: Headphones },
];

export default function Discover(_props: DiscoverProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="discover" />
      <MetaTags
        title="Discover - Local Government Reorganisation"
        description="Explore topics, reorganisations, and the podcast to understand the local government reform landscape."
        keywords="discover LGR, reorganisations, podcast, local government reform topics"
      />

      <PageBanner
        heroVariant="discover"
        heroLabel="DISCOVER"
        heroTitle="Discover The LGR Landscape"
        heroSubtitle="Explore themes, places, and council-level context across current and emerging reorganisations."
        currentPath={location.pathname}
        breadcrumbVariant="inline"
      />

      <ContentContainer variant="hub">
        <section className="layout-section hub-section-plain">
          <div className="hub-intro">
            <p className="text-academic-base font-serif leading-relaxed">
              Discover brings together topics, reorganisations, and the podcast so you can explore the LGR landscape by theme or by listening. Use Topics for governance and democracy themes, Reorganisations for where change is happening, and the Podcast for conversations with practitioners and leaders.
            </p>
          </div>
        </section>

        <section className="layout-section hub-section-pathway">
          <h2 className="font-display font-bold text-academic-charcoal mb-4 hub-section-heading">
            <span className="block text-academic-2xl">Not sure where to begin?</span>
            <span className="block text-academic-lg text-academic-neutral-700 mt-1">
              The most popular pages in Discover are:
            </span>
          </h2>
          <div className="layout-pathway-grid">
            {featuredPathway.map((step, idx) => (
              <Link
                key={step.url}
                to={step.url}
                className={`hub-pathway-card ${idx === 0 ? 'hub-pathway-card-primary' : ''}`}
              >
                <Hand className="w-8 h-8 hub-pathway-icon" strokeWidth={1.5} />
                {step.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="layout-section hub-section-plain">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4 hub-section-heading">
            Topics
          </h2>
          <p className="text-academic-neutral-700 font-serif mb-6 max-w-2xl">
            Explore thought leadership by theme: governance and reform, democratic legitimacy and statecraft, and system design.
          </p>
          <div className="layout-card-grid hub-card-grid mb-10">
            {topicCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.path}
                  to={card.path}
                  className="group academic-card p-6 text-left transition-all hover:shadow-lg duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="hub-card-icon">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif flex-grow">
                    {card.description}
                  </p>
                  <div className="text-academic-sm font-display font-semibold text-teal-700">
                    View topic →
                  </div>
                </Link>
              );
            })}
          </div>

          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6 hub-section-heading">
            All pages in this section
          </h2>
          <div className="layout-card-grid hub-card-grid">
            {subPageCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.path}
                  to={card.path}
                  className="group academic-card p-6 text-left transition-all hover:shadow-lg duration-300 flex flex-col h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="hub-card-icon">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif flex-grow">
                    {card.description}
                  </p>
                  <div className="text-academic-sm font-display font-semibold text-teal-700">
                    View page →
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </ContentContainer>

      <FAQSection page="discover" variant="hub" />
      <HubCtaBand />
    </div>
  );
}
