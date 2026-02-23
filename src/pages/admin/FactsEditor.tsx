import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface Fact {
  id: string;
  title: string;
  content: string;
  category: string | null;
  order_index: number;
  source_url?: string | null;
}

export default function FactsEditor() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    order_index: 0,
    source_url: '',
  });

  useEffect(() => {
    fetchFacts();
  }, []);

  const fetchFacts = async () => {
    const { data, error } = await supabase
      .from('facts')
      .select('*')
      .order('order_index');

    if (!error && data) {
      setFacts(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const payload = {
      ...formData,
      source_url: formData.source_url?.trim() || null,
    };
    const { error } = await supabase
      .from('facts')
      .insert([payload]);

    if (!error) {
      await updateSiteTimestamp();
      fetchFacts();
      resetForm();
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const payload = {
      ...formData,
      source_url: formData.source_url?.trim() || null,
    };
    const { error } = await supabase
      .from('facts')
      .update(payload)
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchFacts();
      resetForm();
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this fact?')) {
      const { error } = await supabase
        .from('facts')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchFacts();
      }
    }
  };

  const startEdit = (fact: Fact) => {
    setFormData({
      title: fact.title,
      content: fact.content,
      category: fact.category || '',
      order_index: fact.order_index,
      source_url: fact.source_url || '',
    });
    setEditingId(fact.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      order_index: 0,
      source_url: '',
    });
  };

  if (loading) {
    return <div>Loading facts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Facts Management</h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Fact
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-300 space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            {isCreating ? 'Create New Fact' : 'Edit Fact'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fact-editor-title" className="block text-sm font-medium text-slate-700 mb-2">Title</label>
              <input
                id="fact-editor-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label htmlFor="fact-editor-category" className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <input
                id="fact-editor-category"
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                placeholder="Optional"
              />
            </div>
          </div>

          <div role="group" aria-labelledby="fact-editor-content-label">
            <span id="fact-editor-content-label" className="block text-sm font-medium text-slate-700 mb-2">Content</span>
            <WYSIWYGEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Enter fact content..."
            />
          </div>

          <div>
            <label htmlFor="fact-editor-order" className="block text-sm font-medium text-slate-700 mb-2">Order</label>
            <input
              id="fact-editor-order"
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label htmlFor="fact-editor-source-url" className="block text-sm font-medium text-slate-700 mb-2">Source URL</label>
            <input
              id="fact-editor-source-url"
              type="url"
              value={formData.source_url}
              onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
              placeholder="https://..."
            />
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
        {facts.map((fact) => (
          <div key={fact.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{fact.title}</h3>
                <p className="text-slate-600 mb-3">{fact.content}</p>
                {fact.category && (
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600">
                    {fact.category}
                  </span>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => startEdit(fact)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Edit fact"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(fact.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete fact"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {facts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No facts yet. Click "Add Fact" to create one.
        </div>
      )}
    </div>
  );
}
