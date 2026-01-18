import { supabase } from './supabase';

export interface ContentRelation {
  id: string;
  title: string;
  slug: string;
  type: 'article' | 'material' | 'fact' | 'lesson' | 'interview';
  excerpt?: string;
  description?: string;
  theme?: string;
  geography?: string;
  relevanceScore?: number;
}

/**
 * Find related articles based on theme, geography, or shared keywords
 */
export async function findRelatedArticles(
  currentSlug: string,
  theme?: string,
  geography?: string,
  limit: number = 4
): Promise<ContentRelation[]> {
  try {
    let query = supabase
      .from('articles')
      .select('id, title, slug, excerpt, published_date')
      .eq('status', 'published')
      .neq('slug', currentSlug)
      .order('published_date', { ascending: false })
      .limit(limit * 2); // Get more than needed for filtering

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    // Score articles by relevance
    const scored = data.map(article => {
      let score = 0;
      // Theme matching would require a theme field in articles table
      // For now, we'll prioritize by recency
      score += 1;
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        type: 'article' as const,
        excerpt: article.excerpt || undefined,
        relevanceScore: score
      };
    });

    // Sort by relevance score and limit
    return scored
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding related articles:', error);
    return [];
  }
}

/**
 * Find related materials based on theme, geography, or LGR phase
 */
export async function findRelatedMaterials(
  currentSlug: string,
  theme?: string,
  geography?: string,
  lgrPhase?: string,
  limit: number = 3
): Promise<ContentRelation[]> {
  try {
    let query = supabase
      .from('materials')
      .select('id, title, slug, description, theme, geography, lgr_phase, published_date')
      .neq('slug', currentSlug)
      .order('published_date', { ascending: false })
      .limit(limit * 2);

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    // Score materials by relevance
    const scored = data.map(material => {
      let score = 0;
      if (theme && material.theme === theme) score += 3;
      if (geography && material.geography === geography) score += 2;
      if (lgrPhase && material.lgr_phase === lgrPhase) score += 1;
      // Base score for recency
      score += 1;

      return {
        id: material.id,
        title: material.title,
        slug: material.slug,
        type: 'material' as const,
        description: material.description || undefined,
        theme: material.theme || undefined,
        geography: material.geography || undefined,
        relevanceScore: score
      };
    });

    // Sort by relevance score and limit
    return scored
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding related materials:', error);
    return [];
  }
}

/**
 * Find related facts based on category or theme
 */
export async function findRelatedFacts(
  currentId: string,
  category?: string,
  limit: number = 2
): Promise<ContentRelation[]> {
  try {
    let query = supabase
      .from('facts')
      .select('id, title, category, order_index')
      .neq('id', currentId)
      .order('order_index', { ascending: true })
      .limit(limit * 2);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    // Generate slug from title
    const generateSlug = (title: string): string => {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    return data.slice(0, limit).map(fact => ({
      id: fact.id,
      title: fact.title,
      slug: generateSlug(fact.title),
      type: 'fact' as const,
      theme: fact.category || undefined
    }));
  } catch (error) {
    console.error('Error finding related facts:', error);
    return [];
  }
}

/**
 * Find all related content for a given piece of content
 */
export async function findAllRelatedContent(
  currentSlug: string,
  contentType: 'article' | 'material' | 'fact',
  theme?: string,
  geography?: string,
  lgrPhase?: string,
  category?: string
): Promise<{
  articles: ContentRelation[];
  materials: ContentRelation[];
  facts: ContentRelation[];
}> {
  const [articles, materials, facts] = await Promise.all([
    contentType === 'article' 
      ? findRelatedArticles(currentSlug, theme, geography, 3)
      : contentType === 'material'
      ? findRelatedArticles(currentSlug, theme, geography, 2)
      : findRelatedArticles(currentSlug, theme, geography, 2),
    contentType === 'material'
      ? findRelatedMaterials(currentSlug, theme, geography, lgrPhase, 2)
      : findRelatedMaterials(currentSlug, theme, geography, lgrPhase, 2),
    contentType === 'fact'
      ? findRelatedFacts(currentSlug, category, 2)
      : findRelatedFacts(currentSlug, category, 1)
  ]);

  return {
    articles: articles.slice(0, 3), // Cap at 3-4 articles
    materials: materials.slice(0, 2), // Cap at 2 materials
    facts: facts.slice(0, 2) // Cap at 2 facts
  };
}
