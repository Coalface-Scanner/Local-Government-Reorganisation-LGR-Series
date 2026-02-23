/**
 * Road with visible bends: the tarmac (road surface) follows a curved path.
 * White centre line follows the same curve.
 */
export default function BentRoad() {
  // Road centreline: bends right, then left, then right. Path stays in 52–148 so 96px stroke fits in viewBox 0 0 200.
  const roadPath =
    'M 100 0 ' +
    'Q 148 400 100 800 ' +
    'Q 52 1200 100 1600 ' +
    'Q 148 2000 100 2400';

  return (
    <div className="bent-road" aria-hidden="true">
      <svg
        className="bent-road__svg"
        viewBox="0 0 200 2400"
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
        </defs>
        {/* Road surface (tarmac): thick stroke so the actual road bends */}
        <path
          d={roadPath}
          fill="none"
          stroke="url(#bent-road-fill)"
          strokeWidth="96"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#bent-road-shadow)"
        />
        {/* Centre line: follows the same bend as the road */}
        <path
          d={roadPath}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeDasharray="12 12"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
