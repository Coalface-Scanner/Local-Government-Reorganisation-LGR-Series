import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Bookmark, BookmarkCheck, RotateCcw, Share2, AlertTriangle } from 'lucide-react';
import type { RoadmapMilestone, AudienceId, AppliesTo, MilestoneStatus } from '../../data/roadmapMilestones';
import { AUDIENCE_LABELS } from '../../data/roadmapMilestones';

const APPLIES_TO_LABELS: Record<AppliesTo, string> = {
  surrey: 'Surrey',
  dpp: 'DPP Areas',
  other: 'Other Areas',
};

const APPLIES_TO_COLORS: Record<AppliesTo, string> = {
  surrey: 'bg-teal-100 text-teal-800 border-teal-300',
  dpp: 'bg-sky-100 text-sky-800 border-sky-300',
  other: 'bg-slate-100 text-slate-700 border-slate-300',
};

const AREA_ACCENT: Record<AppliesTo, { dot: string; border: string; bg: string }> = {
  surrey: { dot: 'bg-teal-600', border: 'border-teal-200', bg: 'bg-teal-50' },
  dpp: { dot: 'bg-sky-600', border: 'border-sky-200', bg: 'bg-sky-50' },
  other: { dot: 'bg-slate-500', border: 'border-slate-200', bg: 'bg-slate-50' },
};

