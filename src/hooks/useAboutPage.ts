import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AboutPage {
  id: string;
  page_slug: string;
  title: string;
  content: string;
  sections: Record<string, unknown>;
}

interface UseAboutPageResult {
  page: AboutPage | null;
  loading: boolean;
  error: string | null;
}

export function useAboutPage(pageSlug: string): UseAboutPageResult {
  const [page, setPage] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('about_pages')
          .select('*')
          .eq('page_slug', pageSlug)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        setPage(data || null);
      } catch (err) {
        console.error('Error fetching about page:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch about page');
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    if (pageSlug) {
      fetchPage();
    }
  }, [pageSlug]);

  return { page, loading, error };
}
