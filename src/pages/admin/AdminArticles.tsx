import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Save, X, LogOut, FileText, Calendar } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../lib/supabase';
import ArticleEditor from '../../components/ArticleEditor';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  featured_image: string | null;
  status: 'draft' | 'published';
  published_date: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface AdminArticlesProps {
  onNavigate: (page: string) => void;
}

export default function AdminArticles({ onNavigate }: AdminArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { logout, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('admin/articles/login');
    }
  }, [isAuthenticated, onNavigate]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNew = () => {
    setEditingArticle({
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      featured_image: '',
      status: 'draft',
      featured: false,
    });
    setPreviewMode(false);
    setError('');
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setPreviewMode(false);
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      await fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article');
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!editingArticle) return;

    if (!editingArticle.title?.trim()) {
      setError('Title is required');
      return;
    }

    if (!editingArticle.slug?.trim()) {
      setError('Slug is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const articleData = {
        title: editingArticle.title,
        slug: editingArticle.slug,
        excerpt: editingArticle.excerpt || null,
        body: editingArticle.body || null,
        featured_image: editingArticle.featured_image || null,
        status,
        published_date: status === 'published' ? (editingArticle.published_date || new Date().toISOString()) : null,
        featured: editingArticle.featured || false,
      };

      if (editingArticle.id) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('articles').insert([articleData]);
        if (error) throw error;
      }

      await fetchArticles();
      setEditingArticle(null);
      setPreviewMode(false);
    } catch (err: any) {
      console.error('Error saving article:', err);
      if (err.message?.includes('duplicate key')) {
        setError('An article with this slug already exists. Please use a different slug.');
      } else {
        setError('Failed to save article. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setEditingArticle(prev => {
      if (!prev) return null;
      const newSlug = !prev.id && !prev.slug ? generateSlug(title) : prev.slug;
      return { ...prev, title, slug: newSlug || '' };
    });
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }

  if (editingArticle) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (confirm('Discard changes?')) {
                      setEditingArticle(null);
                      setPreviewMode(false);
                    }
                  }}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <X size={24} />
                </button>
                <h1 className="text-xl font-bold text-neutral-900">
                  {editingArticle.id ? 'Edit Article' : 'New Article'}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <Eye size={18} />
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <FileText size={18} />
                  Publish
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {previewMode ? (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <article className="prose prose-lg max-w-none">
                {editingArticle.featured_image && (
                  <img
                    src={editingArticle.featured_image}
                    alt={editingArticle.title}
                    className="w-full h-64 object-cover rounded-lg mb-8"
                  />
                )}
                <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                  {editingArticle.title || 'Untitled Article'}
                </h1>
                {editingArticle.excerpt && (
                  <p className="text-xl text-neutral-600 mb-6 font-medium">
                    {editingArticle.excerpt}
                  </p>
                )}
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: editingArticle.body || '' }}
                />
              </article>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingArticle.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 text-2xl font-bold border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none"
                    placeholder="Enter article title"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={editingArticle.slug || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none font-mono text-sm"
                    placeholder="article-url-slug"
                  />
                  <p className="mt-1 text-xs text-neutral-500">
                    URL: /insights/{editingArticle.slug || 'article-slug'}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={editingArticle.excerpt || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none resize-none"
                    placeholder="Brief summary of the article (optional)"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-4">
                    Article Body
                  </label>
                  <ArticleEditor
                    value={editingArticle.body || ''}
                    onChange={(value) => setEditingArticle({ ...editingArticle, body: value })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-neutral-700 mb-4">Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        editingArticle.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {editingArticle.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <input
                        type="checkbox"
                        id="featured-toggle"
                        checked={editingArticle.featured || false}
                        onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                        className="w-4 h-4 text-teal-600 border-neutral-300 rounded focus:ring-2 focus:ring-teal-700"
                      />
                      <label htmlFor="featured-toggle" className="text-sm font-medium text-neutral-700 cursor-pointer">
                        Feature Article
                      </label>
                    </div>
                    {editingArticle.featured && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Exclusive</span>
                        <span className="text-xs text-amber-700">badge will display</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Publication Date
                  </label>
                  <input
                    type="datetime-local"
                    value={
                      editingArticle.published_date
                        ? new Date(editingArticle.published_date).toISOString().slice(0, 16)
                        : new Date().toISOString().slice(0, 16)
                    }
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value).toISOString() : null;
                      setEditingArticle({ ...editingArticle, published_date: date });
                    }}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Set when this article should be considered published
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Featured Image
                  </label>
                  <input
                    type="url"
                    value={editingArticle.featured_image || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, featured_image: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                  {editingArticle.featured_image && (
                    <img
                      src={editingArticle.featured_image}
                      alt="Featured"
                      className="mt-4 w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <p className="mt-2 text-xs text-neutral-500">
                    Enter the full URL of the featured image
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Article Management</h1>
              <p className="text-neutral-600 mt-1">Create and manage your articles</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleNew}
                className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors"
              >
                <Plus size={20} />
                New Article
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText size={48} className="mx-auto text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No articles yet</h3>
            <p className="text-neutral-600 mb-6">Get started by creating your first article</p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors"
            >
              <Plus size={20} />
              Create Article
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-neutral-900">{article.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                    {article.excerpt && (
                      <p className="text-neutral-600 mb-3">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>/insights/{article.slug}</span>
                      <span>•</span>
                      <span>Updated {new Date(article.updated_at).toLocaleDateString()}</span>
                      {article.published_date && (
                        <>
                          <span>•</span>
                          <span>Published {new Date(article.published_date).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
