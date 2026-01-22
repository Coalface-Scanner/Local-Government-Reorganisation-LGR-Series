import { useEffect, useRef } from 'react';
import {
  AlertCircle,
  Map,
  CloudLightning,
  Shuffle,
  CheckCircle2,
  AlertTriangle,
  Hammer,
  ScrollText,
  Lock,
  Building2,
  Fuel,
  PoundSterling,
  Calendar,
  Flag,
  ArrowDown
} from 'lucide-react';
import MetaTags from '../components/MetaTags';

interface JourneyMapProps {
  onNavigate: (page: string) => void;
}

export default function JourneyMap({ onNavigate: _onNavigate }: JourneyMapProps) {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    observerRef.current = observer;

    const currentRefs = revealRefs.current;
    currentRefs.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      if (observerRef.current) {
        currentRefs.forEach(el => {
          if (el) observerRef.current?.unobserve(el);
        });
      }
    };
  }, []);

  const addToRevealRefs = (el: HTMLDivElement | null, index: number) => {
    revealRefs.current[index] = el;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-50/40 to-slate-50 bg-fixed">
      <MetaTags
        title="LGR Forecast 2026-27: The Journey Map"
        description="Interactive forecast visualization of Local Government Reorganisation from 2026 to 2027. Navigate the key milestones, decisions, and transitions."
        keywords="LGR forecast, local government reorganisation 2026, LGR journey map, unitary authority timeline, shadow elections, structural changes orders"
      />

      {/* Hero Header */}
      <header className="bg-slate-900 text-white py-12 px-6 text-center border-b-8 border-yellow-400">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block bg-yellow-400 text-black font-bold px-3 py-1 rounded mb-4 transform -rotate-1">FORECAST</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            LGR Journey Map <span className="text-blue-400">2026-27</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Navigating the twisting highway of Local Government Reorganisation over the next 12 months.
          </p>
        </div>
      </header>

      <main className="relative max-w-[1000px] mx-auto px-5 py-10">
        {/* The Road Background */}
        <div className="road-line"></div>
        <div className="road-stripes"></div>

        {/* ZONE 1: STARTING GATES */}
        <div className="relative py-12">
          <div className="flex justify-center mb-8 reveal" ref={(el) => addToRevealRefs(el, 0)}>
            <div className="highway-sign px-8 py-4 text-xl">
              Zone 1: The Departure <br />
              <span className="text-sm font-normal text-green-100 opacity-80">Q1 2026 (Jan - Mar)</span>
            </div>
          </div>

          {/* Jan 15 Decision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="md:text-right reveal left-card relative" ref={(el) => addToRevealRefs(el, 1)}>
              <div className="connector"></div>
              <div className="milestone-card border-l-orange-500">
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-2 rounded-full shadow-lg">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">The "Capacity" Toll Booth</h3>
                <p className="text-sm text-slate-500 font-semibold mb-2">Jan/Feb 2026</p>
                <p className="text-slate-600">Secretary of State decides on election delays. 63 councils face the fork in the road.</p>
                <div className="mt-3 bg-orange-50 text-orange-800 text-xs px-2 py-1 rounded inline-block">Deadline: 15 Jan 2026</div>
              </div>
            </div>
            <div className="hidden md:block"></div>
          </div>

          {/* Mapping Decisions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="hidden md:block"></div>
            <div className="reveal right-card relative" ref={(el) => addToRevealRefs(el, 2)}>
              <div className="connector"></div>
              <div className="milestone-card border-l-blue-600">
                <div className="absolute -top-4 -left-4 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <Map className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Mapping the Future</h3>
                <p className="text-sm text-slate-500 font-semibold mb-2">Target: Spring 2026</p>
                <p className="text-slate-600">Unitary map options announced for DPP areas (Essex, Hants, Sussex, Norfolk, Suffolk).</p>
              </div>
            </div>
          </div>
        </div>

        {/* POLITICAL TURBULENCE INTERLUDE */}
        <div className="reveal turbulence-zone relative z-20" ref={(el) => addToRevealRefs(el, 3)}>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-slate-700 text-white p-3 rounded-full mb-2 shadow-lg animate-pulse">
              <CloudLightning className="w-8 h-8 text-yellow-300" />
            </div>
            <h3 className="text-slate-700 font-bold text-lg uppercase tracking-wide">Political Upheaval</h3>
            <p className="text-slate-600 text-sm max-w-md">
              Decision making impacted by planning volatility and political uncertainty ahead of the split.
            </p>
          </div>
        </div>

        {/* ZONE 2: SURREY PROTOTYPE */}
        <div className="relative py-12">
          {/* Route Diversion Sign */}
          <div className="flex justify-center mb-6 reveal" ref={(el) => addToRevealRefs(el, 4)}>
            <div className="diversion-sign p-4 transform -rotate-1 shadow-xl bg-yellow-400 text-black border-black border-4 relative z-30">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1 border-b-2 border-black pb-1 w-full justify-center">
                  <Shuffle className="w-6 h-6" />
                  <span className="text-lg">ROUTE DIVERSION</span>
                </div>
                <div className="text-sm font-bold text-center">
                  CANCELLED ELECTIONS<br />
                  <span className="text-xs font-normal">Most traffic diverted to 2027/28</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8 reveal" ref={(el) => addToRevealRefs(el, 5)}>
            <div className="highway-sign px-8 py-4 text-xl bg-blue-800 border-blue-200">
              Zone 2: The Split Road <br />
              <span className="text-sm font-normal text-blue-200 opacity-80">May 2026</span>
            </div>
          </div>

          {/* The Split: Express Lane vs Service Road */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 relative">
            {/* Surrey Express Lane */}
            <div className="reveal" ref={(el) => addToRevealRefs(el, 6)}>
              <div className="bg-green-50 border-4 border-green-500 rounded-xl p-6 shadow-xl relative transform md:-rotate-1 hover:rotate-0 transition duration-300">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded font-bold uppercase text-xs tracking-wider">
                  Surrey Express Lane
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="text-green-600 w-8 h-8" />
                  <h3 className="text-lg font-bold text-green-900">Shadow Elections Live</h3>
                </div>
                <p className="text-sm text-green-800 mb-2">
                  <strong>May 7, 2026:</strong> East & West Surrey elect Shadow Authorities.
                </p>
                <ul className="text-xs text-green-700 list-disc ml-4 space-y-1">
                  <li>Immediate "First 100 Days" plan</li>
                  <li>Appoint Statutory Officers (S151, MO)</li>
                  <li>Adopt single Scheme of Delegation</li>
                </ul>
              </div>
            </div>

            {/* Lame Duck Service Road */}
            <div className="reveal mt-8 md:mt-0 relative" ref={(el) => addToRevealRefs(el, 7)}>
              {/* Dead End Visual (Hidden on mobile) */}
              <div className="hidden md:block dead-end-road">
                <div className="dead-end-sign">DEAD END</div>
              </div>

              <div className="bg-gray-100 border-4 border-dashed border-gray-400 rounded-xl p-6 shadow-none opacity-90 relative">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white px-4 py-1 rounded font-bold uppercase text-xs tracking-wider">
                  The "Lame Duck" Lane
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="text-yellow-600 w-8 h-8" />
                  <h3 className="text-lg font-bold text-gray-700">Existing Councils</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Councillors lose incentive. Risk of "Maverick" voting.</p>
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-xs border border-yellow-200">
                  <strong>Warning:</strong> High volatility in Planning Committees expected.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OPERATIONAL REALITY BREAK */}
        <div className="reveal my-12" ref={(el) => addToRevealRefs(el, 8)}>
          <div className="bg-slate-800 text-slate-200 p-6 rounded-lg border-l-8 border-yellow-400 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="construction-tape absolute top-0 left-0 w-full h-2"></div>
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400 p-2 rounded text-black shrink-0">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Operational Reality Check: Throughout 2026</h4>
                <p className="text-sm text-slate-300 mt-1">While politics move fast, the machine grinds slowly.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-700 p-3 rounded">
                    <strong className="text-yellow-400 block text-xs uppercase mb-1">Tech Strategy</strong>
                    <span className="text-xs">"Lift and Drop" tactics only. No true digital integration yet.</span>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <strong className="text-red-400 block text-xs uppercase mb-1">Workforce</strong>
                    <span className="text-xs">Major "Brain Drain" in Planning/Legal. Staff churn ~50%.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="construction-tape absolute bottom-0 left-0 w-full h-2"></div>
          </div>
        </div>

        {/* ZONE 3: LEGISLATIVE BRIDGE */}
        <div className="relative py-12">
          <div className="flex justify-center mb-8 reveal" ref={(el) => addToRevealRefs(el, 9)}>
            <div className="highway-sign px-8 py-4 text-xl bg-indigo-900 border-indigo-300">
              Zone 3: The Legislative Bridge <br />
              <span className="text-sm font-normal text-indigo-200 opacity-80">Mid - Late 2026</span>
            </div>
          </div>

          {/* SCOs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="md:text-right reveal left-card relative" ref={(el) => addToRevealRefs(el, 10)}>
              <div className="connector"></div>
              <div className="milestone-card border-l-purple-600">
                <div className="absolute -top-4 -right-4 bg-purple-600 text-white p-2 rounded-full shadow-lg">
                  <ScrollText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Structural Changes Orders</h3>
                <p className="text-slate-600 text-sm mt-2">
                  Secondary legislation laid in Parliament legally creating new unitaries for 2028.
                </p>
                <div className="mt-3 flex justify-end gap-2">
                  <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Section 24 Restrictions Active
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block"></div>
          </div>

          {/* Shadow Bodies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="hidden md:block"></div>
            <div className="reveal right-card relative" ref={(el) => addToRevealRefs(el, 11)}>
              <div className="connector"></div>
              <div className="milestone-card border-l-indigo-500">
                <div className="absolute -top-4 -left-4 bg-indigo-500 text-white p-2 rounded-full shadow-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">New Foundations</h3>
                <p className="text-slate-600 text-sm mt-2">
                  <strong>MCAs:</strong> Cumbria, Cheshire & Warrington enter shadow phase.
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  <strong>CCAs:</strong> Interim "Foundation" Authorities formed in Essex & Hants.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE 5: FUEL & HORIZON */}
        <div className="relative py-12 pb-32">
          <div className="flex justify-center mb-8 reveal" ref={(el) => addToRevealRefs(el, 12)}>
            <div className="bg-slate-900 text-white border-2 border-yellow-400 px-8 py-4 rounded-full text-xl font-bold shadow-2xl flex items-center gap-2">
              <Fuel className="text-yellow-400 w-6 h-6" />
              Zone 5: Refueling & Horizon
            </div>
          </div>

          <div className="max-w-3xl mx-auto reveal" ref={(el) => addToRevealRefs(el, 13)}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <PoundSterling className="w-6 h-6" />
                  Funding & The Future
                </h3>
              </div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-slate-800 mb-2">Devolution Investments</h4>
                    <p className="text-slate-600 text-sm mb-4">
                      Initial tranches of the £6bn devolution funding begin flowing to interim bodies to ensure delivery doesn't stall.
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">2026-27 Financial Year</p>
                  </div>
                  <div className="flex-1 border-l-4 border-slate-100 pl-6">
                    <h4 className="font-bold text-lg text-slate-800 mb-2">Next Stop: 2027</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        Mayoral Elections (May 2027)
                      </li>
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <Flag className="w-4 h-4 text-blue-500" />
                        Unitary Vesting Days (2028)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Road End */}
          <div className="text-center mt-12 opacity-50">
            <ArrowDown className="mx-auto w-8 h-8 animate-bounce text-slate-400" />
            <p className="text-sm text-slate-500 mt-2">Journey continues...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
