import { useEffect, useState } from 'react';
import SubscriptionForm from '../components/SubscriptionForm';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import Timeline from '../components/Timeline';
import CouncilsList from '../components/CouncilsList';
import PageNavigation from '../components/PageNavigation';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, FileText, Calendar, List, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FactsProps {
  onNavigate: (page: string) => void;
}

interface Fact {
  id: string;
  title: string;
  content: string;
  category: string | null;
  order_index: number;
}

export default function Facts({ onNavigate: _onNavigate }: FactsProps) {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const navItems = [
    { id: 'timescales', label: 'Timescales', icon: <Calendar size={16} /> },
    { id: 'councils', label: 'Councils Involved', icon: <MapPin size={16} /> },
    { id: 'facts', label: 'Key Facts', icon: <List size={16} /> },
    { id: 'methodology', label: 'Methodology', icon: <CheckCircle size={16} /> },
    { id: 'sources', label: 'Sources', icon: <FileText size={16} /> }
  ];

  useEffect(() => {
    const fetchFacts = async () => {
      const { data, error } = await supabase
        .from('facts')
        .select('*')
        .order('order_index');

      if (!error && data) {
        setFacts(data);
      }
      setLoading(false);
    };

    fetchFacts();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Facts & Figures"
        description="Key data and statistics on local government reorganisation in England. Timeline of reforms, performance indicators, and evidence-based analysis of outcomes across reorganised authorities."
        keywords="LGR statistics, council reorganisation data, unitary authority performance, local government facts, reorganisation timeline"
      />
      <div className="relative bg-gradient-to-b from-teal-50 to-white border-b-4 border-neutral-900 py-16">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-6">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-3">
              EVIDENCE-BASED ANALYSIS
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-6">
            The Facts Behind{' '}
            <span className="text-teal-700 font-serif italic">
              Recent Reorganisations
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Behind the headline promises of simpler, stronger local government, the emerging reality is uneven.
            These facts set out the clearest wins and the most significant stresses.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-10">
            <div id="timescales">
              <Timeline />
            </div>

            <div id="councils">
              <CouncilsList />
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-600">Loading facts...</div>
            ) : facts.length === 0 ? (
              <div className="text-center py-12 text-slate-600">No facts available yet.</div>
            ) : (
              <>
                <div id="facts" className="mt-12 mb-8">
                  <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-sm font-semibold text-slate-700 mb-4">
                    Key Facts
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    What are the facts?
                  </h2>
                  <p className="text-slate-600">
                    Evidence from recent reorganisations across England
                  </p>
                </div>

                {facts.map((fact) => (
                  <div key={fact.id} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <AlertCircle className="text-slate-600" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900">{fact.title}</h2>
                    </div>
                    <div className="space-y-6">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{fact.content}</p>
                      {fact.category && (
                        <div className="inline-block bg-slate-100 px-4 py-2 rounded-full text-sm font-medium text-slate-700">
                          {fact.category}
                        </div>
                      )}
                    </div>
                  </div>
                ))}</>
            )}

            {!loading && facts.length > 0 && (
              <>

                <div id="methodology" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                  <button
                    onClick={() => setMethodologyOpen(!methodologyOpen)}
                    className="flex items-center gap-3 w-full text-left group"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                      <CheckCircle className="text-slate-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 flex-1">Methodology</h2>
                    {methodologyOpen ? (
                      <ChevronUp className="text-slate-400" size={24} />
                    ) : (
                      <ChevronDown className="text-slate-400" size={24} />
                    )}
                  </button>

                  {methodologyOpen && (
                    <div className="mt-8 space-y-6 text-slate-700">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Methods and Sources</h3>
                        <p className="italic text-slate-600 mb-6">How this analysis has been developed</p>
                      </div>

                      <div>
                        <p className="leading-relaxed mb-6">
                          This note accompanies the Local Government Reorganisation Series and explains how evidence has been gathered, assessed and applied.
                        </p>
                        <p className="leading-relaxed">
                          The analysis draws on a review of councils that have completed structural reorganisation within the last five years, including the creation of new unitary authorities from district and county council structures. The focus is on implementation experience and outcomes, rather than policy intent or headline claims.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-3">Evidence base</h4>
                        <p className="leading-relaxed mb-4">
                          The material has been assembled from the following sources:
                        </p>
                        <ul className="space-y-2 ml-6">
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>Published business cases for local government reorganisation</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>Cabinet, committee and scrutiny reports on implementation and transition</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>Medium Term Financial Strategies and Section 151 monitoring reports</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>External audit commentary, including value for money assessments</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>DLUHC datasets on planning performance and service delivery</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>Local Government Association guidance and sector briefings</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>Institute for Government and National Audit Office analysis</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>Boundary Commission material on governance and representation</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-cyan-600 mt-1.5">•</span>
                            <span>Publicly available statements and updates issued by reorganised councils</span>
                          </li>
                        </ul>
                        <p className="leading-relaxed mt-4">
                          Only evidence that is attributable to named councils or authoritative sector bodies has been used. Anecdotal commentary and informal reporting have been excluded.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-3">Approach</h4>
                        <p className="leading-relaxed mb-4">
                          The analysis does not seek to rank councils or produce league tables. Instead, it identifies recurring patterns and shared challenges across different reorganisations, recognising that outcomes vary depending on starting conditions, geography, political leadership and delivery capacity.
                        </p>
                        <p className="leading-relaxed">
                          Where figures are referenced, they are drawn directly from published council material and used illustratively, not as universal benchmarks.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-3">Limitations</h4>
                        <p className="leading-relaxed mb-4">
                          Reorganisation is an ongoing process. For some councils, full outcomes will not be visible for several years. This analysis therefore focuses primarily on early and medium-term experience, particularly the transition period following vesting day.
                        </p>
                        <p className="leading-relaxed">
                          The purpose is not to provide definitive judgements, but to inform better decision making by learning from what is already known.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div id="sources" className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                  <button
                    onClick={() => setSourcesOpen(!sourcesOpen)}
                    className="flex items-center gap-3 w-full text-left group"
                  >
                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                      <FileText className="text-cyan-600" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 flex-1">Sources</h2>
                    {sourcesOpen ? (
                      <ChevronUp className="text-slate-400" size={24} />
                    ) : (
                      <ChevronDown className="text-slate-400" size={24} />
                    )}
                  </button>

                {sourcesOpen && (
                  <div className="mt-8 space-y-8 text-slate-700">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Evidence from Recent Reorganisations</h3>
                      <p className="italic text-slate-600 mb-6">Illustrative council experience and sources</p>
                    </div>

                    <div className="space-y-8">
                      <div className="border-l-4 border-cyan-500 pl-6">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Dorset Council (Vesting day 2019)</h4>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Key themes</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            <li>Financial savings delivered over time</li>
                            <li>Significant early workforce and service pressure</li>
                            <li>Strong emphasis on protecting frontline services</li>
                          </ul>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">What happened</p>
                          <p className="text-slate-600 leading-relaxed">
                            Dorset Council has reported substantial cumulative savings since reorganisation, achieved through service redesign, corporate consolidation and estate rationalisation. Early years involved workforce disruption and integration challenges, alongside efforts to maintain frontline services.
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Lesson</p>
                          <p className="text-slate-600 leading-relaxed">
                            Long-term efficiencies are achievable, but require sustained investment in transition, strong programme governance and realism about early disruption.
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800 mb-2">Sources</p>
                          <ul className="space-y-2 text-sm">
                            <li>
                              <a href="https://www.dorsetcouncil.gov.uk/council-democracy-and-elections/budget-and-spending" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Dorset Council, Council Plan and Medium Term Financial Strategy
                              </a>
                            </li>
                            <li>
                              <a href="https://www.dorsetcouncil.gov.uk/w/local-government-reorganisation" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Dorset Council, Local Government Reorganisation: Benefits and Savings Updates
                              </a>
                            </li>
                            <li>
                              <a href="https://www.dorsetcouncil.gov.uk/w/audit-of-accounts" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                External Auditor Value for Money Commentary (Grant Thornton)
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-l-4 border-cyan-500 pl-6">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Buckinghamshire Council (Vesting day 2020)</h4>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Key themes</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            <li>Large-scale savings claims</li>
                            <li>Centralised governance model</li>
                            <li>Locality arrangements introduced to address democratic scale</li>
                          </ul>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">What happened</p>
                          <p className="text-slate-600 leading-relaxed">
                            Buckinghamshire Council has reported significant savings following reorganisation, supported by consolidation of services and corporate functions. The size of the authority led to the introduction of area-based arrangements to support local engagement and member visibility.
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Lesson</p>
                          <p className="text-slate-600 leading-relaxed">
                            Scale can support efficiency, but democratic capacity and local connection must be designed into governance structures from the outset.
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800 mb-2">Sources</p>
                          <ul className="space-y-2 text-sm">
                            <li>
                              <a href="https://www.buckinghamshire.gov.uk/your-council/budget-and-spending" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Buckinghamshire Council, Medium Term Financial Plan and Savings Programme
                              </a>
                            </li>
                            <li>
                              <a href="https://www.buckinghamshire.gov.uk/your-council/unitary-council" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Buckinghamshire Council, Becoming a Unitary Authority: Implementation Updates
                              </a>
                            </li>
                            <li>
                              <a href="https://www.buckinghamshire.gov.uk/your-council/accounts-and-audit" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                External Auditor Value for Money Report (Ernst & Young)
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-l-4 border-cyan-500 pl-6">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Somerset Council (Vesting day 2023)</h4>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Key themes</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            <li>Early implementation pressure</li>
                            <li>Digital and ICT integration challenges</li>
                            <li>Workforce capacity constraints</li>
                          </ul>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">What happened</p>
                          <p className="text-slate-600 leading-relaxed">
                            Somerset Council's early transition period has highlighted the complexity of integrating legacy systems and operating models. Public reporting has acknowledged service pressures and the need to stabilise delivery while organisational change continues.
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Lesson</p>
                          <p className="text-slate-600 leading-relaxed">
                            Digital integration and workforce capacity are critical risk areas and must be treated as core programme priorities.
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800 mb-2">Sources</p>
                          <ul className="space-y-2 text-sm">
                            <li>
                              <a href="https://www.somerset.gov.uk/council-and-democracy/local-government-reorganisation" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Somerset Council, Local Government Reorganisation Programme Updates
                              </a>
                            </li>
                            <li>
                              <a href="https://www.somerset.gov.uk/budget" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Somerset Council, Medium Term Financial Strategy and Budget Reports
                              </a>
                            </li>
                            <li>
                              <a href="https://www.somerset.gov.uk/your-council/committees" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Audit Committee Papers and External Audit Commentary
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-l-4 border-cyan-500 pl-6">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">North Yorkshire Council (Vesting day 2023)</h4>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Key themes</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            <li>Geographic scale and service harmonisation</li>
                            <li>Planning and regulatory service pressure</li>
                            <li>Extended bedding-in period</li>
                          </ul>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">What happened</p>
                          <p className="text-slate-600 leading-relaxed">
                            The creation of one of England's largest unitary authorities has required extensive service harmonisation across a wide geographic area. Early reporting highlights pressure in regulatory and technical services as systems and processes are aligned.
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Lesson</p>
                          <p className="text-slate-600 leading-relaxed">
                            Geographic scale materially increases delivery complexity. Regulatory and planning services require explicit protection during transition.
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800 mb-2">Sources</p>
                          <ul className="space-y-2 text-sm">
                            <li>
                              <a href="https://www.northyorks.gov.uk/council/about-the-council/local-government-reorganisation" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                North Yorkshire Council, Local Government Reorganisation Programme
                              </a>
                            </li>
                            <li>
                              <a href="https://www.northyorks.gov.uk/planning-and-conservation" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                North Yorkshire Council, Planning Performance and Committee Reports
                              </a>
                            </li>
                            <li>
                              <a href="https://www.northyorks.gov.uk/your-council/committees" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Cabinet and Scrutiny Committee Papers
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="border-l-4 border-cyan-500 pl-6">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">Cumberland Council and Westmorland and Furness Council (Vesting day 2023)</h4>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Key themes</p>
                          <ul className="list-disc list-inside space-y-1 text-slate-600">
                            <li>Democratic geography</li>
                            <li>Member workload and representation</li>
                            <li>Locality and community engagement challenges</li>
                          </ul>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">What happened</p>
                          <p className="text-slate-600 leading-relaxed">
                            The creation of two large unitary authorities has reshaped democratic representation across Cumbria. Early experience highlights increased reliance on locality working and the role of town and parish councils in maintaining community connection.
                          </p>
                        </div>

                        <div className="mb-4">
                          <p className="font-semibold text-slate-800 mb-2">Lesson</p>
                          <p className="text-slate-600 leading-relaxed">
                            Reorganisation reshapes democratic relationships. Local voice must be actively supported through formal structures and resourcing.
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800 mb-2">Sources</p>
                          <ul className="space-y-2 text-sm">
                            <li>
                              <a href="https://www.cumberland.gov.uk/your-council/local-government-reorganisation" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Cumberland Council, Local Government Reorganisation Information
                              </a>
                            </li>
                            <li>
                              <a href="https://www.westmorlandandfurness.gov.uk/your-council/new-council" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Westmorland and Furness Council, Becoming a New Council
                              </a>
                            </li>
                            <li>
                              <a href="https://www.lgbce.org.uk" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 underline">
                                Local Government Boundary Commission for England, Electoral Arrangements
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <PageNavigation items={navItems} />
              <SubscriptionForm />
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="facts" />

      <LastUpdated />
    </div>
  );
}
