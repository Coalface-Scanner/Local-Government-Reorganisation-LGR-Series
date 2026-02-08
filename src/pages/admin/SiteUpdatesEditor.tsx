import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';
import ErrorMessage from '../../components/admin/ErrorMessage';

interface SiteUpdate {
  id: string;
  title: string;
  description: string | null;
  update_type: string;
  link_page: string | null;
  link_slug: string | null;
  created_at: string;
}

export default function SiteUpdatesEditor() {
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    update_type: 'content_update',
    link_page: '',
    link_slug: '',
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    const { data, error } = await supabase
      .from('site_updates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUpdates(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const dataToInsert = {
      ...formData,
      link_page: formData.link_page || null,
      link_slug: formData.link_slug || null,
      description: formData.description || null,
    };

    const { error } = await supabase
      .from('site_updates')
      .insert([dataToInsert]);

    if (!error) {
      await updateSiteTimestamp();
      fetchUpdates();
      resetForm();
      setIsCreating(false);
      setError('');
    } else {
      setError('Error creating update: ' + error.message);
    }
  };

  const handleUpdate = async (id: string) => {
    const dataToUpdate = {
      ...formData,
      link_page: formData.link_page || null,
      link_slug: formData.link_slug || null,
      description: formData.description || null,
    };

    const { error } = await supabase
      .from('site_updates')
      .update(dataToUpdate)
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchUpdates();
      resetForm();
      setEditingId(null);
      setError('');
    } else {
      setError('Error updating update: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this update?')) {
      const { error } = await supabase
        .from('site_updates')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchUpdates();
      }
    }
  };

  const startEdit = (update: SiteUpdate) => {
    setFormData({
      title: update.title,
      description: update.description || '',
      update_type: update.update_type,
      link_page: update.link_page || '',
      link_slug: update.link_slug || '',
    });
    setEditingId(update.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      update_type: 'content_update',
      link_page: '',
      link_slug: '',
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
          <h2 className="text-3xl font-bold text-slate-900">Site Updates</h2>
          <p className="text-slate-600 mt-1">
            Manage updates shown in the Latest Updates box on the home page
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
          Add Update
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-300 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              {isCreating ? 'Create New Update' : 'Edit Update'}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingId(null);
                resetForm();
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="e.g., New article published on Surrey devolution"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (optional)
              </label>
              <WYSIWYGEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Optional longer description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Update Type
              </label>
              <select
                value={formData.update_type}
                onChange={(e) => setFormData({ ...formData, update_type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="content_update">Content Update</option>
                <option value="new_article">New Article</option>
                <option value="feature">New Feature</option>
              </select>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
              <h4 className="font-semibold text-slate-900">Link Settings</h4>
              <p className="text-sm text-slate-600">
                Make this update clickable by adding a link to a page. Leave blank for non-clickable updates.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Link Page
                </label>
                <select
                  value={formData.link_page}
                  onChange={(e) => setFormData({ ...formData, link_page: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="">No link (not clickable)</option>
                  <option value="home">Home</option>
                  <option value="article">Article (requires slug)</option>
                  <option value="materials">Materials</option>
                  <option value="facts">Facts & Figures</option>
                  <option value="lessons">Lessons</option>
                  <option value="reasons">Reasons</option>
                  <option value="surrey">Surrey Focus</option>
                  <option value="interviews">Interviews</option>
                  <option value="100days">100 Days Playbook</option>
                </select>
              </div>

              {formData.link_page === 'article' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Article Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.link_slug}
                    onChange={(e) => setFormData({ ...formData, link_slug: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="e.g., tim-oliver-interview-lgr-surrey"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Required when linking to an article
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (isCreating) {
                  handleCreate();
                } else if (editingId) {
                  handleUpdate(editingId);
                }
              }}
              disabled={!formData.title || (formData.link_page === 'article' && !formData.link_slug)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isCreating ? 'Create Update' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="bg-white p-6 rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{update.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded">
                    {update.update_type}
                  </span>
                  {update.link_page && (
                    <span className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded">
                      Clickable → {update.link_page}
                    </span>
                  )}
                </div>
                {update.description && (
                  <p className="text-slate-600 text-sm mb-2">{update.description}</p>
                )}
                <div className="text-xs text-slate-500">
                  {new Date(update.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(update)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(update.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
