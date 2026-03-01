import { useEffect, useState, useCallback } from 'react';
import { supabase, hasValidSupabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';
import { useLocation } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import ErrorDisplay from '../components/ErrorDisplay';
import { Search, Filter, ArrowUpDown, Calendar, Building2 } from 'lucide-react';
import { LGRReorganisation, ReorganisationType, REORGANISATION_TYPE_LABELS, REORGANISATION_REASON_LABELS } from '../types/reorganisations';
import FAQSection from '../components/FAQSection';

interface ReorganisationsProps {
  onNavigate: (page: string, slug?: string) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const TYPE_OPTIONS: ReorganisationType[] = [
  'unitary_creation',
  'merger',
  'boundary_change',
  'abolition',
];

// Generate years from 2010 to current year + 1
const getYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = 2010; year <= currentYear + 1; year++) {
    years.push(year);
  }
  return years.reverse(); // Newest first
};

const YEAR_OPTIONS = getYearOptions();

export default function Reorganisations({ onNavigate: _onNavigate }: ReorganisationsProps) {
  const [reorganisations, setReorganisations] = useState<LGRReorganisation[]>([]);
  const [filteredReorganisations, setFilteredReorganisations] = useState<LGRReorganisation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 20;
  const location = useLocation();

  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ReorganisationType[]>([]);

  useEffect(() => {
    fetchReorganisations();
  }, []);

  const fetchReorganisations = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!hasValidSupabase) {
        setReorganisations([]);
        setLoading(false);
        setError(
          'Reorganisations data is loaded from the database. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, then run the Supabase migrations (e.g. supabase db push) to see data here.'
        );
        return;
      }
      const { data, error: fetchError } = await prerenderSafe(
        supabase.from('lgr_reorganisations').select('*').order('year', { ascending: false }),
        { data: [], error: null }
      );

      if (fetchError) {
        throw fetchError;
      }

      setReorganisations(data || []);
    } catch (err) {
      console.error('Error fetching reorganisations:', err);
      setError(
        'Failed to load reorganisations. If the database is set up, ensure the lgr_reorganisations table exists (run migrations: supabase db push or apply the SQL in supabase/migrations).'
      );
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...reorganisations];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.councils_involved.some((council) =>
            council.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Year filter
    if (selectedYears.length > 0) {
      filtered = filtered.filter((r) => selectedYears.includes(r.year));
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((r) => selectedTypes.includes(r.type));
    }

    // Sort: newest/oldest by year, with boundary_change first then merger then unitary_creation
    const typeOrder = { boundary_change: 0, merger: 1, unitary_creation: 2, abolition: 3 };
    const yearSort = sortBy === 'newest' ? -1 : 1;
    filtered.sort((a, b) => {
      const typeA = typeOrder[a.type] ?? 3;
      const typeB = typeOrder[b.type] ?? 3;
      if (typeA !== typeB) return typeA - typeB;
      return yearSort * (a.year - b.year) || (yearSort * (a.effective_date || '').localeCompare(b.effective_date || ''));
    });

    setFilteredReorganisations(filtered);
  }, [reorganisations, searchQuery, sortBy, selectedYears, selectedTypes]);

  useEffect(() => {
    applyFiltersAndSort();
    setCurrentPage(1);
  }, [applyFiltersAndSort]);

  const toggleFilter = (value: number | ReorganisationType, selected: (number | ReorganisationType)[], setSelected: (val: (number | ReorganisationType)[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedYears([]);
    setSelectedTypes([]);
    setSearchQuery('');
  };

  const activeFilterCount = selectedYears.length + selectedTypes.length;

  const totalPages = Math.ceil(filteredReorganisations.length / itemsPerPage);
  const paginatedReorganisations = filteredReorganisations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="main-content" className="min-h-screen bg-academic-cream">
        <SEOHead page="reorganisations" />
        <MetaTags
          title="Local Government Reorganisations Since 2010"
          description="Comprehensive list of all local government reorganisations in England since 2010. Filter by year and type including unitary creations, mergers, boundary changes, and council abolitions."
          keywords="local government reorganisation, LGR, unitary authorities, council mergers, boundary changes, council abolition, England local government, reorganisation history"
        />
        
        <PageBanner
          heroLabel="LGR SERIES"
          heroTitle="Local Government Reorganisations"
          heroSubtitle="A comprehensive list of all local government reorganisations in England since 2010. Filter by year and type to explore the history of structural changes to local government."
          currentPath={location.pathname}
        />

      <div className="layout-container layout-content-sub">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              <div className="academic-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-academic-charcoal text-academic-lg">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-academic-sm text-teal-700 hover:text-teal-800 font-display font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <FilterSection
                    title="Year"
                    options={YEAR_OPTIONS}
                    selected={selectedYears}
                    onChange={setSelectedYears}
                    toggleFilter={toggleFilter}
                  />

                  <FilterSection
                    title="Type"
                    options={TYPE_OPTIONS}
                    selected={selectedTypes}
                    onChange={setSelectedTypes}
                    toggleFilter={toggleFilter}
                    getLabel={(value) => REORGANISATION_TYPE_LABELS[value as ReorganisationType]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="academic-card p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-academic-neutral-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search reorganisations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search reorganisations"
                    className="w-full pl-12 pr-4 py-3 border border-academic-neutral-300 focus:ring-2 focus:ring-teal-700 focus:border-teal-700 bg-white font-serif"
                    style={{ borderRadius: '2px' }}
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort reorganisations"
                    className="px-4 py-3 border border-academic-neutral-300 focus:ring-2 focus:ring-teal-700 focus:border-teal-700 bg-white font-display"
                    style={{ borderRadius: '2px' }}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 py-3 bg-academic-warm border border-academic-neutral-300 hover:bg-academic-neutral-200 transition-colors flex items-center gap-2"
                    style={{ borderRadius: '2px' }}
                  >
                    <Filter size={20} />
                    {activeFilterCount > 0 && (
                      <span className="bg-teal-700 text-white text-academic-xs font-display font-bold w-5 h-5 flex items-center justify-center" style={{ borderRadius: '2px' }}>
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6">
                <ErrorDisplay
                  title="Unable to Load Reorganisations"
                  message={error}
                  onRetry={fetchReorganisations}
                />
              </div>
            )}

            {loading ? (
              <div className="academic-card p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
                <p className="text-academic-neutral-600 font-serif">Loading reorganisations...</p>
              </div>
            ) : (
              <>
                <div className="mb-6 text-academic-sm text-academic-neutral-600 font-serif">
                  Showing {filteredReorganisations.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredReorganisations.length)} of {filteredReorganisations.length} {filteredReorganisations.length === 1 ? 'reorganisation' : 'reorganisations'}
                </div>

                {filteredReorganisations.length === 0 ? (
                  <div className="academic-card p-12 text-center">
                    <Building2 className="mx-auto mb-6 text-academic-neutral-300" size={48} />
                    <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-3">No reorganisations found</h3>
                    <p className="text-academic-base text-academic-neutral-600 mb-6 font-serif">
                      {reorganisations.length === 0
                        ? 'No reorganisations have been added yet.'
                        : 'Try adjusting your search or filters'}
                    </p>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="academic-button academic-button-primary"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-10">
                      {paginatedReorganisations.map((reorganisation, index) => {
                        const isFirstBoundaryOnPage =
                          reorganisation.type === 'boundary_change' &&
                          !paginatedReorganisations
                            .slice(0, index)
                            .some((r) => r.type === 'boundary_change');
                        const isFirstMajorOnPage =
                          (reorganisation.type === 'merger' || reorganisation.type === 'unitary_creation') &&
                          !paginatedReorganisations
                            .slice(0, index)
                            .some((r) => r.type === 'merger' || r.type === 'unitary_creation');

                        return (
                          <div key={reorganisation.id} className="space-y-6">
                            {isFirstBoundaryOnPage && (
                              <div className="pb-2">
                                <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">
                                  Minor Boundary Changes (2012–2025)
                                </h2>
                                <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed">
                                  These changes involved moving the administrative borders between existing councils to resolve geographic anomalies, usually caused by new housing developments, rather than structural unifications.
                                </p>
                              </div>
                            )}
                            {isFirstMajorOnPage && (
                              <div className="pb-2">
                                <h2 className="text-academic-xl font-display font-bold text-academic-charcoal mb-2">
                                  Major Structural Changes (Council Mergers & Unitary Creations)
                                </h2>
                                <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed">
                                  Between 2019 and 2023, a major wave of &ldquo;unitarisation&rdquo; and district mergers occurred to reduce administrative costs, leading to the abolition of several historic county and district councils.
                                </p>
                              </div>
                            )}
                            <div className="academic-card p-8 hover:border-teal-700 transition-all duration-300">
                              <div className="flex flex-col gap-4">
                                <div className="flex flex-wrap items-start gap-3">
                                  <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal flex-1">
                                    {reorganisation.name}
                                  </h3>
                                  <span className={`px-3 py-1 text-academic-xs font-display font-semibold ${
                                    reorganisation.status === 'completed'
                                      ? 'bg-green-50 text-green-800'
                                      : reorganisation.status === 'proposed'
                                      ? 'bg-blue-50 text-blue-800'
                                      : 'bg-gray-50 text-gray-800'
                                  }`} style={{ borderRadius: '2px' }}>
                                    {reorganisation.status.charAt(0).toUpperCase() + reorganisation.status.slice(1)}
                                  </span>
                                </div>

                                {(reorganisation.name_before || reorganisation.name_after) && (
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {reorganisation.name_before && (
                                      <div>
                                        <span className="text-academic-xs font-display font-semibold text-academic-charcoal uppercase tracking-wide">Name Before</span>
                                        <p className="text-academic-sm text-academic-neutral-700 font-serif mt-0.5">{reorganisation.name_before}</p>
                                      </div>
                                    )}
                                    {reorganisation.name_after && (
                                      <div>
                                        <span className="text-academic-xs font-display font-semibold text-academic-charcoal uppercase tracking-wide">Name After</span>
                                        <p className="text-academic-sm text-academic-neutral-700 font-serif mt-0.5">{reorganisation.name_after}</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                  <span className="px-3 py-1 bg-teal-50 text-teal-800 text-academic-xs font-display font-semibold flex items-center gap-1" style={{ borderRadius: '2px' }}>
                                    <Calendar size={14} />
                                    {reorganisation.year}
                                  </span>
                                  <span className="px-3 py-1 bg-blue-50 text-blue-800 text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
                                    {REORGANISATION_REASON_LABELS[reorganisation.type]}
                                  </span>
                                  {reorganisation.effective_date && (
                                    <span className="px-3 py-1 bg-academic-neutral-100 text-academic-neutral-700 text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
                                      {new Date(reorganisation.effective_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                  )}
                                </div>

                                {(reorganisation.merger_headline || reorganisation.description) && (
                                  <div>
                                    <span className="text-academic-xs font-display font-semibold text-academic-charcoal uppercase tracking-wide">Merger Headline</span>
                                    <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed mt-0.5">
                                      {reorganisation.merger_headline ?? reorganisation.description}
                                    </p>
                                  </div>
                                )}

                                {reorganisation.current_status && (
                                  <div>
                                    <span className="text-academic-xs font-display font-semibold text-academic-charcoal uppercase tracking-wide">Current Status</span>
                                    <p className="text-academic-base text-academic-neutral-700 font-serif leading-relaxed mt-0.5">
                                      {reorganisation.current_status}
                                    </p>
                                  </div>
                                )}

                                {reorganisation.councils_involved && reorganisation.councils_involved.length > 0 && (
                                  <div>
                                    <h4 className="text-academic-sm font-display font-semibold text-academic-charcoal mb-2 flex items-center gap-2">
                                      <Building2 size={16} />
                                      Councils Involved
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {reorganisation.councils_involved.map((council, i) => (
                                        <span
                                          key={i}
                                          className="px-3 py-1 bg-academic-warm text-academic-neutral-700 text-academic-xs font-serif"
                                          style={{ borderRadius: '2px' }}
                                        >
                                          {council}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="academic-button academic-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <div className="flex gap-2">
                          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 7) {
                              pageNum = i + 1;
                            } else if (currentPage <= 4) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 3) {
                              pageNum = totalPages - 6 + i;
                            } else {
                              pageNum = currentPage - 3 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => goToPage(pageNum)}
                                className={`w-10 h-10 font-display font-semibold transition-colors rounded-xl ${
                                  currentPage === pageNum
                                    ? 'bg-teal-700 text-white'
                                    : 'border border-academic-neutral-300 hover:bg-academic-warm text-academic-charcoal'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="academic-button academic-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <FAQSection page="reorganisations" />
        <div className="layout-container">
        </div>
      </div>
  );
}

interface FilterSectionProps<T extends number | ReorganisationType> {
  title: string;
  options: T[];
  selected: T[];
  onChange: (val: T[]) => void;
  toggleFilter: (value: T, selected: T[], setSelected: (val: T[]) => void) => void;
  getLabel?: (value: T) => string;
}

function FilterSection<T extends number | ReorganisationType>({ 
  title, 
  options, 
  selected, 
  onChange, 
  toggleFilter,
  getLabel 
}: FilterSectionProps<T>) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-academic-neutral-300 pb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="font-display font-semibold text-academic-charcoal">{title}</span>
        <ArrowUpDown size={16} className={`text-academic-neutral-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {options.map((option) => {
            const label = getLabel ? getLabel(option) : String(option);
            return (
              <label key={String(option)} className="flex items-center gap-2 cursor-pointer hover:bg-academic-warm p-2" style={{ borderRadius: '2px' }}>
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggleFilter(option, selected as T[], onChange)}
                  className="w-4 h-4 text-teal-700 border-academic-neutral-300 focus:ring-teal-700"
                  style={{ borderRadius: '2px' }}
                />
                <span className="text-academic-sm text-academic-neutral-700 font-serif">{label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
