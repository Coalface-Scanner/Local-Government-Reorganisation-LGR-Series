import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useLocation } from 'react-router-dom';
import FAQSection from '../components/FAQSection';
import MetaTags from '../components/MetaTags';
import CollectionPageStructuredData from '../components/CollectionPageStructuredData';
import PageBanner from '../components/PageBanner';
import OptimizedImage from '../components/OptimizedImage';
import ErrorDisplay from '../components/ErrorDisplay';
import ContentTypeTag from '../components/ContentTypeTag';
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
  content_type: string | null;
  geography: string;
  theme: string;
  audience: string[];
  lgr_phase: string;
  format: string;
  author: string;
  author_name: string;
  image_url: string | null;
  thumbnail_image_url: string | null;
  pdf_url: string | null;
  external_url: string | null;
  source?: 'materials' | 'articles' | 'news'; // Track where the material came from
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
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 20;
  const location = useLocation();

  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedGeography, setSelectedGeography] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string[]>([]);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string[]>([]);

  useEffect(() => {
    fetchAllMaterials();
  }, []);

  const fetchAllMaterials = async () => {
    try {
      // Fetch from materials table
      const { data: materialsData } = await supabase
        .from('materials')
        .select('*')
        .order('published_date', { ascending: false });

      // Fetch published articles from articles table
      const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_date', { ascending: false });

      // Fetch published news from news table
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('published_date', { ascending: false });

      const allMaterials: Material[] = [];

      // Add materials as-is
      if (materialsData) {
        allMaterials.push(...materialsData.map(m => ({
          ...m,
          source: 'materials' as const
        })));
      }

      // Transform articles to material format
      if (articlesData) {
        const articleMaterials: Material[] = articlesData.map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          description: article.excerpt || null,
          published_date: article.published_date || article.created_at,
          read_count: 0, // Articles don't have read_count in the articles table
          editors_pick: article.featured || false,
          type: 'Insight', // Default type for articles
          content_type: article.content_type || 'Article',
          geography: article.region || 'National',
          theme: 'Governance', // Default theme
          audience: [],
          lgr_phase: '',
          format: 'Article',
          author: article.author || 'Coalface editorial',
          author_name: article.author || 'Coalface editorial',
          image_url: article.featured_image || null,
          thumbnail_image_url: null, // Articles don't have separate thumbnails yet
          pdf_url: null,
          external_url: null,
          source: 'articles' as const
        }));
        allMaterials.push(...articleMaterials);
      }

      // Transform news to material format
      if (newsData) {
        const newsMaterials: Material[] = newsData.map(news => ({
          id: news.id,
          title: news.title,
          slug: news.slug,
          description: news.excerpt || null,
          published_date: news.published_date,
          read_count: 0, // News doesn't have read_count
          editors_pick: false,
          type: 'Commentary', // Default type for news
          content_type: 'News Update',
          geography: 'National', // Default geography
          theme: 'Public trust and engagement', // Default theme
          audience: [],
          lgr_phase: '',
          format: 'Article',
          author: 'Coalface editorial',
          author_name: 'Coalface editorial',
          image_url: null,
          pdf_url: null,
          external_url: null,
          source: 'news' as const
        }));
        allMaterials.push(...newsMaterials);
      }

      // Sort all materials by published_date (newest first)
      allMaterials.sort((a, b) => {
        const dateA = new Date(a.published_date).getTime();
        const dateB = new Date(b.published_date).getTime();
        return dateB - dateA;
      });

      setMaterials(allMaterials);
      setError(null);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Failed to load materials. Please try refreshing the page.');
    }
  };

  const applyFiltersAndSort = useCallback(() => {
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
  }, [materials, searchQuery, sortBy, selectedType, selectedGeography, selectedTheme, selectedAudience, selectedPhase, selectedFormat, selectedAuthor]);


  useEffect(() => {
    applyFiltersAndSort();
    setCurrentPage(1);
  }, [applyFiltersAndSort]);

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
    <div id="main-content" className="min-h-screen bg-academic-cream">
      <MetaTags
        title="LGR Series Materials & Resources"
        description="Comprehensive library of articles, research papers, factsheets, and interviews from the Local Government Reorganisation (LGR) Series. Expert analysis on LGR governance, council reform, and unitary authorities."
        keywords="LGR Series, Local Government Reorganisation materials, LGR research, council reform materials, reorganisation case studies, local government resources, unitary authority research, LGR governance"
      />
      <CollectionPageStructuredData
        name="Research Library - Materials & Resources"
        description="Browse articles, research papers, factsheets, and interviews on local government reorganisation. Comprehensive resource library for practitioners and policymakers."
        url="/materials"
        numberOfItems={materials.length}
        items={materials.map(material => ({
          name: material.title,
          url: `/materials/${material.slug}`,
          description: material.description || undefined
        }))}
      />
      <PageBanner
        heroLabel="RESEARCH LIBRARY"
        heroTitle="LGR Series Materials"
        heroSubtitle="Search and explore all research, insights, case studies, and resources from the LGR Series on local government reorganisation and LGR governance"
        currentPath={location.pathname}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            <div className="academic-card p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-academic-neutral-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search materials"
                    className="w-full pl-12 pr-4 py-3 border border-academic-neutral-300 focus:ring-2 focus:ring-teal-700 focus:border-teal-700 bg-white font-serif"
                    style={{ borderRadius: '2px' }}
                  />
                </div>

                <div className="flex gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort materials"
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
                  title="Unable to Load Materials"
                  message={error}
                  onRetry={fetchAllMaterials}
                />
              </div>
            )}

            <div className="mb-6 text-academic-sm text-academic-neutral-600 font-serif">
              Showing {filteredMaterials.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredMaterials.length)} of {filteredMaterials.length} {filteredMaterials.length === 1 ? 'result' : 'results'}
            </div>

            {!error && filteredMaterials.length === 0 ? (
              <div className="academic-card p-12 text-center">
                <FileText className="mx-auto mb-6 text-academic-neutral-300" size={48} />
                <h3 className="text-academic-2xl font-display font-bold text-academic-charcoal mb-3">No materials found</h3>
                <p className="text-academic-base text-academic-neutral-600 mb-6 font-serif">Try adjusting your search or filters</p>
                <button
                  onClick={clearAllFilters}
                  className="academic-button academic-button-primary"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-8">
                  {paginatedMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="academic-card p-8 hover:border-teal-700 transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {(material.thumbnail_image_url || material.image_url) && (
                        <div className="w-full md:w-48 overflow-hidden">
                          <OptimizedImage
                            src={material.thumbnail_image_url || material.image_url || ''}
                            alt={material.title}
                            variant="thumbnail"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {material.source && (
                            <span className={`px-3 py-1 text-academic-xs font-display font-semibold ${
                              material.source === 'articles' 
                                ? 'bg-blue-50 text-blue-800' 
                                : material.source === 'news'
                                ? 'bg-purple-50 text-purple-800'
                                : 'bg-teal-50 text-teal-800'
                            }`} style={{ borderRadius: '2px' }}>
                              {material.source === 'articles' ? 'Article' : material.source === 'news' ? 'News' : 'Material'}
                            </span>
                          )}
                          {material.content_type && (
                            <ContentTypeTag contentType={material.content_type} />
                          )}
                          <span className="px-3 py-1 bg-teal-50 text-teal-800 text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
                            {material.type}
                          </span>
                          <span className="px-3 py-1 bg-academic-neutral-100 text-academic-neutral-700 text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
                            {material.format}
                          </span>
                          <span className="px-3 py-1 bg-academic-neutral-100 text-academic-neutral-700 text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
                            {new Date(material.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {material.editors_pick && (
                            <span className="px-3 py-1 bg-amber-50 text-amber-800 text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
                              Editor's Pick
                            </span>
                          )}
                        </div>

                        <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-3 group-hover:text-teal-700 transition-colors">
                          {material.title}
                        </h3>

                        {material.description && (
                          <p className="text-academic-base text-academic-neutral-700 mb-4 line-clamp-2 font-serif leading-relaxed">{material.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-academic-sm text-academic-neutral-600 mb-6 font-serif">
                          {material.author_name && <span>{material.author_name}</span>}
                          <span>{new Date(material.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {material.read_count > 0 && <span>{material.read_count} reads</span>}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {material.source === 'articles' ? (
                            <a
                              href={`/insights/${material.slug}`}
                              aria-label={`Read more about ${material.title}`}
                              className="academic-button academic-button-primary flex items-center gap-2"
                            >
                              Read more
                            </a>
                          ) : material.source === 'news' ? (
                            <a
                              href={`/news#${material.slug}`}
                              aria-label={`Read more about ${material.title}`}
                              className="academic-button academic-button-primary flex items-center gap-2"
                            >
                              Read more
                            </a>
                          ) : (
                            <button
                              onClick={() => onNavigate('article', material.slug)}
                              aria-label={`Read more about ${material.title}`}
                              className="academic-button academic-button-primary flex items-center gap-2"
                            >
                              Read more
                            </button>
                          )}
                          {material.pdf_url && (
                            <a
                              href={material.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="academic-button academic-button-secondary flex items-center gap-2"
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
                              className="academic-button academic-button-secondary flex items-center gap-2"
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
          </div>
        </div>
      </div>

      <FAQSection page="materials" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-academic-warm p-2" style={{ borderRadius: '2px' }}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleFilter(option, selected, onChange)}
                className="w-4 h-4 text-teal-700 border-academic-neutral-300 focus:ring-teal-700"
                style={{ borderRadius: '2px' }}
              />
              <span className="text-academic-sm text-academic-neutral-700 font-serif">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
