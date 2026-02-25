/**
 * Political Upheaval section styled as a weather forecast with animated thunderbolts.
 */

function ThunderboltIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export default function PoliticalWeatherReport() {
  return (
    <div className="political-weather-report relative z-20 my-8 md:my-12">
      {/* Animated thunderbolts around the edges */}
      <div className="political-weather-report__thunderbolts" aria-hidden="true">
        <div className="political-weather-report__bolt political-weather-report__bolt--tl"><ThunderboltIcon /></div>
        <div className="political-weather-report__bolt political-weather-report__bolt--tr"><ThunderboltIcon /></div>
        <div className="political-weather-report__bolt political-weather-report__bolt--ml"><ThunderboltIcon /></div>
        <div className="political-weather-report__bolt political-weather-report__bolt--mr"><ThunderboltIcon /></div>
        <div className="political-weather-report__bolt political-weather-report__bolt--bl"><ThunderboltIcon /></div>
        <div className="political-weather-report__bolt political-weather-report__bolt--br"><ThunderboltIcon /></div>
      </div>

      <div className="political-weather-report__screen">
        <div className="political-weather-report__banner">THE LGR WEATHER FORECAST</div>
        <div className="political-weather-report__content">
          <div className="political-weather-report__map">
            <div className="political-weather-report__storm-icon">
              <svg viewBox="0 0 64 48" fill="none" className="w-16 h-12" aria-hidden>
                <ellipse cx="32" cy="20" rx="24" ry="10" fill="#94a3b8" opacity="0.9" />
                <path
                  d="M34 8 L28 22 L32 22 L26 40 L36 24 L32 24 Z"
                  fill="#facc15"
                  className="political-weather-report__lightning"
                />
              </svg>
            </div>
          </div>
          <div className="political-weather-report__forecast">
            <h3 className="political-weather-report__title">Political Upheaval</h3>
            <p className="political-weather-report__desc">
              Decision making impacted by volatility as Councillors and Officers consider the future, and political uncertainty ahead for even experienced Councillors.
            </p>
            <div className="political-weather-report__badge">MAY 2026 ONWARD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