const STATUS_CONFIG: Record<MilestoneStatus, { label: string; classes: string }> = {
  confirmed: { label: 'Confirmed', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'in-design': { label: 'In design', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  conditional: { label: 'Conditional', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  complete: { label: 'Complete', classes: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
};

type WaveType = 'wave-1' | 'wave-2' | 'pipeline' | 'all-waves';

const WAVE_CONFIG: Record<WaveType, { label: string; classes: string; cardClass: string }> = {
  'wave-1': {
    label: 'Wave 1 — Surrey Fast Track',
    classes: 'bg-teal-700 text-white',
    cardClass: 'milestone-card--wave-1',
  },
  'wave-2': {
    label: 'Wave 2 — DPP Areas',
    classes: 'bg-sky-700 text-white',
    cardClass: 'milestone-card--wave-2',
  },
  pipeline: {
    label: 'Conditional Pipeline',
    classes: 'bg-slate-600 text-white',
    cardClass: 'milestone-card--pipeline',
  },
  'all-waves': {
    label: 'All Areas',
    classes: 'bg-gradient-to-r from-teal-700 via-sky-700 to-slate-600 text-white',
    cardClass: 'milestone-card--all-waves',
  },
};

/** Classify a milestone into its primary wave for visual treatment. */
function getWaveType(appliesTo?: AppliesTo[]): WaveType {
  if (!appliesTo?.length) return 'all-waves';
  const has = (a: AppliesTo) => appliesTo.includes(a);
  if (has('surrey') && has('dpp') && has('other')) return 'all-waves';
  if (has('surrey') && !has('dpp') && !has('other')) return 'wave-1';
  if (has('surrey') && has('dpp') && !has('other')) return 'wave-1'; // Surrey + DPP, Surrey leads
  if (has('dpp') && !has('surrey')) return 'wave-2';
  if (!has('surrey') && !has('dpp')) return 'pipeline';
  return 'all-waves';
}

/**
 * Parse a summary string into area-specific sections.
 * Looks for patterns like "Surrey: ... DPP areas: ... Other areas: ..."
 * Returns null if summary doesn't follow the pattern (i.e. it's a simple single-area text).
 */
function parseAreaSections(summary: string): { area: AppliesTo; label: string; text: string }[] | null {
  // Match patterns: "Surrey:" or "DPP areas:" or "Other areas:" at sentence boundaries
  const surreyMatch = summary.match(/\bSurrey[:\s]+(?:(?!DPP|Other areas)[^]*?)(?=\.\s*DPP|\.\s*Other areas|\.$)/i);
  const dppMatch = summary.match(/\bDPP areas?[:\s]+(?:(?!Surrey|Other areas)[^]*?)(?=\.\s*Surrey|\.\s*Other areas|\.$)/i);
  const otherMatch = summary.match(/\bOther areas?[:\s]+(?:(?!Surrey|DPP)[^]*?)(?=\.\s*Surrey|\.\s*DPP|\.$)/i);

  if (!surreyMatch && !dppMatch && !otherMatch) return null;

  // More robust approach: split on area prefixes
  const sections: { area: AppliesTo; label: string; text: string }[] = [];
  const parts = summary.split(/(?=Surrey[: ]|DPP areas?[: ]|Other areas?[: ])/i);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (/^Surrey[: ]/i.test(trimmed)) {
      const text = trimmed.replace(/^Surrey[:\s]+/i, '').replace(/\.\s*$/, '').trim();
      if (text) sections.push({ area: 'surrey', label: 'Surrey', text: text + '.' });
    } else if (/^DPP areas?[: ]/i.test(trimmed)) {
      const text = trimmed.replace(/^DPP areas?[:\s]+/i, '').replace(/\.\s*$/, '').trim();
      if (text) sections.push({ area: 'dpp', label: 'DPP Areas', text: text + '.' });
    } else if (/^Other areas?[: ]/i.test(trimmed)) {
      const text = trimmed.replace(/^Other areas?[:\s]+/i, '').replace(/\.\s*$/, '').trim();
      if (text) sections.push({ area: 'other', label: 'Other Areas', text: text + '.' });
    }
  }

  return sections.length >= 2 ? sections : null;
}

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
  hideConnector = false,
}: MilestoneCardProps) {
  const handleShare = () => {
    const url = window.location.origin + window.location.pathname + '?milestone=' + milestone.id;
    navigator.clipboard.writeText(url);
  };

  const activeTags = milestone.appliesTo?.filter(Boolean) ?? [];
  const waveType = getWaveType(milestone.appliesTo);
  const wave = WAVE_CONFIG[waveType];
  const areaSections = parseAreaSections(milestone.summary);

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
        className={`milestone-card academic-card group rounded-xl overflow-hidden transition-all duration-200 relative ${wave.cardClass} ${
          isExpanded ? 'milestone-card-expanded' : 'milestone-card-compact'
        } ${isHighlighted ? 'ring-2 ring-teal-400' : ''}`}
      >
        {/* Wave banner */}
        <div className={`px-4 py-1.5 text-[11px] font-display font-bold uppercase tracking-wider ${wave.classes}`}>
          {wave.label}
        </div>

        <div className="flex items-stretch gap-0">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex-1 min-w-0 text-left bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-inset rounded-l-xl p-4 pt-3"
            aria-expanded={isExpanded ? 'true' : 'false'}
            aria-label={isExpanded
              ? `${milestone.title}. Click to collapse.`
              : `${milestone.title}, ${milestone.dateLabel}. Click to expand for details.`
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Compact metadata row: area tags + status */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {activeTags.map((area) => (
                    <span
                      key={area}
                      className={`text-[10px] font-display font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${APPLIES_TO_COLORS[area]}`}
                    >
                      {APPLIES_TO_LABELS[area]}
                    </span>
                  ))}
                  {milestone.status && (
                    <span className={`text-[10px] font-display font-medium px-2 py-0.5 rounded border whitespace-nowrap ${STATUS_CONFIG[milestone.status].classes}`}>
                      {STATUS_CONFIG[milestone.status].label}
                    </span>
                  )}
                </div>
                <h3 className="text-academic-lg sm:text-academic-xl font-display font-bold text-academic-charcoal group-hover:text-teal-700 leading-snug">
                  {milestone.title}
                </h3>
                <p className="text-academic-sm font-display font-semibold text-academic-neutral-600 mt-1">
                  {milestone.dateLabel}
                </p>
                {/* Surface risk note hint in compact view */}
                {!isExpanded && milestone.riskNote && (
                  <div className="flex items-center gap-1.5 mt-2 text-amber-700">
                    <AlertTriangle size={13} aria-hidden="true" />
                    <span className="text-[11px] font-display font-medium line-clamp-1">{milestone.riskNote}</span>
                  </div>
                )}
                <span className="text-teal-600 inline-flex items-center mt-2 text-xs font-display font-semibold" aria-hidden="true">
                  {isExpanded ? 'Collapse' : 'View details'}
                  {isExpanded
                    ? <ChevronDown size={16} className="ml-0.5" aria-hidden="true" />
                    : <ChevronRight size={16} className="ml-0.5" aria-hidden="true" />
                  }
                </span>
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-academic-neutral-500 hover:text-teal-600 hover:bg-teal-50 shrink-0 self-center"
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
          <div className="px-4 pb-4 pt-3 border-t border-academic-neutral-200">
            {/* Area-specific summary sections (if parseable), or plain summary */}
            {areaSections ? (
              <div className="space-y-3 mb-4">
                {areaSections.map(({ area, label, text }) => {
                  const accent = AREA_ACCENT[area];
                  return (
                    <div key={area} className={`rounded-lg border ${accent.border} ${accent.bg} px-3 py-2.5`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${accent.dot}`} aria-hidden="true" />
                        <span className="text-xs font-display font-bold uppercase tracking-wide text-academic-charcoal">
                          {label}
                        </span>
                      </div>
                      <p className="text-academic-sm text-academic-neutral-700 font-serif leading-relaxed">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed mb-4">
                {milestone.summary}
              </p>
            )}

            {milestone.whoItAffects && (
              <p className="text-academic-sm text-academic-neutral-600 font-serif mb-4">
                <strong>Who it affects:</strong> {milestone.whoItAffects}
              </p>
            )}
            {milestone.riskNote && (
              <div className="mb-4 flex items-start gap-2 bg-amber-50 text-amber-800 text-sm px-3 py-2 rounded-lg border border-amber-200">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-serif">{milestone.riskNote}</span>
              </div>
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
            <h4 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
              Go deeper
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {milestone.links.articles[0] && (
                <Link
                  to={`/insights/${milestone.links.articles[0]}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-medium bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                >
                  Article
                </Link>
              )}
              <Link
                to={milestone.links.facts[0] || '/facts/lgr-timeline'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-medium bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
              >
                Facts & timeline
              </Link>
              {milestone.links.glossary[0] ? (
                <Link
                  to={`/glossary/${milestone.links.glossary[0]}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-medium bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                >
                  Glossary
                </Link>
              ) : (
                <Link
                  to="/first-100-days"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-medium bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors"
                >
                  First 100 Days
                </Link>
              )}
              {milestone.links.place?.map((p) => (
                <Link
                  key={p}
                  to={p}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-medium bg-academic-neutral-100 text-academic-charcoal hover:bg-teal-50 hover:text-teal-800 border border-academic-neutral-200 transition-colors"
                >
                  {p === '/surrey' ? 'Surrey hub' : p.replace('/', '')}
                </Link>
              ))}
              {milestone.links.tools?.slice(0, 2).map((t) => (
                <Link
                  key={t}
                  to={t}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-display font-medium bg-academic-neutral-100 text-academic-charcoal hover:bg-teal-50 hover:text-teal-800 border border-academic-neutral-200 transition-colors"
                >
                  {t === '/first-100-days' ? 'First 100 Days' : 'Tools'}
                </Link>
              ))}
            </div>
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
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
