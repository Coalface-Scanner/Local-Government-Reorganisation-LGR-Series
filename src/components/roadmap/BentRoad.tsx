/**
 * Straight road with consistent width, high-speed rail to the left.
 * Vehicles and train animate along their paths.
 */

import { useState, useEffect } from 'react';

/* Straight road for consistent width; rail to the right so both stay visible when scaled */
const ROAD_CENTER_X = 100;
const RAIL_X = 170;
const ROAD_PATH = `M ${ROAD_CENTER_X} 0 L ${ROAD_CENTER_X} 2400`;

const COLOURS = [
  '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#ef4444', '#ec4899',
  '#a78bfa', '#3b82f6', '#14b8a6', '#22c55e', '#eab308', '#fca5a5', '#93c5fd',
];

type VehicleDef = {
  type: 'car' | 'truck';
  direction: 'up' | 'down';
  duration: number;
  begin: number;
  color: string;
};

const VEHICLES: VehicleDef[] = [
  { type: 'car', direction: 'down', duration: 6, begin: 0, color: COLOURS[0] },
  { type: 'truck', direction: 'up', duration: 7.5, begin: -1.2, color: COLOURS[1] },
  { type: 'car', direction: 'down', duration: 5.5, begin: -2.8, color: COLOURS[2] },
  { type: 'car', direction: 'up', duration: 6.5, begin: -4.1, color: COLOURS[3] },
  { type: 'truck', direction: 'down', duration: 8, begin: -5.5, color: COLOURS[4] },
  { type: 'car', direction: 'up', duration: 6, begin: -0.6, color: COLOURS[5] },
  { type: 'car', direction: 'down', duration: 5.8, begin: -3.4, color: COLOURS[6] },
  { type: 'truck', direction: 'up', duration: 7.2, begin: -6.2, color: COLOURS[7] },
  { type: 'car', direction: 'down', duration: 6.2, begin: -2.1, color: COLOURS[8] },
  { type: 'car', direction: 'up', duration: 6.8, begin: -4.8, color: COLOURS[9] },
  { type: 'car', direction: 'down', duration: 5.4, begin: -1.5, color: COLOURS[10] },
  { type: 'truck', direction: 'up', duration: 7.8, begin: -5.2, color: COLOURS[11] },
  { type: 'car', direction: 'down', duration: 6.4, begin: -3.9, color: COLOURS[12] },
  { type: 'car', direction: 'up', duration: 5.9, begin: -0.3, color: COLOURS[0] },
];

function CarIcon({ color }: { color: string }) {
  return (
    <g transform="translate(-4,-6)" filter="url(#vehicle-shadow)">
      <rect x="0" y="2" width="8" height="5" rx="0.8" fill={color} stroke="#1f2937" strokeWidth="0.4" />
      <rect x="1.5" y="3.2" width="2" height="1.5" fill="#94a3b8" opacity="0.8" />
      <circle cx="2" cy="6.8" r="0.6" fill="#374151" />
      <circle cx="6" cy="6.8" r="0.6" fill="#374151" />
    </g>
  );
}

function TruckIcon({ color }: { color: string }) {
  return (
    <g transform="translate(-5,-7)" filter="url(#vehicle-shadow)">
      <rect x="0" y="2.5" width="6" height="4.5" rx="0.6" fill={color} stroke="#1f2937" strokeWidth="0.4" />
      <rect x="6" y="3" width="4" height="4" rx="0.6" fill={color} stroke="#1f2937" strokeWidth="0.4" />
      <rect x="6.5" y="3.8" width="1.5" height="1.2" fill="#94a3b8" opacity="0.8" />
      <circle cx="1.8" cy="6.5" r="0.7" fill="#374151" />
      <circle cx="5.2" cy="6.5" r="0.7" fill="#374151" />
      <circle cx="7.5" cy="6.5" r="0.7" fill="#374151" />
      <circle cx="9.2" cy="6.5" r="0.7" fill="#374151" />
    </g>
  );
}

/** Sleek high-speed train with prominent Surrey Express branding - width ~40, center at 20 */
function TrainIcon() {
  return (
    <g transform="translate(-20,-5)" filter="url(#vehicle-shadow)">
      {/* Streamlined nose + body */}
      <path d="M 0 6 L 4 6 L 8 4 L 8 2 L 26 2 L 26 10 L 8 10 L 8 8 Z" fill="#0f766e" stroke="#0d5c54" strokeWidth="0.4" />
      <rect x="26" y="3" width="14" height="7" rx="0.5" fill="#0f766e" stroke="#0d5c54" strokeWidth="0.3" />
      <circle cx="8" cy="9" r="0.7" fill="#475569" />
      <circle cx="18" cy="9" r="0.7" fill="#475569" />
      <circle cx="32" cy="9" r="0.7" fill="#475569" />
      <circle cx="38" cy="9" r="0.7" fill="#475569" />
      {/* Prominent SURREY EXPRESS label on train */}
      <rect x="4" y="4.5" width="22" height="3.5" rx="0.4" fill="#0d5c54" />
      <text x="15" y="6.7" fontSize="2.8" fontWeight="800" fill="white" fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="0.5">SURREY EXPRESS</text>
    </g>
  );
}

