import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Video, Mic, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { updateSiteTimestamp } from '../../lib/updateTimestamp';
import WYSIWYGEditor from '../../components/WYSIWYGEditor';

interface Interview {
  id: string;
  name: string;
  title: string;
  organization: string | null;
  description: string;
  image_url: string | null;
  video_url: string | null;
  interview_type: string;
  audio_url: string | null;
  transcript: string | null;
  status: string;
  order_index: number;
}

export default function InterviewsEditor() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    organization: '',
    description: '',
    image_url: '',
    video_url: '',
    interview_type: 'written_only',
    audio_url: '',
    transcript: '',
    status: 'draft',
    order_index: 0,
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .order('order_index');

    if (!error && data) {
      setInterviews(data);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const { error } = await supabase
      .from('interviews')
      .insert([formData]);

    if (!error) {
      await updateSiteTimestamp();
      fetchInterviews();
      resetForm();
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('interviews')
      .update(formData)
      .eq('id', id);

    if (!error) {
      await updateSiteTimestamp();
      fetchInterviews();
      resetForm();
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this interview?')) {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id);

      if (!error) {
        await updateSiteTimestamp();
        fetchInterviews();
      }
    }
  };

  const startEdit = (interview: Interview) => {
    setFormData({
      name: interview.name,
      title: interview.title,
      organization: interview.organization || '',
      description: interview.description,
      image_url: interview.image_url || '',
      video_url: interview.video_url || '',
      interview_type: interview.interview_type || 'written_only',
      audio_url: interview.audio_url || '',
      transcript: interview.transcript || '',
      status: interview.status,
      order_index: interview.order_index,
    });
    setEditingId(interview.id);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      organization: '',
      description: '',
      image_url: '',
      video_url: '',
      interview_type: 'written_only',
      audio_url: '',
      transcript: '',
      status: 'draft',
      order_index: 0,
    });
  };

  if (loading) {
    return <div>Loading interviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Interviews Management</h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingId(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Interview
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white p-6 rounded-xl border-2 border-slate-300 space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">
            {isCreating ? 'Create New Interview' : 'Edit Interview'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                placeholder="Interviewee name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title/Position</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                placeholder="e.g., CEO, Director"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Organization</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interview Type *</label>
              <select
                value={formData.interview_type}
                onChange={(e) => setFormData({ ...formData, interview_type: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="on_camera">On Camera (Video)</option>
                <option value="voice_only">Voice Only (Audio)</option>
                <option value="written_only">Written Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="draft">Draft</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="Profile photo or thumbnail"
              />
            </div>

            {formData.interview_type === 'on_camera' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Video URL</label>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="YouTube, Vimeo, or direct video URL"
                />
              </div>
            )}

            {formData.interview_type === 'voice_only' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Audio URL</label>
                <input
                  type="text"
                  value={formData.audio_url}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="MP3 or audio file URL"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="Brief description of the interview"
            />
          </div>

          {(formData.interview_type === 'on_camera' || formData.interview_type === 'voice_only') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Transcript (Optional)</label>
              <WYSIWYGEditor
                value={formData.transcript}
                onChange={(value) => setFormData({ ...formData, transcript: value })}
                placeholder="Full transcript of the interview..."
              />
            </div>
          )}

          {formData.interview_type === 'written_only' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Interview Content *</label>
              <WYSIWYGEditor
                value={formData.transcript}
                onChange={(value) => setFormData({ ...formData, transcript: value })}
                placeholder="Full written interview content..."
              />
            </div>
          )}

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
        {interviews.map((interview) => (
          <div key={interview.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-slate-900">{interview.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    interview.status === 'published' ? 'bg-green-100 text-green-800' :
                    interview.status === 'coming_soon' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {interview.status}
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {interview.interview_type === 'on_camera' && <><Video size={14} /> Video</>}
                    {interview.interview_type === 'voice_only' && <><Mic size={14} /> Audio</>}
                    {interview.interview_type === 'written_only' && <><FileText size={14} /> Written</>}
                  </span>
                </div>
                <p className="text-slate-600 mb-2">{interview.title}</p>
                {interview.organization && (
                  <p className="text-sm text-slate-500 mb-3">{interview.organization}</p>
                )}
                <p className="text-slate-600">{interview.description}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => startEdit(interview)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(interview.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {interviews.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No interviews yet. Click "Add Interview" to create one.
        </div>
      )}
    </div>
  );
}
