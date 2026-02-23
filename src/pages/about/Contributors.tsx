import { useLocation } from 'react-router-dom';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import OptimizedImage from '../../components/OptimizedImage';
import FAQSection from '../../components/FAQSection';

interface ContributorsProps {
  onNavigate: (page: string) => void;
}

export default function Contributors({ onNavigate: _onNavigate }: ContributorsProps) {
  const location = useLocation();
  
  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Contributors - LGRI Authors & Contributors"
        description="Meet the contributors and authors behind the LGRI research programme examining local government reorganisation."
        keywords="LGR series contributors, LGR authors, local government reorganisation researchers, COALFACE team"
      />
      
      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Contributors & Authors"
        heroSubtitle="Meet the contributors and authors behind the LGRI research programme."
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
                  The LGRI benefits from contributions from practitioners, academics, and elected representatives with direct experience of local government reorganisation.
                </p>
                <p>
                  If you would like to contribute to the LGRI, please visit our{' '}
                  <a href="/about/contribute" className="text-teal-700 hover:text-teal-800 underline">
                    Contribute page
                  </a>
                  {' '}or{' '}
                  <a href="/contact" className="text-teal-700 hover:text-teal-800 underline">
                    contact us
                  </a>.
                </p>
              </div>
            </section>

            {/* COALFACE Section */}
            <section className="academic-card p-8">
              <div className="mb-6">
                <OptimizedImage
                  src="/Coalface_Logo_Coloured_Stacked..jpg"
                  alt="COALFACE Logo"
                  variant="article"
                  className="max-w-xs"
                />
              </div>
              <div className="academic-prose">
                <p>
                  COALFACE is an independent consultancy and insight practice specialising in local government, planning, governance and political decision making. Its contribution to the LGRI draws on experience as an elected councillor, in advisory and officer roles within local authorities, and in supporting planning and regeneration programmes. COALFACE provides applied analysis focused on governance design, democratic legitimacy and delivery conditions in reorganised councils, with an emphasis on how decisions are made in practice rather than on formal structures alone.
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
                  Our sincere thanks to everyone listed below who has contributed insight to the LGRI, whether through interviews, advice, specialist input or discussion. Their contributions have strengthened the quality, balance and practical relevance of the work, while responsibility for all analysis and conclusions remains mine as Editor.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tim Oliver */}
                <div className="flex flex-col">
                  <OptimizedImage
                    src="/Oliver_TNail_Article.png"
                    alt="Tim Oliver"
                    variant="article"
                    className="w-full rounded-lg object-cover shadow-md mb-4"
                  />
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-1">
                    Tim Oliver OBE
                  </h3>
                  <p className="text-academic-sm text-teal-700 font-semibold mb-2">
                    Leader of Surrey County Council
                  </p>
                  <p className="text-academic-sm text-academic-neutral-700 leading-relaxed">
                    National Chair of the County Councils Network and strong proponent of mayoral devolution, awarded OBE for services to local government in 2024.
                  </p>
                </div>

                {/* Andrew Kelly */}
                <div className="flex flex-col">
                  <OptimizedImage
                    src="/Kelly_TNail_Article.png"
                    alt="Andrew Kelly"
                    variant="article"
                    className="w-full rounded-lg object-cover shadow-md mb-4"
                  />
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-1">
                    Andrew Kelly
                  </h3>
                  <p className="text-academic-sm text-teal-700 font-semibold mb-2">
                    Former Elmbridge Councillor and Cabinet Member
                  </p>
                  <p className="text-academic-sm text-academic-neutral-700 leading-relaxed">
                    Examines how larger councils and reduced representation impact democratic engagement and local voice in reorganised authorities.
                  </p>
                </div>

                {/* Robert Moran */}
                <div className="flex flex-col">
                  <OptimizedImage
                    src="/Moran_TNail_Article.png"
                    alt="Robert Moran"
                    variant="article"
                    className="w-full rounded-lg object-cover shadow-md mb-4"
                  />
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-1">
                    Robert Moran
                  </h3>
                  <p className="text-academic-sm text-teal-700 font-semibold mb-2">
                    Former Chief Executive, Elmbridge Borough Council
                  </p>
                  <p className="text-academic-sm text-academic-neutral-700 leading-relaxed">
                    Senior local government leader with extensive experience of council governance and organisational leadership during periods of reform and transition.
                  </p>
                </div>

                {/* Eric Owens */}
                <div className="flex flex-col">
                  <OptimizedImage
                    src="/eric_owens_interview_-_coming_soon.png"
                    alt="Eric Owens"
                    variant="article"
                    className="w-full rounded-lg object-cover shadow-md mb-4"
                  />
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-1">
                    Eric Owens
                  </h3>
                  <p className="text-academic-sm text-teal-700 font-semibold mb-2">
                    Former Buckinghamshire Planning Service Director
                  </p>
                  <p className="text-academic-sm text-academic-neutral-700 leading-relaxed">
                    Experienced planning service director with direct insight into the operational and digital realities of local government reorganisation and service delivery.
                  </p>
                </div>

                {/* Cllr Paul Follows */}
                <div className="flex flex-col">
                  <OptimizedImage
                    src="/LGR-Series-Paul-Follows.jpeg"
                    alt="Cllr Paul Follows"
                    variant="article"
                    className="w-full rounded-lg object-cover shadow-md mb-4"
                  />
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-1">
                    Cllr Paul Follows
                  </h3>
                  <p className="text-academic-sm text-teal-700 font-semibold mb-2">
                    Leader of Waverley & Leader of the Official Opposition SCC
                  </p>
                  <p className="text-academic-sm text-academic-neutral-700 leading-relaxed">
                    Paul serves as Leader of Woking Borough Council, with extensive experience in local government leadership, governance, finance and strategic service delivery.
                  </p>
                </div>

                {/* Cllr Anne-Marie Barker */}
                <div className="flex flex-col">
                  <OptimizedImage
                    src="/LGR-Series-Barker-Woking.jpeg"
                    alt="Cllr Anne-Marie Barker"
                    variant="article"
                    className="w-full rounded-lg object-cover shadow-md mb-4"
                  />
                  <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-1">
                    Cllr Anne-Marie Barker
                  </h3>
                  <p className="text-academic-sm text-teal-700 font-semibold mb-2">
                    Leader of Woking
                  </p>
                  <p className="text-academic-sm text-academic-neutral-700 leading-relaxed">
                    Anne-Marie is a senior local government leader with experience in council leadership, governance, reform and community representation, contributing practical insight on reorganisation impacts.
                  </p>
                </div>
              </div>
            </section>

            {/* Organisations Section */}
            <section className="academic-card p-8 bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200">
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-6">
                Organisations
              </h2>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
                  <a
                    href="https://engagecf.co.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <OptimizedImage
                      src="/E.C.F_Initials_Logo_Colour.jpg"
                      alt="E.C.F. Logo"
                      variant="article"
                      className="max-w-[200px] h-auto"
                    />
                  </a>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <a
                        href="https://engagecf.co.uk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-academic-2xl font-display font-bold text-academic-charcoal hover:text-teal-700 transition-colors"
                      >
                        E.C.F.
                      </a>
                      <span className="px-3 py-1 bg-teal-700 text-white text-xs font-bold rounded-full">
                        Strategic Partner
                      </span>
                    </div>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed mb-3">
                      ECF are a specialist communications and engagement consultancy working on built environment projects across the country. From large transport infrastructure projects to small housing developments, they ensure that proposals for development are communicated with the public through meaningful engagement.
                    </p>
                    <a
                      href="https://engagecf.co.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-teal-700 hover:text-teal-800 font-semibold underline"
                    >
                      Visit E.C.F. website →
                    </a>
                  </div>
                </div>
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
                    About the LGRI →
                  </a>
                  <a
                    href="/about/leadership/rowan-cole"
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
