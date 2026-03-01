import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sources() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="factsSources" />
      <MetaTags
        title="Sources - Facts & Data"
        description="Evidence from recent reorganisations across England, including council experience and sources from Dorset, Buckinghamshire, Somerset, North Yorkshire, and Cumbria."
        keywords="LGR sources, reorganisation evidence, council case studies, local government reorganisation references"
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Sources"
        heroSubtitle="Evidence from recent reorganisations across England. Illustrative council experience and sources."
        currentPath={location.pathname}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/facts')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Facts & Data
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 text-slate-700">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Evidence from Recent Reorganisations</h2>
            <p className="italic text-slate-600 mb-8">Illustrative council experience and sources</p>

            <div className="space-y-10">
              <div className="border-l-4 border-cyan-500 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Dorset Council (Vesting day 2019)</h3>

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
                <h3 className="text-xl font-bold text-slate-900 mb-3">Buckinghamshire Council (Vesting day 2020)</h3>

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
                <h3 className="text-xl font-bold text-slate-900 mb-3">Somerset Council (Vesting day 2023)</h3>

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
                <h3 className="text-xl font-bold text-slate-900 mb-3">North Yorkshire Council (Vesting day 2023)</h3>

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
                <h3 className="text-xl font-bold text-slate-900 mb-3">Cumberland Council and Westmorland and Furness Council (Vesting day 2023)</h3>

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
        </div>
      </div>

      <FAQSection page="facts" />
    </div>
  );
}

