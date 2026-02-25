import { Car, Truck } from 'lucide-react';

const LANE_OFFSETS = [18, 50, 82]; // % from left within the 96px road (three lanes)

const COLOURS = [
  '#fde68a', '#fcd34d', '#fef3c7', '#fbbf24', '#f59e0b', '#f97316', '#ef4444',
  '#ec4899', '#f472b6', '#a78bfa', '#818cf8', '#3b82f6', '#0ea5e9', '#06b6d4',
  '#14b8a6', '#22c55e', '#84cc16', '#eab308', '#ffffff', '#fca5a5', '#93c5fd',
];

type VehicleDef = {
  type: 'car' | 'truck';
  lane: number;
  direction: 'up' | 'down';
  duration: number;
  delay: number;
  color: string;
};

/* Negative delays = start partway through the journey so cars are scattered along the road at load */
const VEHICLES: VehicleDef[] = [
  { type: 'car', lane: 0, direction: 'down', duration: 5.5, delay: 0, color: COLOURS[0] },
  { type: 'truck', lane: 1, direction: 'up', duration: 7, delay: -1.4, color: COLOURS[1] },
  { type: 'car', lane: 2, direction: 'down', duration: 5, delay: -3.2, color: COLOURS[2] },
  { type: 'car', lane: 0, direction: 'up', duration: 6.5, delay: -4.8, color: COLOURS[3] },
  { type: 'truck', lane: 2, direction: 'up', duration: 8, delay: -6.1, color: COLOURS[4] },
  { type: 'car', lane: 1, direction: 'down', duration: 5.8, delay: -2.1, color: COLOURS[5] },
  { type: 'truck', lane: 0, direction: 'down', duration: 7.5, delay: -5.5, color: COLOURS[6] },
  { type: 'car', lane: 2, direction: 'up', duration: 6, delay: -0.8, color: COLOURS[7] },
  { type: 'car', lane: 1, direction: 'up', duration: 6.8, delay: -3.6, color: COLOURS[8] },
  { type: 'car', lane: 0, direction: 'down', duration: 5.2, delay: -4.2, color: COLOURS[9] },
  { type: 'car', lane: 2, direction: 'up', duration: 7.2, delay: -6.8, color: COLOURS[10] },
  { type: 'truck', lane: 1, direction: 'down', duration: 8.2, delay: -2.5, color: COLOURS[11] },
  { type: 'car', lane: 0, direction: 'up', duration: 5.6, delay: -1.9, color: COLOURS[12] },
  { type: 'car', lane: 2, direction: 'down', duration: 6.2, delay: -5.1, color: COLOURS[13] },
  { type: 'car', lane: 1, direction: 'down', duration: 5.9, delay: -7.2, color: COLOURS[14] },
  { type: 'car', lane: 0, direction: 'down', duration: 7, delay: -0.4, color: COLOURS[15] },
  { type: 'car', lane: 2, direction: 'up', duration: 5.4, delay: -4.6, color: COLOURS[16] },
  { type: 'truck', lane: 1, direction: 'up', duration: 7.8, delay: -3.1, color: COLOURS[17] },
  { type: 'car', lane: 0, direction: 'up', duration: 6.4, delay: -6.2, color: COLOURS[18] },
  { type: 'car', lane: 2, direction: 'down', duration: 5.7, delay: -2.7, color: COLOURS[19] },
  { type: 'car', lane: 1, direction: 'up', duration: 6.6, delay: -5.4, color: COLOURS[20] },
  { type: 'car', lane: 0, direction: 'down', duration: 5.3, delay: -1.2, color: COLOURS[0] },
  { type: 'car', lane: 2, direction: 'up', duration: 6.1, delay: -4.0, color: COLOURS[4] },
  { type: 'car', lane: 1, direction: 'down', duration: 7.1, delay: -6.5, color: COLOURS[8] },
  { type: 'truck', lane: 0, direction: 'up', duration: 8.5, delay: -0.6, color: COLOURS[12] },
  { type: 'car', lane: 2, direction: 'down', duration: 5.1, delay: -3.8, color: COLOURS[16] },
];

export default function RoadVehicles() {
  return (
    <div className="road-vehicles" aria-hidden="true">
      {VEHICLES.map((v, i) => (
        <div
          key={i}
          className={`road-vehicle road-vehicle--${v.direction}`}
          style={
            {
              '--lane': LANE_OFFSETS[v.lane],
              '--duration': `${v.duration}s`,
              '--delay': `${v.delay}s`,
            } as React.CSSProperties
          }
        >
          {v.type === 'car' ? (
            <Car className="road-vehicle-icon road-vehicle-icon--car" strokeWidth={2.5} stroke={v.color} fill="none" />
          ) : (
            <Truck className="road-vehicle-icon road-vehicle-icon--truck" strokeWidth={2.5} stroke={v.color} fill="none" />
          )}
        </div>
      ))}
    </div>
  );
}
