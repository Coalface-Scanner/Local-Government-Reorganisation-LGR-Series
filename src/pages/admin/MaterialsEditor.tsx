import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface Material {
  id: string;
  title: string;
  description: string;
  content: string | null;
  rich_content: string | null;
  type: string;
  content_type: string | null;
  featured_theme: boolean;
  featured_site: boolean;
  theme: string | null;
  main_image_url: string | null;
  additional_images: Array<{ url: string; caption?: string }>;
  slug: string;
  format: string;
  published_date: string;
  status: string;
  tags: string[];
}

export default function MaterialsEditor() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    rich_content: '',
    type: 'Insight',
    content_type: 'Article',
    featured_theme: false,
    featured_site: false,
    theme: null as string | null,
    format: 'Article',
    main_image_url: '',
    additional_images: [] as Array<{ url: string; caption?: string }>,
    published_date: new Date().toISOString().split('T')[0],
    status: 'published',
    tags: [] as string[],
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newTag, setNewTag] = useState('');
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingAdditionalImage, setUploadingAdditionalImage] = useState(false);
  const mainImageFileInputRef = useRef<HTMLInputElement>(null);
  const additionalImageFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) {
        console.error('Error loading materials:', error);
        alert('Error loading materials: ' + error.message);
        setMaterials([]);
      } else {
        if (data) {
          const parsedData = data.map(material => ({
            ...material,
            additional_images: typeof material.additional_images === 'string'
              ? JSON.parse(material.additional_images || '[]')
              : (Array.isArray(material.additional_images) ? material.additional_images : [])
          }));
          setMaterials(parsedData);
        } else {
          setMaterials([]);
        }
      }
    } catch (err) {
      console.error('Unexpected error fetching materials:', err);
      alert('Unexpected error loading materials. Please refresh the page.');
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    // Validate theme requirement for published materials
    if (formData.status === 'published' && formData.content_type !== 'FAQ' && formData.content_type !== 'Other' && !formData.theme) {
      alert('Theme is required for published materials (except FAQ and Other)');
      return;
    }

    const dataToInsert = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      additional_images: formData.additional_images,
      content_type: formData.content_type || 'Article',
      featured_theme: formData.featured_theme || false,
      featured_site: formData.featured_site || false,
      theme: formData.theme || null,
    };

    const { error } = await supabase
      .from('materials')
      .insert([dataToInsert]);

    if (!error) {
      await updateSiteTimestamp();
      fetchMaterials();
      resetForm();
      setIsCreating(false);
    } else {
      alert('Error creating material: ' + error.message);
    }
  };

  const handleUpdate = async (id: string) => {
    // Validate theme requirement for published materials
    if (formData.status === 'published' && formData.content_type !== 'FAQ' && formData.content_type !== 'Other' && !formData.theme) {
      alert('Theme is required for published materials (except FAQ and Other)');
      return;
    }

    const dataToUpdate = {
      ...formData,
      additional_images: formData.additional_images,
      content_type: formData.content_type || 'Article',
      featured_theme: formData.featured_theme || false,
      featured_site: formData.featured_site || false,
      theme: formData.theme || null,
    };

    const { error } = await supabase
      .from('materials')
      .update(dataToUpdate)
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchMaterials();
      resetForm();
      setEditingId(null);
    } else {
      alert('Error updating material: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this material?')) {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchMaterials();
      }
    }
  };

  const startEdit = (material: Material) => {
    let parsedImages = [];
    if (typeof material.additional_images === 'string') {
      try {
        parsedImages = JSON.parse(material.additional_images || '[]');
      } catch {
        parsedImages = [];
      }
    } else if (Array.isArray(material.additional_images)) {
      parsedImages = material.additional_images;
    }

    setFormData({
      title: material.title,
      slug: material.slug,
      description: material.description || '',
      content: material.content || '',
      rich_content: material.rich_content || '',
      type: material.type,
      content_type: material.content_type || 'Article',
      featured_theme: material.featured_theme || false,
      featured_site: material.featured_site || false,
      theme: material.theme || null,
      format: material.format,
      main_image_url: material.main_image_url || '',
      additional_images: parsedImages,
      published_date: material.published_date,
      status: material.status || 'published',
      tags: material.tags || [],
    });
    setEditingId(material.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      rich_content: '',
      type: 'Insight',
      content_type: 'Article',
      featured_theme: false,
      featured_site: false,
      theme: null,
      format: 'Article',
      main_image_url: '',
      additional_images: [],
      published_date: new Date().toISOString().split('T')[0],
      status: 'published',
      tags: [],
    });
    setNewImageUrl('');
    setNewImageCaption('');
    setNewTag('');
  };

  const handleMainImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `materials/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    try {
      setUploadingMainImage(true);
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, main_image_url: data.publicUrl });
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingMainImage(false);
      if (mainImageFileInputRef.current) {
        mainImageFileInputRef.current.value = '';
      }
    }
  };

  const handleAdditionalImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `materials/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    try {
      setUploadingAdditionalImage(true);
      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      setFormData({
        ...formData,
        additional_images: [...formData.additional_images, { url: data.publicUrl, caption: newImageCaption.trim() || undefined }],
      });
      setNewImageCaption('');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingAdditionalImage(false);
      if (additionalImageFileInputRef.current) {
        additionalImageFileInputRef.current.value = '';
      }
    }
  };

  const addAdditionalImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!newImageUrl || !newImageUrl.trim()) {
      alert('Please enter an image URL or upload an image');
      return;
    }
    setFormData({
      ...formData,
      additional_images: [...formData.additional_images, { url: newImageUrl.trim(), caption: newImageCaption.trim() || undefined }],
    });
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const removeAdditionalImage = (index: number) => {
    setFormData({
      ...formData,
      additional_images: formData.additional_images.filter((_, i) => i !== index),
    });
  };

  const addTag = () => {
    if (!newTag || formData.tags.includes(newTag)) return;
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag],
    });
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  if (loading) {
    return <div>Loading materials...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Materials Management</h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Material
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-300 space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            {isCreating ? 'Create New Material' : 'Edit Material'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Auto-generated from title if empty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="Insight">Insight</option>
                <option value="Explainer">Explainer</option>
                <option value="Case study">Case study</option>
                <option value="Report">Report</option>
                <option value="Interview">Interview</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Format *</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="Article">Article</option>
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Published Date</label>
              <input
                type="date"
                value={formData.published_date}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Content Type *</label>
              <select
                value={formData.content_type}
                onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="News Update">News Update</option>
                <option value="Interview">Interview</option>
                <option value="Article">Article</option>
                <option value="Research">Research</option>
                <option value="Lesson">Lesson</option>
                <option value="FAQ">FAQ</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Core Theme {formData.content_type && formData.content_type !== 'FAQ' && formData.content_type !== 'Other' && formData.status === 'published' && <span className="text-red-600">*</span>}
              </label>
              <select
                value={formData.theme || ''}
<<<<<<< Current (Your changes)
                onChange={(e) => setFormData({ ...formData, theme: e.target.value || null })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required={!!(formData.content_type && formData.content_type !== 'FAQ' && formData.content_type !== 'Other' && formData.status === 'published')}
              >
                <option value="">Select core theme</option>
                <option value="Local Government">Local Government</option>
                <option value="Democracy">Democracy</option>
                <option value="Public Design">Public Design</option>
                <option value="Governance">Governance</option>
                <option value="Planning delivery">Planning delivery</option>
                <option value="Finance and resilience">Finance and resilience</option>
                <option value="Capacity and workforce">Capacity and workforce</option>
                <option value="Digital and data">Digital and data</option>
                <option value="Public trust and engagement">Public trust and engagement</option>
                <option value="Programme and transition">Programme and transition</option>
=======
                onChange={(e) => {
                  // #region agent log
                  const options = Array.from(e.target.options).map(o => ({value: o.value, text: o.text}));
                  fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MaterialsEditor.tsx:466',message:'Theme dropdown onChange - options count',data:{selectedValue:e.target.value,optionCount:options.length,allOptions:options},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                  // #endregion
                  setFormData({ ...formData, theme: e.target.value || null });
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                required={!!(formData.content_type && formData.content_type !== 'FAQ' && formData.content_type !== 'Other' && formData.status === 'published')}
                ref={(selectEl) => {
                  // #region agent log
                  if (selectEl) {
                    const options = Array.from(selectEl.options).map(o => ({value: o.value, text: o.text}));
                    fetch('http://127.0.0.1:7242/ingest/88a481fd-d50d-4443-a40c-d5f5149aa669',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MaterialsEditor.tsx:select-ref',message:'Theme dropdown rendered - options count',data:{optionCount:options.length,options:options},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                  }
                  // #endregion
                }}
              >
                <option value="">Select core theme</option>
                <option value="Local Government">Governance and Reform</option>
                <option value="Democratic Legitimacy">Democratic Legitimacy</option>
                <option value="Statecraft and System Design">Statecraft and System Design</option>
>>>>>>> Incoming (Background Agent changes)
              </select>
              {formData.content_type && formData.content_type !== 'FAQ' && formData.content_type !== 'Other' && !formData.theme && (
                <p className="mt-1 text-xs text-amber-600">
                  ⚠️ Theme is required when publishing this content type
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                id="featured-theme-materials"
                checked={formData.featured_theme}
                onChange={(e) => setFormData({ ...formData, featured_theme: e.target.checked })}
                disabled={!formData.theme || formData.content_type === 'FAQ' || formData.content_type === 'Other'}
                className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor="featured-theme-materials" className="text-sm font-medium text-slate-700 cursor-pointer">
                Featured – Core Theme
              </label>
            </div>

            <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                id="featured-site-materials"
                checked={formData.featured_site}
                onChange={(e) => setFormData({ ...formData, featured_site: e.target.checked })}
                className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
              />
              <label htmlFor="featured-site-materials" className="text-sm font-medium text-slate-700 cursor-pointer">
                Featured Site Material
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Tags</label>
            <div className="space-y-3">
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-teal-900 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors font-medium"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Short Description</label>
            <WYSIWYGEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Brief description for previews and search results"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Main Image</label>
            <div className="space-y-3">
              <input
                ref={mainImageFileInputRef}
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleMainImageUpload(file);
                }}
                className="hidden"
                id="main-image-upload"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => mainImageFileInputRef.current?.click()}
                  disabled={uploadingMainImage}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Upload size={16} />
                  {uploadingMainImage ? 'Uploading...' : 'Upload Image'}
                </button>
                <input
                  type="text"
                  value={formData.main_image_url}
                  onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="Or enter image URL"
                />
              </div>
              {formData.main_image_url && (
                <div className="mt-2">
                  <img src={formData.main_image_url} alt="Preview" className="max-w-xs rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, main_image_url: '' })}
                    className="mt-2 text-xs text-red-600 hover:text-red-800"
                  >
                    Remove image
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500">
                Upload an image or enter a URL. Images are uploaded to Supabase storage (max 5MB).
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Additional Images</label>
            <div className="space-y-3">
              {formData.additional_images.map((img, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <img src={img.url} alt={img.caption || 'Image'} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 truncate">{img.url}</p>
                    {img.caption && <p className="text-xs text-slate-500">{img.caption}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}

              <div className="space-y-3">
                <input
                  ref={additionalImageFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await handleAdditionalImageUpload(file);
                  }}
                  className="hidden"
                  id="additional-image-upload"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => additionalImageFileInputRef.current?.click()}
                    disabled={uploadingAdditionalImage}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Upload size={16} />
                    {uploadingAdditionalImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addAdditionalImage();
                      }
                    }}
                    placeholder="Or enter image URL"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <input
                  type="text"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAdditionalImage();
                    }
                  }}
                  placeholder="Caption (optional)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={(e) => addAdditionalImage(e)}
                  disabled={!newImageUrl.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <ImageIcon size={18} />
                  Add Image from URL
                </button>
                <p className="text-xs text-slate-500">
                  Upload an image or enter a URL. Images are uploaded to Supabase storage (max 5MB).
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rich Content</label>
            <WYSIWYGEditor
              value={formData.rich_content}
              onChange={(value) => setFormData({ ...formData, rich_content: value })}
              placeholder="Write your content here..."
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

      {loading ? (
        <div className="text-center py-12 text-slate-500">
          Loading materials...
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-slate-600">
            Showing {materials.length} material{materials.length !== 1 ? 's' : ''}
          </div>
          
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-900">{material.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        material.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {material.status || 'published'}
                      </span>
                      {material.content_type && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                          {material.content_type}
                        </span>
                      )}
                      {material.featured_site && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                          Site Featured
                        </span>
                      )}
                      {material.featured_theme && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                          Theme Featured
                        </span>
                      )}
                    </div>
                    {material.description && (
                      <p className="text-slate-600 mb-3 line-clamp-2">{material.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{material.type}</span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{material.format}</span>
                      {material.theme && (
                        <span className="bg-slate-100 px-3 py-1 rounded-full">{material.theme}</span>
                      )}
                      <span>{new Date(material.published_date).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEdit(material)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit material"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete material"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {materials.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-500">
              <p className="mb-4">No materials found.</p>
              <button
                onClick={() => {
                  setIsCreating(true);
                  setEditingId(null);
                  resetForm();
                }}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Your First Material
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
