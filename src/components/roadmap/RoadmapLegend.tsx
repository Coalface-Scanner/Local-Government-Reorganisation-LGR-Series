/**
 * Persistent legend showing programme sequencing: Surrey, DPP, Other areas.
 */

export default function RoadmapLegend() {
  return (
    <div
      className="roadmap-legend fixed bottom-4 left-4 z-30 bg-white/95 backdrop-blur-sm border border-academic-neutral-200 rounded-lg shadow-lg p-3 text-xs font-medium"
      role="complementary"
      aria-label="Programme sequencing legend"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="roadmap-legend__swatch roadmap-legend__swatch--surrey" aria-hidden />
          <span>Surrey – Live Prototype</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="roadmap-legend__swatch roadmap-legend__swatch--dpp" aria-hidden />
          <span>DPP Areas – Structured Rollout</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="roadmap-legend__swatch roadmap-legend__swatch--other" aria-hidden />
          <span>Other Areas – Conditional Pipeline</span>
        </div>
      </div>
    </div>
  );
}
