import { Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, ExternalLink } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import OptimizedImage from '../../components/OptimizedImage';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useAboutPage } from '../../hooks/useAboutPage';

interface RowanColeProps {
  onNavigate: (page: string) => void;
}

export default function RowanCole({ onNavigate: _onNavigate }: RowanColeProps) {
  const { page: cmsPage, loading } = useAboutPage('editor');
  
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
              <div className="space-y-6">
                <div className="w-full">
                  <OptimizedImage
                    src="/rowan-cole-editor-lgr-series.jpg"
                    alt="Rowan Cole, Editor of the LGR Series and LGR strategist specialising in public sector strategy and governance analysis"
                    variant="article"
                    className="w-full max-w-2xl mx-auto rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div className="academic-prose max-w-4xl">
                  <p className="mb-4">
                    <span className="font-bold">Rowan Cole</span> is Editor of the LGR Series and a specialist LGR strategist focused on public sector strategy and governance, democratic accountability, and the conditions that shape delivery outcomes across England.
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
                          width="16"
                          height="16"
                          alt="ORCID iD icon"
                          className="mr-1"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
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
                        style={{ color: '#ffffff' }}
                      >
                        <Linkedin size={18} style={{ color: '#ffffff' }} />
                        <span style={{ color: '#ffffff' }}>LinkedIn</span>
                        <ExternalLink size={14} style={{ color: '#ffffff' }} />
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

            {/* Editor's Letter */}
            <section className="academic-card p-8 md:p-10">
              <div className="academic-prose max-w-4xl">
                <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">
                  Editor's Letter
                </h2>
                {loading ? (
                  <div className="text-center py-8 text-academic-neutral-600">Loading...</div>
                ) : cmsPage ? (
                  <div dangerouslySetInnerHTML={{ __html: cmsPage.content }} />
                ) : (
                  <>
                    <p className="text-academic-lg font-semibold text-teal-700 mb-6 leading-relaxed">
                      A golden opportunity for meaningful change, or a governance stress test for public trust and planning?
                    </p>

                    <p className="mb-6 italic">
                      Personal thoughts and reflections as we begin to launch the LGR Series, exploring the intricacies of the most far reaching restructuring of English local government in a generation.
                    </p>

                    <p className="mb-6">
                      <span className="font-semibold">Local Government Reorganisation: Decisions, Power and Place</span> examines a programme that will reshape not only how planning authorities operate, but how the wider local government system functions around them. Driven by the Government's ambition to deliver 1.5 million new homes, reorganisation will influence governance, capacity, accountability and delivery across the whole development cycle.
                    </p>

                    <p className="mb-6">
                      These reforms cut across governance, finance, digital systems, service integration and political leadership. They will affect how place shaping priorities are set, how statutory services interact, and how capacity is deployed across planning, regeneration, infrastructure and democratic oversight. In practice, LGR will help determine how quickly, consistently and transparently councils can make decisions, and how confidently partners can invest behind them.
                    </p>

                    <p className="mb-6">
                      There is substantial potential here. Done well, reorganisation could create clearer lines of accountability, more coherent decision pathways, stronger governance controls, and more resilient operating models. It could also create the conditions for faster, more predictable planning, by improving consistency, reducing duplication, and strengthening the capability available to plan making and decision taking.
                    </p>

                    <p className="mb-6">
                      Our intent in publishing this Series is firmly supportive. We want to help authorities, developers and practitioners understand the issues early, so they can capitalise on the opportunity rather than be hindered by it. We will focus on what is practical, what is measurable, and what can be acted on within real world political and organisational constraints.
                    </p>

                    <p className="mb-6">
                      Recent history shows, however, how easily the opposite can occur. Dorset and Northumberland provide instructive case studies where governance disruption, legacy systems, political instability and uneven organisational capacity contributed to slower decisions, reduced transparency and increased risk across the development ecosystem. Those experiences offer lessons on what happens when reorganisation collides with fragile governance arrangements, or insufficient preparation.
                    </p>

                    <p className="mb-6">
                      To keep the analysis grounded, the Series uses Surrey as a primary test case, examining how reorganisation may reconfigure planning committees, officer delegations, governance controls, digital infrastructure and political accountability. From this, we draw out what planners, developers, officers, councillors and programme leaders need to understand now, before formal transition decisions set the direction of travel.
                    </p>

                    <p className="mb-6">
                      Across the Series we return to a core question. Will LGR create a simpler, faster and more effective environment for planning and delivery, or will new structures, inherited systems and political flux introduce fresh complexity?
                    </p>

                    <p className="mb-8">
                      Our objective is to equip the sector to make the former a reality. Thank you to everyone who has already contributed, and to those who will take part as the Series develops. I hope you find it useful, insightful and pragmatic, and I welcome suggestions for topics, case studies and contributors.
                    </p>
                  </>
                )}

                <div className="mt-8 mb-6">
                  <img
                    src="/signature_-_rowan_cole.png"
                    alt="Rowan Cole Signature"
                    className="h-16 mb-2"
                  />
                  <p className="text-academic-charcoal font-semibold text-lg">Rowan Cole</p>
                  <p className="text-academic-neutral-600">LGR Series</p>
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

    </div>
  );
}
