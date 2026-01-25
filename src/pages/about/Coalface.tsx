import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import SubscriptionForm from '../../components/SubscriptionForm';
import LastUpdated from '../../components/LastUpdated';
import { useAboutPage } from '../../hooks/useAboutPage';

interface CoalfaceProps {
  onNavigate: (page: string) => void;
}

export default function Coalface({ onNavigate: _onNavigate }: CoalfaceProps) {
  const { page: cmsPage, loading } = useAboutPage('coalface');
  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="About COALFACE - LGR Series"
        description="Learn about COALFACE, the research and engagement practice behind the LGR Series, specializing in planning governance and institutional analysis."
        keywords="COALFACE, planning governance, research practice, Council Scanner, COALFACE Insights"
      />
      
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">ABOUT</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              About{' '}
              <span className="text-teal-700 font-serif italic">
                COALFACE
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              The research and engagement practice behind the LGR Series.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-academic-sm text-academic-neutral-600">
              <Link to="/about" className="hover:text-teal-700 transition-colors">About</Link>
              <span>/</span>
              <span className="text-academic-neutral-900">COALFACE</span>
            </nav>

            {/* About COALFACE */}
            <section className="academic-card p-8 md:p-10">
              <div className="academic-prose">
                {loading ? (
                  <div className="text-center py-8 text-academic-neutral-600">Loading...</div>
                ) : cmsPage ? (
                  <div dangerouslySetInnerHTML={{ __html: cmsPage.content }} />
                ) : (
                  <>
                    <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">
                      About COALFACE
                    </h2>
                    <p className="mb-6">
                      The LGR Series is produced by COALFACE, a research and engagement practice specialising in planning governance, political behaviour, and institutional analysis. COALFACE works with developers, local authorities, and sector bodies to strengthen understanding of how governance conditions shape development outcomes.
                    </p>

                    <p className="mb-6">
                      Coalface Engagement Ltd provides consultancy services under the COALFACE brand, including Council Scanner™, COALFACE Insights, and COALFACE Engagement.
                    </p>

                    <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">
                      Our Services
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                      <li><strong>Council Scanner™:</strong> Systematic analysis of planning authority governance, decision-making patterns, and institutional behaviour</li>
                      <li><strong>COALFACE Insights:</strong> Research-driven analysis on local government, planning, and place-making</li>
                      <li><strong>COALFACE Engagement:</strong> Planning consultation and engagement shaped by political behaviour and governance conditions</li>
                    </ul>

                    <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">
                      Our Approach
                    </h3>
                    <p className="mb-4">
                      COALFACE combines data from the COALFACE Council Scanner™ with evidence from real reorganisations to support better decision-making. Our work focuses on:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                      <li>Understanding how governance structures affect planning outcomes</li>
                      <li>Analyzing political behaviour and its impact on decision-making</li>
                      <li>Examining institutional capacity and organizational effectiveness</li>
                      <li>Supporting evidence-based approaches to local government reform</li>
                    </ul>

                    <div className="bg-teal-50 border-l-4 border-teal-700 p-6 mt-8">
                      <h4 className="font-display font-bold text-academic-charcoal mb-2">
                        Learn More
                      </h4>
                      <p className="text-academic-neutral-700 mb-4">
                        For more information about COALFACE's services and research, visit:
                      </p>
                      <p className="text-academic-base font-display font-semibold">
                        <a href="https://www.coalfaceengagement.co.uk" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:text-teal-800 transition-colors">
                          www.coalfaceengagement.co.uk
                        </a>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-academic-neutral-300">
              <Link
                to="/about"
                className="flex items-center gap-2 text-academic-sm font-display font-semibold text-teal-700 hover:text-teal-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to About
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white p-6 border border-academic-neutral-300 rounded-sm shadow-sm">
                <h3 className="text-academic-xl font-display font-black text-academic-charcoal mb-3">
                  The Dispatch
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <SubscriptionForm variant="compact" />
              </div>

              <div className="academic-card p-6">
                <h4 className="font-display font-bold text-academic-charcoal mb-4 text-sm tracking-wider border-b-2 border-academic-neutral-300 pb-3">
                  ABOUT SECTIONS
                </h4>
                <nav className="space-y-2">
                  <Link
                    to="/about"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Overview
                  </Link>
                  <Link
                    to="/about/editor"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Editor's Letter
                  </Link>
                  <Link
                    to="/about/methodology"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Methodology
                  </Link>
                  <Link
                    to="/about/contribute"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Contribute
                  </Link>
                  <Link
                    to="/about/coalface"
                    className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded"
                  >
                    About COALFACE
                  </Link>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <LastUpdated />
    </div>
  );
}
