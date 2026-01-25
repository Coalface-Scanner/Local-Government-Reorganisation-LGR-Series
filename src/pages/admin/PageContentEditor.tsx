import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface PageContent {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  content: string;
  metadata: Record<string, any>;
  order_index: number;
}

const AVAILABLE_PAGES = [
  { value: 'contact', label: 'Contact Page' },
  { value: 'subscribe', label: 'Subscribe Page' },
];

export default function PageContentEditor() {
  const [content, setContent] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState('contact');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    page_slug: 'contact',
    section_key: '',
    title: '',
    content: '',
    metadata: {} as Record<string, any>,
    order_index: 0,
  });

  useEffect(() => {
    fetchContent();
  }, [selectedPage]);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_slug', selectedPage)
      .order('order_index');

    if (!error && data) {
      setContent(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('page_content')
      .insert([{
        ...formData,
        metadata: formData.metadata || {},
      }]);

    if (!error) {
      await updateSiteTimestamp();
      fetchContent();
      resetForm();
      setIsCreating(false);
    } else {
      alert('Error creating page content: ' + error.message);
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('page_content')
      .update({
        ...formData,
        metadata: formData.metadata || {},
      })
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchContent();
      resetForm();
      setEditingId(null);
    } else {
      alert('Error updating page content: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content section?')) {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchContent();
      } else {
        alert('Error deleting page content: ' + error.message);
      }
    }
  };

  const startEdit = (item: PageContent) => {
    setFormData({
      page_slug: item.page_slug,
      section_key: item.section_key,
      title: item.title || '',
      content: item.content,
      metadata: item.metadata || {},
      order_index: item.order_index,
    });
    setEditingId(item.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      page_slug: selectedPage,
      section_key: '',
      title: '',
      content: '',
      metadata: {},
      order_index: 0,
    });
  };

  if (loading) {
    return <div className="text-slate-600">Loading page content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Page Content</h2>
        <button
          onClick={() => {
            resetForm();
            setIsCreating(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <Plus size={18} />
          Add Section
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Page
        </label>
        <select
          value={selectedPage}
          onChange={(e) => {
            setSelectedPage(e.target.value);
            setFormData({ ...formData, page_slug: e.target.value });
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
        >
          {AVAILABLE_PAGES.map((page) => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit Page Content' : 'New Page Content'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Section Key (e.g., hero_title, hero_description)
              </label>
              <input
                type="text"
                value={formData.section_key}
                onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="hero_title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Section title..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content
              </label>
              <WYSIWYGEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Page content..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Order Index
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
              >
                <Save size={18} />
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setIsCreating(false);
                  setEditingId(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {content.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {item.section_key}
                  </span>
                  <span className="text-slate-500 text-sm">Order: {item.order_index}</span>
                </div>
                {item.title && (
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                )}
                <div className="text-slate-600 mb-3" dangerouslySetInnerHTML={{ __html: item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '') }} />
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {content.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No page content yet. Click "Add Section" to create one.
        </div>
      )}
    </div>
  );
}
