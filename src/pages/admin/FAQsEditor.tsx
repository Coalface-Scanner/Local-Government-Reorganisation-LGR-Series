import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface FAQ {
  id: string;
  page: string;
  question: string;
  answer: string;
  order_index: number;
}

const PAGE_OPTIONS = [
  { value: 'home', label: 'Home' },
  { value: 'facts', label: 'Facts' },
  { value: 'reasons', label: 'Reasons' },
  { value: 'lessons', label: 'Lessons' },
  { value: 'interviews', label: 'Interviews' },
  { value: 'surrey', label: 'Surrey' },
  { value: 'councils', label: 'Councils' },
  { value: 'materials', label: 'Materials' },
  { value: 'hundred-days', label: '100 Days' }
];

export default function FAQsEditor() {
  const { user } = useAuth();
  const [selectedPage, setSelectedPage] = useState('home');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ question: '', answer: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchFAQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPage]);

  async function fetchFAQs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('page', selectedPage)
      .order('order_index', { ascending: true });

    if (!error && data) {
      setFaqs(data);
    }
    setLoading(false);
  }

  async function handleCreate() {
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      setMessage('Question and answer are required');
      return;
    }

    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.order_index)) : -1;

    const { error } = await supabase
      .from('faqs')
      .insert({
        page: selectedPage,
        question: editForm.question,
        answer: editForm.answer,
        order_index: maxOrder + 1
      });

    if (error) {
      setMessage('Error creating FAQ: ' + error.message);
    } else {
      setMessage('FAQ created successfully');
      setEditForm({ question: '', answer: '' });
      setIsCreating(false);
      fetchFAQs();
    }
  }

  async function handleUpdate(id: string) {
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      setMessage('Question and answer are required');
      return;
    }

    const { error } = await supabase
      .from('faqs')
      .update({
        question: editForm.question,
        answer: editForm.answer
      })
      .eq('id', id);

    if (error) {
      setMessage('Error updating FAQ: ' + error.message);
    } else {
      setMessage('FAQ updated successfully');
      setEditingId(null);
      fetchFAQs();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting FAQ: ' + error.message);
    } else {
      setMessage('FAQ deleted successfully');
      fetchFAQs();
    }
  }

  async function moveItem(id: string, direction: 'up' | 'down') {
    const currentIndex = faqs.findIndex(f => f.id === id);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === faqs.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentFaq = faqs[currentIndex];
    const targetFaq = faqs[targetIndex];

    await supabase
      .from('faqs')
      .update({ order_index: targetFaq.order_index })
      .eq('id', currentFaq.id);

    await supabase
      .from('faqs')
      .update({ order_index: currentFaq.order_index })
      .eq('id', targetFaq.id);

    fetchFAQs();
  }

  function startEdit(faq: FAQ) {
    setEditingId(faq.id);
    setEditForm({ question: faq.question, answer: faq.answer });
    setIsCreating(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setEditForm({ question: '', answer: '' });
  }

  if (!user) {
    return <div className="p-8 text-center">Please log in to access this page</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Manage FAQs</h1>
            <a
              href="/admin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Dashboard
            </a>
          </div>

          {message && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">{message}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Page
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {PAGE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <button
              onClick={() => {
                setIsCreating(true);
                setEditingId(null);
                setEditForm({ question: '', answer: '' });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add New FAQ
            </button>
          </div>

          {isCreating && (
            <div className="mb-6 p-4 border-2 border-blue-300 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-4">Create New FAQ</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={editForm.question}
                    onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter question..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <WYSIWYGEditor
                    value={editForm.answer}
                    onChange={(value) => setEditForm({ ...editForm, answer: value })}
                    placeholder="Enter answer..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    Create
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-600">Loading FAQs...</p>
          ) : faqs.length === 0 ? (
            <p className="text-center text-gray-600">No FAQs for this page yet</p>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white"
                >
                  {editingId === faq.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={editForm.question}
                          onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <WYSIWYGEditor
                          value={editForm.answer}
                          onChange={(value: string) => setEditForm({ ...editForm, answer: value })}
                          placeholder="Enter answer with HTML formatting..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(faq.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">
                          {faq.question}
                        </h3>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => moveItem(faq.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ArrowUp className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => moveItem(faq.id, 'down')}
                            disabled={index === faqs.length - 1}
                            className="p-1 text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ArrowDown className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{faq.answer}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(faq)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}