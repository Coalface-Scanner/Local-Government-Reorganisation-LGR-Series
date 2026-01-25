import { useState, useEffect } from 'react';
import { Archive, RotateCcw, Trash2, Search, FileText, Newspaper, TrendingDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ArchivedItem {
  id: string;
  title: string;
  slug: string;
  content_type: string | null;
  theme: string | null;
  archived_at: string;
  archived_by: string | null;
  source: 'articles' | 'materials' | 'news';
  published_date?: string;
  created_at: string;
}

export default function ArchiveManager() {
  const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    contentType: 'all',
    theme: 'all',
    source: 'all',
    dateRange: 'all',
  });
  const [stats, setStats] = useState({
    total: 0,
    byType: {} as Record<string, number>,
    bySource: {} as Record<string, number>,
    oldestArchive: null as string | null,
  });
  const { user: _user } = useAuth();

  useEffect(() => {
    fetchArchivedContent();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [archivedItems]);

  const fetchArchivedContent = async () => {
    setLoading(true);
    try {
      // Fetch archived articles
      const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, slug, content_type, theme, archived_at, archived_by, published_date, created_at')
        .eq('status', 'archived')
        .order('archived_at', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch archived materials
      const { data: materials, error: materialsError } = await supabase
        .from('materials')
        .select('id, title, slug, content_type, theme, archived_at, archived_by, published_date, created_at')
        .eq('status', 'archived')
        .order('archived_at', { ascending: false });

      if (materialsError) throw materialsError;

      // Fetch archived news
      const { data: news, error: newsError } = await supabase
        .from('news')
        .select('id, title, slug, archived_at, archived_by, published_date, created_at')
        .eq('status', 'archived')
        .order('archived_at', { ascending: false });

      if (newsError) throw newsError;

      const allArchived: ArchivedItem[] = [
        ...(articles || []).map(item => ({ ...item, source: 'articles' as const, content_type: item.content_type || null })),
        ...(materials || []).map(item => ({ ...item, source: 'materials' as const, content_type: item.content_type || null })),
        ...(news || []).map(item => ({ ...item, source: 'news' as const, content_type: null, theme: null })),
      ];

      setArchivedItems(allArchived);
    } catch (error) {
      console.error('Error fetching archived content:', error);
      alert('Failed to load archived content');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const stats = {
      total: archivedItems.length,
      byType: {} as Record<string, number>,
      bySource: {} as Record<string, number>,
      oldestArchive: null as string | null,
    };

    archivedItems.forEach(item => {
      // Count by content type
      const type = item.content_type || 'Uncategorized';
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // Count by source
      stats.bySource[item.source] = (stats.bySource[item.source] || 0) + 1;

      // Find oldest archive date
      if (item.archived_at) {
        if (!stats.oldestArchive || item.archived_at < stats.oldestArchive) {
          stats.oldestArchive = item.archived_at;
        }
      }
    });

    setStats(stats);
  };

  const filteredItems = archivedItems.filter(item => {
    // Search filter
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Content type filter
    if (filters.contentType !== 'all' && item.content_type !== filters.contentType) {
      return false;
    }

    // Theme filter
    if (filters.theme !== 'all' && item.theme !== filters.theme) {
      return false;
    }

    // Source filter
    if (filters.source !== 'all' && item.source !== filters.source) {
      return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all' && item.archived_at) {
      const archiveDate = new Date(item.archived_at);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - archiveDate.getTime()) / (1000 * 60 * 60 * 24));

      if (filters.dateRange === 'week' && daysDiff > 7) return false;
      if (filters.dateRange === 'month' && daysDiff > 30) return false;
      if (filters.dateRange === 'year' && daysDiff > 365) return false;
    }

    return true;
  });

  const handleRestore = async (item: ArchivedItem) => {
    if (!confirm(`Restore "${item.title}" to draft status?`)) return;

    try {
      const table = item.source;
      const { error } = await supabase
        .from(table)
        .update({
          status: 'draft',
          archived_at: null,
          archived_by: null,
        })
        .eq('id', item.id);

      if (error) throw error;

      await fetchArchivedContent();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error restoring item:', error);
      alert('Failed to restore item');
    }
  };

  const handleDelete = async (item: ArchivedItem) => {
    if (!confirm(`Permanently delete "${item.title}"? This action cannot be undone.`)) return;

    try {
      const table = item.source;
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      await fetchArchivedContent();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleBulkRestore = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Restore ${selectedItems.size} item(s) to draft status?`)) return;

    try {
      const itemsToRestore = archivedItems.filter(item => selectedItems.has(item.id));
      const updatesByTable: Record<string, string[]> = {};

      itemsToRestore.forEach(item => {
        if (!updatesByTable[item.source]) {
          updatesByTable[item.source] = [];
        }
        updatesByTable[item.source].push(item.id);
      });

      for (const [table, ids] of Object.entries(updatesByTable)) {
        const { error } = await supabase
          .from(table)
          .update({
            status: 'draft',
            archived_at: null,
            archived_by: null,
          })
          .in('id', ids);

        if (error) throw error;
      }

      await fetchArchivedContent();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error bulk restoring:', error);
      alert('Failed to restore items');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Permanently delete ${selectedItems.size} item(s)? This action cannot be undone.`)) return;

    try {
      const itemsToDelete = archivedItems.filter(item => selectedItems.has(item.id));
      const deletesByTable: Record<string, string[]> = {};

      itemsToDelete.forEach(item => {
        if (!deletesByTable[item.source]) {
          deletesByTable[item.source] = [];
        }
        deletesByTable[item.source].push(item.id);
      });

      for (const [table, ids] of Object.entries(deletesByTable)) {
        const { error } = await supabase
          .from(table)
          .delete()
          .in('id', ids);

        if (error) throw error;
      }

      await fetchArchivedContent();
      setSelectedItems(new Set());
    } catch (error) {
      console.error('Error bulk deleting:', error);
      alert('Failed to delete items');
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const getContentTypeOptions = () => {
    const types = new Set<string>();
    archivedItems.forEach(item => {
      if (item.content_type) types.add(item.content_type);
    });
    return Array.from(types).sort();
  };

  const getThemeOptions = () => {
    const themes = new Set<string>();
    archivedItems.forEach(item => {
      if (item.theme) themes.add(item.theme);
    });
    return Array.from(themes).sort();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-slate-600">Loading archived content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Archive className="w-8 h-8" />
            Archive Manager
          </h2>
          <p className="text-slate-600 mt-1">
            Manage archived content from articles, materials, and news
          </p>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-slate-600" />
            <h3 className="text-sm font-medium text-slate-600">Total Archived</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-slate-600" />
            <h3 className="text-sm font-medium text-slate-600">Articles</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.bySource.articles || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-slate-600" />
            <h3 className="text-sm font-medium text-slate-600">Materials</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.bySource.materials || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper className="w-6 h-6 text-slate-600" />
            <h3 className="text-sm font-medium text-slate-600">News</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.bySource.news || 0}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archived content..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content Type</label>
            <select
              value={filters.contentType}
              onChange={(e) => setFilters({ ...filters, contentType: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {getContentTypeOptions().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
            <select
              value={filters.theme}
              onChange={(e) => setFilters({ ...filters, theme: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Themes</option>
              {getThemeOptions().map(theme => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Source</label>
            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="articles">Articles</option>
              <option value="materials">Materials</option>
              <option value="news">News</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Archive Date</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg flex items-center justify-between">
          <span className="text-teal-800 font-medium">
            {selectedItems.size} item(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkRestore}
              className="flex items-center gap-2 px-4 py-2 bg-white text-teal-700 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restore Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Archived Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
            <Archive className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No archived content</h3>
            <p className="text-slate-600">
              {archivedItems.length === 0
                ? 'No content has been archived yet.'
                : 'No items match your filters.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-600">
                Showing {filteredItems.length} of {archivedItems.length} archived items
              </p>
              <button
                onClick={toggleSelectAll}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            {filteredItems.map((item) => (
              <div
                key={`${item.source}-${item.id}`}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="mt-1 w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {item.source}
                      </span>
                      {item.content_type && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                          {item.content_type}
                        </span>
                      )}
                      {item.theme && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          {item.theme}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <span>/{item.source}/{item.slug}</span>
                      {item.archived_at && (
                        <>
                          <span>•</span>
                          <span>
                            Archived {new Date(item.archived_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(item)}
                      className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Restore to draft"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Permanently delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
