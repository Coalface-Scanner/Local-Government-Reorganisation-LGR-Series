import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import SubscriptionForm from '../../components/SubscriptionForm';
import OptimizedImage from '../../components/OptimizedImage';
import LastUpdated from '../../components/LastUpdated';
import { useAboutPage } from '../../hooks/useAboutPage';

interface EditorProps {
  onNavigate: (page: string) => void;
}

export default function Editor({ onNavigate }: EditorProps) {
  const { page: cmsPage, loading } = useAboutPage('editor');
  return (
    <div className="bg-academic-cream min-h-screen">
      <MetaTags
        title="Editor's Letter - LGR Series Editorial Team"
        description="Read the editor's letter introducing the LGR Series and learn about the editorial team behind this research programme."
        keywords="LGR series editor, Rowan Cole, editorial letter, COALFACE, local government reorganisation"
      />
      
      <div className="relative bg-academic-warm py-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">ABOUT</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              Editor's{' '}
              <span className="text-teal-700 font-serif italic">
                Letter
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Personal thoughts and reflections on local government reorganisation and the mission of the LGR Series.
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
              <span className="text-academic-neutral-900">Editor</span>
            </nav>

            {/* Editor's Letter */}
            <section className="academic-card p-8 md:p-10">
              <div className="academic-prose">
                {loading ? (
                  <div className="text-center py-8 text-academic-neutral-600">Loading...</div>
                ) : cmsPage ? (
                  <div dangerouslySetInnerHTML={{ __html: cmsPage.content }} />
                ) : (
                  <>
                    <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-4">
                      Editor's Letter
                    </h2>
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

            {/* About the Editor */}
            <section className="academic-card p-8 md:p-10">
              <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                About the Editor
              </h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <OptimizedImage
                    src="/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg"
                    alt="Rowan Cole, Engagement Director at Coalface"
                    variant="article"
                    className="w-48 h-48 rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div className="flex-1 academic-prose">
                  <p className="mb-4">
                    Rowan Cole is Engagement Director at COALFACE, where he leads research and analysis on local government governance, planning performance, and democratic accountability. His work focuses on how institutional structures and political conditions shape development outcomes across England.
                  </p>
                  <p className="mb-4">
                    The LGR Series draws on COALFACE's Council Scanner™ methodology, which examines planning committee behaviour, officer delegation patterns, decision-making consistency, and governance effectiveness across all English planning authorities.
                  </p>
                  <p className="mt-4">
                    <span className="text-academic-neutral-700">Author ID: </span>
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
                  </p>
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
                    className="block px-3 py-2 text-academic-sm text-teal-700 bg-teal-50 font-semibold rounded"
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
