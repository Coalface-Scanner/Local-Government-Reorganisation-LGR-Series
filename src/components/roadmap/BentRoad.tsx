/**
 * Straight road with consistent width, high-speed rail to the right.
 * The Surrey Express rail is visually prominent to communicate Surrey's fast-track status.
 * Vehicles and train animate along their paths.
 */

import { useState, useEffect } from 'react';

const ROAD_CENTER_X = 80;
const RAIL_X = 165;
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

/** Sleek high-speed train with prominent Surrey Express branding */
function TrainIcon() {
  return (
    <g transform="translate(-24,-7)" filter="url(#vehicle-shadow)">
      {/* Streamlined nose + body */}
      <path d="M 0 8 L 5 8 L 10 5 L 10 3 L 32 3 L 32 13 L 10 13 L 10 11 Z" fill="#0f766e" stroke="#0d5c54" strokeWidth="0.5" />
      <rect x="32" y="4" width="16" height="9" rx="0.5" fill="#0f766e" stroke="#0d5c54" strokeWidth="0.4" />
      <circle cx="10" cy="12" r="1" fill="#475569" />
      <circle cx="22" cy="12" r="1" fill="#475569" />
      <circle cx="36" cy="12" r="1" fill="#475569" />
      <circle cx="44" cy="12" r="1" fill="#475569" />
      {/* Prominent SURREY EXPRESS label on train */}
      <rect x="5" y="5.5" width="27" height="5" rx="0.5" fill="#0d5c54" />
      <text x="18.5" y="9.2" fontSize="3.6" fontWeight="800" fill="white" fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="0.6">SURREY EXPRESS</text>
    </g>
  );
}

const STATIC_POINTS = [
  [80, 200], [80, 500], [80, 800], [80, 1100], [80, 1400], [80, 1700], [80, 2100],
  [80, 400], [80, 950], [80, 1500],
];

/** Y positions for the repeating Surrey Express signposts along the rail */
const SIGN_POSITIONS = [60, 350, 650, 950, 1250, 1550, 1850, 2150];

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
        viewBox="0 0 280 2400"
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
          {/* Glow effect for the fast-track rail */}
          <filter id="rail-glow" x="-100%" y="-5%" width="300%" height="110%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id="bent-road-motion-path" d={ROAD_PATH} fill="none" stroke="none" />
          <path id="rail-path" d={`M ${RAIL_X} 0 L ${RAIL_X} 2400`} fill="none" stroke="none" />
        </defs>

        {/* ── REGULAR ROAD (left side) ── */}
        {/* Road label */}
        <text x={ROAD_CENTER_X} y={30} fontSize="8" fontWeight="bold" fill="#475569" fontFamily="system-ui,sans-serif" textAnchor="middle" opacity="0.7">Standard programme</text>

        {/* Three lanes: Surrey (dark grey), DPP (mid grey), Other (light grey) */}
        <rect x={ROAD_CENTER_X - 48} y={0} width={32} height={2400} fill="#374151" filter="url(#bent-road-shadow)" />
        <rect x={ROAD_CENTER_X - 16} y={0} width={32} height={2400} fill="#6b7280" filter="url(#bent-road-shadow)" />
        <rect x={ROAD_CENTER_X + 16} y={0} width={32} height={2400} fill="#9ca3af" filter="url(#bent-road-shadow)" />
        {/* Lane dividers */}
        <line x1={ROAD_CENTER_X - 16} y1={0} x2={ROAD_CENTER_X - 16} y2={2400} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <line x1={ROAD_CENTER_X + 16} y1={0} x2={ROAD_CENTER_X + 16} y2={2400} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        {/* Centre dashed line */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="12 12" strokeLinecap="round" />

        {/* Cars and trucks on the road */}
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

        {/* ── SURREY EXPRESS FAST-TRACK RAIL (right side) ── */}

        {/* Teal glow strip behind the rail */}
        <rect x={RAIL_X - 16} y={0} width={32} height={2400} fill="#0f766e" opacity="0.12" filter="url(#rail-glow)" />

        {/* Rail bed (wider, more visible) */}
        <rect x={RAIL_X - 10} y={0} width={20} height={2400} fill="#0f766e" opacity="0.15" rx="2" />

        {/* Twin rail lines — thick and visible */}
        <path
          d={`M ${RAIL_X - 5} 0 L ${RAIL_X - 5} 2400`}
          fill="none"
          stroke="#0f766e"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={`M ${RAIL_X + 5} 0 L ${RAIL_X + 5} 2400`}
          fill="none"
          stroke="#0f766e"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Cross-ties (sleepers) every 30 units */}
        {Array.from({ length: 80 }, (_, i) => i * 30).map((y) => (
          <line key={y} x1={RAIL_X - 8} y1={y} x2={RAIL_X + 8} y2={y} stroke="#0d5c54" strokeWidth="2.5" opacity="0.6" />
        ))}

        {/* SURREY EXPRESS signposts — larger, more frequent, with arrows */}
        {SIGN_POSITIONS.map((y) => (
          <g key={y}>
            {/* Sign background — generous padding */}
            <rect x={RAIL_X - 44} y={y - 16} width={88} height={28} rx="3" fill="#0f766e" stroke="white" strokeWidth="2.5" />
            {/* Top line: SURREY EXPRESS */}
            <text x={RAIL_X} y={y - 2} fontSize="9" fontWeight="800" fill="white" fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="1">
              SURREY EXPRESS
            </text>
            {/* Bottom line: FAST TRACK */}
            <text x={RAIL_X} y={y + 9} fontSize="6" fontWeight="700" fill="#5eead4" fontFamily="system-ui,sans-serif" textAnchor="middle" letterSpacing="2">
              FAST TRACK ▸
            </text>
          </g>
        ))}

        {/* Animated train — larger scale */}
        {!reducedMotion && (
          <g className="road-vehicle-svg" transform="scale(2.5)">
            <animateMotion
              dur="10s"
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
          <g transform={`translate(${RAIL_X}, 1200) scale(2.5)`}>
            <TrainIcon />
          </g>
        )}
      </svg>
    </div>
  );
}
