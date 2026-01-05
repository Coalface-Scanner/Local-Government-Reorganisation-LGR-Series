import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, MapPin, User, Tag, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
}

interface SearchProps {
  onNavigate: (page: string, slug?: string) => void;
}

export default function Search({ onNavigate }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    region: 'all',
    category: 'all',
    author: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchQuery, filters]);

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

  const performSearch = async () => {
    setLoading(true);
    const allResults: SearchResult[] = [];

    const shouldSearchType = (type: string) => filters.type === 'all' || filters.type === type;

    const sanitizedQuery = searchQuery.trim().replace(/[%_]/g, '\\$&');

    if (shouldSearchType('article')) {
      let query = supabase.from('articles').select('*').eq('status', 'published');

      if (sanitizedQuery) {
        query = query.or(`title.ilike.%${sanitizedQuery}%,body.ilike.%${sanitizedQuery}%,excerpt.ilike.%${sanitizedQuery}%`);
      }
      if (filters.region !== 'all') query = query.eq('region', filters.region);
      if (filters.category !== 'all') query = query.eq('category', filters.category);
      if (filters.author !== 'all') query = query.eq('author', filters.author);

      const { data } = await query;
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
      let query = supabase.from('facts').select('*').eq('published', true);

      if (sanitizedQuery) {
        query = query.or(`title.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`);
      }
      if (filters.region !== 'all') query = query.eq('region', filters.region);
      if (filters.category !== 'all') query = query.eq('category', filters.category);

      const { data } = await query;
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
      let query = supabase.from('lessons').select('*').eq('published', true);

      if (sanitizedQuery) {
        query = query.or(`title.ilike.%${sanitizedQuery}%,content.ilike.%${sanitizedQuery}%`);
      }
      if (filters.region !== 'all') query = query.eq('region', filters.region);
      if (filters.category !== 'all') query = query.eq('category', filters.category);

      const { data } = await query;
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
      let query = supabase.from('interviews').select('*').eq('published', true);

      if (sanitizedQuery) {
        query = query.or(`title.ilike.%${sanitizedQuery}%,interviewee.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`);
      }

      const { data } = await query;
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
      let query = supabase.from('materials').select('*').eq('published', true);

      if (sanitizedQuery) {
        query = query.or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`);
      }
      if (filters.region !== 'all') query = query.eq('region', filters.region);
      if (filters.category !== 'all') query = query.eq('category', filters.category);
      if (filters.author !== 'all') query = query.eq('author', filters.author);

      const { data } = await query;
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

    allResults.sort((a, b) => {
      const dateA = new Date(a.date || '').getTime();
      const dateB = new Date(b.date || '').getTime();
      return dateB - dateA;
    });

    setResults(allResults);
    setLoading(false);
  };

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
      onNavigate('insights-article', result.slug);
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
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Library
          </h1>
          <p className="text-xl text-gray-600">
            Browse and search all published articles, reports, data, and insights
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search by keyword, title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search content"
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors mb-4"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </span>
          </button>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Content Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  aria-label="Filter by content type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Region
                </label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                  aria-label="Filter by region"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Regions</option>
                  {availableRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  aria-label="Filter by category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Author
                </label>
                <select
                  value={filters.author}
                  onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                  aria-label="Filter by author"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
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
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : (
          <div className="space-y-4" aria-live="polite" aria-atomic="false">
            {results.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-600">
                  No results found. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-600 mb-4">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
                {results.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-l-4 border-blue-500 hover:border-blue-600"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors flex-1">
                        {result.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {result.featured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md whitespace-nowrap">
                            Exclusive
                          </span>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {result.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
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
    </div>
  );
}
