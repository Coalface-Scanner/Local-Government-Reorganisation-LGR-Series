import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';

export default function LastUpdated() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLastUpdated() {
      const { data, error } = await prerenderSafe(
        supabase.from('site_metadata').select('last_updated').eq('id', 1).maybeSingle(),
        { data: null, error: null }
      );

      if (data && !error) {
        const date = new Date(data.last_updated);
        const formatted = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) + ' at ' + date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        });
        setLastUpdated(formatted);
      }
    }

    fetchLastUpdated();
  }, []);

  if (!lastUpdated) return null;

  return (
    <div className="text-center py-4 text-xs text-slate-500 border-t border-slate-200 bg-slate-50">
      Last updated {lastUpdated}
    </div>
  );
}
