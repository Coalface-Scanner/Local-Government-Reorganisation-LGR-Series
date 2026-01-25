import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface AboutPage {
  id: string;
  page_slug: string;
  title: string;
  content: string;
  sections: Record<string, unknown>;
}

const AVAILABLE_PAGES = [
  { value: 'editor', label: "Editor's Letter" },
  { value: 'methodology', label: 'Methodology' },
  { value: 'contribute', label: 'Contribute' },
  { value: 'coalface', label: 'About COALFACE' },
];

export default function AboutPagesEditor() {
  const [pages, setPages] = useState<AboutPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedPage, setSelectedPage] = useState('editor');
  const [formData, setFormData] = useState({
    page_slug: 'editor',
    title: '',
    content: '',
    sections: {} as Record<string, unknown>,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPage && pages.length > 0) {
      const page = pages.find(p => p.page_slug === selectedPage);
      if (page) {
        setFormData({
          page_slug: page.page_slug,
          title: page.title,
          content: page.content,
          sections: page.sections || {},
        });
      }
    }
  }, [selectedPage, pages]);

  const fetchPages = async () => {
    const { data, error } = await supabase
      .from('about_pages')
      .select('*')
      .order('page_slug');

    if (!error && data) {
      setPages(data);
      if (data.length > 0 && !selectedPage) {
        setSelectedPage(data[0].page_slug);
      }
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    if (!id) {
      console.error('No page ID provided');
      setSaveMessage({ type: 'error', text: 'No page selected to update' });
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase
        .from('about_pages')
        .update({
          title: formData.title,
          content: formData.content,
          sections: formData.sections || {},
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await updateSiteTimestamp();
      await fetchPages();
      setSaveMessage({ type: 'success', text: 'Page updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error updating about page:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSaveMessage({ 
        type: 'error', 
        text: `Error updating about page: ${errorMessage}` 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading about pages...</div>;
  }

  const currentPage = pages.find(p => p.page_slug === selectedPage);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">About Pages</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Page
        </label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
        >
          {AVAILABLE_PAGES.map((page) => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>
      </div>

      {currentPage && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Content
              </label>
              <WYSIWYGEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="About page content..."
              />
            </div>
            {saveMessage && (
              <div className={`p-3 rounded-lg ${
                saveMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {saveMessage.text}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (currentPage?.id) {
                    handleUpdate(currentPage.id);
                  } else {
                    console.error('No currentPage.id available');
                    setSaveMessage({ type: 'error', text: 'No page ID available. Please refresh the page.' });
                  }
                }}
                disabled={saving || !currentPage?.id}
                className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {pages.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No about pages found. Run the seed migration to create initial pages.
        </div>
      )}
    </div>
  );
}
