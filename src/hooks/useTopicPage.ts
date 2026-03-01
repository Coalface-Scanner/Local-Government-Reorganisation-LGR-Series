import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';

interface TopicPage {
  id: string;
  theme_slug: string;
  display_name: string;
  description: string;
  key_question: string;
  secondary_questions: string[];
  related_themes: string[];
}

interface UseTopicPageResult {
  page: TopicPage | null;
  loading: boolean;
  error: string | null;
}

export function useTopicPage(themeSlug: string): UseTopicPageResult {
  const [page, setPage] = useState<TopicPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await prerenderSafe(
          supabase.from('topic_pages').select('*').eq('theme_slug', themeSlug).maybeSingle(),
          { data: null, error: null } as any
        );

        if (fetchError) {
          throw fetchError;
        }

        setPage(data || null);
      } catch (err) {
        console.error('Error fetching topic page:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch topic page');
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    if (themeSlug) {
      fetchPage();
    }
  }, [themeSlug]);

  return { page, loading, error };
}
