import { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  ChevronDown,
  Search,
  Bookmark,
  X,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import type { RouteId, AudienceId, ScenarioId, PlaceId } from '../../data/roadmapMilestones';
import {
  ZONES,
  ROUTE_IDS,
  ROUTE_LABELS,
  AUDIENCE_IDS,
  AUDIENCE_LABELS,
  SCENARIO_IDS,
  SCENARIO_LABELS,
  PLACE_OPTIONS,
  PLACE_LABELS,
} from '../../data/roadmapMilestones';

export interface RoadmapFilters {
  zone: string;
  routes: RouteId[];
  audience: AudienceId | '';
  place: PlaceId;
  scenario: ScenarioId;
  searchQuery: string;
}

interface StickyJourneyControlBarProps {
  filters: RoadmapFilters;
  onFiltersChange: (f: Partial<RoadmapFilters>) => void;
  onNowClick: () => void;
  onZoneChange?: (zoneId: string) => void;
  savedCount: number;
  onSavedClick: () => void;
}

export default function StickyJourneyControlBar({
  filters,
  onFiltersChange,
  onNowClick,
  onZoneChange,
  savedCount,
  onSavedClick,
}: StickyJourneyControlBarProps) {
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const currentZoneLabel = ZONES.find((z) => z.id === filters.zone)?.title ?? 'Junction';
  const hasActiveFilters =
    filters.routes.length > 0 ||
    filters.audience !== '' ||
    filters.place !== 'all-england' ||
    filters.scenario !== 'baseline' ||
    (filters.searchQuery?.trim() ?? '') !== '';

  const activeFilterCount = [
    filters.routes.length > 0,
    filters.audience !== '',
    filters.place !== 'all-england',
    filters.scenario !== 'baseline',
  ].filter(Boolean).length;

  const toggleRoute = (r: RouteId) => {
    const next = filters.routes.includes(r)
      ? filters.routes.filter((x) => x !== r)
      : [...filters.routes, r];
    onFiltersChange({ routes: next });
  };

  const resetFilters = () => {
    onFiltersChange({
      routes: [],
      audience: '',
      place: 'all-england' as PlaceId,
      scenario: 'baseline' as ScenarioId,
      searchQuery: '',
    });
    setShowSearch(false);
  };

  return (
    <div className="bg-academic-cream border-b border-academic-neutral-200">
      <div className="layout-container py-2">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Now button */}
          <button
            type="button"
            onClick={onNowClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-display font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
            aria-label="Jump to current position on the journey"
          >
            <MapPin size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Now</span>
          </button>

          {/* Zone dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowZoneDropdown(!showZoneDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-display font-medium bg-academic-neutral-100 text-academic-charcoal hover:bg-academic-neutral-200 border border-academic-neutral-300 max-w-[200px]"
              aria-expanded={showZoneDropdown}
              aria-haspopup="listbox"
            >
              <span className="truncate">{currentZoneLabel}</span>
              <ChevronDown size={16} className="shrink-0" aria-hidden="true" />
            </button>
            {showZoneDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  aria-hidden="true"
                  onClick={() => setShowZoneDropdown(false)}
                />
                <ul
                  role="listbox"
                  className="absolute left-0 top-full mt-1 py-1 bg-white border border-academic-neutral-300 rounded-lg shadow-lg z-20 min-w-[220px]"
                >
                  {ZONES.map((z) => (
                    <li key={z.id} role="option" aria-selected={filters.zone === z.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onFiltersChange({ zone: z.id });
                          onZoneChange?.(z.id);
                          setShowZoneDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-serif ${
                          filters.zone === z.id ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-academic-charcoal hover:bg-academic-warm'
                        }`}
                      >
                        <span className="font-display font-semibold">{z.title}</span>
                        <span className="block text-xs text-academic-neutral-500 mt-0.5">{z.period}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Filters toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-display font-medium border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-teal-50 text-teal-700 border-teal-300'
                : 'bg-academic-neutral-100 text-academic-charcoal hover:bg-academic-neutral-200 border-academic-neutral-300'
            }`}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-teal-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Reset filters — only shown when filters are active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-display font-medium text-academic-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Reset all filters"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Search */}
          <div className="flex items-center gap-1 ml-auto">
            {showSearch ? (
              <>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={filters.searchQuery}
                  onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
                  placeholder="Search milestones..."
                  className="px-3 py-2 text-sm border border-academic-neutral-300 rounded-lg w-36 sm:w-44 md:w-52 font-serif focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:outline-none"
                  aria-label="Search milestones"
                />
                <button
                  type="button"
                  onClick={() => {
                    onFiltersChange({ searchQuery: '' });
                    setShowSearch(false);
                  }}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-academic-neutral-500 hover:text-academic-charcoal"
                  aria-label="Close search"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-academic-neutral-600 hover:bg-academic-warm hover:text-academic-charcoal"
                aria-label="Search milestones"
              >
                <Search size={18} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Saved / reading list */}
          <button
            type="button"
            onClick={onSavedClick}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-display font-medium text-academic-charcoal hover:bg-academic-warm border border-academic-neutral-300"
            aria-label={savedCount ? `Reading list: ${savedCount} saved` : 'Reading list'}
          >
            <Bookmark size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="bg-teal-100 text-teal-800 text-xs font-bold px-1.5 py-0.5 rounded">
                {savedCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel — grouped into two rows for visual clarity */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-academic-neutral-200">
            {/* Row 1: Routes (topical) + Audience (who) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[11px] font-display font-bold text-teal-700 uppercase tracking-wider mb-1.5">
                  Routes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ROUTE_IDS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRoute(r)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-display font-medium transition-colors border ${
                        filters.routes.includes(r)
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-academic-charcoal hover:bg-teal-50 hover:text-teal-800 border-academic-neutral-300'
                      }`}
                    >
                      {ROUTE_LABELS[r]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-display font-bold text-sky-700 uppercase tracking-wider mb-1.5">
                  Audience
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {AUDIENCE_IDS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => onFiltersChange({ audience: filters.audience === a ? '' : a })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-display font-medium transition-colors border ${
                        filters.audience === a
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-academic-charcoal hover:bg-sky-50 hover:text-sky-800 border-academic-neutral-300'
                      }`}
                    >
                      {AUDIENCE_LABELS[a]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Row 2: Place + Scenario */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-display font-bold text-violet-700 uppercase tracking-wider mb-1.5">
                  Place
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PLACE_OPTIONS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onFiltersChange({ place: p })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-display font-medium transition-colors border ${
                        filters.place === p
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'bg-white text-academic-charcoal hover:bg-violet-50 hover:text-violet-800 border-academic-neutral-300'
                      }`}
                    >
                      {PLACE_LABELS[p]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-display font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                  Scenario
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SCENARIO_IDS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onFiltersChange({ scenario: s })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-display font-medium transition-colors border ${
                        filters.scenario === s
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white text-academic-charcoal hover:bg-amber-50 hover:text-amber-800 border-academic-neutral-300'
                      }`}
                    >
                      {SCENARIO_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
