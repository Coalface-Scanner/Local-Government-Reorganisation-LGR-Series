import { Save, FileText, Calendar, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export interface ValidationError {
  field: string;
  message: string;
}

interface ContentEditorActionsProps {
  onSaveDraft: () => Promise<void> | void;
  onPublish: () => Promise<void> | void;
  onSchedulePublish?: (date: Date) => Promise<void> | void;
  onPreview?: () => void;
  saving?: boolean;
  validationErrors?: ValidationError[];
  hasChanges?: boolean;
  currentStatus?: 'draft' | 'published' | 'archived';
  scheduledPublishAt?: string | null;
  className?: string;
}

export default function ContentEditorActions({
  onSaveDraft,
  onPublish,
  onSchedulePublish,
  onPreview,
  saving = false,
  validationErrors = [],
  hasChanges = true,
  currentStatus,
  scheduledPublishAt,
  className = '',
}: ContentEditorActionsProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const hasErrors = validationErrors.length > 0;
  const canPublish = hasChanges && !hasErrors;

  const handleSchedulePublish = async () => {
    if (!onSchedulePublish || !scheduleDate) return;

    const dateTime = new Date(`${scheduleDate}T${scheduleTime || '09:00'}`);
    if (isNaN(dateTime.getTime())) {
      alert('Invalid date/time');
      return;
    }

    if (dateTime <= new Date()) {
      alert('Scheduled publish time must be in the future');
      return;
    }

    await onSchedulePublish(dateTime);
    setShowScheduleDialog(false);
    setScheduleDate('');
    setScheduleTime('');
  };

  const getStatusBadge = () => {
    if (scheduledPublishAt) {
      const scheduleDate = new Date(scheduledPublishAt);
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-800">
            Scheduled: {scheduleDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      );
    }

    if (currentStatus === 'published') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-800">Published</span>
        </div>
      );
    }

    if (currentStatus === 'archived') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
          <XCircle className="w-4 h-4 text-slate-600" />
          <span className="text-sm text-slate-800">Archived</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-yellow-600" />
        <span className="text-sm text-yellow-800">Draft</span>
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Status Badge */}
      {getStatusBadge()}

      {/* Validation Errors */}
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">
                <strong>{error.field}:</strong> {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onSaveDraft}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Draft'}
        </button>

        {onPreview && (
          <button
            onClick={onPreview}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        )}

        <button
          onClick={onPublish}
          disabled={saving || !canPublish}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <FileText className="w-4 h-4" />
          {saving ? 'Publishing...' : 'Publish Now'}
        </button>

        {onSchedulePublish && (
          <>
            <button
              onClick={() => setShowScheduleDialog(true)}
              disabled={saving || !canPublish}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Calendar className="w-4 h-4" />
              Schedule Publish
            </button>

            {showScheduleDialog && (
              <>
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-50"
                  onClick={() => setShowScheduleDialog(false)}
                />
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 z-50 min-w-[400px]">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Schedule Publication</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => {
                          setShowScheduleDialog(false);
                          setScheduleDate('');
                          setScheduleTime('');
                        }}
                        className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSchedulePublish}
                        disabled={!scheduleDate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-slate-500 space-y-1">
        <p>
          <strong>Save Draft:</strong> Saves your changes without publishing. Content remains hidden from the public.
        </p>
        <p>
          <strong>Publish Now:</strong> Makes your content immediately visible to the public.
        </p>
        {onSchedulePublish && (
          <p>
            <strong>Schedule Publish:</strong> Sets a future date and time for automatic publication.
          </p>
        )}
      </div>
    </div>
  );
}
