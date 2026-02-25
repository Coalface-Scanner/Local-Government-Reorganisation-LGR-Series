import { useState, useEffect } from 'react';
import { Edit, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';

interface PageContentItem {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  content: string;
  order_index: number;
}

export default function ContactPageEditor() {
  const [content, setContent] = useState<PageContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    title: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_slug', 'contact')
      .order('order_index');

    if (!error && data) {
      setContent(data);
    }
    setLoading(false);
  };

  const handleUpdate = async (sectionKey: string) => {
    const item = content.find(c => c.section_key === sectionKey);
    if (!item) return;

    const { error } = await supabase
      .from('page_content')
      .update({
        title: formData.title || null,
        content: formData.content,
      })
      .eq('id', item.id);

    if (!error) {
      await updateSiteTimestamp();
      fetchContent();
      setEditingSection(null);
    } else {
      alert('Error updating contact page content: ' + error.message);
    }
  };

  const startEdit = (sectionKey: string) => {
    const item = content.find(c => c.section_key === sectionKey);
    if (item) {
      setFormData({
        title: item.title || '',
        content: item.content,
      });
      setEditingSection(sectionKey);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading contact page content...</div>;
  }

  const sections = [
    { key: 'hero_label', label: 'Hero Label', type: 'text' },
    { key: 'hero_title', label: 'Hero Title', type: 'text' },
    { key: 'hero_description', label: 'Hero Description', type: 'textarea' },
    { key: 'form_title', label: 'Form Title', type: 'text' },
    { key: 'form_description', label: 'Form Description', type: 'textarea' },
    { key: 'card_editorial_title', label: 'Editorial Card Title', type: 'text' },
    { key: 'card_editorial_description', label: 'Editorial Card Description', type: 'textarea' },
    { key: 'card_editorial_email', label: 'Editorial Email', type: 'text' },
    { key: 'card_subscribe_title', label: 'Subscribe Card Title', type: 'text' },
    { key: 'card_subscribe_description', label: 'Subscribe Card Description', type: 'textarea' },
    { key: 'card_subscribe_link', label: 'Subscribe Link Text', type: 'text' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Contact Page Content</h2>

      <div className="space-y-4">
        {sections.map((section) => {
          const item = content.find(c => c.section_key === section.key);
          const isEditing = editingSection === section.key;

          return (
            <div key={section.key} className="bg-white p-6 rounded-xl border-2 border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{section.label}</h3>
                {!isEditing && (
                  <button
                    onClick={() => startEdit(section.key)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  {section.type === 'textarea' ? (
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={section.key.includes('title') || section.key.includes('label') ? formData.title : formData.content}
                      onChange={(e) => {
                        if (section.key.includes('title') || section.key.includes('label')) {
                          setFormData({ ...formData, title: e.target.value });
                        } else {
                          setFormData({ ...formData, content: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(section.key)}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors"
                    >
                      <Save size={18} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({ title: '', content: '' });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-slate-600">
                  {item ? (
                    <p>{item.title || item.content || 'No content set'}</p>
                  ) : (
                    <p className="text-slate-400 italic">No content set. Click edit to add content.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
