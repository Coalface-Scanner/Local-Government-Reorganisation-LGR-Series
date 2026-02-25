import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Bookmark, BookmarkCheck, RotateCcw, Share2 } from 'lucide-react';
import type { RoadmapMilestone, AudienceId, AppliesTo, MilestoneStatus } from '../../data/roadmapMilestones';
import { AUDIENCE_LABELS } from '../../data/roadmapMilestones';

const APPLIES_TO_LABELS: Record<AppliesTo, string> = {
  surrey: 'Surrey',
  dpp: 'DPP',
  other: 'Other',
};

const STATUS_LABELS: Record<MilestoneStatus, string> = {
  confirmed: 'Confirmed',
  'in-design': 'In design',
  conditional: 'Conditional',
  complete: 'Complete',
};

interface MilestoneCardProps {
  milestone: RoadmapMilestone;
  isExpanded?: boolean;
  isHighlighted?: boolean;
  onToggleExpand: () => void;
  onToggleSave: () => void;
  isSaved: boolean;
  side: 'left' | 'right';
  audience?: AudienceId | '';
  featuredLink?: { label: string; href: string };
  featuredGlossary?: string;
  /** When true, the connector line to the spine is hidden (e.g. when card is on a u-turn branch). */
  hideConnector?: boolean;
}

