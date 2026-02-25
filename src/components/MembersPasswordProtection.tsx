import { useState, useEffect, ReactNode } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface MembersPasswordProtectionProps {
  children: ReactNode;
}

const MEMBERS_SESSION_KEY = 'members_authenticated';

export default function MembersPasswordProtection({ children }: MembersPasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated from sessionStorage
    const authStatus = sessionStorage.getItem(MEMBERS_SESSION_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Get password from environment variable, or use a default for development
    const correctPassword = import.meta.env.VITE_MEMBERS_PASSWORD || import.meta.env.VITE_SITE_PASSWORD;

    if (!correctPassword) {
      setError('Password protection is not configured. Please contact the administrator.');
      return;
    }

    if (password === correctPassword) {
      sessionStorage.setItem(MEMBERS_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-teal-50 to-neutral-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-neutral-200">
            <div className="flex justify-center mb-6">
              <div className="bg-teal-700 p-4 rounded-full">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-center text-neutral-900 mb-2">
              Members Access Only
            </h1>
            <p className="text-center text-neutral-600 mb-8">
              This page is password protected. Please enter the password to continue.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="members-password" className="block text-sm font-bold text-neutral-700 mb-2">
                  Password
                </label>
                <input
                  id="members-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-neutral-900 font-medium"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 px-6 rounded-lg transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Access Members Area
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-500">
                This page contains members-only content.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
