import { Link } from 'react-router-dom';

/**
 * Slim band at the bottom of hub pages: deep teal background, white text,
 * directional line and "View the roadmap" button. Gives the page an exit with purpose.
 */
export default function HubCtaBand() {
  return (
    <div className="hub-cta-band" role="complementary" aria-label="Next step">
      <div className="hub-cta-band-inner">
        <p>Start with the roadmap to understand how reorganisation unfolds.</p>
        <Link to="/roadmap" className="hub-cta-band-button">
          View the roadmap
        </Link>
      </div>
    </div>
  );
}
