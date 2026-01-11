import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Methodology() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Methodology - Facts & Data"
        description="How the Local Government Reorganisation Series analysis has been developed, including evidence base, approach, and limitations."
        keywords="LGR methodology, reorganisation analysis, evidence gathering, research methods"
      />
      
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-3 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts & Data
          </button>
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              RESEARCH METHODOLOGY
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Methodology
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            How this analysis has been developed and the evidence base that informs it.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200 space-y-8 text-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Methods and Sources</h2>
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
            <h3 className="text-xl font-bold text-slate-900 mb-4">Evidence base</h3>
            <p className="leading-relaxed mb-4">
              The material has been assembled from the following sources:
            </p>
            <ul className="space-y-3 ml-6">
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
            <p className="leading-relaxed mt-6">
              Only evidence that is attributable to named councils or authoritative sector bodies has been used. Anecdotal commentary and informal reporting have been excluded.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Approach</h3>
            <p className="leading-relaxed mb-4">
              The analysis does not seek to rank councils or produce league tables. Instead, it identifies recurring patterns and shared challenges across different reorganisations, recognising that outcomes vary depending on starting conditions, geography, political leadership and delivery capacity.
            </p>
            <p className="leading-relaxed">
              Where figures are referenced, they are drawn directly from published council material and used illustratively, not as universal benchmarks.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Limitations</h3>
            <p className="leading-relaxed mb-4">
              Reorganisation is an ongoing process. For some councils, full outcomes will not be visible for several years. This analysis therefore focuses primarily on early and medium-term experience, particularly the transition period following vesting day.
            </p>
            <p className="leading-relaxed">
              The purpose is not to provide definitive judgements, but to inform better decision making by learning from what is already known.
            </p>
          </div>
        </div>
      </div>

      <FAQSection page="facts" />
      <LastUpdated />
    </div>
  );
}

