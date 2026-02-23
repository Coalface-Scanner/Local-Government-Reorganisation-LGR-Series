import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, User, FileText, MessageSquare, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageNavigation from '../components/PageNavigation';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';

interface ReasonsProps {
  onNavigate: (page: string) => void;
}

export default function Reasons({ onNavigate }: ReasonsProps) {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>('editor');

  const navItems = [
    { id: 'editor', label: "Editor's Letter", icon: <User size={16} /> },
    { id: 'methodology', label: 'Methodology', icon: <FileText size={16} /> },
    { id: 'contribute', label: 'Contribute', icon: <MessageSquare size={16} /> },
    { id: 'about', label: 'About COALFACE', icon: <Info size={16} /> },
  ];

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="About the LGR Initiative - Methodology & Purpose"
        description="Learn about the LGR Initiative methodology, editorial approach, and purpose. Discover how we examine local government reorganisation through evidence-based analysis."
        keywords="LGR series, local government reorganisation methodology, council reform research, editorial approach, COALFACE insights"
      />
      <PageBanner
        heroLabel="ABOUT"
        heroTitle="About the LGR Initiative"
        heroSubtitle="Editorial approach, methodology, and how to contribute"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div id="editor">
                    <button
                      onClick={() => toggleSection('editor')}
                      className="w-full bg-white rounded-xl p-6 shadow-md border border-academic-neutral-200 hover:border-teal-400 transition-all text-left academic-card"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-academic-charcoal font-display">Editor | Rowan Cole</h2>
                        <ChevronDown
                          className={`w-6 h-6 text-academic-neutral-600 transition-transform ${
                            openSection === 'editor' ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>
                    {openSection === 'editor' && (
                      <div className="bg-white rounded-xl p-8 shadow-lg border border-academic-neutral-200 space-y-6 academic-card">
                        <div>
                          <h3 className="text-xl font-bold text-academic-charcoal mb-3 font-display">Editor's Letter</h3>
                          <h4 className="text-lg font-semibold text-teal-700 mb-4 leading-relaxed font-serif">
                            A golden opportunity for meaningful change, or a governance stress test for public trust and planning?
                          </h4>

                          <div className="prose max-w-none">
                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">About This Series</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                      Personal thoughts and reflections as we begin to launch the LGR Series, exploring the intricacies of the most far reaching restructuring of English local government in a generation.
                    </p>

                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">What is the LGR Initiative?</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              <span className="font-semibold">Local Government Reorganisation: Decisions, Power and Place</span> examines a programme that will reshape not only how planning authorities operate, but how the wider local government system functions around them. Driven by the Government's ambition to deliver 1.5 million new homes, reorganisation will influence governance, capacity, accountability and delivery across the whole development cycle.
                            </p>

                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">What Areas Does LGR Affect?</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              These reforms cut across multiple critical areas:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-academic-neutral-700 mb-4 font-serif">
                              <li><strong>Governance:</strong> How place shaping priorities are set and decisions are made</li>
                              <li><strong>Finance:</strong> Budget allocation and resource management across merged authorities</li>
                              <li><strong>Digital systems:</strong> IT infrastructure and data integration challenges</li>
                              <li><strong>Service integration:</strong> How statutory services interact and capacity is deployed</li>
                              <li><strong>Political leadership:</strong> Democratic oversight and accountability structures</li>
                            </ul>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              In practice, LGR will help determine how quickly, consistently and transparently councils can make decisions, and how confidently partners can invest behind them.
                            </p>

                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">What Are the Potential Benefits?</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              There is substantial potential here. Done well, reorganisation could create:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-academic-neutral-700 mb-4 font-serif">
                              <li>Clearer lines of accountability</li>
                              <li>More coherent decision pathways</li>
                              <li>Stronger governance controls</li>
                              <li>More resilient operating models</li>
                              <li>Faster, more predictable planning through improved consistency and reduced duplication</li>
                            </ul>

                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">Our Approach</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              Our intent in publishing this Series is firmly supportive. We want to help authorities, developers and practitioners understand the issues early, so they can capitalise on the opportunity rather than be hindered by it. We will focus on what is practical, what is measurable, and what can be acted on within real world political and organisational constraints.
                            </p>

                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">Lessons from Experience</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              Recent history shows, however, how easily the opposite can occur. Dorset and Northumberland provide instructive case studies where governance disruption, legacy systems, political instability and uneven organisational capacity contributed to slower decisions, reduced transparency and increased risk across the development ecosystem. Those experiences offer lessons on what happens when reorganisation collides with fragile governance arrangements, or insufficient preparation.
                            </p>

                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">Surrey as a Test Case</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              To keep the analysis grounded, the Series uses Surrey as a primary test case, examining how reorganisation may reconfigure planning committees, officer delegations, governance controls, digital infrastructure and political accountability. From this, we draw out what planners, developers, officers, councillors and programme leaders need to understand now, before formal transition decisions set the direction of travel.
                            </p>

                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">The Core Question</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              Across the Series we return to a core question. Will LGR create a simpler, faster and more effective environment for planning and delivery, or will new structures, inherited systems and political flux introduce fresh complexity?
                            </p>

                            <h4 className="text-academic-lg font-display font-semibold text-academic-charcoal mb-3">Our Objective</h4>
                            <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                              Our objective is to equip the sector to make the former a reality. Thank you to everyone who has already contributed, and to those who will take part as the Series develops. I hope you find it useful, insightful and pragmatic, and I welcome suggestions for topics, case studies and contributors.
                            </p>

                    <div className="mt-8 mb-6">
                      <img
                        src="/signature_-_rowan_cole.png"
                        alt="Rowan Cole Signature"
                        className="h-16 mb-2"
                      />
                      <p className="text-slate-900 font-semibold text-lg">Rowan Cole</p>
                      <p className="text-slate-600">LGR Initiative</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <img
                          src="/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg"
                          alt="Rowan Cole, Engagement Director at Coalface"
                          className="w-48 h-48 rounded-xl object-cover shadow-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-academic-charcoal mb-2 font-display">About the Editor</h3>
                          <p className="text-academic-neutral-700 leading-relaxed mb-3 font-serif">
                            Rowan Cole is Engagement Director at COALFACE, where he leads research and analysis on local government governance, planning performance, and democratic accountability. His work focuses on how institutional structures and political conditions shape development outcomes across England.
                          </p>
                          <p className="text-academic-neutral-700 leading-relaxed font-serif">
                            The LGR Initiative draws on COALFACE's Council Scanner™ methodology, which examines planning committee behaviour, officer delegation patterns, decision-making consistency, and governance effectiveness across all English planning authorities.
                          </p>
                          <p className="mt-4">
                            <span className="text-academic-neutral-700 font-serif">Author ID: </span>
                            <a
                              href="https://orcid.org/0009-0008-1064-9037"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center align-top hover:underline text-teal-700 font-serif"
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
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>

            <div id="methodology">
              <button
                onClick={() => toggleSection('methodology')}
                className="w-full bg-white rounded-xl p-6 shadow-md border border-academic-neutral-200 hover:border-teal-400 transition-all text-left academic-card"
              >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-academic-charcoal font-display">Methodology</h2>
                <ChevronDown
                  className={`w-6 h-6 text-academic-neutral-600 transition-transform ${
                    openSection === 'methodology' ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {openSection === 'methodology' && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-academic-neutral-200 space-y-5 academic-card">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-academic-charcoal mb-3 font-display">Research Approach</h3>
                  <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                    The LGR Initiative is built on COALFACE's Council Scanner™ methodology, which provides systematic analysis of planning authority governance, decision-making patterns, and institutional behaviour across England.
                  </p>

                  <h4 className="text-lg font-semibold text-academic-charcoal mb-3 font-display">What Data Do We Use?</h4>
                  <p className="text-academic-neutral-700 leading-relaxed mb-3 font-serif">
                    Our analysis draws on comprehensive data sources:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-academic-neutral-700 mb-6 font-serif">
                    <li><strong>Planning committee records:</strong> Meeting records and voting patterns</li>
                    <li><strong>Delegation schemes:</strong> Officer decision-making authority and frameworks</li>
                    <li><strong>Constitutional documents:</strong> Council governance frameworks and structures</li>
                    <li><strong>Planning policies:</strong> Strategic planning policies and local plan timelines</li>
                    <li><strong>Political analysis:</strong> Political composition and electoral cycle data</li>
                    <li><strong>Performance metrics:</strong> Application processing times and decision outcomes</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-academic-charcoal mb-3 font-display">How Do We Analyse This Data?</h4>
                  <p className="text-academic-neutral-700 leading-relaxed mb-3 font-serif">
                    Our analysis examines how governance structures, political conditions, and institutional capacity interact to shape planning outcomes. We focus on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-academic-neutral-700 mb-6 font-serif">
                    <li><strong>Decision-making:</strong> Consistency and transparency in planning decisions</li>
                    <li><strong>Governance stability:</strong> Political risk factors and stability indicators</li>
                    <li><strong>Officer capacity:</strong> Delegation patterns and resource allocation</li>
                    <li><strong>Committee behaviour:</strong> Member engagement and decision-making dynamics</li>
                    <li><strong>Digital infrastructure:</strong> System integration and IT capability</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-academic-charcoal mb-3 font-display">Quality Standards</h4>
                  <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                    All analysis is grounded in publicly available data, cross-referenced across multiple sources, and validated against official records. We prioritise empirical evidence over anecdote, and clearly distinguish between observation, analysis, and interpretation.
                  </p>
                </div>
              </div>
            )}
            </div>

            <div id="contribute">
              <button
                onClick={() => toggleSection('contribute')}
                className="w-full bg-white rounded-xl p-6 shadow-md border border-academic-neutral-200 hover:border-teal-400 transition-all text-left academic-card"
              >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-academic-charcoal font-display">Want to contribute?</h2>
                <ChevronDown
                  className={`w-6 h-6 text-academic-neutral-600 transition-transform ${
                    openSection === 'contribute' ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {openSection === 'contribute' && (
              <div className="bg-white rounded-xl p-8 shadow-lg border border-academic-neutral-200 space-y-6 academic-card">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-academic-charcoal mb-4 font-display">Get Involved</h3>
                  <p className="text-academic-neutral-700 leading-relaxed mb-6 font-serif">
                    The LGR Initiative welcomes contributions from practitioners, local authority officers, elected members, developers, and other stakeholders involved in local government reorganisation and planning.
                  </p>

                  <h4 className="text-lg font-semibold text-academic-charcoal mb-3 font-display">Ways to Contribute</h4>
                  <div className="space-y-4 mb-6">
                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                      <h5 className="font-semibold text-academic-charcoal mb-2 font-display">Share Your Experience</h5>
                      <p className="text-sm text-academic-neutral-700 font-serif">
                        If you've been involved in reorganisation processes, we'd like to hear about practical challenges, governance issues, or lessons learned that could inform the wider sector.
                      </p>
                    </div>

                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                      <h5 className="font-semibold text-academic-charcoal mb-2 font-display">Suggest Topics</h5>
                      <p className="text-sm text-academic-neutral-700 font-serif">
                        Recommend areas of analysis, case studies, or specific questions that would benefit from deeper investigation within the Series.
                      </p>
                    </div>

                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                      <h5 className="font-semibold text-academic-charcoal mb-2 font-display">Provide Data</h5>
                      <p className="text-sm text-academic-neutral-700 font-serif">
                        Help expand our evidence base by sharing governance documents, performance data, or other publicly available material from authorities undergoing reorganisation.
                      </p>
                    </div>

                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                      <h5 className="font-semibold text-academic-charcoal mb-2 font-display">Expert Commentary</h5>
                      <p className="text-sm text-academic-neutral-700 font-serif">
                        Contribute analysis, opinion pieces, or technical commentary on specific aspects of LGR and its impact on planning and governance.
                      </p>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-academic-charcoal mb-3 font-display">Contact</h4>
                  <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                    To discuss contributions or suggest topics, please contact:
                  </p>
                  <p className="text-academic-charcoal font-medium font-display">
                    <a href="mailto:office@lgr-initiative.co.uk" className="text-teal-700 hover:text-teal-800">
                      office@lgr-initiative.co.uk
                    </a>
                  </p>
                </div>
              </div>
            )}
            </div>

            <div id="about">
              <button
                onClick={() => toggleSection('about')}
                className="w-full bg-white rounded-xl p-6 shadow-md border border-academic-neutral-200 hover:border-teal-400 transition-all text-left academic-card"
              >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-academic-charcoal font-display">About the LGR Initiative</h2>
                <ChevronDown
                  className={`w-6 h-6 text-academic-neutral-600 transition-transform ${
                    openSection === 'about' ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {openSection === 'about' && (
              <div className="bg-white rounded-xl p-8 shadow-lg border border-academic-neutral-200 space-y-6 academic-card">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-academic-charcoal mb-4 font-display">About This Research Programme</h3>
                  <p className="text-academic-neutral-700 leading-relaxed mb-6 font-serif">
                    The LGR Initiative is a dedicated research and analysis programme examining the 2024-2025 wave of English local government reorganisation, with particular focus on its implications for planning, governance, and development delivery.
                  </p>

                  <h4 className="text-lg font-semibold text-academic-charcoal mb-3 font-display">What Are Our Objectives?</h4>
                  <p className="text-academic-neutral-700 leading-relaxed mb-3 font-serif">
                    The LGR Initiative aims to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-academic-neutral-700 mb-6 font-serif">
                    <li>Document the reorganisation process and its impact on planning authority functions</li>
                    <li>Analyse governance risks and opportunities created by structural change</li>
                    <li>Provide practical insights for authorities, developers, and practitioners</li>
                    <li>Build evidence on what works and what doesn't in reorganisation transitions</li>
                    <li>Strengthen sector understanding of institutional and political factors affecting delivery</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-academic-charcoal mb-3 font-display">What Content Do We Publish?</h4>
                  <p className="text-academic-neutral-700 leading-relaxed mb-3 font-serif">
                    The Series is published on an ongoing basis as reorganisation progresses. Content includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-academic-neutral-700 mb-6 font-serif">
                    <li><strong>Data and Facts:</strong> Evidence-based analysis of governance structures, decision-making patterns, and performance metrics</li>
                    <li><strong>Lessons:</strong> Case studies from previous reorganisations examining what succeeded and what failed</li>
                    <li><strong>Interviews:</strong> Practitioner perspectives from officers, members, and developers with direct experience</li>
                    <li><strong>Case Studies:</strong> Deep analysis of specific authorities, including Surrey as a primary test case</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-academic-charcoal mb-3 font-display">About COALFACE</h4>
                  <p className="text-academic-neutral-700 leading-relaxed mb-4 font-serif">
                    The LGR Initiative is produced by COALFACE, a research and engagement practice specialising in planning governance, political behaviour, and institutional analysis. COALFACE works with developers, local authorities, and sector bodies to strengthen understanding of how governance conditions shape development outcomes.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Coalface Engagement Ltd provides consultancy services under the COALFACE brand, including Council Scanner™, COALFACE Insights, and COALFACE Engagement.
                  </p>
                </div>
              </div>
            )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <PageNavigation items={navItems} />
              <div className="lgr-insights-cta">
                <h3 className="lgr-insights-cta__title">LGR Insights & Updates</h3>
                <p className="lgr-insights-cta__body">
                  Receive our regular update direct to your inbox. Subscribe here.
                </p>
                <Link to="/subscribe" className="lgr-insights-cta__btn">
                  Subscribe
                </Link>
              </div>

              <div className="border-2 border-neutral-900 bg-white p-6">
                <h4 className="font-black text-neutral-900 mb-4 text-sm tracking-wider border-b-2 border-neutral-200 pb-3">
                  RELATED CONTENT
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    View the Lessons →
                  </button>
                  <button
                    onClick={() => onNavigate('facts')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    View the Facts & Data →
                  </button>
                  <button
                    onClick={() => onNavigate('surrey')}
                    className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-teal-50 border border-neutral-200 hover:border-teal-700 transition-all text-sm font-bold text-neutral-700 hover:text-teal-700"
                  >
                    Surrey Analysis →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="reasons" />

    </div>
  );
}
