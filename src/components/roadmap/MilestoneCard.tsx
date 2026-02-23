import { Link } from 'react-router-dom';
import { BookOpen, Bookmark, BookmarkCheck, RotateCcw } from 'lucide-react';
import type { RoadmapMilestone, RouteId } from '../../data/roadmapMilestones';
import { ROUTE_LABELS } from '../../data/roadmapMilestones';

interface MilestoneCardProps {
  milestone: RoadmapMilestone;
  isHighlighted?: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
  isSaved: boolean;
  side: 'left' | 'right';
  featuredLink?: { label: string; href: string };
  featuredGlossary?: string;
  /** When true, the connector line to the spine is hidden (e.g. when card is on a u-turn branch). */
  hideConnector?: boolean;
}

export default function MilestoneCard({
  milestone,
  isHighlighted,
  onOpen,
  onToggleSave,
  isSaved,
  side,
  featuredLink,
  featuredGlossary,
  hideConnector = false,
}: MilestoneCardProps) {
  const routeChips = milestone.routes.slice(0, 3).map((r: RouteId) => (
    <span
      key={r}
      className="inline-block px-2 py-0.5 rounded text-xs font-display font-medium bg-teal-100 text-teal-800"
    >
      {ROUTE_LABELS[r]}
    </span>
  ));

  const borderColor =
    milestone.visualType === 'reversal'
      ? 'border-l-amber-500'
      : isHighlighted
        ? 'border-l-teal-600'
        : 'border-l-teal-500';

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
        onClick={() => onOpen()}
        className={`milestone-card academic-card cursor-pointer ${borderColor} ${
          isHighlighted ? 'ring-2 ring-teal-400' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-2">
              {milestone.title}
            </h3>
            <p className="text-academic-sm font-display font-semibold text-academic-neutral-600 mb-2">
              {milestone.dateLabel}
            </p>
            {routeChips.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">{routeChips}</div>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-academic-neutral-500 hover:text-teal-600 hover:bg-teal-50 shrink-0"
            aria-label={isSaved ? 'Remove from reading list' : 'Add to reading list'}
          >
            {isSaved ? (
              <BookmarkCheck size={20} className="text-teal-600" aria-hidden="true" />
            ) : (
              <Bookmark size={20} aria-hidden="true" />
            )}
          </button>
        </div>
        <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed mb-3">
          {milestone.summary}
        </p>
        <ul className="list-disc ml-4 space-y-1 text-academic-sm text-academic-neutral-700 font-serif mb-4">
          {milestone.whyItMatters.slice(0, 2).map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
        {milestone.riskNote && (
          <div className="mb-4 bg-amber-50 text-amber-800 text-xs px-3 py-1.5 rounded inline-block border border-amber-200">
            <strong>{milestone.riskNote}</strong>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-academic-neutral-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="text-base font-display font-semibold text-teal-700 hover:text-teal-800 underline underline-offset-2"
          >
            Open details
          </button>
          {featuredLink && (
            <Link
              to={featuredLink.href}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
            >
              Read next: {featuredLink.label} →
            </Link>
          )}
          {featuredGlossary && (
            <Link
              to={`/glossary/${featuredGlossary}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
            >
              <BookOpen size={18} aria-hidden="true" />
              Glossary
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
