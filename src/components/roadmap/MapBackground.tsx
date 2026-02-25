/**
 * Top-down illustrated map background: green landscape, city clusters, villages,
 * winding local roads, and smaller village roads. Styled to sit behind the main motorway (BentRoad).
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
          <linearGradient id="bg-city-tint" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.05" />
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

        {/* Local roads (medium): light grey, winding, white dashed centre line */}
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

        {/* Smaller village roads (thin): connect villages and clusters */}
        <g stroke="#a8b4c0" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 35 420 Q 60 480 45 560 L 25 620" />
          <path d="M 270 520 Q 250 580 265 650 L 285 720" />
          <path d="M 50 780 Q 75 850 40 920 L 20 1000" />
          <path d="M 260 820 Q 240 880 255 960 L 275 1020" />
          <path d="M 30 1180 Q 55 1250 48 1320 L 35 1400" />
          <path d="M 278 1220 Q 258 1280 265 1360 L 272 1440" />
          <path d="M 42 1620 Q 68 1690 55 1760 L 38 1840" />
          <path d="M 268 1660 Q 248 1720 258 1800 L 272 1880" />
          <path d="M 40 2020 Q 65 2080 50 2160 L 32 2240" />
          <path d="M 262 1980 Q 245 2040 255 2120 L 268 2200" />
        </g>
        <g stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeDasharray="4 6" fill="none">
          <path d="M 35 420 Q 60 480 45 560 L 25 620" />
          <path d="M 270 520 Q 250 580 265 650 L 285 720" />
          <path d="M 50 780 Q 75 850 40 920 L 20 1000" />
          <path d="M 260 820 Q 240 880 255 960 L 275 1020" />
          <path d="M 30 1180 Q 55 1250 48 1320 L 35 1400" />
          <path d="M 278 1220 Q 258 1280 265 1360 L 272 1440" />
          <path d="M 42 1620 Q 68 1690 55 1760 L 38 1840" />
          <path d="M 268 1660 Q 248 1720 258 1800 L 272 1880" />
          <path d="M 40 2020 Q 65 2080 50 2160 L 32 2240" />
          <path d="M 262 1980 Q 245 2040 255 2120 L 268 2200" />
        </g>

        {/* City cluster 1 (left, y~300): dense, larger buildings */}
        <ellipse cx="55" cy="320" rx="65" ry="55" fill="url(#bg-city-tint)" />
        <g fill="#0f766e" stroke="#0d5c54" strokeWidth="0.8">
          <rect x="8" y="260" width="42" height="38" rx="1" />
          <rect x="14" y="268" width="10" height="8" fill="#0d5c54" opacity="0.5" />
          <rect x="28" y="268" width="10" height="8" fill="#0d5c54" opacity="0.5" />
          <rect x="42" y="268" width="5" height="8" fill="#0d5c54" opacity="0.5" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8">
          <rect x="22" y="245" width="36" height="32" rx="1" />
          <rect x="28" y="253" width="8" height="6" fill="#0f766e" opacity="0.5" />
          <rect x="42" y="253" width="8" height="6" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#0d9488" stroke="#0f766e" strokeWidth="0.7">
          <rect x="50" y="272" width="28" height="42" rx="1" />
          <rect x="56" y="282" width="5" height="6" fill="#0f766e" opacity="0.5" />
          <rect x="56" y="292" width="5" height="6" fill="#0f766e" opacity="0.5" />
        </g>

        {/* City cluster 2 (right, y~920): dense, larger buildings */}
        <ellipse cx="265" cy="940" rx="55" ry="65" fill="url(#bg-city-tint)" />
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8">
          <rect x="230" y="885" width="44" height="35" rx="1" />
          <rect x="236" y="893" width="10" height="8" fill="#0f766e" opacity="0.5" />
          <rect x="250" y="893" width="10" height="8" fill="#0f766e" opacity="0.5" />
          <rect x="264" y="893" width="6" height="8" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.6">
          <rect x="248" y="860" width="38" height="28" rx="1" />
          <text x="255" y="877" fontSize="7" fontWeight="bold" fill="#0369a1" fontFamily="system-ui,sans-serif">SHOP</text>
        </g>
        <g fill="#0f766e" stroke="#0d5c54" strokeWidth="0.8">
          <rect x="258" y="905" width="32" height="48" rx="1" />
          <rect x="264" y="915" width="5" height="6" fill="#0d5c54" opacity="0.5" />
          <rect x="264" y="927" width="5" height="6" fill="#0d5c54" opacity="0.5" />
          <rect x="264" y="939" width="5" height="6" fill="#0d5c54" opacity="0.5" />
        </g>

        {/* City cluster 3 (left, y~1520) */}
        <ellipse cx="50" cy="1540" rx="60" ry="60" fill="url(#bg-city-tint)" />
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8">
          <rect x="6" y="1490" width="40" height="36" rx="1" />
          <rect x="12" y="1498" width="10" height="8" fill="#0f766e" opacity="0.5" />
          <rect x="26" y="1498" width="10" height="8" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#0f766e" stroke="#0d5c54" strokeWidth="0.8">
          <rect x="20" y="1470" width="28" height="45" rx="1" />
          <rect x="26" y="1480" width="5" height="6" fill="#0d5c54" opacity="0.5" />
          <rect x="26" y="1492" width="5" height="6" fill="#0d5c54" opacity="0.5" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.6">
          <rect x="38" y="1510" width="34" height="26" rx="1" />
          <path d="M 38 1510 L 55 1500 L 72 1510 Z" fill="#94a3b8" stroke="none" />
        </g>

        {/* City cluster 4 (right, y~2120) */}
        <ellipse cx="268" cy="2140" rx="50" ry="55" fill="url(#bg-city-tint)" />
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8">
          <rect x="235" y="2095" width="38" height="32" rx="1" />
          <rect x="241" y="2103" width="8" height="6" fill="#0f766e" opacity="0.5" />
          <rect x="255" y="2103" width="8" height="6" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#0d9488" stroke="#0f766e" strokeWidth="0.7">
          <rect x="250" y="2120" width="26" height="40" rx="1" />
          <rect x="256" y="2130" width="5" height="6" fill="#0f766e" opacity="0.5" />
          <rect x="256" y="2142" width="5" height="6" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.6">
          <rect x="252" y="2165" width="32" height="24" rx="1" />
          <path d="M 268 2165 L 268 2153 L 284 2153 L 284 2165 Z" fill="#ef4444" stroke="none" />
        </g>

        {/* Villages: 12 smaller clusters (1-3 buildings each) */}
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="25" y="540" width="22" height="18" rx="1" />
          <rect x="28" y="546" width="5" height="4" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.5">
          <rect x="258" y="680" width="24" height="16" rx="1" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="20" y="760" width="20" height="22" rx="1" />
          <rect x="35" y="768" width="18" height="16" rx="1" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="248" y="1120" width="26" height="20" rx="1" />
          <rect x="252" y="1126" width="5" height="4" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="30" y="1280" width="18" height="24" rx="1" />
          <rect x="36" y="1288" width="5" height="5" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.5">
          <rect x="260" y="1580" width="22" height="18" rx="1" />
          <rect x="268" y="1550" width="14" height="20" rx="1" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="18" y="1700" width="24" height="18" rx="1" />
          <rect x="22" y="1706" width="5" height="4" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="252" y="1840" width="20" height="22" rx="1" />
        </g>
        <g fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="0.5">
          <rect x="28" y="1950" width="22" height="16" rx="1" />
          <rect x="35" y="1956" width="5" height="4" fill="#94a3b8" opacity="0.6" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="255" y="2280" width="26" height="20" rx="1" />
          <rect x="261" y="2286" width="5" height="4" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="22" y="2180" width="20" height="28" rx="1" />
          <rect x="28" y="2190" width="5" height="5" fill="#0f766e" opacity="0.5" />
        </g>
        <g fill="#14b8a6" stroke="#0f766e" strokeWidth="0.6">
          <rect x="35" y="1050" width="24" height="18" rx="1" />
        </g>

        {/* Trees: dark teal canopy, brown trunk */}
        {[
          [25, 350], [45, 520], [280, 450], [265, 620], [30, 900], [275, 880],
          [40, 1250], [270, 1180], [50, 1550], [260, 1520], [35, 1920], [278, 1880], [48, 2180],
          [265, 400], [20, 650], [285, 1050], [38, 1420], [272, 1720], [42, 2050],
        ].map(([x, y], i) => (
          <g key={`tree-${i}`}>
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
        <ellipse cx="250" cy="2020" rx="14" ry="9" fill="#8fb87a" opacity="0.8" />
        <ellipse cx="75" cy="2320" rx="12" ry="10" fill="#7aa86a" opacity="0.85" />
      </svg>
    </div>
  );
}
