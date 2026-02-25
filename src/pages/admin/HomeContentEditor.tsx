import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface HomeContent {
  id: string;
  section: string;
  title: string;
  content: string;
  link_text: string | null;
  link_url: string | null;
  order_index: number;
}

export default function HomeContentEditor() {
  const [content, setContent] = useState<HomeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    section: 'hero',
    title: '',
    content: '',
    link_text: '',
    link_url: '',
    order_index: 0,
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('home_content')
      .select('*')
      .order('order_index');

    if (!error && data) {
      setContent(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('home_content')
      .insert([formData]);

    if (!error) {
      await updateSiteTimestamp();
      fetchContent();
      resetForm();
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('home_content')
      .update(formData)
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchContent();
      resetForm();
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content section?')) {
      const { error } = await supabase
        .from('home_content')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchContent();
      }
    }
  };

  const startEdit = (item: HomeContent) => {
    setFormData({
      section: item.section,
      title: item.title,
      content: item.content,
      link_text: item.link_text || '',
      link_url: item.link_url || '',
      order_index: item.order_index,
    });
    setEditingId(item.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      section: 'hero',
      title: '',
      content: '',
      link_text: '',
      link_url: '',
      order_index: 0,
    });
  };

  if (loading) {
    return <div>Loading home content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Home Page Content</h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Section
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-300 space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            {isCreating ? 'Create New Section' : 'Edit Section'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Section ID</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                placeholder="e.g., hero, feature_1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Order</label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
            <WYSIWYGEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Enter content..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Link Text (Optional)</label>
              <input
                type="text"
                value={formData.link_text}
                onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Link URL (Optional)</label>
              <input
                type="text"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => (isCreating ? handleCreate() : handleUpdate(editingId!))}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isCreating ? 'Create' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                resetForm();
              }}
              className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
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
                    {item.section}
                  </span>
                  <span className="text-slate-500 text-sm">Order: {item.order_index}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 mb-3">{item.content}</p>
                {item.link_text && item.link_url && (
                  <div className="text-sm text-slate-500">
                    Link: {item.link_text} → {item.link_url}
                  </div>
                )}
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
          No home page content yet. Click "Add Section" to create one.
        </div>
      )}
    </div>
  );
}
