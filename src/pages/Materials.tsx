import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import { Search, Filter, ArrowUpDown, FileText, Download, ExternalLink } from 'lucide-react';

interface Material {
  id: string;
  title: string;
  slug: string;
  description: string;
  published_date: string;
  read_count: number;
  editors_pick: boolean;
  type: string;
  geography: string;
  theme: string;
  audience: string[];
  lgr_phase: string;
  format: string;
  author: string;
  author_name: string;
  image_url: string;
  pdf_url: string;
  external_url: string;
}

interface MaterialsProps {
  onNavigate: (page: string, slug?: string) => void;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most_read', label: 'Most Read' },
  { value: 'editors_pick', label: "Editor's Picks" },
];

const TYPE_OPTIONS = [
  'Features',
  'Insight',
  'Explainer',
  'Case study',
  'Interview',
  'Commentary',
  'Briefing note',
  'Toolkit',
  'Data note',
];

const GEOGRAPHY_OPTIONS = [
  'National',
  'Region',
  'Combined authority',
  'County or unitary',
  'Local area',
];

const THEME_OPTIONS = [
  'Governance',
  'Planning delivery',
  'Finance and resilience',
  'Capacity and workforce',
  'Digital and data',
  'Public trust and engagement',
  'Programme and transition',
];

const AUDIENCE_OPTIONS = [
  'Members',
  'Officers',
  'Planning',
  'Developers',
  'Advisers',
  'Communities',
  'Government',
];

const LGR_PHASE_OPTIONS = [
  'Signals',
  'Proposal',
  'Shadow',
  'Vesting prep',
  'Vesting',
  'First 100 days',
  'Year one',
  'Consolidation',
];

const FORMAT_OPTIONS = [
  'Article',
  'PDF',
  'Factsheet',
  'Report',
  'Checklist',
  'Template',
  'Slides',
  'Webinar',
];

const AUTHOR_OPTIONS = [
  'Coalface editorial',
  'Guest',
  'Interviewee',
  'Organisation statement',
];

