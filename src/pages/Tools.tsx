import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Calendar, Vote, BookOpen, Quote, Headphones, Hand, Map } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import ThemeChip from '../components/ThemeChip';
import FAQSection from '../components/FAQSection';
import HubCtaBand from '../components/HubCtaBand';
import { ContentContainer } from '../components/layout';

interface ToolsProps {
  onNavigate: (page: string, slug?: string) => void;
}

const featuredPathway = [
  { label: 'LGR Timetable & Governance Roadmap', url: '/roadmap' },
  { label: 'First 100 Days Playbook', url: '/first-100-days' },
  { label: 'Surrey Election Tools', url: '/surrey/election-tracker' },
];

const subPageCards = [
  { title: 'LGR Timetable & Governance Roadmap', path: '/roadmap', description: 'Key milestones from proposal to vesting day.', icon: Calendar },
  { title: 'Election & Representation Models', path: '/surrey/election-tracker', description: 'Ward patterns and election timings and representation.', icon: Vote },
  { title: 'First 100 Days Playbook', path: '/first-100-days', description: 'Guidance for leaders and officers in new authorities.', icon: BookOpen },
  { title: 'Lessons Library', path: '/lessons', description: 'Reflections and case studies from recent reorganisations.', icon: Quote },
  { title: 'LGR Podcast and Audio', path: '/podcast', description: 'Conversations with leaders and practitioners on LGR in practice.', icon: Headphones },
];

export default function Tools(_props: ToolsProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="tools" />
      <MetaTags
        title="Tools and Practical Resources - LGR Initiative"
        description="Practical tools and resources for Local Government Reorganisation including the LGR Timetable & Governance Roadmap, Election & Representation Models, First 100 Days Playbook, Lessons Library, and Podcast."
        keywords="LGR tools, local government reorganisation resources, LGR roadmap, election models, first 100 days playbook, LGR lessons, LGR podcast"
      />

      <PageBanner
        heroVariant="tools"
        heroLabel="TOOLS & RESOURCES"
        heroTitle="Tools and Practical Resources for LGR"
        heroSubtitle="Practical tools, guides, and resources to support Local Government Reorganisation planning, implementation, and governance."
        currentPath={location.pathname}
        breadcrumbVariant="inline"
      />

      <ContentContainer variant="hub">
        <section className="layout-section hub-section-plain">
          <div className="hub-intro">
            <p className="text-academic-base font-serif leading-relaxed">
              Tools brings together practical resources for LGR: the governance roadmap, election and representation models, the First 100 Days Playbook, the Lessons Library, and the LGR Podcast. Use the links below to find the right resource for planning, implementation, or learning from experience.
            </p>
          </div>
        </section>

        <section className="layout-section hub-section-pathway">
          <h2 className="font-display font-bold text-academic-charcoal mb-4 hub-section-heading">
            <span className="block text-academic-2xl">Not sure where to begin?</span>
            <span className="block text-academic-lg text-academic-neutral-700 mt-1">
              The most popular pages in Tools are:
            </span>
          </h2>
          <div className="layout-pathway-grid">
            {featuredPathway.map((step, idx) => (
              <Link
                key={step.url}
                to={step.url}
                className={`hub-pathway-card ${idx === 0 ? 'hub-pathway-card-primary' : ''}`}
              >
                {idx === 0 ? (
                  <Map className="w-8 h-8 hub-pathway-icon" strokeWidth={1.5} />
                ) : (
                  <Hand className="w-8 h-8 hub-pathway-icon" strokeWidth={1.5} />
                )}
                <span className="text-sm leading-tight">{step.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="layout-section hub-section-plain">
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {card.path === '/roadmap' && (
                      <ThemeChip key="gov" theme="Governance and Reform" variant="secondary" href="/topics/governance-and-reform" />
                    )}
                    {card.path === '/surrey/election-tracker' && (
                      <ThemeChip key="demo" theme="Democratic Legitimacy" variant="secondary" href="/topics/democratic-legitimacy" />
                    )}
                    {card.path === '/first-100-days' && (
                      <>
                        <ThemeChip key="state" theme="Statecraft and System Design" variant="secondary" href="/topics/statecraft-and-system-design" />
                        <ThemeChip key="gov2" theme="Governance and Reform" variant="secondary" href="/topics/governance-and-reform" />
                      </>
                    )}
                  </div>
                  <div className="text-academic-sm font-display font-semibold text-teal-700">
                    View page →
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="layout-section hub-section-plain">
          <div className="academic-card p-8 bg-teal-50 border-l-4 border-teal-600">
            <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
              Explore More
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link to="/" className="academic-button academic-button-outline inline-flex items-center gap-2">
                Back to LGR Hub
                <ArrowRight size={16} />
              </Link>
              <Link to="/topics" className="academic-button academic-button-outline inline-flex items-center gap-2">
                View All Topics
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </ContentContainer>

      <FAQSection page="tools" variant="hub" />
      <HubCtaBand />
    </div>
  );
}
