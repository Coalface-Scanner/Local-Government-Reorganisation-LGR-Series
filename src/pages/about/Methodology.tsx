import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import { useAboutPage } from '../../hooks/useAboutPage';

interface MethodologyProps {
  onNavigate: (page: string) => void;
}

export default function Methodology({ onNavigate: _onNavigate }: MethodologyProps) {
  const { page: cmsPage, loading } = useAboutPage('methodology');
  const location = useLocation();
  
  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Research Methodology - LGR Series"
        description="Learn about the LGR Series research methodology, data sources, analytical framework, and quality standards."
        keywords="LGR methodology, research methodology, Council Scanner, data sources, analytical framework"
      />
      
      <PageBanner
        heroLabel="ABOUT"
        heroTitle="Research Methodology"
        heroSubtitle="Our systematic approach to analysing planning authority governance, decision-making patterns, and institutional behaviour."
        currentPath={location.pathname}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-academic-sm text-academic-neutral-600">
              <Link to="/about" className="hover:text-teal-700 transition-colors">About</Link>
              <span>/</span>
              <span className="text-academic-neutral-900">Methodology</span>
            </nav>

            {/* Research Approach */}
            <section className="academic-card p-8 md:p-10">
              <div className="academic-prose">
                {loading ? (
                  <div className="text-center py-8 text-academic-neutral-600">Loading...</div>
                ) : cmsPage ? (
                  <div dangerouslySetInnerHTML={{ __html: cmsPage.content }} />
                ) : (
                  <>
                    <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">
                      Research Approach
                    </h2>
                    <p className="mb-6">
                      The LGR Series is built on COALFACE's Council Scanner™ methodology, which provides systematic analysis of planning authority governance, decision-making patterns, and institutional behaviour across England.
                    </p>

                    <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">
                      Core Data Sources
                    </h3>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                      <li>Planning committee meeting records and voting patterns</li>
                      <li>Officer delegation schemes and decision-making authority</li>
                      <li>Council constitutional documents and governance frameworks</li>
                      <li>Strategic planning policies and local plan timelines</li>
                      <li>Political composition and electoral cycle analysis</li>
                      <li>Performance data on application processing and outcomes</li>
                    </ul>

                    <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">
                      Analytical Framework
                    </h3>
                    <p className="mb-4">
                      Our analysis examines how governance structures, political conditions, and institutional capacity interact to shape planning outcomes. We focus on:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                      <li>Decision-making consistency and transparency</li>
                      <li>Governance stability and political risk factors</li>
                      <li>Officer capacity and delegation patterns</li>
                      <li>Committee behaviour and member engagement</li>
                      <li>Digital infrastructure and system integration</li>
                    </ul>

                    <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 mt-6">
                      Quality Standards
                    </h3>
                    <p className="mb-6">
                      All analysis is grounded in publicly available data, cross-referenced across multiple sources, and validated against official records. We prioritise empirical evidence over anecdote, and clearly distinguish between observation, analysis, and interpretation.
                    </p>

                    <div className="bg-teal-50 border-l-4 border-teal-700 p-6 mt-8">
                      <h4 className="font-display font-bold text-academic-charcoal mb-2">
                        Transparency and Reproducibility
                      </h4>
                      <p className="text-academic-neutral-700">
                        We are committed to transparency in our research methods. All data sources are cited, and our analytical frameworks are clearly explained to enable others to understand and build upon our work.
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
                  LGR Series Newsletter
                </h3>
                <p className="text-academic-sm text-academic-neutral-700 mb-4 font-serif">
                  Get the LGR Series directly in your inbox. No fluff, just deep analysis.
                </p>
                <Link
                  to="/subscribe"
                  className="inline-block bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider transition-colors"
                >
                  Subscribe
                </Link>
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
                    to="/editor/rowan-cole"
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    Editor Profile
                  </Link>
                  <Link
                    to="/about/methodology"
                    className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded"
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
                    className="block px-3 py-2 text-academic-sm text-academic-neutral-700 hover:bg-teal-50 hover:text-teal-700 transition-colors rounded"
                  >
                    About COALFACE
                  </Link>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}
