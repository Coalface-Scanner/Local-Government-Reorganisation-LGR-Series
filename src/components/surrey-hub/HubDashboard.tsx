import { Zap, Map, Building2, Vote } from 'lucide-react';
import type { ViewType } from '../../data/surreyHubData';

interface HubDashboardProps {
  onStartJourney: (journeyId: ViewType) => void;
}

export default function HubDashboard({ onStartJourney }: HubDashboardProps) {
  return (
    <section className="min-h-screen pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Strategic Intelligence Portal
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Select a briefing to begin the immersive analysis journey.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARD 1: HARMONISATION */}
          <button
            onClick={() => onStartJourney('journey-harmonisation')}
            className="hub-card rounded-2xl p-8 group text-left"
            aria-label="Start Harmonisation Analysis Journey"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded border border-indigo-500/20">
                OPERATIONAL RISK
              </span>
              <Zap className="text-3xl grayscale group-hover:grayscale-0 transition" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-300 transition">
              Harmonisation Analysis
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Deep dive into "Day 1" risks: Tax equalisation, contract mergers, and cultural friction.
            </p>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
              <span>Begin Journey</span>
              <span>→</span>
            </div>
          </button>

          {/* CARD 2: COUNCIL DEEP DIVE */}
          <button
            onClick={() => onStartJourney('journey-deepdive')}
            className="hub-card rounded-2xl p-8 group border-emerald-500/30 text-left"
            aria-label="Start Council Deep Dive Journey"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded border border-emerald-500/20">
                STRATEGIC ASSETS
              </span>
              <Map className="text-3xl grayscale group-hover:grayscale-0 transition" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition">
              Council Deep Dive
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Interactive SVG map analysis of all 11 Boroughs. View assets, liabilities, and AI-generated executive briefs.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <span>Inspect Matrix</span>
              <span>→</span>
            </div>
          </button>

          {/* CARD 3: HOUSING */}
          <button
            onClick={() => onStartJourney('journey-housing')}
            className="hub-card rounded-2xl p-8 group text-left"
            aria-label="Start Grey Belt Revolution Journey"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="bg-green-500/10 text-green-400 text-xs font-bold px-3 py-1 rounded border border-green-500/20">
                INTERACTIVE MAP
              </span>
              <Building2 className="text-3xl grayscale group-hover:grayscale-0 transition" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-300 transition">
              Grey Belt Revolution
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Where will the 40,000 new homes go? Includes live Grey Belt Conflict Map.
            </p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
              <span>Begin Journey</span>
              <span>→</span>
            </div>
          </button>

          {/* CARD 4: ELECTION FORECAST */}
          <button
            onClick={() => onStartJourney('journey-election')}
            className="hub-card rounded-2xl p-8 group border-red-500/30 text-left"
            aria-label="Start Election Forecast Journey"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="bg-red-500/10 text-red-400 text-xs font-bold px-3 py-1 rounded border border-red-500/20">
                LIVE MODEL
              </span>
              <Vote className="text-3xl grayscale group-hover:grayscale-0 transition" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-300 transition">
              2027 Election Forecast
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Ward-by-ward political risk prediction model. Analyse the impact of the Tax Harmonisation shock.
            </p>
            <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
              <span>View Forecast</span>
              <span>→</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
