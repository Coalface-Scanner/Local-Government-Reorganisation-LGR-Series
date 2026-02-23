import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FurtherReading() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Further Reading - Facts & Data"
        description="Additional resources, reports, and publications on local government reorganisation, unitary authorities, and local government reform."
        keywords="LGR resources, reorganisation reading, local government publications, unitary authority research"
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Further Reading"
        heroSubtitle="Additional resources, reports, and publications on local government reorganisation and unitary authorities."
        currentPath={location.pathname}
      />
      <div className="layout-container layout-content-sub">
        <button
          onClick={() => navigate('/facts')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Facts & Data
        </button>
      </div>
      <div className="layout-container layout-content-sub">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recommended Resources</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-teal-500 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Government and Official Sources</h3>
                <ul className="space-y-3 text-slate-700">
                  <li>
                    <a href="https://www.gov.uk/government/organisations/department-for-levelling-up-housing-and-communities" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                      Department for Levelling Up, Housing and Communities (DLUHC)
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Official guidance and policy on local government reorganisation</p>
                  </li>
                  <li>
                    <a href="https://www.lgbce.org.uk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                      Local Government Boundary Commission for England
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Electoral arrangements and boundary reviews</p>
                  </li>
                  <li>
                    <a href="https://www.nao.org.uk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                      National Audit Office
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Value for money studies and public sector analysis</p>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-teal-500 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sector Bodies and Research</h3>
                <ul className="space-y-3 text-slate-700">
                  <li>
                    <a href="https://www.local.gov.uk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                      Local Government Association (LGA)
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Sector guidance, briefings, and best practice</p>
                  </li>
                  <li>
                    <a href="https://www.instituteforgovernment.org.uk" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                      Institute for Government
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Research and analysis on public sector reform</p>
                  </li>
                  <li>
                    <a href="https://www.cipfa.org" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 underline">
                      Chartered Institute of Public Finance and Accountancy (CIPFA)
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Financial management and governance resources</p>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-teal-500 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Academic and Think Tank Publications</h3>
                <ul className="space-y-3 text-slate-700">
                  <li>
                    <p className="font-semibold text-slate-800">Local Government Studies</p>
                    <p className="text-sm text-slate-600 mt-1">Academic journal on local government and public administration</p>
                  </li>
                  <li>
                    <p className="font-semibold text-slate-800">Public Administration Review</p>
                    <p className="text-sm text-slate-600 mt-1">Research on public sector management and reform</p>
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-teal-500 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Related Series Content</h3>
                <ul className="space-y-3 text-slate-700">
                  <li>
                    <a href="/lessons" className="text-teal-600 hover:text-teal-700 underline">
                      Lessons from Recent Reorganisations
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Practical insights and recommendations</p>
                  </li>
                  <li>
                    <a href="/insights" className="text-teal-600 hover:text-teal-700 underline">
                      Insights from the LGRI
                    </a>
                    <p className="text-sm text-slate-600 mt-1">Expert perspectives and analysis</p>
                  </li>
                  <li>
                    <a href="/interviews" className="text-teal-600 hover:text-teal-700 underline">
                      Interviews with Key Figures
                    </a>
                    <p className="text-sm text-slate-600 mt-1">First-hand accounts from those involved in reorganisation</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FAQSection page="facts" />
    </div>
  );
}