const STATIC_POINTS = [
  [100, 200], [100, 500], [100, 800], [100, 1100], [100, 1400], [100, 1700], [100, 2100],
  [100, 400], [100, 950], [100, 1500], [100, 2050],
  [100, 600], [100, 1250], [100, 1850],
];

export default function BentRoad() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="bent-road" aria-hidden="true">
      <svg
        className="bent-road__svg"
        viewBox="0 0 240 2400"
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bent-road-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="20%" stopColor="#374151" />
            <stop offset="50%" stopColor="#4b5563" />
            <stop offset="80%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <filter id="bent-road-shadow" x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
          </filter>
          <filter id="vehicle-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.4" />
          </filter>
          <path id="bent-road-motion-path" d={ROAD_PATH} fill="none" stroke="none" />
          <path id="rail-path" d={`M ${RAIL_X} 0 L ${RAIL_X} 2400`} fill="none" stroke="none" />
        </defs>
        {/* Static labels at top */}
        <text x={ROAD_CENTER_X} y={70} fontSize="7" fontWeight="bold" fill="#1f2937" fontFamily="system-ui,sans-serif" textAnchor="middle">Typical devolution program</text>
        {/* Prominent SURREY EXPRESS sign above rail */}
        <rect x={RAIL_X - 32} y={20} width={64} height={22} rx="3" fill="#0f766e" stroke="white" strokeWidth="2" />
        <text x={RAIL_X} y={35} fontSize="8" fontWeight="800" fill="white" fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="1">SURREY EXPRESS</text>

        {/* Three lanes: Surrey (dark grey), DPP (mid grey), Other (light grey) */}
        <rect x={ROAD_CENTER_X - 48} y={0} width={32} height={2400} fill="#374151" filter="url(#bent-road-shadow)" />
        <rect x={ROAD_CENTER_X - 16} y={0} width={32} height={2400} fill="#6b7280" filter="url(#bent-road-shadow)" />
        <rect x={ROAD_CENTER_X + 16} y={0} width={32} height={2400} fill="#9ca3af" filter="url(#bent-road-shadow)" />
        {/* Lane dividers */}
        <line x1={ROAD_CENTER_X - 16} y1={0} x2={ROAD_CENTER_X - 16} y2={2400} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <line x1={ROAD_CENTER_X + 16} y1={0} x2={ROAD_CENTER_X + 16} y2={2400} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        {/* Centre line */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="12 12" strokeLinecap="round" />
        {/* Cars and trucks animating along path */}
        {VEHICLES.map((v, i) => (
          <g
            key={i}
            className="road-vehicle-svg"
            transform={reducedMotion ? `translate(${STATIC_POINTS[i][0]}, ${STATIC_POINTS[i][1]})` : undefined}
          >
            {!reducedMotion && (v.direction === 'down' ? (
              <animateMotion dur={`${v.duration}s`} repeatCount="indefinite" rotate="auto" begin={`${v.begin}s`}>
                <mpath href="#bent-road-motion-path" />
              </animateMotion>
            ) : (
              <animateMotion dur={`${v.duration}s`} repeatCount="indefinite" rotate="auto" begin={`${v.begin}s`} keyPoints="1;0" keyTimes="0;1">
                <mpath href="#bent-road-motion-path" />
              </animateMotion>
            ))}
            {v.type === 'car' ? <CarIcon color={v.color} /> : <TruckIcon color={v.color} />}
          </g>
        ))}

        {/* Surrey Express high-speed rail + signposts along the line */}
        {[400, 1000, 1600, 2200].map((y) => (
          <g key={y}>
            <rect x={RAIL_X - 28} y={y - 12} width={56} height={18} rx="2" fill="#0f766e" stroke="white" strokeWidth="1.5" />
            <text x={RAIL_X} y={y} fontSize="6" fontWeight="800" fill="white" fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="0.5">SURREY EXPRESS</text>
          </g>
        ))}
        <path
          d={`M ${RAIL_X - 4} 0 L ${RAIL_X - 4} 2400`}
          fill="none"
          stroke="#0f766e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M ${RAIL_X + 4} 0 L ${RAIL_X + 4} 2400`}
          fill="none"
          stroke="#0f766e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {!reducedMotion && (
          <g className="road-vehicle-svg" transform="scale(2)">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              rotate="auto"
              begin="0s"
            >
              <mpath href="#rail-path" />
            </animateMotion>
            <TrainIcon />
          </g>
        )}
        {reducedMotion && (
          <g transform={`translate(${RAIL_X}, 1200) scale(2)`}>
            <TrainIcon />
          </g>
        )}
      </svg>
    </div>
  );
}
