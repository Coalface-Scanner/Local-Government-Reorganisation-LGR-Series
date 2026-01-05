import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface Reason {
  id: string;
  title: string;
  content: string;
  order_index: number;
}

export default function ReasonsEditor() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    order_index: 0,
  });

  useEffect(() => {
    fetchReasons();
  }, []);

  const fetchReasons = async () => {
    const { data, error } = await supabase
      .from('reasons')
      .select('*')
      .order('order_index');

    if (!error && data) {
      setReasons(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('reasons')
      .insert([formData]);

    if (!error) {
      await updateSiteTimestamp();
      fetchReasons();
      resetForm();
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('reasons')
      .update(formData)
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchReasons();
      resetForm();
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reason?')) {
      const { error } = await supabase
        .from('reasons')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchReasons();
      }
    }
  };

  const startEdit = (reason: Reason) => {
    setFormData({
      title: reason.title,
      content: reason.content,
      order_index: reason.order_index,
    });
    setEditingId(reason.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      order_index: 0,
    });
  };

  if (loading) {
    return <div>Loading reasons...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Reasons Management</h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Reason
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-300 space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            {isCreating ? 'Create New Reason' : 'Edit Reason'}
          </h3>

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
              placeholder="Enter reason content..."
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
        {reasons.map((reason) => (
          <div key={reason.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{reason.title}</h3>
                <p className="text-slate-600">{reason.content}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => startEdit(reason)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(reason.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reasons.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No reasons yet. Click "Add Reason" to create one.
        </div>
      )}
    </div>
  );
}
