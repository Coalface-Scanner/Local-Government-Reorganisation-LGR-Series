import { useLocation } from 'react-router-dom';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import OptimizedImage from '../../components/OptimizedImage';
import FAQSection from '../../components/FAQSection';

interface Contributor {
  name: string;
  surname: string;
  role: string;
  bio: string;
  imageSrc: string;
  imageAlt: string;
  /** Positions the crop to show more of the top (e.g. faces). Omit for default center. */
  imageObjectPosition?: string;
}

const CONTRIBUTORS_DATA: Contributor[] = [
  {
    name: 'Cllr Anne-Marie Barker',
    surname: 'Barker',
    role: 'Leader of Woking Borough Council',
    bio: 'Anne-Marie is a senior local government leader with experience in council leadership, governance, reform and community representation, contributing practical insight on reorganisation impacts.',
    imageSrc: '/Contributors/Headshots/anne-marie-barker.jpeg',
    imageAlt: 'Cllr Anne-Marie Barker',
    imageObjectPosition: '50% 25%',
  },
  {
    name: 'Cllr Richard Biggs',
    surname: 'Biggs',
    role: 'Leader, Reigate and Banstead Borough Council',
    bio: 'Guiding the authority through the strategic and operational implications of local government reorganisation across Surrey. Provides borough level insight on governance transition, planning integration, financial resilience and community representation within a two tier context.',
    imageSrc: '/Contributors/Headshots/richard-biggs.jpg',
    imageAlt: 'Cllr Richard Biggs',
  },
  {
    name: 'Cllr Paul Follows',
    surname: 'Follows',
    role: 'Leader of Waverley & Leader of the Official Opposition SCC',
    bio: 'Paul serves as Leader of Woking Borough Council, with extensive experience in local government leadership, governance, finance and strategic service delivery.',
    imageSrc: '/Contributors/Headshots/paul-follows.jpeg',
    imageAlt: 'Cllr Paul Follows',
    imageObjectPosition: '50% 25%',
  },
  {
    name: 'Andrew Kelly',
    surname: 'Kelly',
    role: 'Former Elmbridge Councillor and Cabinet Member',
    bio: 'Examines how larger councils and reduced representation impact democratic engagement and local voice in reorganised authorities.',
    imageSrc: '/Contributors/Headshots/andrew-kelly.jpg',
    imageAlt: 'Andrew Kelly',
  },
  {
    name: 'Robert Moran',
    surname: 'Moran',
    role: 'Former Chief Executive, Elmbridge Borough Council',
    bio: 'Senior local government leader with extensive experience of council governance and organisational leadership during periods of reform and transition.',
    imageSrc: '/Contributors/Headshots/robert-moran.jpeg',
    imageAlt: 'Robert Moran',
  },
  {
    name: 'Tim Oliver OBE',
    surname: 'Oliver',
    role: 'Leader of Surrey County Council',
    bio: 'National Chair of the County Councils Network and strong proponent of mayoral devolution, awarded OBE for services to local government in 2024.',
    imageSrc: '/Contributors/Headshots/tim-oliver.jpg',
    imageAlt: 'Tim Oliver',
  },
  {
    name: 'Eric Owens',
    surname: 'Owens',
    role: 'Former Buckinghamshire Planning Service Director',
    bio: 'Experienced planning service director with direct insight into the operational and digital realities of local government reorganisation and service delivery.',
    imageSrc: '/Contributors/Headshots/eric-owens.jpeg',
    imageAlt: 'Eric Owens',
  },
];

const CONTRIBUTORS_SORTED = [...CONTRIBUTORS_DATA].sort((a, b) =>
  a.surname.localeCompare(b.surname)
);

interface ContributorsProps {
  onNavigate: (page: string) => void;
}

export default function Contributors({ onNavigate: _onNavigate }: ContributorsProps) {
  const location = useLocation();
  
  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Contributors - LGR Initiative Authors & Contributors"
        description="Meet the contributors and authors behind the LGR Initiative research programme examining local government reorganisation."
        keywords="LGR series contributors, LGR authors, local government reorganisation researchers"
      />
      
      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Contributors & Authors"
        heroSubtitle="Meet the contributors and authors behind the LGR Initiative research programme."
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Contributors Section */}
            <section className="academic-card p-8">
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-6">
                Contributors
              </h2>
              <div className="academic-prose space-y-4">
                <p>
                  The LGR Initiative benefits from contributions from practitioners, academics, and elected representatives with direct experience of local government reorganisation.
                </p>
                <p>
                  If you would like to contribute to the LGR Initiative, please visit our{' '}
                  <a href="/about/contributors/contribute" className="text-teal-700 hover:text-teal-800 underline">
                    Contribute page
                  </a>
                  {' '}or{' '}
                  <a href="/contact" className="text-teal-700 hover:text-teal-800 underline">
                    contact us
                  </a>.
                </p>
              </div>
            </section>

            {/* Insights Section */}
            <section className="academic-card p-8">
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-6">
                Insights
              </h2>
              <div className="academic-prose mb-8">
                <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed">
                  Our sincere thanks to everyone listed below who has contributed insight to the LGR Initiative, whether through interviews, advice, specialist input or discussion. Their contributions have strengthened the quality, balance and practical relevance of the work, while responsibility for all analysis and conclusions remains mine as Editor.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CONTRIBUTORS_SORTED.map((contributor) => (
                  <div key={contributor.surname} className="flex flex-col">
                    <OptimizedImage
                      src={contributor.imageSrc}
                      alt={contributor.imageAlt}
                      variant="thumbnail"
                      className="w-full rounded-lg shadow-md mb-4"
                      objectPosition={contributor.imageObjectPosition}
                    />
                    <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-1">
                      {contributor.name}
                    </h3>
                    <p className="text-academic-sm text-teal-700 font-semibold mb-2">
                      {contributor.role}
                    </p>
                    <div className="min-h-[4.5rem]">
                      <p className="text-academic-sm text-academic-neutral-700 leading-relaxed">
                        {contributor.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="academic-card p-6">
                <h4 className="font-display font-bold text-academic-charcoal mb-4 text-sm tracking-wider border-b-2 border-academic-neutral-300 pb-3">
                  RELATED CONTENT
                </h4>
                <div className="space-y-3">
                  <a
                    href="/about"
                    className="block w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700"
                  >
                    About the LGR Initiative →
                  </a>
                  <a
                    href="/rowan-cole-local-government-reorganisation"
                    className="block w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700"
                  >
                    Editor Profile →
                  </a>
                  <a
                    href="/contact"
                    className="block w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700"
                  >
                    Contact Us →
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FAQSection page="about" />
    </div>
  );
}
