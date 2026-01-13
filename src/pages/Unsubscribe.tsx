import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import MetaTags from '../components/MetaTags';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

export default function Unsubscribe() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(`/${page}`);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error' | 'not-found'; message: string } | null>(null);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data: subscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('id, active')
        .eq('email', email)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!subscription) {
        setResult({
          type: 'not-found',
          message: 'This email address is not subscribed to our mailing list.'
        });
        setLoading(false);
        return;
      }

      if (!subscription.active) {
        setResult({
          type: 'error',
          message: 'This email address has already been unsubscribed.'
        });
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('id', subscription.id);

      if (updateError) throw updateError;

      setResult({
        type: 'success',
        message: 'You have been successfully unsubscribed. We\'re sorry to see you go!'
      });
      setEmail('');
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us for assistance.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MetaTags
        title="Unsubscribe - LGR Series Newsletter"
        description="Unsubscribe from the LGR Series mailing list. Enter your email address to stop receiving weekly insights and updates."
      />
      <Navigation onNavigate={handleNavigate} currentPage="unsubscribe" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Unsubscribe from Mailing List
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We're sorry to see you go. Enter your email address below to unsubscribe from our research updates.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 max-w-md mx-auto">
          <form onSubmit={handleUnsubscribe} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 px-6 rounded-xl font-bold tracking-wide hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? 'Processing...' : 'Unsubscribe'}
            </button>
          </form>

          {result && (
            <div
              className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
                result.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                  : result.type === 'not-found'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200/50'
                  : 'bg-rose-50 text-rose-800 border border-rose-200/50'
              }`}
            >
              {result.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{result.message}</p>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-600">
            Changed your mind?{' '}
            <a href="/subscribe" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
              Resubscribe here
            </a>
          </p>
        </div>
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
