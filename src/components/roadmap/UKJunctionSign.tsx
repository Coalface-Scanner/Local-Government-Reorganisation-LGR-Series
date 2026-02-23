/**
 * UK motorway-style junction sign: blue background, white border,
 * destination, route, junction number in black box, distance, and junction arrow graphic.
 */
interface UKJunctionSignProps {
  junctionNumber: string;
  destination: string;
  route: string;
}

export default function UKJunctionSign({
  junctionNumber,
  destination,
  route,
}: UKJunctionSignProps) {
  return (
    <div className="uk-junction-sign">
      <div className="uk-junction-sign__content">
        <div className="uk-junction-sign__left">
          <div className="uk-junction-sign__destination">{destination}</div>
          <div className="uk-junction-sign__route">{route}</div>
          <div className="uk-junction-sign__bottom">
            <div className="uk-junction-sign__junction-box" aria-hidden="true">
              {junctionNumber}
            </div>
            <div className="uk-junction-sign__distance" aria-hidden="true">
              ½ m
            </div>
          </div>
        </div>
        <div className="uk-junction-sign__graphic" aria-hidden="true">
          <svg viewBox="0 0 48 64" className="uk-junction-sign__arrows" fill="white" stroke="none">
            {/* Main carriageway: vertical bar on the right */}
            <rect x="34" y="0" width="14" height="64" />
            {/* Exit ramp: diagonal bar diverging down-left */}
            <polygon points="34,14 34,28 12,56 8,60 12,56 26,32" />
          </svg>
        </div>
      </div>
    </div>
  );
}
