import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';
import ErrorMessage from '../../components/admin/ErrorMessage';

interface ArticleQA {
  id: string;
  article_slug: string;
  question: string;
  answer: string;
  order_index: number;
}

interface ArticleQAEditorProps {
  articleSlug: string;
  onClose: () => void;
}

export default function ArticleQAEditor({ articleSlug, onClose }: ArticleQAEditorProps) {
  const [qas, setQAs] = useState<ArticleQA[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    order_index: 0,
  });

  useEffect(() => {
    fetchQAs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleSlug]);

  const fetchQAs = async () => {
    const { data, error } = await supabase
      .from('article_qa')
      .select('*')
      .eq('article_slug', articleSlug)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setQAs(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('Question and answer are required');
      return;
    }
    setError('');

    const { error } = await supabase
      .from('article_qa')
      .insert([{
        ...formData,
        article_slug: articleSlug,
      }]);

    if (!error) {
      fetchQAs();
      resetForm();
      setIsCreating(false);
      setError('');
    } else {
      setError('Error creating Q&A: ' + error.message);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      setError('Question and answer are required');
      return;
    }
    setError('');

    const { error } = await supabase
      .from('article_qa')
      .update(formData)
      .eq('id', id);

    if (!error) {
      fetchQAs();
      resetForm();
      setEditingId(null);
      setError('');
    } else {
      setError('Error updating Q&A: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Q&A?')) {
      return;
    }

    const { error } = await supabase
      .from('article_qa')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchQAs();
      setError('');
    } else {
      setError('Error deleting Q&A: ' + error.message);
    }
  };

  const startEdit = (qa: ArticleQA) => {
    setFormData({
      question: qa.question,
      answer: qa.answer,
      order_index: qa.order_index,
    });
    setEditingId(qa.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      order_index: 0,
    });
    setEditingId(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center text-neutral-600">Loading Q&A...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} onDismiss={() => setError('')} />
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Article Q&A</h2>
          <p className="text-sm text-neutral-600 mt-1">Manage Q&A for article: {articleSlug}</p>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-600 hover:text-neutral-900"
        >
          <X size={24} />
        </button>
      </div>

      {!isCreating && !editingId && (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Q&A
        </button>
      )}

      {(isCreating || editingId) && (
        <div className="mb-6 bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            {editingId ? 'Edit Q&A' : 'New Q&A'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Question *
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none"
                placeholder="Enter the question"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Answer * (supports HTML formatting)
              </label>
              <WYSIWYGEditor
                value={formData.answer}
                onChange={(value) => setFormData({ ...formData, answer: value })}
                placeholder="Enter the answer..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors"
              >
                <Save size={18} />
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {qas.length === 0 ? (
          <div className="text-center py-8 text-neutral-600">
            No Q&A items yet. Click "Add Q&A" to create one.
          </div>
        ) : (
          qas.map((qa) => (
            <div
              key={qa.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                      Order: {qa.order_index}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                    {qa.question}
                  </h4>
                  <div
                    className="text-sm text-neutral-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: qa.answer.substring(0, 100) + (qa.answer.length > 100 ? '...' : '') }}
                  />
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => startEdit(qa)}
                    className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(qa.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