export default function MilestoneCard({
  milestone,
  isExpanded = false,
  isHighlighted,
  onToggleExpand,
  onToggleSave,
  isSaved,
  side,
  audience,
  featuredLink: _featuredLink,
  featuredGlossary: _featuredGlossary,
  hideConnector = false,
}: MilestoneCardProps) {
  const isSurreyPrimary = milestone.appliesTo?.length === 1 && milestone.appliesTo[0] === 'surrey';
  const borderColor =
    milestone.visualType === 'reversal'
      ? 'border-l-amber-500'
      : isSurreyPrimary
        ? 'border-l-teal-700 border-l-[8px]'
        : isHighlighted
          ? 'border-l-teal-600'
          : 'border-l-teal-500';

  const handleShare = () => {
    const url = window.location.origin + window.location.pathname + '?milestone=' + milestone.id;
    navigator.clipboard.writeText(url);
  };

  return (
    <div
      className={`${side === 'left' ? 'left-card md:text-right' : 'right-card'} relative`}
    >
      {!hideConnector && <div className="connector" aria-hidden="true" />}
      {milestone.visualType === 'reversal' && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-white p-2 rounded-full shadow-lg"
          aria-hidden="true"
          title="Policy reversal"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
        </div>
      )}
      <div
        className={`milestone-card academic-card group rounded-xl overflow-hidden transition-all duration-200 relative ${borderColor} ${
          isExpanded ? 'milestone-card-expanded' : 'milestone-card-compact'
        } ${isHighlighted ? 'ring-2 ring-teal-400' : ''}`}
      >
        {/* Hover wave progress indicator */}
        {milestone.appliesTo && (milestone.appliesTo.length === 1 && milestone.appliesTo[0] === 'surrey' || milestone.appliesTo.includes('dpp')) && (
          <div
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-display font-semibold px-2 py-1 rounded bg-white/90 shadow border border-academic-neutral-200 pointer-events-none z-10"
            aria-hidden
          >
            {milestone.appliesTo.length === 1 && milestone.appliesTo[0] === 'surrey'
              ? 'Wave 1 – Active'
              : 'Wave 2 – Pending'}
          </div>
        )}
        <div
          className={`flex items-stretch gap-0 ${isExpanded ? '' : '-m-2'}`}
        >
          <button
            type="button"
            onClick={onToggleExpand}
            className={`flex-1 min-w-0 text-left bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-inset rounded-l-xl ${
              isExpanded ? 'p-4 rounded-tl-xl' : 'p-4 -my-2 -ml-2'
            }`}
            aria-expanded={isExpanded ? 'true' : 'false'}
            aria-label={isExpanded
              ? `${milestone.title}. Click to collapse.`
              : `${milestone.title}, ${milestone.dateLabel}. Click to expand for details.`
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Applicability tags */}
                {(milestone.appliesTo?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(['surrey', 'dpp', 'other'] as AppliesTo[]).map((area) => {
                      const active = milestone.appliesTo?.includes(area);
                      return (
                        <span
                          key={area}
                          className={`text-xs font-display font-semibold px-3 py-1 rounded whitespace-nowrap ${
                            active
                              ? 'bg-teal-100 text-teal-800 border border-teal-300'
                              : 'bg-transparent text-academic-neutral-400 border border-academic-neutral-300'
                          }`}
                        >
                          {APPLIES_TO_LABELS[area]}
                        </span>
                      );
                    })}
                  </div>
                )}
                {milestone.status && (
                  <span className="inline-block text-[10px] font-display font-medium text-academic-neutral-600 bg-academic-neutral-100 px-2 py-0.5 rounded mb-2">
                    {STATUS_LABELS[milestone.status]}
                  </span>
                )}
                <h3 className="text-academic-xl font-display font-bold text-academic-charcoal group-hover:text-teal-700">
                  {milestone.title}
                </h3>
                <p className="text-academic-sm font-display font-semibold text-academic-neutral-600 mt-0.5">
                  {milestone.dateLabel}
                </p>
                {!isExpanded && (
                  <span className="text-teal-600 flex items-center mt-2 text-xs font-display font-semibold" aria-hidden="true">
                    View details
                    <ChevronRight size={16} className="ml-0.5" aria-hidden="true" />
                  </span>
                )}
                {isExpanded && (
                  <span className="text-teal-600 flex items-center mt-2 text-xs font-display font-semibold" aria-hidden="true">
                    Click to collapse
                    <ChevronDown size={16} className="ml-0.5" aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-academic-neutral-500 hover:text-teal-600 hover:bg-teal-50 shrink-0 self-center ${
              isExpanded ? '' : 'rounded-l-none'
            }`}
            aria-label={isSaved ? 'Remove from reading list' : 'Add to reading list'}
          >
            {isSaved ? (
              <BookmarkCheck size={18} className="text-teal-600" aria-hidden="true" />
            ) : (
              <Bookmark size={18} aria-hidden="true" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 pt-0 border-t border-academic-neutral-200 mt-2">
            <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed mb-4">
              {milestone.summary}
            </p>
            {milestone.whoItAffects && (
              <p className="text-academic-sm text-academic-neutral-600 font-serif mb-4">
                <strong>Who it affects:</strong> {milestone.whoItAffects}
              </p>
            )}
            <h4 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
              Why it matters
            </h4>
            <ul className="list-disc ml-4 space-y-1 text-academic-sm text-academic-neutral-700 font-serif mb-4">
              {milestone.whyItMatters.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
            {audience && milestone.audienceActions[audience as AudienceId]?.length ? (
              <>
                <h4 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
                  What to do now ({AUDIENCE_LABELS[audience as AudienceId]})
                </h4>
                <ul className="list-disc ml-4 space-y-1 text-academic-sm text-academic-neutral-700 font-serif mb-4">
                  {milestone.audienceActions[audience as AudienceId]!.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {milestone.riskNote && (
              <div className="mb-4 bg-amber-50 text-amber-800 text-xs px-3 py-1.5 rounded inline-block border border-amber-200">
                <strong>{milestone.riskNote}</strong>
              </div>
            )}
            <h4 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
              Go deeper
            </h4>
            <ul className="space-y-3 mb-4">
              {milestone.links.articles[0] && (
                <li>
                  <Link
                    to={`/insights/${milestone.links.articles[0]}`}
                    className="text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
                  >
                    Article
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to={milestone.links.facts[0] || '/facts/lgr-timeline'}
                  className="text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
                >
                  Facts & timeline
                </Link>
              </li>
              {milestone.links.glossary[0] ? (
                <li>
                  <Link
                    to={`/glossary/${milestone.links.glossary[0]}`}
                    className="text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
                  >
                    Glossary
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to="/first-100-days"
                    className="text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
                  >
                    First 100 Days toolkit
                  </Link>
                </li>
              )}
            </ul>
            {(milestone.links.place?.length || milestone.links.tools?.length) ? (
              <>
                <h4 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
                  Related
                </h4>
                <ul className="space-y-3 mb-4">
                  {milestone.links.place?.map((p) => (
                    <li key={p}>
                      <Link
                        to={p}
                        className="text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
                      >
                        {p === '/surrey' ? 'Surrey hub' : p.replace('/', '')}
                      </Link>
                    </li>
                  ))}
                  {milestone.links.tools?.slice(0, 2).map((t) => (
                    <li key={t}>
                      <Link
                        to={t}
                        className="text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
                      >
                        {t === '/first-100-days' ? 'First 100 Days' : 'Tools'}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-academic-neutral-200">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display font-medium bg-academic-neutral-100 text-academic-charcoal hover:bg-teal-100 hover:text-teal-800"
              >
                <Share2 size={16} aria-hidden="true" />
                Share this milestone
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
