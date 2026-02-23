/**
 * Full-width data band – centrepiece hinge of the page. Dark charcoal, generous padding.
 */
export default function LGRDataStatementBlock() {
  return (
    <section
      className="w-full py-20 md:py-28 hyphens-none"
      style={{ backgroundColor: 'var(--lgr-data-band)' }}
      aria-label="Key facts"
    >
      <div className="layout-container layout-content-sub text-center">
        <p className="text-2xl md:text-4xl font-display font-bold text-white max-w-3xl mx-auto leading-tight mb-12">
          Most reorganisations take around two years from proposal to vesting day.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-display font-semibold text-white/95">
          <span className="whitespace-nowrap">18–30 months</span>
          <span className="text-white/50" aria-hidden>|</span>
          <span className="whitespace-nowrap">Structural Change Order</span>
          <span className="text-white/50" aria-hidden>|</span>
          <span className="whitespace-nowrap">Secretary of State decision</span>
        </div>
      </div>
    </section>
  );
}
