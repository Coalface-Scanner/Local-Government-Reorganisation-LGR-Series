import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';

interface PageContentItem {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  content: string;
  metadata: Record<string, unknown>;
  order_index: number;
}

interface UsePageContentResult {
  content: PageContentItem[];
  loading: boolean;
  error: string | null;
  getSection: (sectionKey: string) => PageContentItem | undefined;
}

export function usePageContent(pageSlug: string): UsePageContentResult {
  const [content, setContent] = useState<PageContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await prerenderSafe(
          supabase.from('page_content').select('*').eq('page_slug', pageSlug).order('order_index'),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { data: [], error: null } as any
        );

        if (fetchError) {
          throw fetchError;
        }

        setContent(data || []);
      } catch (err) {
        console.error('Error fetching page content:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch page content');
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    if (pageSlug) {
      fetchContent();
    }
  }, [pageSlug]);

  const getSection = (sectionKey: string): PageContentItem | undefined => {
    return content.find(item => item.section_key === sectionKey);
  };

  return { content, loading, error, getSection };
}
