import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Map, Vote } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import LocalPlaceStructuredData from '../components/LocalPlaceStructuredData';
import FAQSection from '../components/FAQSection';
import { ContentContainer } from '../components/layout';

interface SurreyLGRHubProps {
  onNavigate: (page: string, data?: unknown) => void;
}

const hubCards = [
  {
    title: 'Lessons',
    path: '/surrey/lessons',
    description: 'Surrey: lessons and warnings. Primary risks based on evidence from elsewhere, with actionable guidance for the first 100 days.',
    icon: BookOpen,
  },
  {
    title: 'Area profile',
    path: '/surrey/area-profile',
    description: 'Surrey council profiles. Detailed profiles of all 12 Surrey councils, including key statistics, demographics, and future East and West Surrey unitary arrangements.',
    icon: Map,
  },
  {
    title: 'Election tracker',
    path: '/surrey/election-tracker',
    description: 'Ward patterns, election timings, and representation models for Surrey’s LGR.',
    icon: Vote,
  },
];

export default function SurreyLGRHub({ onNavigate: _onNavigate }: SurreyLGRHubProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="surrey" />
      <MetaTags
        title="Surrey LGR Hub - Lessons, Area Profile & Election Tools"
        description="Surrey LGR Hub: lessons and warnings, area profile and councils map, and election tracker. Your entry point for Surrey’s local government reorganisation."
        keywords="Surrey LGR Hub, Surrey reorganisation, Surrey LGR, East Surrey, West Surrey, Surrey election tracker, Surrey lessons"
      />
      <LocalPlaceStructuredData
        name="Surrey"
        description="Surrey is undergoing local government reorganisation to form East Surrey and West Surrey unitary authorities. The Surrey LGR Hub brings together lessons, area profile, and election tools."
        type="AdministrativeArea"
        address={{
          addressRegion: 'Surrey',
          addressCountry: 'GB',
        }}
        containedInPlace={{
          name: 'South East England',
          type: 'AdministrativeArea',
        }}
        areaServed={[
          'Elmbridge',
          'Epsom and Ewell',
          'Guildford',
          'Mole Valley',
          'Reigate and Banstead',
          'Runnymede',
          'Spelthorne',
          'Surrey Heath',
          'Tandridge',
          'Waverley',
          'Woking',
          'Surrey County Council',
        ]}
        url="/surrey"
      />
      <PageBanner
        heroVariant="insights"
        heroLabel="INSIGHTS"
        heroTitle="Surrey LGR Hub"
        heroSubtitle="Lessons, area profile, and election tools for Surrey’s local government reorganisation"
        currentPath={location.pathname}
      />

      <ContentContainer variant="hub">
        <section className="layout-section hub-section-plain">
          <div className="hub-intro">
            <p className="text-academic-base font-serif leading-relaxed">
              Surrey is undergoing Local Government Reorganisation (LGR) to form East Surrey and West Surrey unitary authorities. Use the links below for lessons and warnings, the councils map and area profile, and the election tracker.
            </p>
          </div>
        </section>

        <section className="layout-section hub-section-plain">
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6 hub-section-heading">
            Surrey LGR Hub
          </h2>
          <div className="layout-card-grid hub-card-grid">
            {hubCards.map((card) => {
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

      <FAQSection page="insights" />
    </div>
  );
}
