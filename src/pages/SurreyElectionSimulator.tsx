import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import MetaTags from '../components/MetaTags';
import { X } from 'lucide-react';

interface SurreyElectionSimulatorProps {
  onNavigate?: (page: string, data?: unknown) => void;
}

interface District {
  name: string;
  group: 'West' | 'East';
  composition: Record<string, number>;
}

const PARTIES = ['Con', 'LD', 'Res', 'Lab', 'Green', 'Ind', 'Other'] as const;

const PARTY_COLORS: Record<string, string> = {
  'Con': '#0087DC', 'LD': '#FAA61A', 'Res': '#6B7280',
  'Lab': '#E4003B', 'Green': '#02A95B', 'Ind': '#9CA3AF', 'Other': '#CBD5E1',
  'Empty': '#F1F5F9'
};

const PARTY_NAMES: Record<string, string> = {
  'Con': 'Conservative', 'LD': 'Lib Dem', 'Res': 'Residents',
  'Lab': 'Labour', 'Green': 'Green', 'Ind': 'Independent', 'Other': 'Other'
};

const districts: District[] = [
  { name: "Elmbridge", group: "East", composition: { Lab: 0, Con: 10, LD: 20, Green: 0, Ind: 0, Res: 1, Other: 17 } },
  { name: "Epsom & Ewell", group: "East", composition: { Lab: 3, Con: 2, LD: 3, Green: 0, Ind: 0, Res: 0, Other: 27 } },
  { name: "Guildford", group: "West", composition: { Lab: 3, Con: 10, LD: 25, Green: 0, Ind: 0, Res: 0, Other: 10 } },
  { name: "Mole Valley", group: "East", composition: { Lab: 0, Con: 2, LD: 31, Green: 0, Ind: 0, Res: 0, Other: 6 } },
  { name: "Reigate & Banstead", group: "East", composition: { Lab: 0, Con: 17, LD: 4, Green: 13, Ind: 0, Res: 0, Other: 11 } },
  { name: "Runnymede", group: "West", composition: { Lab: 8, Con: 12, LD: 6, Green: 3, Ind: 0, Res: 2, Other: 10 } },
  { name: "Spelthorne", group: "West", composition: { Lab: 7, Con: 15, LD: 10, Green: 1, Ind: 0, Res: 0, Other: 5 } },
  { name: "Surrey Heath", group: "West", composition: { Lab: 2, Con: 6, LD: 23, Green: 0, Ind: 0, Res: 0, Other: 4 } },
  { name: "Tandridge", group: "East", composition: { Lab: 0, Con: 5, LD: 12, Green: 0, Ind: 0, Res: 1, Other: 25 } },
  { name: "Waverley", group: "West", composition: { Lab: 0, Con: 11, LD: 24, Green: 1, Ind: 0, Res: 0, Other: 14 } },
  { name: "Woking", group: "West", composition: { Lab: 1, Con: 0, LD: 24, Green: 0, Ind: 0, Res: 0, Other: 5 } }
];

const countyCouncil = { composition: { Con: 47, LD: 16, Res: 13, Lab: 2, Green: 2, Ind: 1 } };

