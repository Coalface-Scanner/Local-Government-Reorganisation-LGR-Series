import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { ArrowUp, CloudLightning, Shuffle } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import FAQSection from '../components/FAQSection';
import {
  RoadmapHero,
  StickyJourneyControlBar,
  MilestoneCard,
  UturnRoadBranch,
  RoadmapSidePanel,
  WhereNextTiles,
  RoadVehicles,
  MapBackground,
  UKJunctionSign,
  BentRoad,
} from '../components/roadmap';
import type { RoadmapFilters } from '../components/roadmap';
import {
  ROADMAP_MILESTONES,
  ZONES,
  getMilestoneById,
  filterMilestones,
} from '../data/roadmapMilestones';
import type {
  RoadmapMilestone,
  AudienceId,
  RouteId,
  ScenarioId,
  PlaceId,
} from '../data/roadmapMilestones';
import { ROUTE_IDS } from '../data/roadmapMilestones';

const SAVED_STORAGE_KEY = 'lgr-roadmap-saved';

function parseSavedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSavedIds(ids: Set<string>) {
  try {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

interface JourneyMapProps {
  onNavigate: (page: string) => void;
}

export default function JourneyMap({ onNavigate: _onNavigate }: JourneyMapProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const nowMarkerRef = useRef<HTMLDivElement | null>(null);
  const milestoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [scrollProgress, setScrollProgress] = useState(0);
  const [_activeZone, setActiveZone] = useState('');
  const [savedIds, setSavedIds] = useState<Set<string>>(parseSavedIds);
  const [panelOpen, setPanelOpen] = useState(false);
  const [showReadingList, setShowReadingList] = useState(false);

  const zoneParam = searchParams.get('zone') || 'zone-1';
  const routesParam = searchParams.get('routes') || '';
  const audienceParam = (searchParams.get('audience') || '') as AudienceId | '';
  const placeParam = (searchParams.get('place') || 'all-england') as PlaceId;
  const scenarioParam = (searchParams.get('scenario') || 'baseline') as ScenarioId;
  const milestoneParam = searchParams.get('milestone') || '';

  const filters: RoadmapFilters = {
    zone: ZONES.some((z) => z.id === zoneParam) ? zoneParam : 'zone-1',
    routes: routesParam
      ? (routesParam.split(',').filter((r) => ROUTE_IDS.includes(r as RouteId)) as RouteId[])
      : [],
    audience: audienceParam,
    place: placeParam,
    scenario: scenarioParam,
    searchQuery: searchParams.get('q') || '',
  };

  const selectedMilestone = milestoneParam ? getMilestoneById(milestoneParam) ?? null : null;
  const filteredMilestones = filterMilestones(ROADMAP_MILESTONES, {
    routes: filters.routes.length ? filters.routes : undefined,
    scenario: filters.scenario,
    searchQuery: filters.searchQuery?.trim() || undefined,
  });

  const updateUrl = useCallback(
    (updates: {
      zone?: string;
      routes?: string[];
      audience?: string;
      place?: string;
      scenario?: string;
      milestone?: string;
      searchQuery?: string;
    }) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (updates.zone !== undefined) next.set('zone', updates.zone);
        if (updates.routes !== undefined) next.set('routes', updates.routes.join(','));
        if (updates.audience !== undefined) next.set('audience', updates.audience);
        if (updates.place !== undefined) next.set('place', updates.place);
        if (updates.scenario !== undefined) next.set('scenario', updates.scenario);
        if (updates.milestone !== undefined) {
          if (updates.milestone) next.set('milestone', updates.milestone);
          else next.delete('milestone');
        }
        if (updates.searchQuery !== undefined) {
          if (updates.searchQuery) next.set('q', updates.searchQuery);
          else next.delete('q');
        }
        return next;
      });
    },
    [setSearchParams]
  );

  const handleFiltersChange = useCallback(
    (f: Partial<RoadmapFilters>) => {
      if (f.zone !== undefined) updateUrl({ zone: f.zone });
      if (f.routes !== undefined) updateUrl({ routes: f.routes });
      if (f.audience !== undefined) updateUrl({ audience: f.audience });
      if (f.place !== undefined) updateUrl({ place: f.place });
      if (f.scenario !== undefined) updateUrl({ scenario: f.scenario });
      if (f.searchQuery !== undefined) updateUrl({ searchQuery: f.searchQuery });
    },
    [updateUrl]
  );

  const scrollToZone = useCallback((zoneId: string) => {
    const el = zoneRefs.current[zoneId];
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const scrollToNow = useCallback(() => {
    const el = nowMarkerRef.current;
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const openMilestone = useCallback(
    (id: string) => {
      updateUrl({ milestone: id });
      setPanelOpen(true);
      setShowReadingList(false);
      setTimeout(() => {
        const el = milestoneRefs.current[id];
        if (el) {
          const offset = 120;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    },
    [updateUrl]
  );

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setShowReadingList(false);
    updateUrl({ milestone: '' });
  }, [updateUrl]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveSavedIds(next);
      return next;
    });
  }, []);

  const handleSavedClick = useCallback(() => {
    setPanelOpen(true);
    setShowReadingList(true);
  }, []);

  useEffect(() => {
    if (milestoneParam && getMilestoneById(milestoneParam)) {
      setPanelOpen(true);
      setShowReadingList(false);
    }
  }, [milestoneParam]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress =
        documentHeight > windowHeight
          ? (scrollTop / (documentHeight - windowHeight)) * 100
          : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      for (const z of ZONES) {
        const el = zoneRefs.current[z.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveZone(z.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const readingListMilestones = ROADMAP_MILESTONES.filter((m) => savedIds.has(m.id));

  const getFeaturedLink = (m: RoadmapMilestone): { label: string; href: string } | undefined => {
    if (m.links.articles[0])
      return { label: 'Article', href: `/insights/${m.links.articles[0]}` };
    if (m.links.facts[0]) return { label: 'Facts', href: m.links.facts[0] };
    if (m.links.glossary[0])
      return { label: 'Glossary', href: `/glossary/${m.links.glossary[0]}` };
    return undefined;
  };

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="LGR Journey 2026: The Journey Map"
        description="Interactive journey map visualisation of Local Government Reorganisation during 2026 and early 2027. Navigate the key milestones, decisions, and transitions."
        keywords="LGR forecast, local government reorganisation 2026, LGR journey map, unitary authority timeline, shadow elections, structural changes orders"
        canonical="https://localgovernmentreorganisation.co.uk/roadmap"
      />

      <PageBanner
        heroLabel="JOURNEY MAP"
        heroTitle="The LGR Journey 2026 to 27"
        heroSubtitle="Your visual control centre for LGR: see where you are in the journey, what decisions matter next, and where to go for deeper reading and tools."
        currentPath={location.pathname}
      />

      <RoadmapHero
        onStartJourney={scrollToNow}
        onBrowseByTopic={() => {
          scrollToZone(filters.zone);
        }}
      />

      <div className="sticky top-0 z-40 bg-academic-cream border-b border-academic-neutral-300 shadow-sm">
        <div
          className="h-1.5 bg-academic-neutral-200"
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
        >
          <div
            className="h-full bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-500 transition-all duration-200 shadow-sm"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <StickyJourneyControlBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onNowClick={scrollToNow}
        onZoneChange={scrollToZone}
        savedCount={savedIds.size}
        onSavedClick={handleSavedClick}
        />
      </div>

      <div className="flex flex-col lg:flex-row">
        <main className="relative flex-1 min-w-0 max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full roadmap-content roadmap-main">
          <MapBackground />
          <BentRoad />
          <RoadVehicles />

          <div
            ref={nowMarkerRef}
            className="relative flex justify-center py-4 z-10"
            aria-hidden="true"
          >
            <div className="road-now-pin flex flex-col items-center">
              <span className="text-sm font-display font-bold text-teal-800 uppercase tracking-wider drop-shadow-sm">Now</span>
              <div className="w-1.5 h-10 bg-teal-500 rounded-full shadow-md" />
            </div>
          </div>

          {ZONES.map((zone, zoneIndex) => {
            const zoneMilestones = filteredMilestones.filter((m) => m.zone === zone.id);
            const isFutureZone =
              zoneIndex > 0 && zone.id !== 'zone-1';
            return (
              <div
                key={zone.id}
                id={zone.id}
                className={`relative z-10 py-12 scroll-mt-24 ${isFutureZone ? 'opacity-90' : ''}`}
                ref={(el) => {
                  zoneRefs.current[zone.id] = el;
                }}
              >
                {zone.id === 'zone-2' && (
                  <>
                    <div className="turbulence-zone relative z-20 my-8 md:my-12">
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
                    <div className="flex justify-center mb-6">
                      <div className="diversion-sign p-4 transform -rotate-1 shadow-xl bg-yellow-400 text-black border-black border-4 relative z-30">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1 border-b-2 border-black pb-1 w-full justify-center">
                          <Shuffle className="w-6 h-6" aria-hidden="true" />
                          <span className="text-lg font-display font-bold">ROUTE DIVERSION</span>
                        </div>
                        <div className="text-sm font-display font-bold text-center">
                          CANCELLED ELECTIONS
                          <br />
                          <span className="text-xs font-normal">Most traffic diverted to 2027/28</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                )}
                <div className="flex justify-center mb-8">
                  <UKJunctionSign
                    junctionNumber={zone.id.replace('zone-', '')}
                    destination={zone.title.replace(/^Junction \d+:\s*/i, '')}
                    route={zone.period}
                  />
                </div>

                {zoneMilestones.map((milestone, idx) => {
                  const isReversalOnUturn = milestone.id === 'election-reversal-16-feb';
                  const side = idx % 2 === 0 ? 'left' : 'right';
                  const isHighlighted =
                    filters.routes.length > 0 &&
                    milestone.routes.some((r) => filters.routes.includes(r));

                  if (isReversalOnUturn) {
                    return (
                      <div
                        key={milestone.id}
                        ref={(el) => {
                          milestoneRefs.current[milestone.id] = el;
                        }}
                      >
                        <UturnRoadBranch
                          milestone={milestone}
                          isHighlighted={isHighlighted}
                          onOpen={() => openMilestone(milestone.id)}
                          onToggleSave={() => toggleSaved(milestone.id)}
                          isSaved={savedIds.has(milestone.id)}
                          featuredLink={getFeaturedLink(milestone)}
                          featuredGlossary={milestone.links.glossary[0]}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={milestone.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16"
                      ref={(el) => {
                        milestoneRefs.current[milestone.id] = el;
                      }}
                    >
                      {side === 'left' ? (
                        <>
                          <div>
                            <MilestoneCard
                              milestone={milestone}
                              isHighlighted={isHighlighted}
                              onOpen={() => openMilestone(milestone.id)}
                              onToggleSave={() => toggleSaved(milestone.id)}
                              isSaved={savedIds.has(milestone.id)}
                              side="left"
                              featuredLink={getFeaturedLink(milestone)}
                              featuredGlossary={milestone.links.glossary[0]}
                            />
                          </div>
                          <div className="hidden md:block" />
                        </>
                      ) : (
                        <>
                          <div className="hidden md:block" />
                          <div>
                            <MilestoneCard
                              milestone={milestone}
                              isHighlighted={isHighlighted}
                              onOpen={() => openMilestone(milestone.id)}
                              onToggleSave={() => toggleSaved(milestone.id)}
                              isSaved={savedIds.has(milestone.id)}
                              side="right"
                              featuredLink={getFeaturedLink(milestone)}
                              featuredGlossary={milestone.links.glossary[0]}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <WhereNextTiles />
        </main>

        <div className="hidden lg:block lg:w-[380px] lg:shrink-0 lg:sticky lg:top-[180px] lg:self-start lg:max-h-[calc(100vh-200px)]">
          <RoadmapSidePanel
            milestone={selectedMilestone}
            audience={filters.audience}
            onClose={closePanel}
            onAddToReadingList={toggleSaved}
            savedIds={savedIds}
            readingListMilestones={readingListMilestones}
            onOpenMilestone={openMilestone}
            onShare={(id) => updateUrl({ milestone: id })}
            isOpen={true}
            showReadingList={showReadingList}
            isMobile={false}
          />
        </div>
      </div>

      {panelOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden
            onClick={closePanel}
          />
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <RoadmapSidePanel
              milestone={selectedMilestone}
              audience={filters.audience}
              onClose={closePanel}
              onAddToReadingList={toggleSaved}
              savedIds={savedIds}
              readingListMilestones={readingListMilestones}
              onOpenMilestone={openMilestone}
              onShare={(id) => updateUrl({ milestone: id })}
              isOpen={true}
              showReadingList={showReadingList}
              isMobile={true}
            />
          </div>
        </div>
      )}

      <FAQSection page="roadmap" />

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} aria-hidden="true" />
      </button>
    </div>
  );
}