export default function Materials({ onNavigate }: MaterialsProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedGeography, setSelectedGeography] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string[]>([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
    setCurrentPage(1);
  }, [materials, searchQuery, sortBy, selectedType, selectedGeography, selectedTheme, selectedAudience, selectedPhase, selectedFormat, selectedAuthor]);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) {
      // Silently fail - materials will show empty state
      return;
    }

    if (data) {
      setMaterials(data);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...materials];

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType.length > 0) {
      filtered = filtered.filter((m) => selectedType.includes(m.type));
    }

    if (selectedGeography.length > 0) {
      filtered = filtered.filter((m) => selectedGeography.includes(m.geography));
    }

    if (selectedTheme.length > 0) {
      filtered = filtered.filter((m) => selectedTheme.includes(m.theme));
    }

    if (selectedAudience.length > 0) {
      filtered = filtered.filter((m) =>
        m.audience?.some((a) => selectedAudience.includes(a))
      );
    }

    if (selectedPhase.length > 0) {
      filtered = filtered.filter((m) => selectedPhase.includes(m.lgr_phase));
    }

    if (selectedFormat.length > 0) {
      filtered = filtered.filter((m) => selectedFormat.includes(m.format));
    }

    if (selectedAuthor.length > 0) {
      filtered = filtered.filter((m) => selectedAuthor.includes(m.author));
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.published_date).getTime() - new Date(b.published_date).getTime());
        break;
      case 'most_read':
        filtered.sort((a, b) => b.read_count - a.read_count);
        break;
      case 'editors_pick':
        filtered = filtered.filter((m) => m.editors_pick);
        break;
    }

    setFilteredMaterials(filtered);
  };

  const toggleFilter = (value: string, selected: string[], setSelected: (val: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedType([]);
    setSelectedGeography([]);
    setSelectedTheme([]);
    setSelectedAudience([]);
    setSelectedPhase([]);
    setSelectedFormat([]);
    setSelectedAuthor([]);
    setSearchQuery('');
  };

  const activeFilterCount =
    selectedType.length +
    selectedGeography.length +
    selectedTheme.length +
    selectedAudience.length +
    selectedPhase.length +
    selectedFormat.length +
    selectedAuthor.length;

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="main-content" className="min-h-screen bg-neutral-50">
      <MetaTags
        title="Research & Materials"
        description="Browse articles, research papers, factsheets, and interviews on local government reorganisation. Comprehensive resource library for practitioners and policymakers."
        keywords="LGR research, council reform materials, reorganisation case studies, local government resources, unitary authority research"
      />
      <div className="relative bg-gradient-to-b from-teal-50 to-white py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-teal-700 pl-6 mb-3">
            <div className="text-xs font-bold tracking-widest text-teal-700 mb-1.5">
              RESEARCH LIBRARY
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 leading-[0.95] mb-3">
            Materials{' '}
            <span className="text-teal-700 font-serif italic">
              Library
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl">
            Search and explore all research, insights, case studies, and resources from the LGR Series
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <FilterSection
                    title="Type"
                    options={TYPE_OPTIONS}
                    selected={selectedType}
                    onChange={setSelectedType}
                    toggleFilter={toggleFilter}
                  />

                  <FilterSection
                    title="Geography"
                    options={GEOGRAPHY_OPTIONS}
                    selected={selectedGeography}
                    onChange={setSelectedGeography}
                    toggleFilter={toggleFilter}
                  />

                  <FilterSection
                    title="Theme"
                    options={THEME_OPTIONS}
                    selected={selectedTheme}
                    onChange={setSelectedTheme}
                    toggleFilter={toggleFilter}
                  />

                  <FilterSection
                    title="Audience"
                    options={AUDIENCE_OPTIONS}
                    selected={selectedAudience}
                    onChange={setSelectedAudience}
                    toggleFilter={toggleFilter}
                  />

                  <FilterSection
                    title="LGR Phase"
                    options={LGR_PHASE_OPTIONS}
                    selected={selectedPhase}
                    onChange={setSelectedPhase}
                    toggleFilter={toggleFilter}
                  />

                  <FilterSection
                    title="Format"
                    options={FORMAT_OPTIONS}
                    selected={selectedFormat}
                    onChange={setSelectedFormat}
                    toggleFilter={toggleFilter}
                  />

                  <FilterSection
                    title="Author"
                    options={AUTHOR_OPTIONS}
                    selected={selectedAuthor}
                    onChange={setSelectedAuthor}
                    toggleFilter={toggleFilter}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search materials"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort materials"
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <Filter size={20} />
                    {activeFilterCount > 0 && (
                      <span className="bg-cyan-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4 text-sm text-slate-600">
              Showing {filteredMaterials.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredMaterials.length)} of {filteredMaterials.length} {filteredMaterials.length === 1 ? 'result' : 'results'}
            </div>

            {filteredMaterials.length === 0 ? (
              <div className="bg-white rounded-xl p-12 shadow-lg border border-slate-200 text-center">
                <FileText className="mx-auto mb-4 text-slate-400" size={48} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">No materials found</h3>
                <p className="text-slate-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {paginatedMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:border-cyan-300 transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {material.image_url && (
                        <img
                          src={material.image_url}
                          alt={material.title}
                          loading="lazy"
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                          width={192}
                          height={128}
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs font-semibold rounded-full">
                            {material.type}
                          </span>
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                            {material.format}
                          </span>
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                            {new Date(material.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {material.editors_pick && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              Editor's Pick
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                          {material.title}
                        </h3>

                        {material.description && (
                          <p className="text-slate-600 mb-3 line-clamp-2">{material.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                          {material.author_name && <span>{material.author_name}</span>}
                          <span>{new Date(material.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {material.read_count > 0 && <span>{material.read_count} reads</span>}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => onNavigate('article', material.slug)}
                            aria-label={`Read more about ${material.title}`}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
                          >
                            Read more
                          </button>
                          {material.pdf_url && (
                            <a
                              href={material.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                              <Download size={16} />
                              PDF
                            </a>
                          )}
                          {material.external_url && (
                            <a
                              href={material.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                              <ExternalLink size={16} />
                              External Link
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            className={`px-4 py-2 border rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-cyan-600 text-white border-cyan-600'
                                : 'border-slate-300 hover:bg-slate-50'
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
                      className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <FAQSection page="materials" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LastUpdated />
      </div>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  toggleFilter: (value: string, selected: string[], setSelected: (val: string[]) => void) => void;
}

function FilterSection({ title, options, selected, onChange, toggleFilter }: FilterSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-b border-slate-200 pb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="font-semibold text-slate-900">{title}</span>
        <ArrowUpDown size={16} className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleFilter(option, selected, onChange)}
                className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
              />
              <span className="text-sm text-slate-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