export default function SurreyElectionSimulator({ onNavigate }: SurreyElectionSimulatorProps) {
  const navigate = useNavigate();
  const handleNavigate = onNavigate || ((page: string) => navigate(`/${page}`));
  
  const [simulation, setSimulation] = useState({
    West: { target: 90, composition: { Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Ind: 0, Other: 0 } },
    East: { target: 76, composition: { Con: 0, LD: 0, Res: 0, Lab: 0, Green: 0, Ind: 0, Other: 0 } }
  });
  
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chartsRef = useRef<Record<string, Chart>>({});

  // Initialize charts when component mounts and when data changes
  useEffect(() => {
    initCharts();

    // Cleanup on unmount
    return () => {
      Object.values(chartsRef.current).forEach((chart) => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    };
  }, [simulation, isModalOpen, selectedDistrict]);

  const initCharts = () => {
    // Destroy existing charts
    Object.values(chartsRef.current).forEach((chart) => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    chartsRef.current = {};

    // Render aggregates
    const aggregates = calculateAggregates();
    renderAggregateChart('aggWestChart', aggregates.West);
    renderAggregateChart('aggEastChart', aggregates.East);

    // Render simulator charts
    renderSimChart('simWestChart', 'West');
    renderSimChart('simEastChart', 'East');

    // Render reference charts
    renderReferenceChart('countyChart', countyCouncil.composition);

    // Render modal chart if open
    if (isModalOpen && selectedDistrict) {
      renderReferenceChart('modalChart', selectedDistrict.composition);
    }
  };

  const calculateAggregates = () => {
    const west = { total: 0, composition: {} as Record<string, number> };
    const east = { total: 0, composition: {} as Record<string, number> };

    PARTIES.forEach(p => {
      west.composition[p] = 0;
      east.composition[p] = 0;
    });

    districts.forEach(d => {
      const target = d.group === 'West' ? west : east;
      Object.entries(d.composition).forEach(([p, count]) => {
        target.composition[p] = (target.composition[p] || 0) + count;
        target.total += count;
      });
    });

    return { West: west, East: east };
  };

  const renderAggregateChart = (canvasId: string, data: { total: number; composition: Record<string, number> }) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = Object.keys(data.composition).filter(k => data.composition[k] > 0);
    const values = labels.map(l => data.composition[l]);
    const colors = labels.map(l => PARTY_COLORS[l] || '#CBD5E1');

    chartsRef.current[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        animation: { duration: 400 }
      }
    });
  };

  const renderSimChart = (canvasId: string, side: 'West' | 'East') => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const simData = simulation[side];
    const filled = Object.values(simData.composition).reduce((a, b) => a + b, 0);
    const remaining = simData.target - filled;

    const chartData = { ...simData.composition };
    if (remaining > 0) chartData['Empty'] = remaining;

    const labels = Object.keys(chartData).filter(k => chartData[k] > 0);
    const values = labels.map(l => chartData[l]);
    const colors = labels.map(l => PARTY_COLORS[l] || '#CBD5E1');

    chartsRef.current[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        animation: { duration: 400 }
      }
    });
  };

  const renderReferenceChart = (canvasId: string, composition: Record<string, number>) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sorted = Object.entries(composition).sort((a, b) => b[1] - a[1]);
    const labels = sorted.map(x => PARTY_NAMES[x[0]]);
    const values = sorted.map(x => x[1]);
    const colors = sorted.map(x => PARTY_COLORS[x[0]]);

    chartsRef.current[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        animation: { duration: 400 }
      }
    });
  };

  const updateSim = (side: 'West' | 'East', party: string, change: number) => {
    setSimulation(prev => {
      const simData = prev[side];
      const currentVal = simData.composition[party];
      const totalFilled = Object.values(simData.composition).reduce((a, b) => a + b, 0);

      if (change > 0 && totalFilled >= simData.target) return prev;
      if (change < 0 && currentVal <= 0) return prev;

      return {
        ...prev,
        [side]: {
          ...simData,
          composition: {
            ...simData.composition,
            [party]: currentVal + change
          }
        }
      };
    });
  };

  const openDistrictModal = (name: string) => {
    const district = districts.find(d => d.name === name);
    if (district) {
      setSelectedDistrict(district);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDistrict(null);
  };

  const aggregates = calculateAggregates();

  const getSimRemaining = (side: 'West' | 'East') => {
    const simData = simulation[side];
    const filled = Object.values(simData.composition).reduce((a, b) => a + b, 0);
    return simData.target - filled;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <MetaTags
        title="Surrey Election Simulator - LGR Modeller"
        description="Interactive seat planner for Surrey's local government reorganisation. Model election outcomes for East and West Surrey unitary authorities."
        keywords="Surrey election simulator, Surrey LGR modeller, election planning, Surrey reorganisation"
      />

      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Surrey <span className="text-yellow-400">LGR Modeller</span>
            </h1>
            <p className="text-slate-400 text-sm">Interactive Seat Planner</p>
          </div>
          <div className="hidden md:block text-right text-xs text-slate-500">
            v3.0 • Simulation Mode
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        {/* SECTION 1: AGGREGATE */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-600 w-1.5 h-6 rounded-full"></span>
            <h2 className="text-xl font-bold text-slate-800">1. Current Aggregate Totals</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6 -mt-2 ml-4">
            Mathematically combining existing district councillors. (Reference Only)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* West Agg */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-700">West Surrey (Current)</h3>
                <span className="text-xs bg-white border px-2 py-1 rounded text-slate-500">From 6 Districts</span>
              </div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-slate-800">{aggregates.West.total}</span>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Total Cllrs</span>
                  </div>
                </div>
                <div className="w-2/3 relative" style={{ height: '200px' }}>
                  <canvas id="aggWestChart"></canvas>
                </div>
              </div>
            </div>

            {/* East Agg */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-700">East Surrey (Current)</h3>
                <span className="text-xs bg-white border px-2 py-1 rounded text-slate-500">From 5 Districts</span>
              </div>
              <div className="flex items-center">
                <div className="w-1/3">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-slate-800">{aggregates.East.total}</span>
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Total Cllrs</span>
                  </div>
                </div>
                <div className="w-2/3 relative" style={{ height: '200px' }}>
                  <canvas id="aggEastChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="flex items-center my-8 text-slate-400 text-sm font-semibold uppercase tracking-wider">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="px-4">Election Simulator (Adjustable)</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* SECTION 2: SIMULATOR */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-yellow-500 w-1.5 h-6 rounded-full"></span>
            <h2 className="text-xl font-bold text-slate-800">2. New Council Projection</h2>
          </div>
          <p className="text-sm text-slate-500 mb-6 -mt-2 ml-4">
            Fill the seats for the new unitary authorities.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SIMULATOR: WEST SURREY */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-yellow-400 border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">West Surrey</h3>
                  <p className="text-sm text-slate-500">
                    Target: <span className="font-bold text-slate-800">90 Seats</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-bold text-yellow-500">{getSimRemaining('West')}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Unassigned</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="relative flex items-center justify-center" style={{ height: '250px' }}>
                  <canvas id="simWestChart"></canvas>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <span className="block text-sm font-bold text-slate-400 uppercase">Majority</span>
                      <span className="block text-xl font-bold text-slate-700">46</span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2">
                  {PARTIES.map(party => (
                    <div
                      key={party}
                      className="flex items-center justify-between bg-white p-2 rounded border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: PARTY_COLORS[party] }}
                        ></span>
                        <span className="text-sm font-semibold text-slate-700">{PARTY_NAMES[party]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold cursor-pointer bg-red-50 text-red-900 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                          onClick={() => updateSim('West', party, -1)}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-slate-800">
                          {simulation.West.composition[party]}
                        </span>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold cursor-pointer bg-green-50 text-green-900 hover:bg-green-500 hover:text-white transition-all active:scale-95"
                          onClick={() => updateSim('West', party, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIMULATOR: EAST SURREY */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-yellow-400 border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">East Surrey</h3>
                  <p className="text-sm text-slate-500">
                    Target: <span className="font-bold text-slate-800">76 Seats</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-bold text-yellow-500">{getSimRemaining('East')}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Unassigned</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="relative flex items-center justify-center" style={{ height: '250px' }}>
                  <canvas id="simEastChart"></canvas>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <span className="block text-sm font-bold text-slate-400 uppercase">Majority</span>
                      <span className="block text-xl font-bold text-slate-700">39</span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2">
                  {PARTIES.map(party => (
                    <div
                      key={party}
                      className="flex items-center justify-between bg-white p-2 rounded border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: PARTY_COLORS[party] }}
                        ></span>
                        <span className="text-sm font-semibold text-slate-700">{PARTY_NAMES[party]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold cursor-pointer bg-red-50 text-red-900 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                          onClick={() => updateSim('East', party, -1)}
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-slate-800">
                          {simulation.East.composition[party]}
                        </span>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded text-xs font-bold cursor-pointer bg-green-50 text-green-900 hover:bg-green-500 hover:text-white transition-all active:scale-95"
                          onClick={() => updateSim('East', party, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="flex items-center my-8 text-slate-400 text-sm font-semibold uppercase tracking-wider">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="px-4">Reference Data (Read Only)</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* SECTION 3: REFERENCE */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 ml-4">3. Existing Councils</h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* County Council */}
            <div className="lg:col-span-1 bg-white rounded-xl p-4 shadow-sm border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-700 text-sm mb-2">Surrey County Council</h4>
              <div className="relative mb-2" style={{ height: '128px' }}>
                <canvas id="countyChart"></canvas>
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                {Object.entries(countyCouncil.composition)
                  .sort((a, b) => b[1] - a[1])
                  .map(([p, c]) => (
                    <div key={p} className="flex justify-between">
                      <span>{PARTY_NAMES[p]}</span>
                      <span className="font-bold">{c}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Districts */}
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {districts.map(d => {
                const total = Object.values(d.composition).reduce((a, b) => a + b, 0);
                const lead = Object.entries(d.composition).sort((a, b) => b[1] - a[1])[0];
                const magic = Math.floor(total / 2) + 1;
                const control = lead[1] >= magic ? PARTY_NAMES[lead[0]] : "NOC";
                const color = lead[1] >= magic ? PARTY_COLORS[lead[0]] : "#94A3B8";

                return (
                  <div
                    key={d.name}
                    className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
                    onClick={() => openDistrictModal(d.name)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{d.group}</span>
                      <div className="h-2 w-2 rounded-full" style={{ background: color }}></div>
                    </div>
                    <h4 className="font-bold text-slate-800">{d.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{control}</p>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      {Object.entries(d.composition)
                        .sort((a, b) => b[1] - a[1])
                        .map(([p, c]) => {
                          const pct = (c / total) * 100;
                          return (
                            <div
                              key={p}
                              style={{ width: `${pct}%`, background: PARTY_COLORS[p] }}
                            ></div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* DETAILS MODAL */}
      {isModalOpen && selectedDistrict && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedDistrict.name}</h2>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">
                  {selectedDistrict.group} Surrey • Current Composition
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="relative mb-6" style={{ height: '250px' }}>
                <canvas id="modalChart"></canvas>
              </div>

              <h4 className="text-sm font-bold text-slate-400 uppercase mb-3 border-b pb-1">
                Current Composition
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {Object.entries(selectedDistrict.composition)
                  .sort((a, b) => b[1] - a[1])
                  .map(([p, count]) => (
                    <div
                      key={p}
                      className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: PARTY_COLORS[p] }}
                        ></span>
                        <span className="text-sm font-medium text-slate-700">{PARTY_NAMES[p]}</span>
                      </div>
                      <span className="font-bold text-slate-800">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

