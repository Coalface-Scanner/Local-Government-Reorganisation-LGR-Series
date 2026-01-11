import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  published_date: string;
  content: string;
  embed_code: string | null;
  excerpt: string | null;
  published: boolean;
  display_order: number;
}

export default function NewsEditor() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    published_date: new Date().toISOString().split('T')[0],
    content: '',
    embed_code: '',
    excerpt: '',
    published: false,
    display_order: 0,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('display_order', { ascending: true })
      .order('published_date', { ascending: false });

    if (!error && data) {
      setNewsItems(data);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleCreate = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsEditor.tsx:59',message:'handleCreate called',data:{title:formData.title,slug:formData.slug},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (!formData.title || !formData.slug) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsEditor.tsx:62',message:'Validation failed',data:{hasTitle:!!formData.title,hasSlug:!!formData.slug},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      alert('Title and slug are required');
      return;
    }

    const dataToInsert = {
      ...formData,
      embed_code: formData.embed_code || null,
      excerpt: formData.excerpt || null,
    };

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsEditor.tsx:71',message:'Before insert call',data:{dataToInsert},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    const { error } = await supabase
      .from('news')
      .insert([dataToInsert]);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsEditor.tsx:75',message:'After insert call',data:{error:error?.message,hasError:!!error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    if (!error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsEditor.tsx:78',message:'Insert successful',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      await updateSiteTimestamp();
      fetchNews();
      resetForm();
      setIsCreating(false);
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'NewsEditor.tsx:82',message:'Insert failed with error',data:{errorMessage:error.message,errorCode:error.code,errorDetails:error.details},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      alert('Error creating news: ' + error.message);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.title || !formData.slug) {
      alert('Title and slug are required');
      return;
    }

    const dataToUpdate = {
      ...formData,
      embed_code: formData.embed_code || null,
      excerpt: formData.excerpt || null,
    };

    const { error } = await supabase
      .from('news')
      .update(dataToUpdate)
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchNews();
      resetForm();
      setEditingId(null);
    } else {
      alert('Error updating news: ' + error.message);
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

  const togglePublished = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('news')
      .update({ published: !currentStatus })
      .eq('id', id);

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
      content: item.content,
      embed_code: item.embed_code || '',
      excerpt: item.excerpt || '',
      published: item.published,
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
      published: false,
      display_order: 0,
    });
  };

  if (loading) {
    return <div className="text-slate-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
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
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
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
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-slate-700">
                  Published
                </label>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="display_order" className="text-sm font-medium text-slate-700">
                  Display Order:
                </label>
                <input
                  type="number"
                  id="display_order"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {newsItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {item.display_order}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-slate-500 text-xs">{item.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {new Date(item.published_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePublished(item.id, item.published)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        item.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
                      {item.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
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
  );
}
