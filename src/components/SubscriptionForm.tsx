import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface SubscriptionFormProps {
  variant?: 'default' | 'compact';
}

export default function SubscriptionForm({ variant = 'default' }: SubscriptionFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('id, active')
        .eq('email', email)
        .maybeSingle();

      if (existingSubscription) {
        if (existingSubscription.active) {
          setMessage({ type: 'error', text: 'This email is already subscribed.' });
        } else {
          const { error } = await supabase
            .from('subscriptions')
            .update({ active: true, unsubscribed_at: null })
            .eq('id', existingSubscription.id);

          if (error) throw error;

          setMessage({ type: 'success', text: 'Welcome back! You have been resubscribed.' });
          setEmail('');
        }
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .insert([{ email, active: true }]);

        if (error) throw error;

        setMessage({ type: 'success', text: 'Successfully subscribed! Check your email.' });
        setEmail('');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className={isCompact ? '' : 'bg-gradient-to-br from-white to-slate-50/50 rounded-2xl shadow-xl border border-slate-200/60 p-10 backdrop-blur-sm'}>
      {!isCompact && (
        <>
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-teal-600 to-cyan-600 rounded-full"></div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Get the Series</h3>
          </div>
          <p className="text-base text-slate-600 mb-8 leading-relaxed">
            New insights as they publish. <span className="font-semibold text-slate-700">Free.</span> No spam.
          </p>
        </>
      )}
      {isCompact && (
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          New insights as they publish. <span className="font-semibold text-slate-700">Free.</span> No spam.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <label htmlFor="subscription-email" className="sr-only">
            Email address
          </label>
          <input
            id="subscription-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all bg-white shadow-sm group-hover:border-slate-300 text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-700 to-cyan-600 text-white py-4 px-6 rounded-xl font-bold tracking-wide hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-sm uppercase letterspacing-wider"
        >
          {loading ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-6 p-4 rounded-xl text-sm font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50 shadow-sm'
              : 'bg-rose-50 text-rose-800 border border-rose-200/50 shadow-sm'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
