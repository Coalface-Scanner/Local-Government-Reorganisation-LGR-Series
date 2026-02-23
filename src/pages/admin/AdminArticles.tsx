import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, Save, X, LogOut, FileText, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import ArticleEditor from '../../components/ArticleEditor';
import ArticleQAEditor from './ArticleQAEditor';
import HeadingGuidelines from '../../components/HeadingGuidelines';
import ErrorMessage from '../../components/admin/ErrorMessage';
import CollapsibleSection from '../../components/admin/CollapsibleSection';
import ImageUpload from '../../components/admin/ImageUpload';
import HelpTooltip from '../../components/admin/HelpTooltip';
import { validateArticle, getFieldError, ValidationError } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import { isAdminUser } from '../../lib/adminAccess';
import { sanitizeHtmlContent } from '../../lib/htmlSanitizer';

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
  content_type: string | null;
  featured_theme: boolean;
  featured_site: boolean;
  author: string | null;
  category: string | null;
  region: string | null;
  geography: string | null;
  theme: string | null;
  lgr_phase: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminArticlesProps {
  onNavigate: (page: string) => void;
}

export default function AdminArticles({ onNavigate }: AdminArticlesProps) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [adminChecked, setAdminChecked] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [managingQA, setManagingQA] = useState<string | null>(null);
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      onNavigate('admin/login');
    }
  }, [authLoading, onNavigate, user]);

  useEffect(() => {
    let cancelled = false;
    async function checkAdminAccess() {
      if (authLoading) return;
      if (!user) {
        setAdminChecked(true);
        setHasAdminAccess(false);
        return;
      }

      const allowed = await isAdminUser(user);
      if (!cancelled) {
        setHasAdminAccess(allowed);
        setAdminChecked(true);
        if (!allowed) {
          await signOut();
          onNavigate('admin/login');
        }
      }
    }
    checkAdminAccess();
    return () => {
      cancelled = true;
    };
  }, [authLoading, onNavigate, signOut, user]);

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
    } catch (_err) {
      setError('Failed to load articles. Please try again.');
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
      content_type: 'Article',
      featured_theme: false,
      featured_site: false,
      author: '',
      category: '',
      region: '',
      geography: '',
      theme: '',
      lgr_phase: '',
    });
    setPreviewMode(false);
    setError('');
  };

  const handleEdit = (article: Article) => {
    // Ensure content_type has a default value if missing
    setEditingArticle({
      ...article,
      content_type: article.content_type || 'Article',
      featured_theme: article.featured_theme ?? false,
      featured_site: article.featured_site ?? false,
    });
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
      setError('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete article. Please try again.';
      setError(errorMessage);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!editingArticle) return;

    // Validate form
    const errors = validateArticle({
      title: editingArticle.title,
      slug: editingArticle.slug,
      body: editingArticle.body || '',
      content_type: editingArticle.content_type || 'Article',
      theme: editingArticle.theme,
      status,
    });

    if (errors.length > 0) {
      setValidationErrors(errors);
      setError('Please fix the errors below before saving.');
      return;
    }

    setSaving(true);
    setError('');
    setValidationErrors([]);

    try {
      // Build articleData with only fields that exist in the articles table
      // Some fields like geography and lgr_phase may not exist in all articles tables
      const articleData: Record<string, unknown> = {
        title: editingArticle.title,
        slug: editingArticle.slug,
        excerpt: editingArticle.excerpt || null,
        body: sanitizeHtmlContent(editingArticle.body || ''),
        featured_image: editingArticle.featured_image || null,
        status,
        published_date: editingArticle.published_date || null, // Will be set in save logic if needed
        featured: editingArticle.featured || false,
        content_type: editingArticle.content_type,
        featured_theme: editingArticle.featured_theme || false,
        featured_site: editingArticle.featured_site || false,
        author: editingArticle.author || null,
        category: editingArticle.category || null,
        region: editingArticle.region || null,
        theme: editingArticle.theme || null,
      };

      // Only include optional fields if they exist in the table schema
      // These fields may not exist in all articles tables - they're primarily for materials
      // If you need these fields, ensure the migrations that add them have been run

      if (editingArticle.id) {
        // For existing articles, preserve published_date if it exists
        // Only set new date if article is being published for the first time (was draft, now published)
        if (status === 'published' && !articleData.published_date) {
          // Check if article was previously published
          const { data: currentArticle } = await supabase
            .from('articles')
            .select('published_date, status')
            .eq('id', editingArticle.id)
            .single();
          
          // Only set new date if article was previously unpublished (draft)
          if (currentArticle && currentArticle.status !== 'published' && !currentArticle.published_date) {
            articleData.published_date = new Date().toISOString();
          } else if (currentArticle && currentArticle.published_date) {
            // Preserve existing published_date - don't overwrite it
            articleData.published_date = currentArticle.published_date;
          }
        }
        
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);
        if (error) {
          throw error;
        }
      } else {
        // For new articles, set published_date if publishing
        if (status === 'published' && !articleData.published_date) {
          articleData.published_date = new Date().toISOString();
        }
        
        const { error } = await supabase.from('articles').insert([articleData]);
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
      }

      await fetchArticles();
      setEditingArticle(null);
      setPreviewMode(false);
      setError('');
    } catch (err: unknown) {
      // Extract error message from Supabase error object
      let errorMessage = 'Unknown error';
      if (err && typeof err === 'object') {
        // Supabase errors have a 'message' property
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        } else if ('hint' in err && typeof err.hint === 'string') {
          errorMessage = err.hint;
        } else if ('code' in err) {
          errorMessage = `Error code: ${err.code}`;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Provide more specific error messages
      const lowerMessage = errorMessage.toLowerCase();
      if (lowerMessage.includes('duplicate key') || lowerMessage.includes('unique constraint') || lowerMessage.includes('violates unique constraint')) {
        setError('An article with this slug already exists. Please use a different slug.');
      } else if (lowerMessage.includes('content_type') || lowerMessage.includes('content type')) {
        setError('Invalid content type. Please select a valid content type from the dropdown.');
      } else if (lowerMessage.includes('theme') && (lowerMessage.includes('required') || lowerMessage.includes('constraint'))) {
        setError('Theme is required for published content (except FAQ and Other). Please select a core theme.');
      } else if (lowerMessage.includes('check constraint') || lowerMessage.includes('violates check constraint')) {
        setError('One or more fields have invalid values. Please check your input and try again.');
      } else if (lowerMessage.includes('permission') || lowerMessage.includes('policy') || lowerMessage.includes('row-level security')) {
        setError('Permission denied. Please check your authentication and try again.');
      } else if (lowerMessage.includes('null value') || lowerMessage.includes('not null')) {
        setError('A required field is missing. Please fill in all required fields.');
      } else {
        setError(`Failed to save article: ${errorMessage}. Please check the console for details.`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setEditingArticle(prev => {
      if (!prev) return null;
      const newSlug = !prev.id && !prev.slug ? generateSlug(title) : prev.slug;
      const updated = { ...prev, title, slug: newSlug || '' };
      
      // Real-time validation
      const errors = validateArticle({
        title: updated.title,
        slug: updated.slug,
        body: updated.body || '',
        content_type: updated.content_type || '',
        theme: updated.theme,
        status: updated.status,
      });
      setValidationErrors(errors);
      
      return updated;
    });
  };

  const handleFieldChange = (field: string, value: unknown) => {
    setEditingArticle(prev => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      
      // Real-time validation
      const errors = validateArticle({
        title: updated.title,
        slug: updated.slug,
        body: updated.body || '',
        content_type: updated.content_type || '',
        theme: updated.theme,
        status: updated.status,
      });
      setValidationErrors(errors);
      
      return updated;
    });
  };

  const handleLogout = () => {
    signOut().finally(() => navigate('/'));
  };

  if (loading || authLoading || !adminChecked) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return null;
  }

  if (editingArticle) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  title="Discard changes"
                  aria-label="Discard changes and return to article list"
                  onClick={() => {
                    if (confirm('Discard changes?')) {
                      setEditingArticle(null);
                      setPreviewMode(false);
                    }
                  }}
                  className="text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-teal-700 rounded p-1"
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
                  className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
                  aria-label={previewMode ? 'Switch to edit mode' : 'Switch to preview mode'}
                >
                  <Eye size={18} aria-hidden="true" />
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-900 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  aria-label="Save article as draft"
                >
                  <Save size={18} aria-hidden="true" />
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  aria-label="Publish article"
                >
                  <FileText size={18} aria-hidden="true" />
                  Publish
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4">
                <ErrorMessage message={error} onDismiss={() => setError('')} />
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
                  dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(editingArticle.body || '') }}
                />
              </article>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label htmlFor="article-title" className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    Title <span className="text-red-600">*</span>
                    {getFieldError(validationErrors, 'title') && (
                      <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
                    )}
                  </label>
                  <input
                    id="article-title"
                    type="text"
                    value={editingArticle.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={`w-full px-4 py-3 text-2xl font-bold border rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none ${
                      getFieldError(validationErrors, 'title') ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                    }`}
                    placeholder="Enter article title"
                    aria-required="true"
                    aria-label="Article title"
                    aria-invalid={!!getFieldError(validationErrors, 'title') ? 'true' : 'false'}
                    aria-describedby={getFieldError(validationErrors, 'title') ? 'title-error' : undefined}
                  />
                  {getFieldError(validationErrors, 'title') && (
                    <p id="title-error" className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      {getFieldError(validationErrors, 'title')}
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label htmlFor="article-slug" className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                    Slug <span className="text-red-600">*</span>
                    {getFieldError(validationErrors, 'slug') && (
                      <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
                    )}
                    <HelpTooltip 
                      content={
                        <>
                          <p className="font-semibold mb-1">URL Slug</p>
                          <p className="text-neutral-300">The slug is the part of the URL that identifies your article. It's auto-generated from the title but you can customize it.</p>
                          <p className="text-neutral-300 mt-2"><strong>Example:</strong> "Understanding Local Government" becomes "understanding-local-government"</p>
                          <p className="text-neutral-300 mt-2"><strong>Rules:</strong> Use only lowercase letters, numbers, and hyphens. No spaces or special characters.</p>
                        </>
                      }
                    />
                  </label>
                  <input
                    id="article-slug"
                    type="text"
                    value={editingArticle.slug || ''}
                    onChange={(e) => {
                      // Auto-convert to lowercase and replace invalid characters
                      const sanitized = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      setEditingArticle({ ...editingArticle, slug: sanitized });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none font-mono text-sm ${
                      getFieldError(validationErrors, 'slug') ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                    }`}
                    placeholder="article-url-slug"
                    aria-required="true"
                    aria-label="Article URL slug"
                    aria-invalid={!!getFieldError(validationErrors, 'slug') ? 'true' : 'false'}
                    aria-describedby={getFieldError(validationErrors, 'slug') ? 'slug-error' : undefined}
                  />
                  {getFieldError(validationErrors, 'slug') ? (
                    <p id="slug-error" className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1" role="alert">
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      {getFieldError(validationErrors, 'slug')}
                    </p>
                  ) : (
                    <>
                      <p className="mt-1 text-xs text-neutral-500">
                        URL: /insights/{editingArticle.slug || 'article-slug'}
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        💡 The slug is auto-generated from the title, but you can edit it. Use lowercase letters, numbers, and hyphens only.
                      </p>
                    </>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label htmlFor="article-excerpt" className="block text-sm font-medium text-neutral-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    id="article-excerpt"
                    value={editingArticle.excerpt || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none resize-none"
                    placeholder="Brief summary of the article (optional)"
                    aria-label="Article excerpt"
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    This appears in article listings and search results
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <label htmlFor="article-body" className="block text-sm font-medium text-neutral-700 mb-4 flex items-center gap-2">
                    Article Body <span className="text-red-600">*</span>
                    {getFieldError(validationErrors, 'body') && (
                      <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
                    )}
                  </label>
                  <div 
                    id="article-body"
                    className={getFieldError(validationErrors, 'body') ? 'border-2 border-red-500 rounded-lg p-1 bg-red-50' : ''}
                  >
                    <ArticleEditor
                      value={editingArticle.body || ''}
                      onChange={(value) => handleFieldChange('body', value)}
                      placeholder="Start writing your article... Use the toolbar above to format text, add headings, lists, images, and more."
                    />
                  </div>
                  {getFieldError(validationErrors, 'body') && (
                    <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1" role="alert" id="body-error">
                      <AlertCircle className="w-3 h-3" aria-hidden="true" />
                      {getFieldError(validationErrors, 'body')}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-neutral-500">
                    💡 <strong>Tip:</strong> Use the toolbar to format your content. You can add headings, bold/italic text, lists, links, images, and more. Images can be uploaded directly from your computer.
                  </p>
                  <HeadingGuidelines htmlContent={editingArticle.body || ''} />
                </div>
              </div>

              <div className="space-y-6">
                {/* Publishing Section - Always visible for status */}
                <CollapsibleSection title="Publishing" defaultOpen={true}>
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
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Publication Date
                      </label>
                      <input
                        type="datetime-local"
                        id="publication-date"
                        value={
                          editingArticle.published_date
                            ? new Date(editingArticle.published_date).toISOString().slice(0, 16)
                            : editingArticle.id
                              ? '' // Don't set default date for existing articles
                              : new Date().toISOString().slice(0, 16) // Only set default for new articles
                        }
                        placeholder="YYYY-MM-DDThh:mm"
                        title="Set the publication date and time"
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value).toISOString() : null;
                          setEditingArticle({ ...editingArticle, published_date: date });
                        }}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
                        aria-label="Publication date and time"
                      />
                      <p className="mt-2 text-xs text-neutral-500">
                        Set when this article was published. If left empty, will use current date when publishing.
                      </p>
                      {editingArticle.published_date && (
                        <p className="mt-1 text-xs text-neutral-400">
                          Current: {new Date(editingArticle.published_date).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                    <div className="space-y-3 pt-2 border-t border-neutral-200">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured-toggle"
                          checked={editingArticle.featured || false}
                          onChange={(e) => setEditingArticle({ ...editingArticle, featured: e.target.checked })}
                          className="w-4 h-4 text-teal-600 border-neutral-300 rounded focus:ring-2 focus:ring-teal-700"
                          aria-label="Feature article (legacy)"
                        />
                        <label htmlFor="featured-toggle" className="text-sm font-medium text-neutral-700 cursor-pointer">
                          Feature Article (Legacy)
                        </label>
                      </div>
                      {editingArticle.featured && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                          <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Exclusive</span>
                          <span className="text-xs text-amber-700">badge will display</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured-theme-toggle"
                          checked={editingArticle.featured_theme || false}
                          onChange={(e) => setEditingArticle({ ...editingArticle, featured_theme: e.target.checked })}
                          className="w-4 h-4 text-teal-600 border-neutral-300 rounded focus:ring-2 focus:ring-teal-700"
                          disabled={!editingArticle.theme || editingArticle.content_type === 'FAQ' || editingArticle.content_type === 'Other'}
                          aria-label="Feature core theme"
                        />
                        <label htmlFor="featured-theme-toggle" className="text-sm font-medium text-neutral-700 cursor-pointer">
                          Feature Core Theme
                        </label>
                      </div>
                      {editingArticle.featured_theme && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg">
                          <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">Featured</span>
                          <span className="text-xs text-teal-700">Will replace current featured item in this theme</span>
                        </div>
                      )}
                      {(!editingArticle.theme || editingArticle.content_type === 'FAQ' || editingArticle.content_type === 'Other') && (
                        <p className="text-xs text-neutral-500">
                          Theme must be set to feature within a core theme
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured-site-toggle"
                          checked={editingArticle.featured_site || false}
                          onChange={(e) => setEditingArticle({ ...editingArticle, featured_site: e.target.checked })}
                          className="w-4 h-4 text-teal-600 border-neutral-300 rounded focus:ring-2 focus:ring-teal-700"
                          aria-label="Featured site material"
                        />
                        <label htmlFor="featured-site-toggle" className="text-sm font-medium text-neutral-700 cursor-pointer">
                          Featured Site Material
                        </label>
                      </div>
                      {editingArticle.featured_site && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                          <span className="text-xs font-bold text-purple-800 uppercase tracking-wide">Site Featured</span>
                          <span className="text-xs text-purple-700">Will replace current featured material on front page</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Media Section */}
                <CollapsibleSection title="Media">
                  <ImageUpload
                    value={editingArticle.featured_image || ''}
                    onChange={(url) => setEditingArticle({ ...editingArticle, featured_image: url })}
                    onError={(errorMsg) => setError(errorMsg)}
                    label="Featured Image"
                    maxSizeMB={5}
                  />
                </CollapsibleSection>

                {/* Metadata Section */}
                <CollapsibleSection title="Metadata">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                        Content Type <span className="text-red-600">*</span>
                        {getFieldError(validationErrors, 'content_type') && (
                          <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
                        )}
                      </label>
                      <select
                        value={editingArticle.content_type || 'Article'}
                        onChange={(e) => handleFieldChange('content_type', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm ${
                          getFieldError(validationErrors, 'content_type') ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                        }`}
                        required
                        aria-label="Content type"
                        aria-invalid={!!getFieldError(validationErrors, 'content_type') ? 'true' : 'false'}
                        aria-describedby={getFieldError(validationErrors, 'content_type') ? 'content-type-error' : undefined}
                      >
                        <option value="News Update">News Update</option>
                        <option value="Interview">Interview</option>
                        <option value="Article">Article</option>
                        <option value="Research">Research</option>
                        <option value="Lesson">Lesson</option>
                        <option value="FAQ">FAQ</option>
                        <option value="Other">Other</option>
                      </select>
                      {getFieldError(validationErrors, 'content_type') ? (
                        <p id="content-type-error" className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3 h-3" aria-hidden="true" />
                          {getFieldError(validationErrors, 'content_type')}
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-neutral-500">
                          Required field. Determines how content is classified and displayed.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                        Core Theme {editingArticle.content_type && editingArticle.content_type !== 'FAQ' && editingArticle.content_type !== 'Other' && editingArticle.status === 'published' && <span className="text-red-600">*</span>}
                        {getFieldError(validationErrors, 'theme') && (
                          <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
                        )}
                      </label>
                      <select
                        id="core-theme-select-admin-articles"
                        value={editingArticle.theme || ''}
                        onChange={(e) => {
                          handleFieldChange('theme', e.target.value || null);
                        }}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm ${
                          getFieldError(validationErrors, 'theme') ? 'border-red-500 bg-red-50' : 'border-neutral-300'
                        }`}
                        required={!!(editingArticle.content_type && editingArticle.content_type !== 'FAQ' && editingArticle.content_type !== 'Other' && editingArticle.status === 'published')}
                        aria-label="Core theme"
                        aria-invalid={!!getFieldError(validationErrors, 'theme') ? 'true' : 'false'}
                        aria-describedby={getFieldError(validationErrors, 'theme') ? 'theme-error' : undefined}
                        ref={(selectEl) => {
                          // Clean up any invalid options added by browser extensions
                          if (selectEl) {
                            const validValues = ['', 'Local Government', 'Democratic Legitimacy', 'Statecraft and System Design'];
                            const observer = new MutationObserver(() => {
                              const currentOptions = Array.from(selectEl.options);
                              const invalidOptions = currentOptions.filter(opt => !validValues.includes(opt.value));
                              if (invalidOptions.length > 0) {
                                invalidOptions.reverse().forEach(opt => opt.remove());
                              }
                            });
                            observer.observe(selectEl, { childList: true, subtree: true });
                            (selectEl as HTMLSelectElement & { _mutationObserver?: MutationObserver })._mutationObserver = observer;
                          }
                        }}
                      >
                        <option value="">Select core theme</option>
                        <option value="Local Government">Governance and Reform</option>
                        <option value="Democratic Legitimacy">Democratic Legitimacy</option>
                        <option value="Statecraft and System Design">Statecraft and System Design</option>
                      </select>
                      {getFieldError(validationErrors, 'theme') ? (
                        <p id="theme-error" className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1" role="alert">
                          <AlertCircle className="w-3 h-3" aria-hidden="true" />
                          {getFieldError(validationErrors, 'theme')}
                        </p>
                      ) : (
                        <>
                          <p className="mt-2 text-xs text-neutral-500">
                            Required for published content (except FAQ and Other). Primary theme for topic clustering.
                          </p>
                          {editingArticle.content_type && editingArticle.content_type !== 'FAQ' && editingArticle.content_type !== 'Other' && !editingArticle.theme && editingArticle.status === 'published' && (
                            <p className="mt-1 text-xs text-amber-600">
                              ⚠️ Theme is required when publishing this content type
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        value={editingArticle.author || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
                        placeholder="Author name (optional)"
                        aria-label="Author name"
                      />
                      <p className="mt-2 text-xs text-neutral-500">
                        The author's name for this article
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                        Category
                        <HelpTooltip 
                          content={
                            <>
                              <div className="font-semibold text-sm mb-2">Category field values for each core theme</div>
                              <p className="text-neutral-300">The Category field is optional. The TopicHub component matches articles using either the Theme or Category field. Recommended values:</p>
                              <div className="space-y-2 mt-2">
                                <div>
                                  <div className="font-semibold text-teal-300">1. Governance and Reform</div>
                                  <div className="pl-2 text-neutral-300">
                                    <div>Theme: <span className="text-white">Local Government</span> (required)</div>
                                    <div>Category: Leave empty, or use one of: <span className="text-white">Governance</span>, <span className="text-white">local government</span>, <span className="text-white">governance</span></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-semibold text-teal-300">2. Democratic Legitimacy</div>
                                  <div className="pl-2 text-neutral-300">
                                    <div>Theme: <span className="text-white">Democratic Legitimacy</span> (required)</div>
                                    <div>Category: Leave empty, or use: <span className="text-white">Democratic legitimacy</span>, <span className="text-white">democratic legitimacy</span></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-semibold text-teal-300">3. Statecraft and System Design</div>
                                  <div className="pl-2 text-neutral-300">
                                    <div>Theme: <span className="text-white">Statecraft and System Design</span> (required)</div>
                                    <div>Category: Leave empty, or use one of: <span className="text-white">Public Design</span>, <span className="text-white">public design</span>, <span className="text-white">Public Engagement</span>, <span className="text-white">Public</span>, <span className="text-white">public</span></div>
                                  </div>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-neutral-700 mt-2">
                                <div className="font-semibold text-sm mb-1">Best practice</div>
                                <p className="text-neutral-300">Set the Theme field to the exact core theme name (Local Government, Democratic Legitimacy, or Statecraft and System Design). Leave Category empty unless you need an additional tag for filtering/organisation.</p>
                              </div>
                            </>
                          }
                        />
                      </label>
                      <input
                        type="text"
                        value={editingArticle.category || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
                        placeholder="e.g., Analysis, News, Opinion (optional)"
                        aria-label="Category"
                      />
                      <p className="mt-2 text-xs text-neutral-500">
                        Category helps organise and filter articles
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Region
                      </label>
                      <input
                        type="text"
                        value={editingArticle.region || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, region: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
                        placeholder="e.g., England, Surrey, London (optional)"
                        aria-label="Geographic region"
                      />
                      <p className="mt-2 text-xs text-neutral-500">
                        Geographic region this article relates to
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Geography
                      </label>
                      <select
                        value={editingArticle.geography || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, geography: e.target.value || null })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
                        aria-label="Geographic focus level"
                      >
                        <option value="">Select geography (optional)</option>
                        <option value="National">National</option>
                        <option value="Region">Region</option>
                        <option value="Combined authority">Combined authority</option>
                        <option value="County or unitary">County or unitary</option>
                        <option value="Local area">Local area</option>
                      </select>
                      <p className="mt-2 text-xs text-neutral-500">
                        Geographic focus level for SEO and content clustering
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        LGR Phase
                      </label>
                      <select
                        value={editingArticle.lgr_phase || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, lgr_phase: e.target.value || null })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent outline-none text-sm"
                        aria-label="LGR phase"
                      >
                        <option value="">Select LGR phase (optional)</option>
                        <option value="Signals">Signals</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Shadow">Shadow</option>
                        <option value="Vesting prep">Vesting prep</option>
                        <option value="Vesting">Vesting</option>
                        <option value="First 100 days">First 100 days</option>
                        <option value="Year one">Year one</option>
                        <option value="Consolidation">Consolidation</option>
                      </select>
                      <p className="mt-2 text-xs text-neutral-500">
                        Relevant phase of local government reorganisation
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>
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
                className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
                aria-label="Create new article"
              >
                <Plus size={20} aria-hidden="true" />
                New Article
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
                aria-label="Log out of admin"
              >
                <LogOut size={20} aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {managingQA && (
          <div className="mb-8">
            <ArticleQAEditor
              articleSlug={managingQA}
              onClose={() => setManagingQA(null)}
            />
          </div>
        )}

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onDismiss={() => setError('')} />
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
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-neutral-900">{article.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        article.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status}
                      </span>
                      {article.content_type && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                          {article.content_type}
                        </span>
                      )}
                      {article.featured_site && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          Site Featured
                        </span>
                      )}
                      {article.featured_theme && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                          Theme Featured
                        </span>
                      )}
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
                      onClick={() => setManagingQA(article.slug)}
                      className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
                      title="Manage Q&A"
                      aria-label={`Manage Q&A for ${article.title}`}
                    >
                      <MessageSquare size={18} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-700"
                      title="Edit"
                      aria-label={`Edit article: ${article.title}`}
                    >
                      <Edit2 size={18} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      title="Delete"
                      aria-label={`Delete article: ${article.title}`}
                    >
                      <Trash2 size={18} aria-hidden="true" />
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
