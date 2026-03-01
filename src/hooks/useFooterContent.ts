import { useState, useEffect } from 'react';
import { hasValidSupabase } from '../lib/supabaseEnv';

interface FooterContentItem {
  id: string;
  section: string;
  content: string;
  link_text: string | null;
  link_url: string | null;
  order_index: number;
}

interface UseFooterContentResult {
  content: FooterContentItem[];
  loading: boolean;
  error: string | null;
  getSection: (section: string) => FooterContentItem | undefined;
}

export function useFooterContent(): UseFooterContentResult {
  const [content, setContent] = useState<FooterContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasValidSupabase) {
      setLoading(false);
      return;
    }
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const { supabase } = await import('../lib/supabase');
        const { prerenderSafe } = await import('../utils/prerender');
        const { data, error: fetchError } = await prerenderSafe(
          supabase.from('footer_content').select('*').order('order_index'),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { data: [], error: null } as any
        );
        if (fetchError) throw fetchError;
        setContent(data || []);
      } catch (err) {
        console.error('Error fetching footer content:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch footer content');
        setContent([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getSection = (section: string): FooterContentItem | undefined => {
    return content.find(item => item.section === section);
  };

  return { content, loading, error, getSection };
}
