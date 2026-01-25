import { Filter, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterOptions {
  status?: string;
  contentType?: string;
  theme?: string;
  author?: string;
  geography?: string;
  lgrPhase?: string;
  dateRange?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface FilterPanelProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  availableOptions?: {
    contentTypes?: string[];
    themes?: string[];
    authors?: string[];
    geographies?: string[];
    lgrPhases?: string[];
  };
  showStatusFilter?: boolean;
  showContentTypeFilter?: boolean;
  showThemeFilter?: boolean;
  showAuthorFilter?: boolean;
  showGeographyFilter?: boolean;
  showLgrPhaseFilter?: boolean;
  showDateRangeFilter?: boolean;
  showSortOptions?: boolean;
  className?: string;
}

export default function FilterPanel({
  filters,
  onChange,
  availableOptions = {},
  showStatusFilter = true,
  showContentTypeFilter = true,
  showThemeFilter = true,
  showAuthorFilter = false,
  showGeographyFilter = false,
  showLgrPhaseFilter = false,
  showDateRangeFilter = true,
  showSortOptions = true,
  className = '',
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== 'all');

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
          hasActiveFilters
            ? 'bg-teal-50 border-teal-300 text-teal-700'
            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-teal-600 text-white text-xs px-2 py-0.5 rounded-full">
            {Object.values(filters).filter(v => v && v !== 'all').length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-50 min-w-[300px] max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Filters</h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-slate-600 hover:text-slate-900"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {showStatusFilter && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={filters.status || 'all'}
                    onChange={(e) => updateFilter('status', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              )}

              {showContentTypeFilter && availableOptions.contentTypes && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Content Type</label>
                  <select
                    value={filters.contentType || 'all'}
                    onChange={(e) => updateFilter('contentType', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Types</option>
                    {availableOptions.contentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {showThemeFilter && availableOptions.themes && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                  <select
                    value={filters.theme || 'all'}
                    onChange={(e) => updateFilter('theme', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Themes</option>
                    {availableOptions.themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
              )}

              {showAuthorFilter && availableOptions.authors && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Author</label>
                  <select
                    value={filters.author || 'all'}
                    onChange={(e) => updateFilter('author', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Authors</option>
                    {availableOptions.authors.map(author => (
                      <option key={author} value={author}>{author}</option>
                    ))}
                  </select>
                </div>
              )}

              {showGeographyFilter && availableOptions.geographies && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Geography</label>
                  <select
                    value={filters.geography || 'all'}
                    onChange={(e) => updateFilter('geography', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Geographies</option>
                    {availableOptions.geographies.map(geo => (
                      <option key={geo} value={geo}>{geo}</option>
                    ))}
                  </select>
                </div>
              )}

              {showLgrPhaseFilter && availableOptions.lgrPhases && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">LGR Phase</label>
                  <select
                    value={filters.lgrPhase || 'all'}
                    onChange={(e) => updateFilter('lgrPhase', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Phases</option>
                    {availableOptions.lgrPhases.map(phase => (
                      <option key={phase} value={phase}>{phase}</option>
                    ))}
                  </select>
                </div>
              )}

              {showDateRangeFilter && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange || 'all'}
                    onChange={(e) => updateFilter('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 90 Days</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              )}

              {showSortOptions && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                    <select
                      value={filters.sortBy || 'updated_at'}
                      onChange={(e) => updateFilter('sortBy', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    >
                      <option value="updated_at">Last Updated</option>
                      <option value="created_at">Created Date</option>
                      <option value="published_date">Published Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
                    <select
                      value={filters.sortOrder || 'desc'}
                      onChange={(e) => updateFilter('sortOrder', e.target.value as 'asc' | 'desc')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
