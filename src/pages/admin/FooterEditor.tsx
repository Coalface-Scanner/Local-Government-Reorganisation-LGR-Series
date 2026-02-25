import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';

interface FooterContent {
  id: string;
  section: string;
  content: string;
  link_text: string | null;
  link_url: string | null;
  order_index: number;
}

export default function FooterEditor() {
  const [content, setContent] = useState<FooterContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    section: 'sponsorship',
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
      .from('footer_content')
      .select('*')
      .order('order_index');

    if (!error && data) {
      setContent(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('footer_content')
      .insert([formData]);

    if (!error) {
      await updateSiteTimestamp();
      fetchContent();
      resetForm();
      setIsCreating(false);
    } else {
      alert('Error creating footer content: ' + error.message);
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('footer_content')
      .update(formData)
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchContent();
      resetForm();
      setEditingId(null);
    } else {
      alert('Error updating footer content: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this footer section?')) {
      const { error } = await supabase
        .from('footer_content')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchContent();
      } else {
        alert('Error deleting footer content: ' + error.message);
      }
    }
  };

  const startEdit = (item: FooterContent) => {
    setFormData({
      section: item.section,
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
      section: 'sponsorship',
      content: '',
      link_text: '',
      link_url: '',
      order_index: 0,
    });
  };

  if (loading) {
    return <div className="text-slate-600">Loading footer content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Footer Content</h2>
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

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            {editingId ? 'Edit Footer Section' : 'New Footer Section'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Section
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="sponsorship">Sponsorship Statement</option>
                <option value="subscription_cta">Subscription CTA</option>
                <option value="disclaimer">Disclaimer</option>
                <option value="tagline">Tagline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Footer content text..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Link Text (optional)
              </label>
              <input
                type="text"
                value={formData.link_text}
                onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Link text..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Link URL (optional)
              </label>
              <input
                type="text"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="/subscribe or https://..."
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
                    {item.section}
                  </span>
                  <span className="text-slate-500 text-sm">Order: {item.order_index}</span>
                </div>
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
          No footer content yet. Click "Add Section" to create one.
        </div>
      )}
    </div>
  );
}
