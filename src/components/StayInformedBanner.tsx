import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { trackSubscription } from '../utils/analytics';

export default function StayInformedBanner() {
  const uniqueId = useId();
  const emailInputId = `stay-informed-email-${uniqueId}`;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { supabase } = await import('../lib/supabase');
      // Check for existing subscription
      const { data: existingSubscription, error: checkError } = await supabase
        .from('subscriptions')
        .select('id, active')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing subscription:', checkError);
        throw checkError;
      }

      if (existingSubscription) {
        if (existingSubscription.active) {
          setMessage({ type: 'error', text: 'This email is already subscribed.' });
        } else {
          const { data: updateData, error: updateError } = await supabase
            .from('subscriptions')
            .update({ active: true, unsubscribed_at: null })
            .eq('id', existingSubscription.id)
            .select();

          if (updateError) {
            console.error('Error updating subscription:', updateError);
            throw updateError;
          }

          setMessage({ type: 'success', text: 'Welcome back! You have been resubscribed.' });
          setEmail('');
        }
      } else {
        const { data: insertData, error: insertError } = await supabase
          .from('subscriptions')
          .insert([{ email, active: true }])
          .select();

        if (!insertError) {
          trackSubscription(email, []);
        } else {
          console.error('Error inserting subscription:', insertError);
          throw insertError;
        }

        setMessage({ type: 'success', text: 'Successfully subscribed! Check your email.' });
        setEmail('');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : 'Unknown error occurred';
      
      setMessage({ 
        type: 'error', 
        text: `Something went wrong: ${errorMessage}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Text Content – match hero banner typography (font-display, font-black, tracking-wider) */}
          <div className="flex-1">
            <div className="text-white/90 text-xs sm:text-sm font-display font-bold uppercase tracking-wider mb-2">
              Stay Up To Date
            </div>
            <div className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-black leading-[1.1] tracking-wider">
              Receive our regular update direct to your inbox. Subscribe here.
            </div>
          </div>

          {/* Subscribe Button/Form */}
          <div className="flex-shrink-0">
            {message?.type === 'success' ? (
              <div className="bg-white text-teal-700 px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider">
                Subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <label htmlFor={emailInputId} className="sr-only">
                  Email address for newsletter subscription
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="px-4 py-3 rounded-lg border-0 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm min-w-[200px]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-teal-700 px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider hover:bg-white/95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            {message?.type === 'error' && (
              <div className="text-white text-xs mt-2 bg-white/20 px-2 py-1 rounded">
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
