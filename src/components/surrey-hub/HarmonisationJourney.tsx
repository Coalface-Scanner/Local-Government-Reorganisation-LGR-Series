import { useState } from 'react';
import { harmStages } from '../../data/surreyHubData';

export default function HarmonisationJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const currentStage = harmStages[activeStage];

  return (
    <section className="min-h-screen relative pt-20 pb-20 px-4 md:px-8">
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-3 lg:sticky lg:top-24 z-20">
          <div className="space-y-4">
            {harmStages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => setActiveStage(index)}
                className={`harm-btn w-full p-4 rounded-xl border ${
                  activeStage === index
                    ? 'active border-white/20 bg-white/10'
                    : 'border-transparent hover:border-white/10'
                } text-left text-sm text-slate-400 hover:text-white mb-2 flex gap-3 transition-all`}
              >
                <span className="font-bold bg-slate-800 w-6 h-6 flex items-center justify-center rounded">
                  {index + 1}
                </span>
                {stage.subtitle}
              </button>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm hidden lg:block">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-4">Risk Profile</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Political</span>
                <span className="text-white">High</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full">
                <div className="h-full bg-rose-500 w-[85%]"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Operational</span>
                <span className="text-white">Severe</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full">
                <div className="h-full bg-amber-500 w-[70%]"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-9">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300">
            <div className="relative p-8">
              <h2 className="text-3xl font-bold text-white mb-2">{currentStage.title}</h2>
              <div className="px-3 py-1 rounded border border-slate-500 inline-block text-xs uppercase font-bold mb-6 text-slate-300">
                {currentStage.risk} Risk
              </div>
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Political Risk</span>
                    <span>{currentStage.metrics.p}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded">
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${currentStage.metrics.p}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Operational Drag</span>
                    <span>{currentStage.metrics.o}%</span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${currentStage.metrics.o}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-slate-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                {currentStage.detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
