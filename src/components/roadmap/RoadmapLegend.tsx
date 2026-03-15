/**
 * Persistent floating legend showing wave-based programme sequencing.
 * Matches the wave banner colours used on milestone cards.
 */

export default function RoadmapLegend() {
  return (
    <div
      className="roadmap-legend fixed bottom-4 left-4 z-30 bg-white/95 backdrop-blur-sm border border-academic-neutral-200 rounded-xl shadow-lg p-4 text-xs font-display"
      role="complementary"
      aria-label="Programme sequencing legend"
    >
      <p className="font-bold text-academic-charcoal uppercase tracking-wider mb-2.5 text-[10px]">
        Programme waves
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-3 rounded-sm bg-teal-700 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-academic-charcoal">Wave 1 — Surrey Fast Track</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-3 rounded-sm bg-sky-700 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-academic-charcoal">Wave 2 — DPP Areas</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-3 rounded-sm bg-slate-600 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-academic-charcoal">Conditional Pipeline</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-3 rounded-sm shrink-0" style={{ background: 'linear-gradient(to right, #0f766e 33%, #0284c7 33%, #0284c7 66%, #475569 66%)' }} aria-hidden="true" />
          <span className="font-semibold text-academic-charcoal">All Areas</span>
        </div>
      </div>
    </div>
  );
}
