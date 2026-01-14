import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import HubDashboard from '../components/surrey-hub/HubDashboard';
import HarmonisationJourney from '../components/surrey-hub/HarmonisationJourney';
import CouncilDeepDive from '../components/surrey-hub/CouncilDeepDive';
import HousingJourney from '../components/surrey-hub/HousingJourney';
import ElectionForecast from '../components/surrey-hub/ElectionForecast';
import StrategicOracle from '../components/surrey-hub/StrategicOracle';
import SurreyHubPasswordProtection from '../components/SurreyHubPasswordProtection';
import type { ViewType } from '../data/surreyHubData';

interface SurreyHubProps {
  onNavigate: (page: string) => void;
}

export default function SurreyHub({ onNavigate: _onNavigate }: SurreyHubProps) {
  const [activeView, setActiveView] = useState<ViewType>('hub');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToHub = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView('hub');
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const startJourney = (journeyId: ViewType) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView(journeyId);
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView]);

  return (
    <SurreyHubPasswordProtection>
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
        <MetaTags
          title="Surrey Strategic Intelligence | Command Centre"
          description="Strategic Intelligence Portal for Surrey's Local Government Reorganisation. Interactive analysis of harmonisation, council deep dives, and election forecasts."
          keywords="Surrey intelligence, Surrey strategic analysis, Surrey reorganisation, Surrey LGR, Surrey councils"
        />

        {/* Global Navigation */}
        <nav className="fixed top-0 w-full z-[100] bg-slate-950/90 backdrop-blur border-b border-slate-800 h-16 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 flex justify-between items-center">
            <button
              onClick={goToHub}
              className="flex items-center gap-2 cursor-pointer"
              aria-label="Return to hub"
            >
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <h1 className="text-lg font-bold tracking-widest text-white">
                SURREY<span className="text-cyan-400">INTEL</span>
              </h1>
            </button>
            <div className="flex items-center gap-4">
              {activeView !== 'hub' && (
                <button
                  onClick={goToHub}
                  className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Command Centre</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* View Container */}
        <main className="relative">
          <div
            className={`transition-opacity duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {activeView === 'hub' && <HubDashboard onStartJourney={startJourney} />}
            {activeView === 'journey-harmonisation' && <HarmonisationJourney />}
            {activeView === 'journey-deepdive' && <CouncilDeepDive />}
            {activeView === 'journey-housing' && <HousingJourney />}
            {activeView === 'journey-election' && <ElectionForecast />}
          </div>
        </main>

        {/* Strategic Oracle Chat Widget - Always visible */}
        <StrategicOracle />
      </div>
    </SurreyHubPasswordProtection>
  );
}
