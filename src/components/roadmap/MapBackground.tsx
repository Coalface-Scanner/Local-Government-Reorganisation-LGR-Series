/**
 * Top-down illustrated map background: green landscape, winding local roads,
 * simple buildings, and trees. Styled to sit behind the main motorway (BentRoad).
 */
export default function MapBackground() {
  return (
    <div className="roadmap-map-bg" aria-hidden="true" role="presentation">
      <svg
        className="roadmap-map-bg__svg"
        viewBox="0 0 320 2400"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bg-grass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a8c49e" />
            <stop offset="30%" stopColor="#8fb87a" />
            <stop offset="60%" stopColor="#7aa86a" />
            <stop offset="100%" stopColor="#8fb87a" />
          </linearGradient>
          <linearGradient id="bg-grass-patch" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9abd88" />
            <stop offset="100%" stopColor="#7aa86a" />
          </linearGradient>
          <pattern id="grass-dots" patternUnits="userSpaceOnUse" width="8" height="8">
            <circle cx="2" cy="2" r="0.8" fill="#7aa86a" opacity="0.4" />
            <circle cx="6" cy="5" r="0.6" fill="#8fb87a" opacity="0.3" />
          </pattern>
        </defs>

        {/* Base: varied green landscape */}
        <rect width="320" height="2400" fill="url(#bg-grass)" />
        <rect width="320" height="2400" fill="url(#grass-dots)" opacity="0.6" />
        <ellipse cx="80" cy="400" rx="120" ry="200" fill="url(#bg-grass-patch)" opacity="0.5" />
        <ellipse cx="240" cy="1200" rx="100" ry="180" fill="url(#bg-grass-patch)" opacity="0.4" />
        <ellipse cx="60" cy="1800" rx="90" ry="160" fill="url(#bg-grass-patch)" opacity="0.5" />

        {/* Local roads: light grey, winding, with white dashed centre line */}
        <g stroke="#9ca3af" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 0 180 Q 50 200 40 400 Q 20 600 80 750 Q 120 850 60 1000 L 0 1100" />
          <path d="M 320 300 Q 260 400 280 600 Q 300 800 240 950 Q 200 1050 260 1200 L 320 1300" />
          <path d="M 20 1400 Q 100 1450 80 1650 Q 60 1850 120 2000 Q 160 2100 100 2250 L 40 2400" />
          <path d="M 300 1500 Q 220 1550 240 1750 Q 260 1950 200 2100 L 280 2250" />
        </g>
        <g stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeDasharray="6 8" fill="none">
          <path d="M 0 180 Q 50 200 40 400 Q 20 600 80 750 Q 120 850 60 1000 L 0 1100" />
          <path d="M 320 300 Q 260 400 280 600 Q 300 800 240 950 Q 200 1050 260 1200 L 320 1300" />
          <path d="M 20 1400 Q 100 1450 80 1650 Q 60 1850 120 2000 Q 160 2100 100 2250 L 40 2400" />
          <path d="M 300 1500 Q 220 1550 240 1750 Q 260 1950 200 2100 L 280 2250" />
        </g>

        {/* Trees: dark teal canopy, brown trunk */}
        {[
          [25, 350], [45, 520], [280, 450], [265, 620], [30, 900], [275, 880],
          [40, 1250], [270, 1180], [50, 1550], [260, 1520], [35, 1920], [278, 1880], [48, 2180],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y + 18} stroke="#8b6914" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={x} cy={y - 4} r={10} fill="#0f766e" stroke="#0d9488" strokeWidth="0.8" />
          </g>
        ))}

        {/* Bushes: light green organic shapes */}
        <ellipse cx="100" cy="320" rx="18" ry="12" fill="#7aa86a" opacity="0.85" />
        <ellipse cx="220" cy="720" rx="14" ry="10" fill="#8fb87a" opacity="0.8" />
        <ellipse cx="95" cy="1100" rx="16" ry="11" fill="#7aa86a" opacity="0.85" />
        <ellipse cx="230" cy="1420" rx="12" ry="9" fill="#8fb87a" opacity="0.8" />
        <ellipse cx="85" cy="1750" rx="15" ry="10" fill="#7aa86a" opacity="0.85" />

        {/* Buildings: blocky teal/blue-green and white */}
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8">
          <rect x="12" y="260" width="36" height="28" rx="1" />
          <rect x="18" y="268" width="8" height="6" fill="#0f766e" opacity="0.6" />
          <rect x="30" y="268" width="8" height="6" fill="#0f766e" opacity="0.6" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.6">
          <rect x="248" y="380" width="42" height="26" rx="1" />
          <text x="259" y="397" fontSize="8" fontWeight="bold" fill="#0369a1" fontFamily="system-ui,sans-serif">SHOP</text>
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8">
          <rect x="8" y="680" width="44" height="32" rx="1" />
          <rect x="14" y="688" width="10" height="8" fill="#0f766e" opacity="0.5" />
          <rect x="28" y="688" width="10" height="8" fill="#0f766e" opacity="0.5" />
          <rect x="14" y="700" width="10" height="8" fill="#0f766e" opacity="0.5" />
          <rect x="28" y="700" width="10" height="8" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.6">
          <rect x="252" y="1020" width="38" height="28" rx="1" />
          <path d="M 252 1020 L 271 1010 L 290 1020 Z" fill="#94a3b8" stroke="none" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8">
          <rect x="10" y="1320" width="28" height="40" rx="1" />
          <rect x="16" y="1328" width="5" height="6" fill="#0f766e" opacity="0.5" />
          <rect x="16" y="1338" width="5" height="6" fill="#0f766e" opacity="0.5" />
          <rect x="16" y="1348" width="5" height="6" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.6">
          <rect x="250" y="1680" width="36" height="28" rx="1" />
          <path d="M 268 1680 L 268 1668 L 284 1668 L 284 1680 Z" fill="#ef4444" stroke="none" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8">
          <rect x="14" y="2080" width="32" height="24" rx="1" />
          <rect x="20" y="2086" width="6" height="5" fill="#0f766e" opacity="0.5" />
          <rect x="20" y="2094" width="6" height="5" fill="#0f766e" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
