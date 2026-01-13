import { useEffect, useRef, useState } from 'react';
import { councils, cohorts } from '../../data/surreyHubData';
import { generateBrief, simulateObjection } from '../../lib/aiStub';

export default function CouncilDeepDive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<SVGGElement>(null);
  const [activeCouncilId, setActiveCouncilId] = useState<string | null>(null);
  const [expandedBriefs, setExpandedBriefs] = useState<Record<string, boolean>>({});
  const [expandedSims, setExpandedSims] = useState<Record<string, boolean>>({});
  const [briefContent, setBriefContent] = useState<Record<string, string>>({});
  const [simContent, setSimContent] = useState<Record<string, string>>({});
  const [loadingBrief, setLoadingBrief] = useState<Record<string, boolean>>({});
  const [loadingSim, setLoadingSim] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!svgContainerRef.current) return;

    svgContainerRef.current.innerHTML = '';

    councils.forEach((council) => {
      if (!council.path) return;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', council.path);
      path.setAttribute('id', `path-${council.id}`);
      path.setAttribute('class', 'council-svg-path transition-all duration-500');
      path.setAttribute('fill', council.cohort === 'WEST' ? '#22d3ee' : '#34d399');
      path.setAttribute('fill-opacity', '0.1');
      path.setAttribute('stroke', council.cohort === 'WEST' ? '#22d3ee' : '#34d399');
      path.setAttribute('stroke-opacity', '0.3');
      svgContainerRef.current?.appendChild(path);
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id.replace('card-', '');
          const council = councils.find((c) => c.id === id);
          const activePath = document.getElementById(`path-${id}`);

          if (entry.isIntersecting) {
            setActiveCouncilId(id);
            entry.target.classList.remove('opacity-20', 'translate-x-10', 'grayscale');
            entry.target.classList.add('opacity-100', 'translate-x-0');

            document.querySelectorAll('.council-svg-path').forEach((p) => {
              p.setAttribute('fill-opacity', '0.05');
              p.setAttribute('stroke-opacity', '0.2');
              (p as SVGPathElement).style.transform = 'scale(1)';
            });

            if (activePath && council) {
              activePath.setAttribute('fill-opacity', '0.4');
              activePath.setAttribute('stroke', '#ffffff');
              activePath.setAttribute('stroke-opacity', '1');
              activePath.style.transformOrigin = `${council.cx}px ${council.cy}px`;
              activePath.style.transform = 'scale(1.1)';
            }
          } else {
            entry.target.classList.add('opacity-20', 'translate-x-10', 'grayscale');
            entry.target.classList.remove('opacity-100', 'translate-x-0');
          }
        });
      },
      { threshold: 0.5 }
    );

    const cards = containerRef.current.querySelectorAll('.deepdive-card');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  const handleGenerateBrief = async (councilId: string) => {
    const council = councils.find((c) => c.id === councilId);
    if (!council) return;

    if (expandedBriefs[councilId]) {
      setExpandedBriefs((prev) => ({ ...prev, [councilId]: false }));
      return;
    }

    setExpandedBriefs((prev) => ({ ...prev, [councilId]: true }));
    setLoadingBrief((prev) => ({ ...prev, [councilId]: true }));

    try {
      const content = await generateBrief(council);
      setBriefContent((prev) => ({ ...prev, [councilId]: content }));
    } catch (error) {
      setBriefContent((prev) => ({
        ...prev,
        [councilId]: 'Error generating brief. Please try again.',
      }));
    } finally {
      setLoadingBrief((prev) => ({ ...prev, [councilId]: false }));
    }
  };

  const handleSimulateObjection = async (councilId: string) => {
    const council = councils.find((c) => c.id === councilId);
    if (!council) return;

    if (expandedSims[councilId]) {
      setExpandedSims((prev) => ({ ...prev, [councilId]: false }));
      return;
    }

    setExpandedSims((prev) => ({ ...prev, [councilId]: true }));
    setLoadingSim((prev) => ({ ...prev, [councilId]: true }));

    try {
      const content = await simulateObjection(council);
      setSimContent((prev) => ({ ...prev, [councilId]: content }));
    } catch (error) {
      setSimContent((prev) => ({
        ...prev,
        [councilId]: 'Error simulating objection. Please try again.',
      }));
    } finally {
      setLoadingSim((prev) => ({ ...prev, [councilId]: false }));
    }
  };

  const activeCouncil = councils.find((c) => c.id === activeCouncilId);

  return (
    <section className="min-h-screen relative pt-20 px-4 md:px-8 bg-slate-950">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>
      <div className="pt-4 lg:flex relative z-10 gap-8 max-w-7xl mx-auto">
        <div className="hidden lg:block lg:w-5/12 lg:h-[80vh] lg:sticky lg:top-24 z-20">
          <div className="h-full rounded-3xl overflow-hidden border border-white/5 bg-slate-900/50 backdrop-blur-sm relative flex flex-col">
            <div className="absolute top-6 left-6 z-10">
              <h2 className="text-xl font-bold text-white tracking-wide">
                SURREY<span className="font-light text-slate-400">_MATRIX</span>
              </h2>
              <div className="flex gap-4 mt-2 text-[10px] font-bold tracking-widest uppercase">
                <span className="flex items-center gap-2 text-cyan-400">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                  West
                </span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  East
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              <svg
                viewBox="0 0 400 350"
                className="w-full h-full drop-shadow-2xl"
                id="surrey-svg-map"
              >
                <defs>
                  <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g
                  ref={svgContainerRef}
                  id="map-paths-container"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
              </svg>
            </div>
            <div className="p-6 border-t border-white/5 bg-black/20 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Active Asset</span>
                <div
                  id="map-asset-text"
                  className="text-sm text-emerald-400 font-medium truncate"
                >
                  {activeCouncil?.asset || 'Select Council...'}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold">
                  Active Liability
                </span>
                <div id="map-liability-text" className="text-sm text-rose-400 font-medium truncate">
                  {activeCouncil?.liability || '...'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-7/12 pb-32" ref={containerRef}>
          {councils.map((council) => {
            const cohort = cohorts[council.cohort];
            return (
              <div
                key={council.id}
                id={`card-${council.id}`}
                className="min-h-[80vh] flex flex-col justify-center py-12 transition-all duration-700 opacity-20 translate-x-10 grayscale deepdive-card"
              >
                <div
                  className={`glass-panel rounded-2xl p-8 shadow-2xl relative overflow-hidden group border-l-4 ${
                    council.cohort === 'WEST'
                      ? 'border-cyan-500'
                      : council.cohort === 'EAST'
                      ? 'border-emerald-500'
                      : 'border-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-slate-800 ${cohort.text} ${cohort.border}`}
                    >
                      {cohort.name}
                    </span>
                    {council.risk && (
                      <span className="text-xs font-bold text-slate-500">
                        {council.risk === 'Critical' ? '⚠️ CRITICAL' : council.risk}
                      </span>
                    )}
                  </div>
                  <h2 className="text-4xl font-light text-white mb-2">{council.name}</h2>
                  <p className={`text-lg font-medium italic ${cohort.text} mb-6`}>
                    &quot;{council.tagline}&quot;
                  </p>
                  <p className="text-slate-300 leading-relaxed mb-6">{council.desc}</p>
                  <div className="grid grid-cols-1 gap-3 mb-6">
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded flex justify-between">
                      <span className="text-[10px] uppercase text-emerald-400 font-bold">Asset</span>
                      <span className="text-sm text-emerald-100">{council.asset}</span>
                    </div>
                    <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded flex justify-between">
                      <span className="text-[10px] uppercase text-rose-400 font-bold">Liability</span>
                      <span className="text-sm text-rose-100">{council.liability}</span>
                    </div>
                  </div>
                  {council.id !== 'intro' && (
                    <>
                      <div className="flex gap-2 mb-4">
                        <button
                          onClick={() => handleGenerateBrief(council.id)}
                          className="flex-1 text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded border border-slate-600 transition"
                        >
                          📄 Strategic Profile
                        </button>
                        <button
                          onClick={() => handleSimulateObjection(council.id)}
                          className="flex-1 text-xs bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 px-4 py-2 rounded border border-rose-800 transition"
                        >
                          ✨ Predict Resistance
                        </button>
                      </div>
                      {expandedBriefs[council.id] && (
                        <div className="text-sm text-slate-300 prose prose-invert prose-sm bg-black/30 p-4 rounded mb-2">
                          {loadingBrief[council.id] ? (
                            <div className="animate-pulse text-xs text-cyan-400">
                              Decrypting Intelligence...
                            </div>
                          ) : (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: briefContent[council.id] || '',
                              }}
                            />
                          )}
                        </div>
                      )}
                      {expandedSims[council.id] && (
                        <div className="text-sm bg-black/30 p-4 rounded">
                          {loadingSim[council.id] ? (
                            <div className="animate-pulse text-xs text-rose-400">
                              Simulating Local Opposition...
                            </div>
                          ) : (
                            <div className="italic text-rose-300 border-l-2 border-rose-500 pl-3 mt-2">
                              &quot;{simContent[council.id]}&quot;
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
