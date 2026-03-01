import { useLocation, useNavigate } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import { ArrowLeft } from 'lucide-react';
import { useScrollDepthTracking } from '../../hooks/useScrollDepthTracking';
import FAQSection from '../../components/FAQSection';
import { useTimeOnPageTracking } from '../../hooks/useTimeOnPageTracking';

export default function LessonsBestPractices() {
  const navigate = useNavigate();
  const location = useLocation();

  useScrollDepthTracking();
  useTimeOnPageTracking();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="lessonsBestPractices" />
      <MetaTags
        title="Best Practices - Lessons from Reorganisation"
        description="Practical guidance drawn from the first wave of Local Government Reorganisation. Curated best practices, checklists and lessons from the LGR Initiative."
        keywords="LGR best practices, reorganisation planning, governance design, transition delivery, local government reorganisation guidance, unitary authority checklists"
      />
      <PageBanner
        heroLabel="LEARNING FROM EXPERIENCE"
        heroTitle="Lessons from Reorganisation"
        heroSubtitle="Best practices from the first wave of Local Government Reorganisation"
        currentPath={location.pathname}
      />

      <div className="layout-container layout-content-sub">
        <button
          onClick={() => navigate('/lessons')}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-display font-medium mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Lessons
        </button>

        <div className="max-w-3xl">
          <div className="academic-section-header mb-10">
            <div className="academic-section-label">BEST PRACTICES</div>
            <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal">Practical guidance drawn from the first wave of Local Government Reorganisation</h2>
          </div>

          <div className="academic-card p-8 md:p-10 space-y-6">
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
              This section will bring together curated best practices, checklists and lessons drawn from the LGR Initiative to date.
            </p>
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
              Rather than abstract theory, it will focus on the decisions that have mattered most in practice across recently reorganised councils, and the consequences where they were delayed, diluted or avoided.
            </p>
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
              The material will be grounded in observed experience from Dorset, Somerset, Northumberland, Buckinghamshire and emerging unitary authorities, with Surrey used as a live test case.
            </p>
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
              Content will include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
              <li>Governance design choices that shape planning speed, accountability and political confidence</li>
              <li>Checklists for Members and senior officers navigating the first months of a new authority</li>
              <li>Lessons from where reorganisation improved clarity and where it embedded delay</li>
              <li>Early warning signals indicating governance, legitimacy or delivery risk</li>
            </ul>
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed">
              The purpose is not to prescribe a single model, but to surface the trade offs that decision makers face and the system behaviours that follow.
            </p>
            <p className="text-academic-base font-serif text-academic-neutral-700 leading-relaxed italic">
              This section is in development and will be published in stages as the Series progresses.
            </p>
          </div>
        </div>
      </div>
      <FAQSection page="lessons" />
    </div>
  );
}
