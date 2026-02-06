import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';
import OptimizedImage from '../../components/OptimizedImage';

interface ContributorsProps {
  onNavigate: (page: string) => void;
}

export default function Contributors({ onNavigate: _onNavigate }: ContributorsProps) {
  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Contributors - LGR Series Authors & Contributors"
        description="Meet the contributors and authors behind the LGR Series research programme examining local government reorganisation."
        keywords="LGR series contributors, LGR authors, local government reorganisation researchers, COALFACE team"
      />
      
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        {/* Colored gradient overlay */}
        <div 
          className="absolute inset-0 opacity-60 z-0"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(6, 182, 212, 0.5) 50%, rgba(14, 165, 233, 0.4) 100%)'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">ABOUT</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              Contributors{' '}
              <span className="text-teal-700 font-serif italic">
                & Authors
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Meet the contributors and authors behind the LGR Series research programme.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Contributors Section */}
            <section className="academic-card p-8">
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-6">
                Contributors
              </h2>
              <div className="academic-prose space-y-4">
                <p>
                  The LGR Series benefits from contributions from practitioners, academics, and elected representatives with direct experience of local government reorganisation.
                </p>
                <p>
                  If you would like to contribute to the LGR Series, please visit our{' '}
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
                  COALFACE is an independent consultancy and insight practice specialising in local government, planning, governance and political decision making. Its contribution to the LGR Series draws on experience as an elected councillor, in advisory and officer roles within local authorities, and in supporting planning and regeneration programmes. COALFACE provides applied analysis focused on governance design, democratic legitimacy and delivery conditions in reorganised councils, with an emphasis on how decisions are made in practice rather than on formal structures alone.
                </p>
              </div>
            </section>

            {/* Insights Section */}
            <section className="academic-card p-8">
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-6">
                Insights
              </h2>
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
                    About the LGR Series →
                  </a>
                  <a
                    href="/editor/rowan-cole"
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

      <LastUpdated />
    </div>
  );
}
