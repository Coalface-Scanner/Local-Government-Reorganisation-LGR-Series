import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import type { RoadmapMilestone, AudienceId } from '../../data/roadmapMilestones';
import { AUDIENCE_LABELS } from '../../data/roadmapMilestones';

interface RoadmapSidePanelProps {
  milestone: RoadmapMilestone | null;
  audience: AudienceId | '';
  onClose: () => void;
  onAddToReadingList: (id: string) => void;
  savedIds: Set<string>;
  readingListMilestones: RoadmapMilestone[];
  onOpenMilestone: (id: string) => void;
  onShare?: (milestoneId: string) => void;
  isOpen: boolean;
  showReadingList: boolean;
  isMobile?: boolean;
}

export default function RoadmapSidePanel({
  milestone,
  audience,
  onClose,
  onAddToReadingList,
  savedIds,
  readingListMilestones,
  onOpenMilestone,
  onShare,
  isOpen,
  showReadingList,
  isMobile = false,
}: RoadmapSidePanelProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = () => {
    if (milestone && onShare) {
      onShare(milestone.id);
    }
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  if (!isOpen) return null;

  const panelClasses = isMobile
    ? 'flex flex-col flex-1 min-h-0 overflow-hidden bg-white'
    : 'w-full md:w-[380px] shrink-0 bg-white border-l border-academic-neutral-300 overflow-y-auto flex flex-col';

  return (
    <aside className={`${panelClasses} roadmap-side-panel`} aria-label="Milestone detail">
      <div className="sticky top-0 bg-white border-b border-academic-neutral-200 px-4 py-3 flex items-center justify-between z-10">
        <h2 className="text-academic-lg font-display font-bold text-academic-charcoal">
          {showReadingList ? 'Reading list' : milestone ? milestone.title : 'Journey map'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg text-academic-neutral-500 hover:bg-academic-warm hover:text-academic-charcoal"
          aria-label="Close panel"
        >
          <X size={24} aria-hidden="true" />
        </button>
      </div>
      <div className="p-4 flex-1">
        {showReadingList && readingListMilestones.length > 0 ? (
          <div>
            <h3 className="text-academic-lg font-display font-bold text-academic-charcoal mb-3">
              Reading list
            </h3>
            <ul className="space-y-2">
              {readingListMilestones.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => onOpenMilestone(m.id)}
                    className="text-left w-full px-3 py-2 rounded-lg hover:bg-academic-warm text-academic-charcoal font-serif"
                  >
                    <span className="font-semibold">{m.title}</span>
                    <span className="block text-sm text-academic-neutral-600">{m.dateLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : !milestone ? (
          <p className="text-academic-base text-academic-neutral-600 font-serif">
            Click a milestone on the map to see details, actions, and links to go deeper.
          </p>
        ) : (
          <>
            <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed mb-4">
              {milestone.summary}
            </p>
            {milestone.whoItAffects && (
              <p className="text-academic-sm text-academic-neutral-600 font-serif mb-4">
                <strong>Who it affects:</strong> {milestone.whoItAffects}
              </p>
            )}
            <h3 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
              Why it matters
            </h3>
            <ul className="list-disc ml-4 space-y-1 text-academic-sm text-academic-neutral-700 font-serif mb-4">
              {milestone.whyItMatters.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
            {audience && milestone.audienceActions[audience as AudienceId]?.length ? (
              <>
                <h3 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
                  What to do now ({AUDIENCE_LABELS[audience as AudienceId]})
                </h3>
                <ul className="list-disc ml-4 space-y-1 text-academic-sm text-academic-neutral-700 font-serif mb-4">
                  {milestone.audienceActions[audience as AudienceId]!.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </>
            ) : null}
            <h3 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
              Go deeper
            </h3>
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
              {(milestone.links.facts[0] || '/facts/lgr-timeline') && (
                <li>
                  <Link
                    to={milestone.links.facts[0] || '/facts/lgr-timeline'}
                    className="text-base font-semibold text-teal-800 hover:text-teal-700 underline underline-offset-3"
                  >
                    Facts & timeline
                  </Link>
                </li>
              )}
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
                <h3 className="text-academic-sm font-display font-bold text-academic-charcoal uppercase mb-2">
                  Related
                </h3>
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
                onClick={() => onAddToReadingList(milestone.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display font-medium bg-academic-neutral-100 text-academic-charcoal hover:bg-teal-100 hover:text-teal-800"
              >
                {savedIds.has(milestone.id) ? (
                  <>
                    <BookmarkCheck size={16} aria-hidden="true" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={16} aria-hidden="true" />
                    Add to reading list
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display font-medium bg-academic-neutral-100 text-academic-charcoal hover:bg-teal-100 hover:text-teal-800"
              >
                <Share2 size={16} aria-hidden="true" />
                {copySuccess ? 'Link copied' : 'Share this milestone'}
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
