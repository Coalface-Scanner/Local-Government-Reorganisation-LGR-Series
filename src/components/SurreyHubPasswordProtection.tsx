import { useState, useEffect, ReactNode } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface SurreyHubPasswordProtectionProps {
  children: ReactNode;
}

const SURREY_HUB_PASSWORD = 'ROWAN1988!';
const SURREY_HUB_SESSION_KEY = 'surrey_hub_authenticated';

export default function SurreyHubPasswordProtection({ children }: SurreyHubPasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated from sessionStorage
    const authStatus = sessionStorage.getItem(SURREY_HUB_SESSION_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === SURREY_HUB_PASSWORD) {
      sessionStorage.setItem(SURREY_HUB_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-slate-800 rounded-2xl shadow-xl p-8 md:p-10 border-2 border-slate-700">
            <div className="flex justify-center mb-6">
              <div className="bg-cyan-500 p-4 rounded-full">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-center text-white mb-2">
              Surrey Strategic Intelligence
            </h1>
            <p className="text-center text-slate-300 mb-8">
              This page is password protected. Please enter the password to continue.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border-2 border-red-700 rounded-lg">
                <p className="text-red-300 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="surrey-hub-password" className="block text-sm font-bold text-slate-300 mb-2">
                  Password
                </label>
                <input
                  id="surrey-hub-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-slate-900 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-white font-medium placeholder-slate-500"
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 rounded-lg transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Access Surrey Hub
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                This page contains strategic intelligence and analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
