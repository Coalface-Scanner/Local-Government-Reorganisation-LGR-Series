import { Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, ExternalLink } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import SubscriptionForm from '../../components/SubscriptionForm';
import OptimizedImage from '../../components/OptimizedImage';
import LastUpdated from '../../components/LastUpdated';
import Breadcrumbs from '../../components/Breadcrumbs';

interface RowanColeProps {
  onNavigate: (page: string) => void;
}

export default function RowanCole({ onNavigate: _onNavigate }: RowanColeProps) {
  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Rowan Cole | Editor, LGR Series | Local Government Governance"
        description="Rowan Cole is Editor of the LGR Series and an LGR strategist specialising in public sector strategy, evidence-based governance analysis, and stronger accountability for local authorities."
        keywords="Rowan Cole, LGR Series editor, local government reorganisation, public sector strategy, governance analysis, COALFACE"
        ogTitle="Rowan Cole | Editor, LGR Series"
        ogDescription="Evidence-based governance analysis supporting local authority leaders and officers through risk-managed transitions, service integration, and stronger public accountability."
        ogImage="/rowan-cole-editor-lgr-series.jpg"
      />
      
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: 'About', path: '/about' },
              { label: 'Rowan Cole' }
            ]}
            className="mb-6"
          />
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">EDITOR</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              Rowan{' '}
              <span className="text-teal-700 font-serif italic">
                Cole
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Editor of the LGR Series and LGR strategist specialising in public sector strategy, evidence-based governance analysis, and stronger accountability for local authorities.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Editor Profile */}
            <section className="academic-card p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <OptimizedImage
                    src="/rowan-cole-editor-lgr-series.jpg"
                    alt="Rowan Cole, Editor of the LGR Series and LGR strategist specialising in public sector strategy and governance analysis"
                    variant="article"
                    className="w-64 h-64 rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div className="flex-1 academic-prose">
                  <p className="mb-4">
                    Rowan Cole is Editor of the LGR Series and a specialist LGR strategist focused on public sector strategy and governance, democratic accountability, and the conditions that shape delivery outcomes across England.
                  </p>
                  <p className="mb-4">
                    He provides evidence-based policy and governance analysis for local authority leaders and officers, supporting clearer decision making, stronger governance and accountability, and more resilient institutional performance during periods of structural change.
                  </p>
                  <p className="mb-4">
                    Elected to public office at age 20, significantly below the national average councillor age of 58.8, Rowan developed early experience of political leadership and democratic mandate. He has since successfully transitioned from frontline public office into a career defined by private sector delivery, combining practitioner-led insights with rigorous, neutral, non-partisan analysis.
                  </p>
                  <p className="mb-4">
                    Rowan's work is directed at public sector partners and advisors navigating complex reform environments, with a focus on risk-managed transitions, service integration and citizen experience, and clarity of mission and vision at both organisational and place level.
                  </p>
                  <p className="mb-4">
                    The LGR Series draws on COALFACE's Council Scanner™ methodology, examining planning committee behaviour, officer delegation patterns, decision making consistency, and governance effectiveness across England's planning authorities.
                  </p>
                  <p className="mb-6">
                    Alongside his advisory work, Rowan is recognised as an industry judge for the British Homes and Planning Awards and maintains high-level professional memberships with the Institute of Directors and the Chartered Institute of Public Relations. His approach is collaborative and pragmatic, grounded in clear, jargon-free communication and institutional realism.
                  </p>

                  {/* Social Links */}
                  <div className="mt-8 pt-6 border-t border-academic-neutral-300 space-y-4">
                    {/* ORCID */}
                    <div>
                      <span className="text-academic-neutral-700 font-semibold mb-2 block">Author ID: </span>
                      <a
                        href="https://orcid.org/0009-0008-1064-9037"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center align-top hover:underline text-teal-700"
                      >
                        <img
                          src="https://orcid.org/sites/default/files/images/orcid_16x16.png"
                          style={{ width: '16px', height: '16px', marginRight: '4px' }}
                          alt="ORCID iD icon"
                        />
                        https://orcid.org/0009-0008-1064-9037
                      </a>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <a
                        href="https://www.linkedin.com/in/rowancole/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors"
                      >
                        <Linkedin size={18} />
                        LinkedIn
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    {/* COALFACE */}
                    <div>
                      <a
                        href="https://coalfaceengagement.co.uk/rowan-cole"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-teal-700 hover:text-teal-800 font-semibold hover:underline"
                      >
                        COALFACE Profile
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
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
                    to="/editor/rowan-cole"
                    className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded"
                  >
                    Editor Profile
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

      <LastUpdated />
    </div>
  );
}
