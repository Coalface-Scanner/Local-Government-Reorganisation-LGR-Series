import { Link, useLocation } from 'react-router-dom';
import { User, MessageSquare, Info, Users, Mail, Hand, BookOpen, HelpCircle } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import OrganizationStructuredData from '../../components/OrganizationStructuredData';
import HubCtaBand from '../../components/HubCtaBand';
import { ContentContainer } from '../../components/layout';

interface AboutHubProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const featuredPathway = [
  { label: 'About this programme', url: '/about/overview' },
  { label: 'Leadership', url: '/about/leadership' },
  { label: 'Partnership', url: '/about/partnership' },
];

const subPageCards = [
  { title: 'About this programme', path: '/about/overview', description: 'Mission, central question, core themes and research methodology.', icon: Info },
  { title: 'Leadership', path: '/about/leadership', description: 'Editorial accountability, research support and partners.', icon: User },
  { title: 'Partnership', path: '/about/partnership', description: 'Lead and strategic partners delivering the LGR Initiative.', icon: BookOpen },
  { title: 'Contributors', path: '/about/contributors', description: 'People and organisations who contribute to the LGRI.', icon: Users },
  { title: 'Contribute', path: '/about/contributors/contribute', description: 'How to get involved: share experience or suggest topics.', icon: MessageSquare },
  { title: 'FAQ', path: '/faq', description: 'Frequently asked questions about LGR and the LGR Initiative.', icon: HelpCircle },
  { title: 'Contact', path: '/contact', description: 'Get in touch with the LGRI team.', icon: Mail },
];

export default function AboutHub(_props: AboutHubProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="About the LGR Initiative - Research Programme Overview"
        description="Learn about the LGR Initiative research programme examining local government reorganisation and its implications for planning, governance, and development delivery."
        keywords="LGR Initiative, local government reorganisation, council reform research, COALFACE insights, research programme"
      />
      <OrganizationStructuredData />

      <PageBanner
        heroVariant="about"
        heroLabel="ABOUT"
        heroTitle="About the LGR Initiative"
        heroSubtitle="The LGR Initiative was first established as the LGR Series by Coalface in 2025. It has since expanded into a dedicated research programme examining local government reorganisation and its impact on planning, governance, and development delivery."
        currentPath={location.pathname}
        breadcrumbVariant="inline"
      />

      <ContentContainer variant="hub">
        <section className="layout-section hub-section-plain">
          <div className="hub-intro">
            <p className="text-academic-base font-serif leading-relaxed">
              The LGR Initiative provides independent, governance-led insight into local government reorganisation and devolution, with a clear focus on democratic leadership and community confidence. Use the links below to explore our mission, leadership, methodology, and how to contribute, or to learn about COALFACE and our contributors.
            </p>
          </div>
        </section>

        <section className="layout-section hub-section-pathway">
          <h2 className="font-display font-bold text-academic-charcoal mb-4 hub-section-heading">
            <span className="block text-academic-2xl">Not sure where to begin?</span>
            <span className="block text-academic-lg text-academic-neutral-700 mt-1">
              The most popular pages in About are:
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

      <FAQSection page="about" variant="hub" />
      <HubCtaBand />
    </div>
  );
}
