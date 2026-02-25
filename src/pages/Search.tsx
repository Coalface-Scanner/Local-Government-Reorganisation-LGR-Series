import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { Search as SearchIcon, Filter, MapPin, User, Tag, Calendar, Map } from 'lucide-react';
import { supabase } from '../lib/supabase';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import { trackSearch } from '../utils/analytics';
import FAQSection from '../components/FAQSection';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'article' | 'fact' | 'lesson' | 'interview' | 'material';
  author?: string;
  region?: string;
  category?: string;
  date?: string;
  slug?: string;
  featured?: boolean;
  score?: number; // For ranking
}

interface SearchProps {
  onNavigate: (page: string, slug?: string) => void;
}

const SEARCH_HISTORY_KEY = 'lgr_search_history';
const MAX_HISTORY_ITEMS = 10;

export default function Search({ onNavigate }: SearchProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    region: 'all',
    category: 'all',
    author: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);

  const loadSearchHistory = () => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        setSearchHistory(Array.isArray(history) ? history : []);
      }
    } catch (err) {
      console.error('Error loading search history:', err);
    }
  };

  const saveToHistory = useCallback((query: string) => {
    if (!query.trim()) return;
    try {
      const current = searchHistory.filter(q => q !== query);
      const updated = [query, ...current].slice(0, MAX_HISTORY_ITEMS);
      setSearchHistory(updated);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
    } catch (_err) {
      // Ignore localStorage errors
    }
  }, [searchHistory]);

  useEffect(() => {
    loadFilterOptions();
    loadSearchHistory();
    // If there's a query param, perform search on mount
    if (initialQuery) {
      performSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFilterOptions = async () => {
    const regions = new Set<string>();
    const categories = new Set<string>();
    const authors = new Set<string>();

    const { data: articles } = await supabase.from('articles').select('region, category, author');
    const { data: facts } = await supabase.from('facts').select('region, category');
    const { data: lessons } = await supabase.from('lessons').select('region, category');
    const { data: materials } = await supabase.from('materials').select('region, category, author');

    articles?.forEach(item => {
      if (item.region) regions.add(item.region);
      if (item.category) categories.add(item.category);
      if (item.author) authors.add(item.author);
    });

    facts?.forEach(item => {
      if (item.region) regions.add(item.region);
      if (item.category) categories.add(item.category);
    });

    lessons?.forEach(item => {
      if (item.region) regions.add(item.region);
      if (item.category) categories.add(item.category);
    });

    materials?.forEach(item => {
      if (item.region) regions.add(item.region);
      if (item.category) categories.add(item.category);
      if (item.author) authors.add(item.author);
    });

    setAvailableRegions(Array.from(regions).sort());
    setAvailableCategories(Array.from(categories).sort());
    setAvailableAuthors(Array.from(authors).sort());
  };

  const performSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    const allResults: SearchResult[] = [];

    const shouldSearchType = (type: string) => filters.type === 'all' || filters.type === type;

    const sanitizedQuery = searchQuery.trim().replace(/[%_]/g, '\\$&');

    try {
      if (shouldSearchType('article')) {
        let queryBuilder = supabase.from('articles').select('*').eq('status', 'published');

        if (sanitizedQuery) {
          queryBuilder = queryBuilder.or(`title.ilike.%${sanitizedQuery}%,body.ilike.%${sanitizedQuery}%,excerpt.ilike.%${sanitizedQuery}%`);
        }
        if (filters.region !== 'all') queryBuilder = queryBuilder.eq('region', filters.region);
        if (filters.category !== 'all') queryBuilder = queryBuilder.eq('category', filters.category);
        if (filters.author !== 'all') queryBuilder = queryBuilder.eq('author', filters.author);

        const { data, error } = await queryBuilder;
        if (error) throw error;
        if (data) {
          allResults.push(...data.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || '',
            type: 'article' as const,
            author: item.author,
            region: item.region,
            category: item.category,
            date: item.published_date,
            slug: item.slug,
            featured: item.featured,
          })));
        }
      }

      if (shouldSearchType('fact')) {
        let queryBuilder = supabase.from('facts').select('*').eq('published', true);

        if (sanitizedQuery) {
          queryBuilder = queryBuilder.or(`title.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`);
        }
        if (filters.region !== 'all') queryBuilder = queryBuilder.eq('region', filters.region);
        if (filters.category !== 'all') queryBuilder = queryBuilder.eq('category', filters.category);

        const { data, error } = await queryBuilder;
        if (error) throw error;
        if (data) {
          allResults.push(...data.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.content?.substring(0, 150) + '...' || '',
            type: 'fact' as const,
            region: item.region,
            category: item.category,
            date: item.created_at,
          })));
        }
      }

      if (shouldSearchType('lesson')) {
        let queryBuilder = supabase.from('lessons').select('*').eq('published', true);

        if (sanitizedQuery) {
          queryBuilder = queryBuilder.or(`title.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`);
        }
        if (filters.region !== 'all') queryBuilder = queryBuilder.eq('region', filters.region);
        if (filters.category !== 'all') queryBuilder = queryBuilder.eq('category', filters.category);

        const { data, error } = await queryBuilder;
        if (error) throw error;
        if (data) {
          allResults.push(...data.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.content?.substring(0, 150) + '...' || '',
            type: 'lesson' as const,
            region: item.region,
            category: item.category,
            date: item.created_at,
          })));
        }
      }

      if (shouldSearchType('interview')) {
        let queryBuilder = supabase.from('interviews').select('*').eq('published', true);

        if (sanitizedQuery) {
          queryBuilder = queryBuilder.or(`title.ilike.%${sanitizedQuery}%,interviewee.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`);
        }

        const { data, error } = await queryBuilder;
        if (error) throw error;
        if (data) {
          allResults.push(...data.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.description || '',
            type: 'interview' as const,
            author: item.interviewee,
            date: item.interview_date,
        })));
      }
    }

      if (shouldSearchType('material')) {
        let queryBuilder = supabase.from('materials').select('*').eq('published', true);

        if (sanitizedQuery) {
          queryBuilder = queryBuilder.or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`);
        }
        if (filters.region !== 'all') queryBuilder = queryBuilder.eq('region', filters.region);
        if (filters.category !== 'all') queryBuilder = queryBuilder.eq('category', filters.category);
        if (filters.author !== 'all') queryBuilder = queryBuilder.eq('author', filters.author);

        const { data, error } = await queryBuilder;
        if (error) throw error;
        if (data) {
          allResults.push(...data.map(item => ({
            id: item.id,
            title: item.title,
            excerpt: item.description || '',
            type: 'material' as const,
            author: item.author,
            region: item.region,
            category: item.category,
            date: item.publication_date,
          })));
        }
      }

      // Improved ranking algorithm
      const rankedResults = allResults.map(result => {
        let score = 0;
        const queryLower = sanitizedQuery.toLowerCase();
        const titleLower = result.title.toLowerCase();
        const excerptLower = result.excerpt.toLowerCase();

        // Title matches score higher
        if (titleLower.includes(queryLower)) {
          score += 10;
          if (titleLower.startsWith(queryLower)) {
            score += 5; // Exact start match scores even higher
          }
        }

        // Exact title match scores highest
        if (titleLower === queryLower) {
          score += 20;
        }

        // Excerpt matches score lower
        if (excerptLower.includes(queryLower)) {
          score += 3;
        }

        // Featured articles get a boost
        if (result.featured) {
          score += 5;
        }

        // Recent articles get a small boost
        if (result.date) {
          const daysSincePublished = (Date.now() - new Date(result.date).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSincePublished < 30) {
            score += 2;
          }
        }

        return { ...result, score };
      });

      // Sort by score (highest first), then by date
      rankedResults.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        return dateB - dateA;
      });

      // Save to search history if query exists
      if (sanitizedQuery) {
        saveToHistory(sanitizedQuery);
        // Track search
        trackSearch(sanitizedQuery, rankedResults.length);
      }

      setResults(rankedResults);
    } catch (_err: unknown) {
      setError('Failed to perform search. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, saveToHistory]);

  useEffect(() => {
    if (searchQuery.trim() || initialQuery) {
      performSearch();
    }
  }, [performSearch, initialQuery, searchQuery]);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      article: 'Article',
      fact: 'Data & Fact',
      lesson: 'Lesson',
      interview: 'Interview',
      material: 'Material',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      article: 'bg-blue-100 text-blue-800',
      fact: 'bg-green-100 text-green-800',
      lesson: 'bg-purple-100 text-purple-800',
      interview: 'bg-orange-100 text-orange-800',
      material: 'bg-cyan-100 text-cyan-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'article' && result.slug) {
      onNavigate('insights', result.slug);
    } else if (result.type === 'fact') {
      onNavigate('facts');
    } else if (result.type === 'lesson') {
      onNavigate('lessons');
    } else if (result.type === 'interview') {
      onNavigate('interviews');
    } else if (result.type === 'material') {
      onNavigate('materials');
    }
  };

  return (
    <div id="main-content" className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Search - LGR Initiative Library"
        description="Search and browse all published articles, reports, data, and insights on local government reorganisation. Filter by type, region, category, or author."
        keywords="LGR search, local government reorganisation articles, council reform research, search library"
      />
      <PageBanner
        heroLabel="LIBRARY"
        heroTitle="Search & Browse"
        heroSubtitle="Search and browse all published articles, reports, data, and insights on local government reorganisation"
        currentPath={location.pathname}
      />
      <div className="layout-container layout-content-sub">

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 academic-card">
            <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-neutral-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search by keyword, title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search content"
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-academic-neutral-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors bg-white text-academic-charcoal font-serif"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-academic-charcoal hover:text-teal-700 transition-colors font-display font-medium"
            >
              <Filter className="w-5 h-5" />
              <span>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </span>
            </button>
            <Link
              to="/roadmap"
              className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-display font-medium"
            >
              <Map className="w-5 h-5" />
              View by journey milestone
            </Link>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-academic-warm rounded-xl">
              <div>
                <label className="block text-sm font-medium text-academic-charcoal mb-2 font-display">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Content Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  aria-label="Filter by content type"
                  className="w-full px-3 py-2 border border-academic-neutral-300 rounded-lg focus:border-teal-500 focus:outline-none bg-white text-academic-charcoal font-serif"
                >
                  <option value="all">All Types</option>
                  <option value="article">Articles</option>
                  <option value="fact">Data & Facts</option>
                  <option value="lesson">Lessons</option>
                  <option value="interview">Interviews</option>
                  <option value="material">Materials</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-charcoal mb-2 font-display">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Region
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  aria-label="Filter by region"
                  className="w-full px-3 py-2 border border-academic-neutral-300 rounded-lg focus:border-teal-500 focus:outline-none bg-white text-academic-charcoal font-serif"
                >
                  <option value="all">All Regions</option>
                  {availableRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-charcoal mb-2 font-display">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  aria-label="Filter by category"
                  className="w-full px-3 py-2 border border-academic-neutral-300 rounded-lg focus:border-teal-500 focus:outline-none bg-white text-academic-charcoal font-serif"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-charcoal mb-2 font-display">
                  <User className="w-4 h-4 inline mr-1" />
                  Author
                </label>
                <select
                  value={filters.author}
                  onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                  aria-label="Filter by author"
                  className="w-full px-3 py-2 border border-academic-neutral-300 rounded-lg focus:border-teal-500 focus:outline-none bg-white text-academic-charcoal font-serif"
                >
                  <option value="all">All Authors</option>
                  {availableAuthors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
            <p className="mt-4 text-academic-neutral-600 font-serif">Searching...</p>
          </div>
        ) : (
          <div className="space-y-4" aria-live="polite" aria-atomic="false">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-serif">
                {error}
              </div>
            )}
            {results.length === 0 && !error ? (
              <div className="text-center py-6 bg-white rounded-2xl shadow-lg academic-card">
                <SearchIcon className="w-16 h-16 text-academic-neutral-300 mx-auto mb-4" />
                <p className="text-xl text-academic-neutral-600 font-serif">
                  No results found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-academic-neutral-600 mb-4 font-serif">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
                {results.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-l-4 border-teal-500 hover:border-teal-600 academic-card"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-academic-charcoal hover:text-teal-700 transition-colors flex-1 font-display">
                        {result.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {result.featured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md whitespace-nowrap font-display">
                            Exclusive
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(result.type)} font-display`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                    </div>

                    <p className="text-academic-neutral-600 mb-4 line-clamp-2 font-serif">
                      {result.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-academic-neutral-500 font-serif">
                      {result.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {result.author}
                        </span>
                      )}
                      {result.region && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {result.region}
                        </span>
                      )}
                      {result.category && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {result.category}
                        </span>
                      )}
                      {result.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(result.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      <FAQSection page="library" />
    </div>
  );
}
