import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import RelatedContent from '../../components/RelatedContent';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { caseStudiesData, SERVICE_AREAS, type ServiceOutcomeType } from './caseStudiesData';
import { useScrollDepthTracking } from '../../hooks/useScrollDepthTracking';
import { useTimeOnPageTracking } from '../../hooks/useTimeOnPageTracking';

function OutcomeIcon({ outcome }: { outcome: ServiceOutcomeType }) {
  if (outcome === 'good') return <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" aria-label="Good" />;
  if (outcome === 'bad') return <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" aria-label="Bad" />;
  return <HelpCircle className="w-6 h-6 text-amber-500 flex-shrink-0" aria-label="Not sure" />;
}

function getOutcomeByService(studyId: string, service: string): { outcome: ServiceOutcomeType; summary: string } | null {
  const study = caseStudiesData.find(s => s.id === studyId);
  const so = study?.serviceOutcomes.find(o => o.service === service);
  return so ? { outcome: so.outcome, summary: so.summary } : null;
}

export default function LessonsCaseStudies() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useScrollDepthTracking();
  useTimeOnPageTracking();

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Case Based Insights - Lessons from Reorganisation"
        description="Evidence-based case studies from North and West Northamptonshire, Somerset, and Dorset. What worked, what went wrong, and key lessons from recent local government reorganisations."
        keywords="LGR case studies, Northamptonshire reorganisation, Somerset Council reorganisation, Dorset Council reorganisation, unitary authority case studies, local government reorganisation lessons"
      />
      <PageBanner
        heroLabel="LEARNING FROM EXPERIENCE"
        heroTitle="Lessons from Reorganisation"
        heroSubtitle="Case based insights from recent reorganisations across England"
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
          <div className="academic-section-label">CASE BASED INSIGHTS</div>
          <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal">Case studies by service</h2>
          <p className="text-academic-base text-academic-neutral-700 mt-4 font-serif leading-relaxed">
            Evidence-based case studies from North and West Northamptonshire, Somerset, and Dorset. Each council is listed by service area with an indicator for good, mixed or uncertain, and poor outcomes.
          </p>
        </div>

        {/* Service matrix: rows = services, columns = councils */}
        <div className="academic-card overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-academic-neutral-300 bg-academic-neutral-50">
                  <th className="p-4 font-display font-bold text-academic-charcoal">Service area</th>
                  {caseStudiesData.map((study) => (
                    <th key={study.id} className="p-4 font-display font-bold text-academic-charcoal min-w-[140px]">
                      {study.id === 'northamptonshire' ? 'North & West Northamptonshire' : study.id === 'somerset' ? 'Somerset' : 'Dorset'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICE_AREAS.map((service) => (
                  <tr key={service} className="border-b border-academic-neutral-200 hover:bg-academic-neutral-50/50">
                    <td className="p-4 font-display font-semibold text-academic-charcoal align-top">{service}</td>
                    {caseStudiesData.map((study) => {
                      const result = getOutcomeByService(study.id, service);
                      return (
                        <td key={study.id} className="p-4 align-top">
                          {result ? (
                            <div className="space-y-2">
                              <OutcomeIcon outcome={result.outcome} />
                              <p className="text-academic-sm text-academic-neutral-700 font-serif leading-relaxed">{result.summary}</p>
                            </div>
                          ) : (
                            <span className="text-academic-neutral-400 text-sm">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-academic-neutral-50 border-t border-academic-neutral-200 flex flex-wrap items-center gap-4 text-academic-sm">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Good</span>
            <span className="flex items-center gap-1.5"><XCircle className="w-4 h-4 text-red-600" /> Poor / problems</span>
            <span className="flex items-center gap-1.5"><HelpCircle className="w-4 h-4 text-amber-500" /> Not sure / limited evidence</span>
          </div>
        </div>

        {/* Full case study details (expandable) */}
        <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-6">Full case study details</h3>
        <div className="space-y-6">
          {caseStudiesData.map((study) => {
            const expanded = expandedId === study.id;
            return (
              <article key={study.id} className="academic-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : study.id)}
                  className="w-full p-6 md:p-8 text-left flex items-center justify-between gap-4 hover:bg-academic-neutral-50/50 transition-colors"
                  aria-expanded={String(expanded)}
                >
                  <div>
                    <h4 className="text-academic-xl font-display font-bold text-academic-charcoal">{study.title}</h4>
                    <p className="text-academic-base text-teal-700 font-serif italic mt-1">{study.subtitle}</p>
                  </div>
                  {expanded ? <ChevronUp className="w-6 h-6 text-teal-700 flex-shrink-0" /> : <ChevronDown className="w-6 h-6 text-teal-700 flex-shrink-0" />}
                </button>
                {expanded && (
                  <div className="px-6 md:px-8 pb-8 pt-0 border-t border-academic-neutral-200 space-y-6">
                    <div>
                      <h5 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">Context</h5>
                      <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.context}</p>
                    </div>
                    {study.whatWorked && (
                      <div>
                        <h5 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">What worked</h5>
                        <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.whatWorked}</p>
                      </div>
                    )}
                    {study.whatWentWrong && (
                      <div>
                        <h5 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">What went wrong</h5>
                        <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.whatWentWrong}</p>
                      </div>
                    )}
                    {study.whatHasNotWorked && (
                      <div>
                        <h5 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">What has not yet worked</h5>
                        <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.whatHasNotWorked}</p>
                      </div>
                    )}
                    <div>
                      <h5 className="text-academic-lg font-display font-bold text-academic-charcoal mb-2">Why this matters</h5>
                      <p className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif">{study.whyItMatters}</p>
                    </div>
                    <div className="bg-teal-50 border-l-4 border-teal-700 p-4 rounded-r-lg">
                      <h5 className="text-academic-sm font-display font-bold text-teal-800 mb-2 uppercase tracking-wider">Key lesson</h5>
                      <p className="text-academic-base text-academic-charcoal font-serif leading-relaxed">{study.keyLesson}</p>
                    </div>
                    <div>
                      <h5 className="text-academic-lg font-display font-bold text-academic-charcoal mb-3">Sources</h5>
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
                )}
              </article>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedContent currentSlug="lessons" contentType="fact" maxItems={6} />
      </div>

    </div>
  );
}
