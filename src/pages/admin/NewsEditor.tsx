import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';
import ErrorMessage from '../../components/admin/ErrorMessage';
import { sanitizeEmbedCode, sanitizeHtmlContent } from '../../lib/htmlSanitizer';

type NewsStatus = 'draft' | 'published' | 'archived';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  published_date: string;
  content: string;
  embed_code: string | null;
  excerpt: string | null;
  status: NewsStatus;
  display_order: number;
}

interface RawNewsItem extends Partial<NewsItem> {
  published?: boolean;
}

export default function NewsEditor() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [editorInstanceId] = useState(() => `news-editor-${Date.now()}`);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    published_date: new Date().toISOString().split('T')[0],
    content: '',
    embed_code: '',
    excerpt: '',
    status: 'draft' as NewsStatus,
    display_order: 0,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const normalizeStatus = (item: RawNewsItem): NewsStatus => {
    if (item.status === 'published' || item.status === 'archived' || item.status === 'draft') {
      return item.status;
    }
    return item.published ? 'published' : 'draft';
  };

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('display_order', { ascending: true })
      .order('published_date', { ascending: false });

    if (!error && data) {
      const normalized = (data as RawNewsItem[]).map((item) => ({
        id: String(item.id),
        title: String(item.title || ''),
        slug: String(item.slug || ''),
        published_date: String(item.published_date || new Date().toISOString().split('T')[0]),
        content: String(item.content || ''),
        embed_code: item.embed_code || null,
        excerpt: item.excerpt || null,
        status: normalizeStatus(item),
        display_order: Number(item.display_order || 0),
      }));
      setNewsItems(normalized);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const buildPayload = () => ({
    title: formData.title,
    slug: formData.slug,
    published_date: formData.published_date,
    content: sanitizeHtmlContent(formData.content),
    embed_code: formData.embed_code ? sanitizeEmbedCode(formData.embed_code) : null,
    excerpt: formData.excerpt || null,
    status: formData.status,
    display_order: formData.display_order,
  });

  const persistWithFallback = async (mode: 'insert' | 'update', id?: string) => {
    const payload = buildPayload();

    let result;
    if (mode === 'insert') {
      result = await supabase.from('news').insert([payload]);
    } else {
      result = await supabase.from('news').update(payload).eq('id', id);
    }

    if (!result.error) {
      return { error: null as null | Error };
    }

    // Legacy fallback for old schema (published boolean without status)
    if (result.error.message.toLowerCase().includes('status')) {
      const legacyPayload = {
        ...payload,
        published: payload.status === 'published',
      } as Record<string, unknown>;
      delete legacyPayload.status;

      if (mode === 'insert') {
        const fallback = await supabase.from('news').insert([legacyPayload]);
        return { error: fallback.error as Error | null };
      }

      const fallback = await supabase.from('news').update(legacyPayload).eq('id', id);
      return { error: fallback.error as Error | null };
    }

    return { error: result.error as Error | null };
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.slug) {
      setError('Title and slug are required');
      return;
    }
    setError('');

    const { error: persistError } = await persistWithFallback('insert');

    if (!persistError) {
      await updateSiteTimestamp();
      fetchNews();
      resetForm();
      setIsCreating(false);
      setError('');
    } else {
      setError('Error creating news: ' + persistError.message);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.title || !formData.slug) {
      setError('Title and slug are required');
      return;
    }
    setError('');

    const { error: persistError } = await persistWithFallback('update', id);

    if (!persistError) {
      await updateSiteTimestamp();
      fetchNews();
      resetForm();
      setEditingId(null);
      setError('');
    } else {
      setError('Error updating news: ' + persistError.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchNews();
      }
    }
  };

  const togglePublished = async (id: string, currentStatus: NewsStatus) => {
    const nextStatus: NewsStatus = currentStatus === 'published' ? 'draft' : 'published';

    let { error } = await supabase
      .from('news')
      .update({ status: nextStatus })
      .eq('id', id);

    if (error && error.message.toLowerCase().includes('status')) {
      const fallback = await supabase
        .from('news')
        .update({ published: nextStatus === 'published' })
        .eq('id', id);
      error = fallback.error;
    }

    if (!error) {
      await updateSiteTimestamp();
      fetchNews();
    }
  };

  const startEdit = (item: NewsItem) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      published_date: item.published_date,
      content: item.content || '',
      embed_code: item.embed_code || '',
      excerpt: item.excerpt || '',
      status: item.status,
      display_order: item.display_order,
    });
    setEditingId(item.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      published_date: new Date().toISOString().split('T')[0],
      content: '',
      embed_code: '',
      excerpt: '',
      status: 'draft',
      display_order: 0,
    });
  };

  if (loading) {
    return <div className="text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError('')} />
      )}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">News Editor</h2>
          <p className="text-slate-600 mt-1">
            Manage news articles and updates
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus size={20} />
          Add News
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              {isCreating ? 'Create News' : 'Edit News'}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                resetForm();
              }}
              className="text-slate-500 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (isCreating) {
                    setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
                  }
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-500 mt-1">URL-friendly identifier (e.g., my-news-article)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Published Date *
              </label>
              <input
                type="date"
                value={formData.published_date}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Short summary for listings"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Content *
              </label>
              <WYSIWYGEditor
                key={editorInstanceId}
                value={formData.content || ''}
                onChange={(value) => {
                  if (value && (value.includes('Cannot read properties') || value.includes("reading 'delta'"))) {
                    return;
                  }
                  setFormData({ ...formData, content: value || '' });
                }}
                placeholder="Enter news content here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Embed Code
              </label>
              <textarea
                value={formData.embed_code}
                onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent font-mono text-sm"
                placeholder="<iframe src=...></iframe>"
              />
              <p className="text-xs text-slate-500 mt-1">Optional embed code (e.g., Spotify, YouTube)</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label htmlFor="status" className="text-sm font-medium text-slate-700">
                  Status:
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as NewsStatus })}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="display_order" className="text-sm font-medium text-slate-700">
                  Display Order:
                </label>
                <input
                  type="number"
                  id="display_order"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Save size={20} />
                {isCreating ? 'Create' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {newsItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-900">{item.display_order}</td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-slate-900">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-slate-500 text-xs sm:hidden mt-1">{new Date(item.published_date).toLocaleDateString('en-GB')}</div>
                      <div className="text-slate-500 text-xs hidden sm:block">{item.slug}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-900 hidden sm:table-cell">{new Date(item.published_date).toLocaleDateString('en-GB')}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePublished(item.id, item.status)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold min-h-[32px] ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'archived'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status === 'published' ? <Eye size={14} /> : <EyeOff size={14} />}
                        <span className="hidden sm:inline">{item.status === 'published' ? 'Published' : item.status === 'archived' ? 'Archived' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-slate-600 hover:text-slate-900 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                          title="Edit"
                          aria-label="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {newsItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No news items yet. Click "Add News" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
