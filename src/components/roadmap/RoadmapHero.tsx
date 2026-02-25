import { Link } from 'react-router-dom';
import { MapPin, Layers } from 'lucide-react';

interface RoadmapHeroProps {
  onStartJourney: () => void;
  onBrowseByTopic: () => void;
}

export default function RoadmapHero({ onStartJourney, onBrowseByTopic }: RoadmapHeroProps) {
  return (
    <section className="bg-academic-warm/80 border-b border-academic-neutral-200">
      <div className="layout-container py-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onStartJourney}
            className="academic-button inline-flex items-center gap-2 bg-teal-600 text-white hover:bg-teal-700 border-teal-700"
          >
            <MapPin size={18} aria-hidden="true" />
            Start the Journey
          </button>
          <button
            type="button"
            onClick={onBrowseByTopic}
            className="academic-button academic-button-outline inline-flex items-center gap-2"
          >
            <Layers size={18} aria-hidden="true" />
            Browse by Topic
          </button>
          <Link
            to="/lgr-hub"
            className="text-academic-sm text-academic-neutral-600 hover:text-teal-700 font-serif"
          >
            ← Back to LGR Hub
          </Link>
        </div>
      </div>
    </section>
  );
}
