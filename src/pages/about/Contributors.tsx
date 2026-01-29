import { User } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';

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
            {/* Editor Section */}
            <section className="academic-card p-8">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-academic-neutral-300">
                <div className="w-12 h-12 bg-gradient-teal flex items-center justify-center flex-shrink-0">
                  <User size={24} className="text-white" />
                </div>
                <h2 className="text-academic-sm font-display font-bold tracking-wider text-academic-charcoal">
                  EDITOR
                </h2>
              </div>
              
              <div className="mt-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img
                    src="/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg"
                    alt="Rowan Cole, Engagement Director at Coalface"
                    className="w-48 h-48 rounded-xl object-cover shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-2">Rowan Cole</h3>
                    <p className="text-academic-base text-academic-neutral-600 mb-4 font-serif">Editor, LGR Series</p>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed mb-3 font-serif">
                      Rowan Cole is Engagement Director at COALFACE, where he leads research and analysis on local government governance, planning performance, and democratic accountability. His work focuses on how institutional structures and political conditions shape development outcomes across England.
                    </p>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">
                      The LGR Series draws on COALFACE's Council Scanner™ methodology, which examines planning committee behaviour, officer delegation patterns, decision-making consistency, and governance effectiveness across all English planning authorities.
                    </p>
                  </div>
                </div>
              </div>
            </section>

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
                    href="/about/editor"
                    className="block w-full text-left px-4 py-3 bg-academic-neutral-50 hover:bg-teal-50 border border-academic-neutral-300 hover:border-teal-700 transition-all text-sm font-bold text-academic-neutral-700 hover:text-teal-700"
                  >
                    Editor's Letter →
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
