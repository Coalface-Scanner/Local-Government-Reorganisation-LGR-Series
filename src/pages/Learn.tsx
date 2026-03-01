import { Link, useLocation } from 'react-router-dom';
import { BookOpen, HelpCircle, MessageCircleQuestion, Clock, Hand, Map } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import HubCtaBand from '../components/HubCtaBand';
import { ContentContainer } from '../components/layout';

interface LearnProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const featuredPathway = [
  { label: 'What is LGR', url: '/what-is-lgr' },
  { label: 'Beginners guide', url: '/beginners-guide' },
  { label: 'Questions and answers', url: '/questions-and-answers' },
];

const subPageCards = [
  { title: 'What is LGR', path: '/what-is-lgr', description: 'Introduction to local government reorganisation and how it works.', icon: BookOpen },
  { title: 'Beginners guide', path: '/beginners-guide', description: 'Step-by-step primer to the process and key concepts.', icon: HelpCircle },
  { title: 'Questions and answers', path: '/questions-and-answers', description: 'Common queries and straightforward answers.', icon: MessageCircleQuestion },
  { title: 'First 100 Days', path: '/first-100-days', description: 'Practical toolkit for the first 100 days of a new authority.', icon: Clock },
];

export default function Learn(_props: LearnProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="learn" />
      <MetaTags
        title="Learn - Local Government Reorganisation"
        description="Foundational guides to Local Government Reorganisation, including what LGR is, beginner guidance, FAQs, and first-100-days planning."
        keywords="learn LGR, what is LGR, local government reorganisation guide, beginners guide, LGR FAQ"
      />

      <PageBanner
        heroVariant="learn"
        heroLabel="LEARN"
        heroTitle="Learn about Local Government Reorganisation"
        heroSubtitle="Foundational guides and explanations to help you understand LGR quickly and clearly."
        currentPath={location.pathname}
        breadcrumbVariant="inline"
      />

      <ContentContainer variant="hub">
        <section className="layout-section hub-section-plain">
          <div className="hub-intro">
            <p className="text-academic-base font-serif leading-relaxed">
              Whether you are new to local government reorganisation or need to refresh your understanding, the Learn section gives you clear explanations, practical guides, and quick answers. Start with What Is LGR, use the Beginners Guide for roles and decision points, and explore the First 100 Days for implementation planning.
            </p>
          </div>
        </section>

        <section className="layout-section hub-section-pathway">
          <h2 className="font-display font-bold text-academic-charcoal mb-4 hub-section-heading">
            <span className="block text-academic-2xl">Not sure where to begin?</span>
            <span className="block text-academic-lg text-academic-neutral-700 mt-1">
              Start with the roadmap, or pick a topic below:
            </span>
          </h2>
          <div className="layout-pathway-grid">
            <Link to="/roadmap" className="hub-pathway-card hub-pathway-card-primary">
              <Map className="w-8 h-8 hub-pathway-icon" strokeWidth={1.5} />
              Start with the roadmap
            </Link>
            {featuredPathway.map((step) => (
              <Link key={step.url} to={step.url} className="hub-pathway-card">
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

      <FAQSection page="learn" variant="hub" />
      <HubCtaBand />
    </div>
  );
}
