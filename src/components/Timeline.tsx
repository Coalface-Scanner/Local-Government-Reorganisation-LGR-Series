import { useState } from 'react';
import { Calendar, CheckCircle, Clock, Play } from 'lucide-react';

interface TimelinePhase {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface AreaTimeline {
  area: string;
  description: string;
  finalProposals: string;
  decision: string;
  shadowElection: string;
  goLive: string;
  color: string;
}

const phases: TimelinePhase[] = [
  {
    name: 'Final proposals',
    icon: <Calendar size={20} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Decision',
    icon: <CheckCircle size={20} />,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    name: 'Shadow council',
    icon: <Clock size={20} />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    name: 'Go live',
    icon: <Play size={20} />,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  }
];

const timelines: AreaTimeline[] = [
  {
    area: 'Surrey',
    description: 'Single unitary authority',
    finalProposals: 'May 2025',
    decision: 'Autumn 2025',
    shadowElection: 'May 2026',
    goLive: 'May 2027',
    color: 'from-blue-500 to-blue-600'
  },
  {
    area: 'DPP',
    description: 'Devolution Priority Proposals',
    finalProposals: '26 Sept 2025',
    decision: 'Early 2026',
    shadowElection: 'May 2027',
    goLive: 'May 2028',
    color: 'from-green-500 to-green-600'
  },
  {
    area: 'Non-DPP',
    description: 'Non-Devolution Priority Proposals',
    finalProposals: '28 Nov 2025',
    decision: 'Spring 2026',
    shadowElection: 'May 2027',
    goLive: 'May 2028',
    color: 'from-amber-500 to-amber-600'
  }
];

export default function Timeline() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-lg border border-slate-200">
      <div className="mb-10">
        <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-sm font-semibold text-slate-700 mb-4">
          Implementation Timeline
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">
          What are the timescales?
        </h2>
        <p className="text-slate-600 text-lg">
          Three distinct pathways with different implementation schedules. Click any area to highlight its timeline.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {phases.map((phase, idx) => (
          <div key={idx} className="text-center">
            <div className={`inline-flex w-12 h-12 ${phase.bgColor} rounded-xl items-center justify-center mb-2 border-2 border-slate-200`}>
              <span className={phase.color}>{phase.icon}</span>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {phase.name}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {timelines.map((timeline, idx) => {
          const isSelected = selectedArea === timeline.area;
          const isOtherSelected = selectedArea && selectedArea !== timeline.area;

          return (
            <div
              key={timeline.area}
              className={`transition-all duration-300 ${
                isOtherSelected ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <button
                onClick={() => setSelectedArea(isSelected ? null : timeline.area)}
                className={`w-full text-left mb-4 p-4 rounded-xl transition-all duration-300 ${
                  isSelected ? 'bg-gradient-to-r ' + timeline.color + ' text-white shadow-lg scale-[1.02]' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {timeline.area}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                      {timeline.description}
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'bg-white/20' : 'bg-slate-200'
                  }`}>
                    <span className={`text-lg ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                      {isSelected ? '−' : '+'}
                    </span>
                  </div>
                </div>
              </button>

              <div className="relative bg-white rounded-xl p-4 md:p-6 border border-slate-200">
                <div className="hidden md:block absolute top-16 left-8 right-8 h-1 bg-gradient-to-r from-blue-200 via-green-200 via-amber-200 to-cyan-200 rounded-full opacity-40"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                  <div className="relative">
                    <div className={`${phases[0].bgColor} rounded-xl p-4 md:p-6 border-2 ${
                      isSelected ? 'border-blue-400 shadow-lg' : 'border-blue-200'
                    } transition-all duration-300`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-blue-400 shadow-sm`}>
                        <span className={phases[0].color}>{phases[0].icon}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                        {phases[0].name}
                      </div>
                      <div className={`text-base md:text-lg font-bold text-slate-900`}>
                        {timeline.finalProposals}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`${phases[1].bgColor} rounded-xl p-4 md:p-6 border-2 ${
                      isSelected ? 'border-green-400 shadow-lg' : 'border-green-200'
                    } transition-all duration-300`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-green-400 shadow-sm`}>
                        <span className={phases[1].color}>{phases[1].icon}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                        {phases[1].name}
                      </div>
                      <div className={`text-base md:text-lg font-bold text-slate-900`}>
                        {timeline.decision}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`${phases[2].bgColor} rounded-xl p-4 md:p-6 border-2 ${
                      isSelected ? 'border-amber-400 shadow-lg' : 'border-amber-200'
                    } transition-all duration-300`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-amber-400 shadow-sm`}>
                        <span className={phases[2].color}>{phases[2].icon}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                        {phases[2].name} election
                      </div>
                      <div className={`text-base md:text-lg font-bold text-slate-900`}>
                        {timeline.shadowElection}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className={`${phases[3].bgColor} rounded-xl p-4 md:p-6 border-2 ${
                      isSelected ? 'border-cyan-400 shadow-lg' : 'border-cyan-200'
                    } transition-all duration-300`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mb-3 border-2 border-cyan-400 shadow-sm`}>
                        <span className={phases[3].color}>{phases[3].icon}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                        {phases[3].name}
                      </div>
                      <div className={`text-base md:text-lg font-bold text-slate-900`}>
                        {timeline.goLive}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {idx < timelines.length - 1 && <div className="my-8"></div>}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-900">Note:</span> These timescales are approximate and subject to formal decision-making processes.
          Actual implementation dates may vary based on consultation outcomes, government decisions, and local circumstances.
        </p>
      </div>
    </div>
  );
}
