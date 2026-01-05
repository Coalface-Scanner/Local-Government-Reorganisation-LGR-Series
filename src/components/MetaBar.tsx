import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MetaBarProps {
  onNavigate: (page: string) => void;
}

export default function MetaBar({ onNavigate }: MetaBarProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    async function fetchLastUpdated() {
      const { data } = await supabase
        .from('site_metadata')
        .select('last_updated')
        .eq('id', 1)
        .maybeSingle();

      if (data?.last_updated) {
        const date = new Date(data.last_updated);
        const formatted = date.toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        setLastUpdated(formatted);
      }
    }

    fetchLastUpdated();

    const channel = supabase
      .channel('site_metadata_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'site_metadata'
      }, () => {
        fetchLastUpdated();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="bg-slate-100 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-700">
          <span className="font-medium">
            Last updated: {lastUpdated || 'Loading...'}
          </span>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => onNavigate('reasons')}
            className="hover:text-cyan-600 transition-colors underline decoration-dotted underline-offset-2"
          >
            Method and sources
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => onNavigate('reasons')}
            className="hover:text-cyan-600 transition-colors underline decoration-dotted underline-offset-2"
          >
            Corrections
          </button>
        </div>
      </div>
    </div>
  );
}
