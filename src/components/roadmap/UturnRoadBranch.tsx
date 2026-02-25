import type { RoadmapMilestone, AudienceId } from '../../data/roadmapMilestones';
import MilestoneCard from './MilestoneCard';

interface UturnRoadBranchProps {
  milestone: RoadmapMilestone;
  isExpanded?: boolean;
  isHighlighted?: boolean;
  onToggleExpand: () => void;
  onToggleSave: () => void;
  isSaved: boolean;
  audience?: AudienceId | '';
  featuredLink?: { label: string; href: string };
  featuredGlossary?: string;
}

/**
 * Renders a milestone (e.g. election reversal) on a road that branches right from the spine,
 * does a u-turn, and rejoins the main road. The card sits in the curve of the u-turn.
 */
export default function UturnRoadBranch({
  milestone,
  isExpanded,
  isHighlighted,
  onToggleExpand,
  onToggleSave,
  isSaved,
  audience,
  featuredLink,
  featuredGlossary,
}: UturnRoadBranchProps) {
  return (
    <div
      className="relative mb-12 md:mb-16 flex justify-center"
      style={{ minHeight: '320px' }}
    >
      {/* U-turn road: branch right from spine, semicircle, back to spine. Card in the curve. */}
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2 z-0 pointer-events-none"
        width="200"
        height="280"
        viewBox="0 0 200 280"
        aria-hidden="true"
      >
        <defs>
          <filter id="road-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>
        {/* Branch: from spine (x=100) go right, u-turn (semicircle), then back to spine */}
        <path
          d="M 100 50 L 180 50 A 60 60 0 0 1 180 170 L 100 170"
          fill="none"
          stroke="#374151"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#road-shadow)"
        />
        {/* White dashed stripe along the u-turn */}
        <path
          d="M 100 50 L 180 50 A 60 60 0 0 1 180 170 L 100 170"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
      </svg>
      {/* Card positioned in the curve of the u-turn (right of center) */}
      <div className="relative z-10 mt-8 md:mt-0 md:absolute md:left-1/2 md:top-[50%] md:-translate-y-1/2 md:translate-x-[60px] w-full max-w-md md:w-[340px] px-4 md:px-0">
        <MilestoneCard
          milestone={milestone}
          isExpanded={isExpanded}
          isHighlighted={isHighlighted}
          onToggleExpand={onToggleExpand}
          onToggleSave={onToggleSave}
          isSaved={isSaved}
          side="right"
          audience={audience}
          featuredLink={featuredLink}
          featuredGlossary={featuredGlossary}
          hideConnector
        />
      </div>
    </div>
  );
}
