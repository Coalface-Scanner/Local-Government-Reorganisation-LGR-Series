import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminArticleLoginProps {
  onNavigate: (page: string) => void;
}

export default function AdminArticleLogin({ onNavigate: _onNavigate }: AdminArticleLoginProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Route Deprecated</h1>
            <p className="text-sm text-neutral-600 text-center">
              Article admin now uses the main CMS authentication flow.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/admin/login')}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
