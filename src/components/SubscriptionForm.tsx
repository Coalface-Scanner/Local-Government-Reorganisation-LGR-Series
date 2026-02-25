import { useState, useId } from 'react';
import { supabase } from '../lib/supabase';
import { trackSubscription } from '../utils/analytics';

interface SubscriptionFormProps {
  variant?: 'default' | 'compact';
  defaultTopics?: string[];
}

const AVAILABLE_TOPICS = [
  { value: 'local-government', label: 'Local Government' },
  { value: 'democracy', label: 'Democracy' },
  { value: 'statecraft-and-system-design', label: 'Statecraft and System Design' },
];

export default function SubscriptionForm({ variant = 'default', defaultTopics = [] }: SubscriptionFormProps) {
  const uniqueId = useId();
  const emailInputId = `subscription-email-${uniqueId}`;
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(defaultTopics);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showTopics, setShowTopics] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
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
            .select(); // Get updated data back

          if (updateError) {
            console.error('Error updating subscription:', updateError);
            throw updateError;
          }

          if (import.meta.env.DEV) {
            console.log('Subscription reactivated:', updateData);
          }
          setMessage({ type: 'success', text: 'Welcome back! You have been resubscribed.' });
          setEmail('');
        }
      } else {
        // Insert new subscription - add .select() to verify it worked
        const subscriptionData: { email: string; active: boolean; topic_preferences?: string[] } = {
          email,
          active: true,
        };
        
        // Add topic preferences if any are selected
        if (selectedTopics.length > 0) {
          subscriptionData.topic_preferences = selectedTopics;
        }
        
        const { data: insertData, error: insertError } = await supabase
          .from('subscriptions')
          .insert([subscriptionData])
          .select(); // This returns the inserted row so we can verify

        if (!insertError) {
          trackSubscription(email, selectedTopics);
        } else {
          console.error('Error inserting subscription:', insertError);
          console.error('Error details:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          throw insertError;
        }

        if (import.meta.env.DEV) {
          console.log('Subscription inserted successfully:', insertData);
        }
        setMessage({ type: 'success', text: 'Successfully subscribed! Check your email.' });
        setEmail('');
      }
    } catch (error) {
      // Log the actual error with full details
      console.error('Subscription error:', error);
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      
      // Show more detailed error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : 'Unknown error occurred';
      
      setMessage({ 
        type: 'error', 
        text: `Something went wrong: ${errorMessage}. Please check the console for details.` 
      });
    } finally {
      setLoading(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <div className={isCompact ? 'text-white' : 'bg-gradient-to-br from-white to-slate-50/50 rounded-2xl shadow-xl border border-slate-200/60 p-10 backdrop-blur-sm'}>
      {!isCompact && (
        <>
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-teal-500 via-cyan-500 to-sky-500 rounded-full"></div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Get the Series</h3>
          </div>
          <p className="text-base text-slate-700 mb-8 leading-relaxed font-serif">
            New insights as they're published. <span className="font-semibold text-slate-900">Free</span> — no spam.
          </p>
        </>
      )}
      {isCompact && (
        <p className="text-base mb-4 leading-relaxed font-serif font-semibold text-white">
          New insights as they're published. <span className="font-bold text-white">Free</span> — no spam.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <label htmlFor={emailInputId} className="sr-only">
            Email address
          </label>
          <input
            id={emailInputId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className={`w-full px-5 py-4 border-2 rounded-xl focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 outline-none transition-all shadow-sm ${
              isCompact 
                ? 'border-white/30 bg-white text-slate-900 placeholder:text-slate-500 group-hover:border-white/50' 
                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 group-hover:border-slate-300'
            }`}
          />
        </div>
        
        {/* Topic Preferences - Light and optional */}
        {!isCompact && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowTopics(!showTopics)}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              {showTopics ? 'Hide' : 'Show'} topic preferences (optional)
            </button>
            {showTopics && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                {AVAILABLE_TOPICS.map((topic) => (
                  <label key={topic.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTopics([...selectedTopics, topic.value]);
                        } else {
                          setSelectedTopics(selectedTopics.filter(t => t !== topic.value));
                        }
                      }}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">{topic.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-xl font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-sm uppercase letterspacing-wider min-h-[52px] flex items-center justify-center ${
            isCompact
              ? 'bg-teal-700 text-white hover:bg-teal-800 hover:shadow-lg'
              : 'bg-gradient-to-r from-teal-700 to-cyan-600 text-white hover:shadow-xl hover:shadow-teal-500/25'
          }`}
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
