import { Link, useLocation } from 'react-router-dom';
import { Database, Search, GraduationCap, FileBarChart2, Hand } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import HubCtaBand from '../components/HubCtaBand';
import { ContentContainer } from '../components/layout';

interface ResearchProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const featuredPathway = [
  { label: 'Facts & data', url: '/facts-and-data' },
  { label: 'Library', url: '/library' },
  { label: 'Lessons', url: '/lessons' },
];

const subPageCards = [
  { title: 'Facts & data', path: '/facts-and-data', description: 'Research overview: verified facts, datasets and sources.', icon: Database },
  { title: 'Library', path: '/library', description: 'Search and browse the LGR library of reports and materials.', icon: Search },
  { title: 'Lessons', path: '/lessons', description: 'Case-grounded insights and lessons from prior reorganisations.', icon: GraduationCap },
  { title: 'Reports', path: '/insights/reports', description: 'Long-form analysis and report outputs from the programme.', icon: FileBarChart2 },
];

export default function Research(_props: ResearchProps) {
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
        heroTitle="Research and Evidence on LGR reform"
        heroSubtitle="Find the data, reports, and case-grounded lessons that support rigorous LGR decision-making."
        currentPath={location.pathname}
        breadcrumbVariant="inline"
      />

      <ContentContainer variant="hub">
        <section className="layout-section hub-section-plain">
          <div className="hub-intro">
            <p className="text-academic-base font-serif leading-relaxed">
              The Research section gives you access to evidence, reports, and lessons from practice. Use Facts & Data for reference material and datasets, the Library to search across articles and reports, Lessons for case-based insights, and Reports for longer analysis from the LGR Initiative programme.
            </p>
          </div>
        </section>

        <section className="layout-section hub-section-pathway">
          <h2 className="font-display font-bold text-academic-charcoal mb-4 hub-section-heading">
            <span className="block text-academic-2xl">Not sure where to begin?</span>
            <span className="block text-academic-lg text-academic-neutral-700 mt-1">
              The most popular pages in Research are:
            </span>
          </h2>
          <div className="layout-pathway-grid">
            {featuredPathway.map((step, idx) => (
              <Link key={step.url} to={step.url} className={`hub-pathway-card ${idx === 0 ? 'hub-pathway-card-primary' : ''}`}>
                <Hand className="w-8 h-8 hub-pathway-icon" strokeWidth={1.5} />
                {step.label}
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
                  <div className="text-academic-sm font-display font-semibold text-teal-700">
                    View page →
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </ContentContainer>

      <FAQSection page="research" variant="hub" />
      <HubCtaBand />
    </div>
  );
}
