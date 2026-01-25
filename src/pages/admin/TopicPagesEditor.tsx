import { useState, useEffect } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';

interface TopicPage {
  id: string;
  theme_slug: string;
  display_name: string;
  description: string;
  key_question: string;
  secondary_questions: string[];
  related_themes: string[];
}

const AVAILABLE_THEMES = [
  { value: 'governance-and-reform', label: 'Governance and Reform' },
  { value: 'democratic-legitimacy', label: 'Democratic Legitimacy' },
  { value: 'statecraft-and-system-design', label: 'Statecraft and System Design' },
];

export default function TopicPagesEditor() {
  const [pages, setPages] = useState<TopicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    theme_slug: '',
    display_name: '',
    description: '',
    key_question: '',
    secondary_questions: [] as string[],
    related_themes: [] as string[],
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('topic_pages')
      .select('*')
      .order('theme_slug');

    if (!error && data) {
      setPages(data);
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('topic_pages')
      .update({
        ...formData,
        secondary_questions: formData.secondary_questions,
        related_themes: formData.related_themes,
      })
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchPages();
      resetForm();
      setEditingId(null);
    } else {
      alert('Error updating topic page: ' + error.message);
    }
  };

  const startEdit = (page: TopicPage) => {
    setFormData({
      theme_slug: page.theme_slug,
      display_name: page.display_name,
      description: page.description,
      key_question: page.key_question,
      secondary_questions: page.secondary_questions || [],
      related_themes: page.related_themes || [],
    });
    setEditingId(page.id);
  };

  const resetForm = () => {
    setFormData({
      theme_slug: '',
      display_name: '',
      description: '',
      key_question: '',
      secondary_questions: [],
      related_themes: [],
    });
  };

  const toggleRelatedTheme = (theme: string) => {
    setFormData({
      ...formData,
      related_themes: formData.related_themes.includes(theme)
        ? formData.related_themes.filter(t => t !== theme)
        : [...formData.related_themes, theme],
    });
  };

  if (loading) {
    return <div className="text-slate-600">Loading topic pages...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Topic Pages</h2>

      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page.id} className="bg-white p-6 rounded-xl border-2 border-slate-200">
            {editingId === page.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Theme Slug
                  </label>
                  <input
                    type="text"
                    value={formData.theme_slug}
                    disabled
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Key Question
                  </label>
                  <textarea
                    value={formData.key_question}
                    onChange={(e) => setFormData({ ...formData, key_question: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Secondary Questions (one per line)
                  </label>
                  <textarea
                    value={formData.secondary_questions.join('\n')}
                    onChange={(e) => setFormData({
                      ...formData,
                      secondary_questions: e.target.value.split('\n').map(s => s.trim()).filter(Boolean),
                    })}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="One question per line"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Related Themes
                  </label>
                  <div className="space-y-2">
                    {AVAILABLE_THEMES.filter(t => t.value !== formData.theme_slug).map((theme) => (
                      <label key={theme.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.related_themes.includes(theme.value)}
                          onChange={() => toggleRelatedTheme(theme.value)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-slate-700">{theme.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(page.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      resetForm();
                      setEditingId(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {page.theme_slug}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{page.display_name}</h3>
                  <p className="text-slate-600 mb-3 whitespace-pre-line">{page.description}</p>
                  <p className="text-slate-700 font-semibold mb-3">{page.key_question}</p>
                  {page.secondary_questions && page.secondary_questions.length > 0 && (
                    <ul className="list-disc pl-5 text-slate-600 mb-3 space-y-1">
                      {page.secondary_questions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  )}
                  {page.related_themes && page.related_themes.length > 0 && (
                    <div className="text-sm text-slate-500">
                      Related: {page.related_themes.join(', ')}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => startEdit(page)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No topic pages found. Run the seed migration to create initial pages.
        </div>
      )}
    </div>
  );
}
