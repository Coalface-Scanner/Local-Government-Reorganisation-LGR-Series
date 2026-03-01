import { SEOHead } from '../../components/SEOHead';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import Timeline from '../../components/Timeline';
import { 
  ArrowLeft, Calendar, Route, BookOpen, MapPin
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import FAQSection from '../../components/FAQSection';

export default function LGRTimeline() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-academic-cream">
      <SEOHead page="factsLgrTimeline" />
      <MetaTags
        title="LGR Timetable 2026 - Local Government Reorganisation Timeline"
        description="Comprehensive timeline of Local Government Reorganisation (LGR) processes for 2026. Key dates including shadow elections, vesting days, and the LGR timetable 2026 roadmap."
        keywords="LGR timetable 2026, Local Government Reorganisation timeline, shadow elections 2026, vesting day, LGR roadmap, reorganisation timeline, unitary authority timeline"
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="LGR Timeline 2026"
        heroSubtitle="Comprehensive timeline of LGR processes, key dates, and milestones. Track shadow elections, vesting days, and the LGR timetable roadmap."
        currentPath={location.pathname}
      />
      <div className="layout-container layout-content-sub">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts & Data
          </button>
          <span className="text-academic-neutral-500">|</span>
          <Link
            to="/roadmap"
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <MapPin size={18} aria-hidden="true" />
            Prefer the visual journey map?
          </Link>
        </div>
      </div>
      <div className="layout-container layout-content-hub">
        {/* In Brief Section */}
        <div className="academic-card p-8 mb-12 bg-teal-50 border-l-4 border-teal-700">
          <div className="flex items-start gap-4">
            <Calendar className="text-teal-700 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-2xl font-display font-bold text-academic-charcoal mb-4">
                LGR Timetable 2026 Overview
              </h2>
              <p className="text-lg text-academic-neutral-800 leading-relaxed font-serif">
                The <strong>LGR timetable 2026</strong> represents a significant wave of Local Government Reorganisation across England. Key milestones include shadow elections in May 2026, with new unitary authorities taking full control (vesting day) in 2027-2028. Areas are progressing through distinct pathways: Surrey (fast-tracked), Devolution Priority Proposals (DPP), and Non-Devolution Priority Proposals (Non-DPP), each with different timelines for final proposals, decisions, shadow elections, and go-live dates.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Component */}
        <div className="academic-card p-8 md:p-12 mb-12">
          <Timeline />
        </div>

        {/* Key Milestones */}
        <div className="academic-card p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-display font-bold text-academic-charcoal mb-6">
            Key Milestones in the LGR Process
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-blue-600" size={24} />
                <h3 className="text-xl font-display font-bold text-academic-charcoal">
                  Final Proposals
                </h3>
              </div>
              <p className="text-academic-neutral-700 font-serif">
                Formal proposals for reorganisation are submitted. For Surrey, this occurred in May 2025. DPP proposals are due 26 September 2025, and Non-DPP proposals by 28 November 2025.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-600">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-green-600" size={24} />
                <h3 className="text-xl font-display font-bold text-academic-charcoal">
                  Decision
                </h3>
              </div>
              <p className="text-academic-neutral-700 font-serif">
                Government makes final decision on reorganisation. Surrey decision expected Autumn 2025. DPP decisions in Early 2026, Non-DPP in Spring 2026.
              </p>
            </div>

            <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-amber-600" size={24} />
                <h3 className="text-xl font-display font-bold text-academic-charcoal">
                  Shadow Elections
                </h3>
              </div>
              <p className="text-academic-neutral-700 font-serif">
                Elections held to form the shadow authority. Surrey shadow elections scheduled for May 2026. DPP and Non-DPP shadow elections in May 2027.
              </p>
            </div>

            <div className="p-6 bg-cyan-50 rounded-lg border-l-4 border-cyan-600">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="text-cyan-600" size={24} />
                <h3 className="text-xl font-display font-bold text-academic-charcoal">
                  Go-Live (Vesting Day)
                </h3>
              </div>
              <p className="text-academic-neutral-700 font-serif">
                New unitary authority takes full control. Surrey go-live scheduled for May 2027. DPP and Non-DPP go-live dates set for May 2028.
              </p>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="academic-card p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-display font-bold text-academic-charcoal mb-6">
            Related Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/facts/what-is-lgr')}
              className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <BookOpen className="text-teal-700 group-hover:text-teal-800 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                    What is LGR?
                  </h3>
                  <p className="text-academic-neutral-600 font-serif">
                    Learn about Local Government Reorganisation and how it works.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/surrey')}
              className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <MapPin className="text-teal-700 group-hover:text-teal-800 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                    Surrey Reorganisation Analysis
                  </h3>
                  <p className="text-academic-neutral-600 font-serif">
                    Detailed analysis of Surrey's LGR timetable 2026 transition.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/glossary')}
              className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <BookOpen className="text-teal-700 group-hover:text-teal-800 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                    LGR Glossary
                  </h3>
                  <p className="text-academic-neutral-600 font-serif">
                    Key terms and definitions for understanding LGR processes.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/lgr-journey-2026')}
              className="academic-card p-6 text-left hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <Route className="text-teal-700 group-hover:text-teal-800 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                    LGR Journey 2026
                  </h3>
                  <p className="text-academic-neutral-600 font-serif">
                    Interactive journey map visualizing the LGR process.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

      <FAQSection page="facts" />
      </div>
    </div>
  );
}
