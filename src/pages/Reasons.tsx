import { useState } from 'react';
import { ChevronDown, User, FileText, MessageSquare, Info } from 'lucide-react';
import SubscriptionForm from '../components/SubscriptionForm';
import PageNavigation from '../components/PageNavigation';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';

interface ReasonsProps {
  onNavigate: (page: string) => void;
}

export default function Reasons({ onNavigate }: ReasonsProps) {
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
    <div className="min-h-screen bg-neutral-50">
      <div className="relative bg-gradient-to-b from-teal-50 to-white border-b-4 border-neutral-900 py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url('/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-6">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-3">
              ABOUT
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-6">
            About the{' '}
            <span className="text-teal-700 font-serif italic">
              LGR Series
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Editorial approach, methodology, and how to contribute
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div id="editor">
              <button
                onClick={() => toggleSection('editor')}
                className="w-full bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:border-cyan-400 transition-all text-left"
              >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Editor | Rowan Cole</h2>
                <ChevronDown
                  className={`w-6 h-6 text-slate-600 transition-transform ${
                    openSection === 'editor' ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {openSection === 'editor' && (
              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Editor's Letter</h3>
                  <p className="text-lg font-semibold text-cyan-700 mb-6 leading-relaxed">
                    A golden opportunity for meaningful change, or a governance stress test for public trust and planning?
                  </p>

                  <div className="prose max-w-none">
                    <p className="text-slate-700 leading-relaxed mb-6 italic">
                      Personal thoughts and reflections as we begin to launch the LGR Series, exploring the intricacies of the most far reaching restructuring of English local government in a generation.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      <span className="font-semibold">Local Government Reorganisation: Decisions, Power and Place</span> examines a programme that will reshape not only how planning authorities operate, but how the wider local government system functions around them. Driven by the Government's ambition to deliver 1.5 million new homes, reorganisation will influence governance, capacity, accountability and delivery across the whole development cycle.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      These reforms cut across governance, finance, digital systems, service integration and political leadership. They will affect how place shaping priorities are set, how statutory services interact, and how capacity is deployed across planning, regeneration, infrastructure and democratic oversight. In practice, LGR will help determine how quickly, consistently and transparently councils can make decisions, and how confidently partners can invest behind them.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      There is substantial potential here. Done well, reorganisation could create clearer lines of accountability, more coherent decision pathways, stronger governance controls, and more resilient operating models. It could also create the conditions for faster, more predictable planning, by improving consistency, reducing duplication, and strengthening the capability available to plan making and decision taking.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      Our intent in publishing this Series is firmly supportive. We want to help authorities, developers and practitioners understand the issues early, so they can capitalise on the opportunity rather than be hindered by it. We will focus on what is practical, what is measurable, and what can be acted on within real world political and organisational constraints.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      Recent history shows, however, how easily the opposite can occur. Dorset and Northumberland provide instructive case studies where governance disruption, legacy systems, political instability and uneven organisational capacity contributed to slower decisions, reduced transparency and increased risk across the development ecosystem. Those experiences offer lessons on what happens when reorganisation collides with fragile governance arrangements, or insufficient preparation.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      To keep the analysis grounded, the Series uses Surrey as a primary test case, examining how reorganisation may reconfigure planning committees, officer delegations, governance controls, digital infrastructure and political accountability. From this, we draw out what planners, developers, officers, councillors and programme leaders need to understand now, before formal transition decisions set the direction of travel.
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      Across the Series we return to a core question. Will LGR create a simpler, faster and more effective environment for planning and delivery, or will new structures, inherited systems and political flux introduce fresh complexity?
                    </p>

                    <p className="text-slate-700 leading-relaxed mb-6">
                      Our objective is to equip the sector to make the former a reality. Thank you to everyone who has already contributed, and to those who will take part as the Series develops. I hope you find it useful, insightful and pragmatic, and I welcome suggestions for topics, case studies and contributors.
                    </p>

                    <div className="mt-12 mb-8">
                      <img
                        src="/signature_-_rowan_cole.png"
                        alt="Rowan Cole Signature"
                        className="h-16 mb-2"
                      />
                      <p className="text-slate-900 font-semibold text-lg">Rowan Cole</p>
                      <p className="text-slate-600">LGR Series</p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <img
                          src="/rowan-cole-coalface-engagement-director-headshot-folded-arms.jpg"
                          alt="Rowan Cole, Engagement Director at Coalface"
                          className="w-48 h-48 rounded-xl object-cover shadow-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-3">About the Editor</h3>
                          <p className="text-slate-700 leading-relaxed mb-4">
                            Rowan Cole is Engagement Director at COALFACE, where he leads research and analysis on local government governance, planning performance, and democratic accountability. His work focuses on how institutional structures and political conditions shape development outcomes across England.
                          </p>
                          <p className="text-slate-700 leading-relaxed">
                            The LGR Series draws on COALFACE's Council Scanner™ methodology, which examines planning committee behaviour, officer delegation patterns, decision-making consistency, and governance effectiveness across all English planning authorities.
                          </p>
                          <p className="mt-4">
                            <span className="text-slate-700">Author ID: </span>
                            <a
                              href="https://orcid.org/0009-0008-1064-9037"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center align-top hover:underline"
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
                className="w-full bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:border-cyan-400 transition-all text-left"
              >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Methodology</h2>
                <ChevronDown
                  className={`w-6 h-6 text-slate-600 transition-transform ${
                    openSection === 'methodology' ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {openSection === 'methodology' && (
              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Research Approach</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    The LGR Series is built on COALFACE's Council Scanner™ methodology, which provides systematic analysis of planning authority governance, decision-making patterns, and institutional behaviour across England.
                  </p>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Core Data Sources</h4>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                    <li>Planning committee meeting records and voting patterns</li>
                    <li>Officer delegation schemes and decision-making authority</li>
                    <li>Council constitutional documents and governance frameworks</li>
                    <li>Strategic planning policies and local plan timelines</li>
                    <li>Political composition and electoral cycle analysis</li>
                    <li>Performance data on application processing and outcomes</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Analytical Framework</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Our analysis examines how governance structures, political conditions, and institutional capacity interact to shape planning outcomes. We focus on:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                    <li>Decision-making consistency and transparency</li>
                    <li>Governance stability and political risk factors</li>
                    <li>Officer capacity and delegation patterns</li>
                    <li>Committee behaviour and member engagement</li>
                    <li>Digital infrastructure and system integration</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Quality Standards</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    All analysis is grounded in publicly available data, cross-referenced across multiple sources, and validated against official records. We prioritize empirical evidence over anecdote, and clearly distinguish between observation, analysis, and interpretation.
                  </p>
                </div>
              </div>
            )}
            </div>

            <div id="contribute">
              <button
                onClick={() => toggleSection('contribute')}
                className="w-full bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:border-cyan-400 transition-all text-left"
              >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Want to contribute?</h2>
                <ChevronDown
                  className={`w-6 h-6 text-slate-600 transition-transform ${
                    openSection === 'contribute' ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {openSection === 'contribute' && (
              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Get Involved</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    The LGR Series welcomes contributions from practitioners, local authority officers, elected members, developers, and other stakeholders involved in local government reorganisation and planning.
                  </p>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Ways to Contribute</h4>
                  <div className="space-y-4 mb-6">
                    <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                      <h5 className="font-semibold text-slate-900 mb-2">Share Your Experience</h5>
                      <p className="text-sm text-slate-700">
                        If you've been involved in reorganisation processes, we'd like to hear about practical challenges, governance issues, or lessons learned that could inform the wider sector.
                      </p>
                    </div>

                    <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                      <h5 className="font-semibold text-slate-900 mb-2">Suggest Topics</h5>
                      <p className="text-sm text-slate-700">
                        Recommend areas of analysis, case studies, or specific questions that would benefit from deeper investigation within the Series.
                      </p>
                    </div>

                    <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                      <h5 className="font-semibold text-slate-900 mb-2">Provide Data</h5>
                      <p className="text-sm text-slate-700">
                        Help expand our evidence base by sharing governance documents, performance data, or other publicly available material from authorities undergoing reorganisation.
                      </p>
                    </div>

                    <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                      <h5 className="font-semibold text-slate-900 mb-2">Expert Commentary</h5>
                      <p className="text-sm text-slate-700">
                        Contribute analysis, opinion pieces, or technical commentary on specific aspects of LGR and its impact on planning and governance.
                      </p>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Contact</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    To discuss contributions or suggest topics, please contact:
                  </p>
                  <p className="text-slate-900 font-medium">
                    <a href="mailto:info@coalfaceengagement.co.uk" className="text-cyan-600 hover:text-cyan-700">
                      info@coalfaceengagement.co.uk
                    </a>
                  </p>
                </div>
              </div>
            )}
            </div>

            <div id="about">
              <button
                onClick={() => toggleSection('about')}
                className="w-full bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:border-cyan-400 transition-all text-left"
              >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">About the LGR Series</h2>
                <ChevronDown
                  className={`w-6 h-6 text-slate-600 transition-transform ${
                    openSection === 'about' ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            {openSection === 'about' && (
              <div className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">About This Research Programme</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    The LGR Series is a dedicated research and analysis programme examining the 2024-2025 wave of English local government reorganisation, with particular focus on its implications for planning, governance, and development delivery.
                  </p>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Programme Objectives</h4>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                    <li>Document the reorganisation process and its impact on planning authority functions</li>
                    <li>Analyze governance risks and opportunities created by structural change</li>
                    <li>Provide practical insights for authorities, developers, and practitioners</li>
                    <li>Build evidence on what works and what doesn't in reorganisation transitions</li>
                    <li>Strengthen sector understanding of institutional and political factors affecting delivery</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Publishing Approach</h4>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    The Series is published on an ongoing basis as reorganisation progresses. Content includes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-6">
                    <li><strong>Data and Facts:</strong> Evidence-based analysis of governance structures, decision-making patterns, and performance metrics</li>
                    <li><strong>Lessons:</strong> Case studies from previous reorganisations examining what succeeded and what failed</li>
                    <li><strong>Interviews:</strong> Practitioner perspectives from officers, members, and developers with direct experience</li>
                    <li><strong>Case Studies:</strong> Deep analysis of specific authorities, including Surrey as a primary test case</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-slate-900 mb-3">About COALFACE</h4>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    The LGR Series is produced by COALFACE, a research and engagement practice specialising in planning governance, political behaviour, and institutional analysis. COALFACE works with developers, local authorities, and sector bodies to strengthen understanding of how governance conditions shape development outcomes.
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
              <SubscriptionForm />

              <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200">
                <h4 className="font-bold text-slate-900 mb-3">Explore More</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onNavigate('lessons')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg hover:shadow-md transition-all text-sm font-medium text-slate-700 hover:text-cyan-600"
                  >
                    Key Lessons →
                  </button>
                  <button
                    onClick={() => onNavigate('facts')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg hover:shadow-md transition-all text-sm font-medium text-slate-700 hover:text-cyan-600"
                  >
                    Facts & Data →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="reasons" />

      <LastUpdated />
    </div>
  );
}
