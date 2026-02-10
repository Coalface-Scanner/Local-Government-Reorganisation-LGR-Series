import { useLocation, useNavigate, Link } from 'react-router-dom';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import RelatedContent from '../../components/RelatedContent';
import { ArrowLeft } from 'lucide-react';
import { caseStudiesData } from './caseStudiesData';
import { useScrollDepthTracking } from '../../hooks/useScrollDepthTracking';
import { useTimeOnPageTracking } from '../../hooks/useTimeOnPageTracking';

export default function LessonsCaseStudies() {
  const navigate = useNavigate();
  const location = useLocation();

  useScrollDepthTracking();
  useTimeOnPageTracking();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Case Grounded Lessons - Lessons from Reorganisation"
        description="Evidence-based case studies from North and West Northamptonshire, Somerset, and Dorset. What worked, what went wrong, and key lessons from recent local government reorganisations."
        keywords="LGR case studies, Northamptonshire reorganisation, Somerset Council reorganisation, Dorset Council reorganisation, unitary authority case studies, local government reorganisation lessons"
      />
      <PageBanner
        heroLabel="LEARNING FROM EXPERIENCE"
        heroTitle="Lessons from Reorganisation"
        heroSubtitle="Case grounded lessons from recent reorganisations across England"
        currentPath={location.pathname}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/lessons')}
          className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-display font-medium mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Lessons
        </button>

        <div className="academic-section-header mb-10">
          <div className="academic-section-label">CASE GROUNDED LESSONS</div>
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal">Lessons from recent reorganisations</h2>
          <p className="text-academic-base text-academic-neutral-700 mt-4 font-serif leading-relaxed">
            Evidence-based case studies from North and West Northamptonshire, Somerset, and Dorset.
          </p>
        </div>

        <div className="space-y-8">
          {caseStudiesData.map((study) => (
            <article key={study.id} className="academic-card p-8 md:p-10">
              <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">
                {study.title}
              </h3>
              <p className="text-academic-base text-teal-700 font-serif italic mb-6">{study.subtitle}</p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">Context</h4>
                  <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.context}</p>
                </div>

                {study.whatWorked && (
                  <div>
                    <h4 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">What worked</h4>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.whatWorked}</p>
                  </div>
                )}
                {study.whatWentWrong && (
                  <div>
                    <h4 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">What went wrong</h4>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.whatWentWrong}</p>
                  </div>
                )}
                {study.whatHasNotWorked && (
                  <div>
                    <h4 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">What has not yet worked</h4>
                    <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.whatHasNotWorked}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">Why this matters</h4>
                  <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.whyItMatters}</p>
                </div>

                <div className="bg-teal-50 border-l-4 border-teal-700 p-4 rounded-r-lg">
                  <h4 className="text-academic-sm font-display font-bold text-teal-800 mb-2 uppercase tracking-wider">Key lesson</h4>
                  <p className="text-academic-base text-academic-charcoal font-serif leading-relaxed">{study.keyLesson}</p>
                </div>

                <div>
                  <h4 className="text-academic-lg font-display font-bold text-academic-charcoal mb-3">Sources</h4>
                  <ul className="space-y-2">
                    {study.sources.map((source, idx) => (
                      <li key={idx}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:text-teal-800 underline font-serif text-academic-sm leading-relaxed"
                        >
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedContent currentSlug="lessons" contentType="fact" maxItems={6} />
      </div>

    </div>
  );
}
