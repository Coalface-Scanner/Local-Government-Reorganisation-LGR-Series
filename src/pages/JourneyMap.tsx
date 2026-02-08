import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ArrowDown,
  Menu,
  ArrowUp,
  ArrowRight,
  Info,
  BookOpen
} from 'lucide-react';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import Breadcrumbs from '../components/Breadcrumbs';

interface JourneyMapProps {
  onNavigate: (page: string) => void;
}

const ZONES = [
  { id: 'zone-1', title: 'Zone 1: The Departure', period: 'Q1 2026 (Jan - Mar)' },
  { id: 'zone-2', title: 'Zone 2: The Split Road', period: 'May 2026' },
  { id: 'zone-3', title: 'Zone 3: The Legislative Bridge', period: 'Mid - Late 2026' },
  { id: 'zone-5', title: 'Zone 5: Refueling & Horizon', period: '2026-27' },
];

export default function JourneyMap({ onNavigate: _onNavigate }: JourneyMapProps) {
  const location = useLocation();
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const zoneRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeZone, setActiveZone] = useState<string>('');
  const [showTOC, setShowTOC] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Update active zone based on scroll position
      const zones = Object.entries(zoneRefs.current);
      for (const [zoneId, element] of zones) {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveZone(zoneId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for reveal animations
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

  const scrollToZone = (zoneId: string) => {
    const element = zoneRefs.current[zoneId];
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setShowTOC(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="LGR Journey 2026: The Journey Map"
        description="Interactive journey map visualization of Local Government Reorganisation during 2026 and early 2027. Navigate the key milestones, decisions, and transitions."
        keywords="LGR forecast, local government reorganisation 2026, LGR journey map, unitary authority timeline, shadow elections, structural changes orders"
        canonical="https://localgovernmentreorganisation.co.uk/lgr-journey-2026"
      />
      <PageBanner
        heroLabel="JOURNEY MAP"
        heroTitle="The LGR Journey 2026-27"
        heroSubtitle="Navigating the twisting highway of Local Government Reorganisation during 2026 and early 2027"
        currentPath={location.pathname}
      />

      {/* Progress Indicator */}
      <div className="sticky top-0 z-40 bg-academic-cream border-b border-academic-neutral-300">
        <div className="h-1 bg-academic-neutral-200">
          <div 
            className="h-full bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(scrollProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading progress"
          />
        </div>
      </div>

      {/* Table of Contents - Sticky */}
      <div className="sticky top-1 z-30 bg-academic-cream/95 backdrop-blur-sm border-b border-academic-neutral-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowTOC(!showTOC)}
              className="flex items-center gap-2 text-sm font-display font-semibold text-academic-charcoal hover:text-teal-700 transition-colors"
              aria-expanded={showTOC}
              aria-controls="toc-menu"
            >
              <Menu size={18} aria-hidden="true" />
              <span>Jump to Zone</span>
            </button>
            <Link
              to="/"
              className="text-sm text-academic-neutral-600 hover:text-teal-700 transition-colors font-serif"
            >
              ← Back to LGR Hub
            </Link>
          </div>
          
          {showTOC && (
            <nav id="toc-menu" className="mt-4 pb-2" aria-label="Table of contents">
              <ul className="flex flex-wrap gap-2">
                {ZONES.map((zone) => (
                  <li key={zone.id}>
                    <button
                      onClick={() => scrollToZone(zone.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-display font-medium transition-all ${
                        activeZone === zone.id
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-academic-neutral-100 text-academic-charcoal hover:bg-teal-100 hover:text-teal-700'
                      }`}
                      aria-current={activeZone === zone.id ? 'location' : undefined}
                    >
                      {zone.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <section className="bg-academic-warm py-12 border-b border-academic-neutral-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="academic-card p-8">
            <div className="academic-section-header mb-6">
              <div className="academic-section-label">OVERVIEW</div>
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal">
                Key Milestones Ahead
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-academic-charcoal flex items-center gap-2">
                  <Info size={18} className="text-teal-600" aria-hidden="true" />
                  What to Expect
                </h3>
                <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed">
                  This journey map visualizes the critical path for Local Government Reorganisation from January 2026 through 2027. 
                  Follow the timeline to understand key decision points, political transitions, and operational challenges.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-display font-semibold text-academic-charcoal flex items-center gap-2">
                  <BookOpen size={18} className="text-teal-600" aria-hidden="true" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2 text-academic-base text-academic-neutral-700 font-serif">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>63 councils face election delay decisions by January 15, 2026</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Surrey leads with shadow elections in May 2026</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 mt-1">•</span>
                    <span>Structural Changes Orders create new unitaries for 2028</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* The Road Background */}
        <div className="road-line"></div>
        <div className="road-stripes"></div>

        {/* ZONE 1: STARTING GATES */}
        <div id="zone-1" className="relative py-12 scroll-mt-24" ref={(el) => { zoneRefs.current['zone-1'] = el; }}>
          <div className="flex justify-center mb-8 reveal" ref={(el) => addToRevealRefs(el, 0)}>
            <div className="highway-sign px-8 py-4 text-xl bg-teal-700 border-teal-200">
              Zone 1: The Departure <br />
              <span className="text-sm font-normal text-teal-100 opacity-90">Q1 2026 (Jan - Mar)</span>
            </div>
          </div>

          {/* Jan 15 Decision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <div className="md:text-right reveal left-card relative" ref={(el) => addToRevealRefs(el, 1)}>
              <div className="connector"></div>
              <div className="milestone-card border-l-orange-500 academic-card">
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-2 rounded-full shadow-lg" aria-hidden="true">
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2">The "Capacity" Toll Booth</h3>
                <p className="text-sm text-academic-neutral-600 font-semibold mb-3">Jan/Feb 2026</p>
                <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed">
                  Secretary of State decides on election delays. 63 councils face the fork in the road.
                </p>
                <div className="mt-4 bg-orange-50 text-orange-800 text-xs px-3 py-1.5 rounded inline-block border border-orange-200">
                  <strong>Deadline:</strong> 15 Jan 2026
                </div>
              </div>
            </div>
            <div className="hidden md:block"></div>
          </div>

          {/* Mapping Decisions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <div className="hidden md:block"></div>
            <div className="reveal right-card relative" ref={(el) => addToRevealRefs(el, 2)}>
              <div className="connector"></div>
              <div className="milestone-card border-l-teal-600 academic-card">
                <div className="absolute -top-4 -left-4 bg-teal-600 text-white p-2 rounded-full shadow-lg" aria-hidden="true">
                  <Map className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2">Mapping the Future</h3>
                <p className="text-sm text-academic-neutral-600 font-semibold mb-3">Target: Spring 2026</p>
                <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed">
                  Unitary map options announced for DPP areas (Essex, Hants, Sussex, Norfolk, Suffolk).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* POLITICAL TURBULENCE INTERLUDE */}
        <div className="reveal turbulence-zone relative z-20 my-8 md:my-12" ref={(el) => addToRevealRefs(el, 3)}>
          <div className="flex flex-col items-center justify-center text-center p-6 md:p-8">
            <div className="bg-academic-neutral-800 text-white p-4 rounded-full mb-3 shadow-lg" aria-hidden="true">
              <CloudLightning className="w-8 h-8 text-yellow-300" aria-hidden="true" />
            </div>
            <h3 className="text-academic-xl font-display font-bold text-academic-charcoal uppercase tracking-wide mb-2">
              Political Upheaval
            </h3>
            <p className="text-academic-base text-academic-neutral-700 font-serif max-w-md leading-relaxed">
              Decision making impacted by planning volatility and political uncertainty ahead of the split.
            </p>
          </div>
        </div>

        {/* ZONE 2: SURREY PROTOTYPE */}
        <div id="zone-2" className="relative py-12 scroll-mt-24" ref={(el) => { zoneRefs.current['zone-2'] = el; }}>
          {/* Route Diversion Sign */}
          <div className="flex justify-center mb-6 reveal" ref={(el) => addToRevealRefs(el, 4)}>
            <div className="diversion-sign p-4 transform -rotate-1 shadow-xl bg-yellow-400 text-black border-black border-4 relative z-30">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1 border-b-2 border-black pb-1 w-full justify-center">
                  <Shuffle className="w-6 h-6" aria-hidden="true" />
                  <span className="text-lg font-display font-bold">ROUTE DIVERSION</span>
                </div>
                <div className="text-sm font-display font-bold text-center">
                  CANCELLED ELECTIONS<br />
                  <span className="text-xs font-normal">Most traffic diverted to 2027/28</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-8 reveal" ref={(el) => addToRevealRefs(el, 5)}>
            <div className="highway-sign px-8 py-4 text-xl bg-teal-800 border-teal-200">
              Zone 2: The Split Road <br />
              <span className="text-sm font-normal text-teal-100 opacity-90">May 2026</span>
            </div>
          </div>

          {/* The Split: Express Lane vs Service Road */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16 relative">
            {/* Surrey Express Lane */}
            <div className="reveal" ref={(el) => addToRevealRefs(el, 6)}>
              <div className="bg-green-50 border-4 border-green-500 rounded-xl p-6 shadow-xl relative transform md:-rotate-1 hover:rotate-0 transition duration-300 academic-card">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded font-display font-bold uppercase text-xs tracking-wider">
                  Surrey Express Lane
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="text-green-600 w-8 h-8" aria-hidden="true" />
                  <h3 className="text-lg font-display font-bold text-green-900">Shadow Elections Live</h3>
                </div>
                <p className="text-sm text-green-800 mb-3 font-serif">
                  <strong>May 7, 2026:</strong> East & West Surrey elect Shadow Authorities.
                </p>
                <ul className="text-xs text-green-700 list-disc ml-4 space-y-1 font-serif">
                  <li>Immediate "First 100 Days" plan</li>
                  <li>Appoint Statutory Officers (S151, MO)</li>
                  <li>Adopt single Scheme of Delegation</li>
                </ul>
              </div>
            </div>

            {/* Lame Duck Service Road */}
            <div className="reveal mt-8 md:mt-0 relative" ref={(el) => addToRevealRefs(el, 7)}>
              {/* Dead End Visual (Hidden on mobile) */}
              <div className="hidden md:block dead-end-road" aria-hidden="true">
                <div className="dead-end-sign">DEAD END</div>
              </div>

              <div className="bg-academic-neutral-100 border-4 border-dashed border-academic-neutral-400 rounded-xl p-6 shadow-none opacity-90 relative academic-card">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-academic-neutral-500 text-white px-4 py-1 rounded font-display font-bold uppercase text-xs tracking-wider">
                  The "Lame Duck" Lane
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="text-yellow-600 w-8 h-8" aria-hidden="true" />
                  <h3 className="text-lg font-display font-bold text-academic-neutral-700">Existing Councils</h3>
                </div>
                <p className="text-sm text-academic-neutral-600 mb-3 font-serif">
                  Councillors lose incentive. Risk of "Maverick" voting.
                </p>
                <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-xs border border-yellow-200 font-serif">
                  <strong>Warning:</strong> High volatility in Planning Committees expected.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OPERATIONAL REALITY BREAK */}
        <div className="reveal my-12" ref={(el) => addToRevealRefs(el, 8)}>
          <div className="bg-blue-50 text-academic-neutral-100 p-6 md:p-8 rounded-lg border-l-8 border-yellow-400 max-w-2xl mx-auto shadow-2xl relative overflow-hidden academic-card">
            <div className="construction-tape absolute top-0 left-0 w-full h-2" aria-hidden="true"></div>
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400 p-2 rounded text-black shrink-0" aria-hidden="true">
                <Hammer className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-lg font-display font-bold text-blue-900 mb-2">Operational Reality Check: Throughout 2026</h4>
                <p className="text-sm text-slate-900 mt-1 font-serif font-medium">
                  While politics move fast, the machine grinds slowly.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-100 p-3 rounded border border-blue-200">
                    <strong className="text-orange-600 block text-xs uppercase mb-1 font-display">Tech Strategy</strong>
                    <span className="text-xs font-serif text-slate-800">"Lift and Drop" tactics only. No true digital integration yet.</span>
                  </div>
                  <div className="bg-blue-100 p-3 rounded border border-blue-200">
                    <strong className="text-red-600 block text-xs uppercase mb-1 font-display">Workforce</strong>
                    <span className="text-xs font-serif text-slate-800">Major "Brain Drain" in Planning/Legal. Staff churn ~50%.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="construction-tape absolute bottom-0 left-0 w-full h-2" aria-hidden="true"></div>
          </div>
        </div>

        {/* ZONE 3: LEGISLATIVE BRIDGE */}
        <div id="zone-3" className="relative py-12 scroll-mt-24" ref={(el) => { zoneRefs.current['zone-3'] = el; }}>
          <div className="flex justify-center mb-8 reveal" ref={(el) => addToRevealRefs(el, 9)}>
            <div className="highway-sign px-8 py-4 text-xl bg-indigo-900 border-indigo-300">
              Zone 3: The Legislative Bridge <br />
              <span className="text-sm font-normal text-indigo-200 opacity-90">Mid - Late 2026</span>
            </div>
          </div>

          {/* SCOs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <div className="md:text-right reveal left-card relative" ref={(el) => addToRevealRefs(el, 10)}>
              <div className="connector"></div>
              <div className="milestone-card border-l-purple-600 academic-card">
                <div className="absolute -top-4 -right-4 bg-purple-600 text-white p-2 rounded-full shadow-lg" aria-hidden="true">
                  <ScrollText className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2">Structural Changes Orders</h3>
                <p className="text-academic-base text-academic-neutral-700 text-sm mt-2 font-serif leading-relaxed">
                  Secondary legislation laid in Parliament legally creating new unitaries for 2028.
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <span className="bg-purple-100 text-purple-800 text-xs font-display font-bold px-2 py-1 rounded flex items-center gap-1">
                    <Lock className="w-3 h-3" aria-hidden="true" />
                    Section 24 Restrictions Active
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block"></div>
          </div>

          {/* Shadow Bodies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <div className="hidden md:block"></div>
            <div className="reveal right-card relative" ref={(el) => addToRevealRefs(el, 11)}>
              <div className="connector"></div>
              <div className="milestone-card border-l-indigo-500 academic-card">
                <div className="absolute -top-4 -left-4 bg-indigo-500 text-white p-2 rounded-full shadow-lg" aria-hidden="true">
                  <Building2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-display font-bold text-academic-charcoal mb-2">New Foundations</h3>
                <p className="text-academic-base text-academic-neutral-700 text-sm mt-2 font-serif leading-relaxed">
                  <strong>MCAs:</strong> Cumbria, Cheshire & Warrington enter shadow phase.
                </p>
                <p className="text-academic-base text-academic-neutral-700 text-sm mt-2 font-serif leading-relaxed">
                  <strong>CCAs:</strong> Interim "Foundation" Authorities formed in Essex & Hants.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE 5: FUEL & HORIZON */}
        <div id="zone-5" className="relative py-12 pb-32 scroll-mt-24" ref={(el) => { zoneRefs.current['zone-5'] = el; }}>
          <div className="flex justify-center mb-8 reveal" ref={(el) => addToRevealRefs(el, 12)}>
            <div className="bg-academic-neutral-900 text-white border-2 border-yellow-400 px-8 py-4 rounded-full text-xl font-display font-bold shadow-2xl flex items-center gap-2">
              <Fuel className="text-yellow-400 w-6 h-6" aria-hidden="true" />
              Zone 5: Refueling & Horizon
            </div>
          </div>

          <div className="max-w-3xl mx-auto reveal" ref={(el) => addToRevealRefs(el, 13)}>
            <div className="academic-card rounded-2xl shadow-xl overflow-hidden border border-academic-neutral-300">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-6 text-white">
                <h3 className="text-2xl font-display font-bold flex items-center gap-3">
                  <PoundSterling className="w-6 h-6" aria-hidden="true" />
                  Funding & The Future
                </h3>
              </div>
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-lg text-academic-charcoal mb-2">Devolution Investments</h4>
                    <p className="text-academic-base text-academic-neutral-700 text-sm mb-4 font-serif leading-relaxed">
                      Initial tranches of the £6bn devolution funding begin flowing to interim bodies to ensure delivery doesn't stall.
                    </p>
                    <div className="w-full bg-academic-neutral-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: '25%' }}></div>
                    </div>
                    <p className="text-xs text-academic-neutral-500 mt-1 font-serif">2026-27 Financial Year</p>
                  </div>
                  <div className="flex-1 border-l-4 border-academic-neutral-200 pl-6">
                    <h4 className="font-display font-bold text-lg text-academic-charcoal mb-2">Next Stop: 2027</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm text-academic-neutral-700 font-serif">
                        <Calendar className="w-4 h-4 text-teal-600" aria-hidden="true" />
                        Mayoral Elections (May 2027)
                      </li>
                      <li className="flex items-center gap-2 text-sm text-academic-neutral-700 font-serif">
                        <Flag className="w-4 h-4 text-teal-600" aria-hidden="true" />
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
            <ArrowDown className="mx-auto w-8 h-8 animate-bounce text-academic-neutral-400" aria-hidden="true" />
            <p className="text-sm text-academic-neutral-500 mt-2 font-serif">Journey continues...</p>
          </div>
        </div>

        {/* Related Links Section */}
        <section className="bg-academic-warm py-12 border-t border-academic-neutral-300 mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="academic-section-header mb-6">
              <div className="academic-section-label">EXPLORE</div>
              <h2 className="text-academic-3xl font-display font-bold text-academic-charcoal">
                Related Content
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                to="/surrey"
                className="academic-card p-6 hover:shadow-lg transition-all group"
              >
                <h3 className="font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                  Surrey First 100 Days
                </h3>
                <p className="text-academic-base text-academic-neutral-700 font-serif">
                  Detailed playbook for Surrey's reorganisation journey.
                </p>
              </Link>
              <Link
                to="/facts"
                className="academic-card p-6 hover:shadow-lg transition-all group"
              >
                <h3 className="font-display font-bold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                  All Facts & Resources
                </h3>
                <p className="text-academic-base text-academic-neutral-700 font-serif">
                  Explore more facts, guides, and interactive resources.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Cross-Links Section */}
        <section className="py-12 lg:py-16 bg-academic-warm border-t border-academic-neutral-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="academic-card p-8 bg-teal-50 border-l-4 border-teal-600">
              <h2 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-6">
                Explore Related Resources
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/"
                  className="academic-button academic-button-outline inline-flex items-center gap-2"
                >
                  Back to LGR Hub
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/topics/governance-and-reform"
                  className="academic-button academic-button-outline inline-flex items-center gap-2"
                >
                  Governance and Reform
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/topics/statecraft-and-system-design"
                  className="academic-button academic-button-outline inline-flex items-center gap-2"
                >
                  Statecraft and System Design
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/tools"
                  className="academic-button academic-button-outline inline-flex items-center gap-2"
                >
                  View all Tools
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} aria-hidden="true" />
      </button>
    </div>
  );
}
