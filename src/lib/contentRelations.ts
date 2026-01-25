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
 * Extract keywords from text content for matching
 */
function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, ' ').toLowerCase();
  
  // Common stop words to exclude
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'now'
  ]);
  
  // Extract words (3+ characters, alphanumeric)
  const words = cleanText.match(/\b[a-z]{3,}\b/g) || [];
  
  // Return top 20 keywords by frequency
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    if (!stopWords.has(word) && word.length >= 3) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

/**
 * Calculate content similarity based on shared keywords
 */
function calculateContentSimilarity(
  keywords1: string[],
  keywords2: string[],
  text1: string,
  text2: string
): number {
  if (!keywords1.length || !keywords2.length) return 0;
  
  // Count shared keywords
  const sharedKeywords = keywords1.filter(kw => keywords2.includes(kw)).length;
  const totalKeywords = Math.max(keywords1.length, keywords2.length);
  
  // Base similarity score (0-5 points)
  const keywordScore = (sharedKeywords / totalKeywords) * 5;
  
  // Additional bonus for title/excerpt similarity
  const text1Lower = text1.toLowerCase();
  const text2Lower = text2.toLowerCase();
  let textSimilarity = 0;
  
  // Check for shared phrases (2+ words)
  const words1 = text1Lower.split(/\s+/).filter(w => w.length >= 3);
  
  for (let i = 0; i < words1.length - 1; i++) {
    const phrase = `${words1[i]} ${words1[i + 1]}`;
    if (text2Lower.includes(phrase)) {
      textSimilarity += 0.5;
    }
  }
  
  return Math.min(keywordScore + textSimilarity, 5);
}

/**
 * Find related articles based on theme, geography, content keywords, and category
 */
export async function findRelatedArticles(
  currentSlug: string,
  theme?: string,
  geography?: string,
  limit: number = 4,
  currentContent?: string,
  currentExcerpt?: string,
  category?: string
): Promise<ContentRelation[]> {
  try {
    const query = supabase
      .from('articles')
      .select('id, title, slug, excerpt, published_date, geography, theme, lgr_phase, region, category, body')
      .eq('status', 'published')
      .neq('slug', currentSlug)
      .order('published_date', { ascending: false })
      .limit(limit * 4); // Get more than needed for filtering and scoring

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    // Extract keywords from current content if available
    const currentKeywords = currentContent 
      ? extractKeywords(currentContent + ' ' + (currentExcerpt || ''))
      : currentExcerpt 
        ? extractKeywords(currentExcerpt)
        : [];

    // Score articles by relevance
    const scored = data.map(article => {
      let score = 0;
      
      // Geography matching (highest priority)
      if (geography && article.geography) {
        if (article.geography.toLowerCase() === geography.toLowerCase()) {
          score += 10; // Exact match
        } else if (article.geography.toLowerCase().includes(geography.toLowerCase()) || 
                   geography.toLowerCase().includes(article.geography.toLowerCase())) {
          score += 5; // Partial match
        }
      }
      
      // Region matching (secondary)
      if (geography && article.region) {
        if (article.region.toLowerCase() === geography.toLowerCase()) {
          score += 8; // Exact region match
        }
      }
      
      // Theme matching
      if (theme && article.theme) {
        if (article.theme.toLowerCase() === theme.toLowerCase()) {
          score += 6; // Exact theme match
        }
      }
      
      // Category matching
      if (category && article.category) {
        if (article.category.toLowerCase() === category.toLowerCase()) {
          score += 4; // Category match
        }
      }
      
      // Content-based similarity (if we have current content)
      if (currentKeywords.length > 0 && (article.body || article.excerpt)) {
        const articleText = (article.body || '') + ' ' + (article.excerpt || '');
        const articleKeywords = extractKeywords(articleText);
        const contentScore = calculateContentSimilarity(
          currentKeywords,
          articleKeywords,
          (currentContent || currentExcerpt || ''),
          articleText
        );
        score += contentScore;
      }
      
      // Recency bonus (more recent = slightly higher score)
      const daysSincePublished = article.published_date
        ? Math.floor((Date.now() - new Date(article.published_date).getTime()) / (1000 * 60 * 60 * 24))
        : 365;
      const recencyBonus = Math.max(0, 1 - (daysSincePublished / 365)); // Decay over 1 year
      score += recencyBonus;
      
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        type: 'article' as const,
        excerpt: article.excerpt || undefined,
        geography: article.geography || undefined,
        theme: article.theme || undefined,
        relevanceScore: score
      };
    });

    // Filter out low-relevance matches (minimum score of 2)
    const MINIMUM_SCORE = 2;
    const filtered = scored.filter(item => (item.relevanceScore || 0) >= MINIMUM_SCORE);

    // Sort by relevance score and limit
    return filtered
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
    const query = supabase
      .from('materials')
      .select('id, title, slug, description, theme, geography, lgr_phase, published_date')
      .neq('slug', currentSlug)
      .order('published_date', { ascending: false })
      .limit(limit * 2);

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    // Score materials by relevance with improved weighting
    const scored = data.map(material => {
      let score = 0;
      
      // Geography matching (highest priority)
      if (geography && material.geography) {
        if (material.geography.toLowerCase() === geography.toLowerCase()) {
          score += 10; // Exact match
        } else if (material.geography.toLowerCase().includes(geography.toLowerCase()) || 
                   geography.toLowerCase().includes(material.geography.toLowerCase())) {
          score += 5; // Partial match
        }
      }
      
      // Theme matching
      if (theme && material.theme) {
        if (material.theme.toLowerCase() === theme.toLowerCase()) {
          score += 6; // Exact theme match
        }
      }
      
      // LGR phase matching
      if (lgrPhase && material.lgr_phase) {
        if (material.lgr_phase.toLowerCase() === lgrPhase.toLowerCase()) {
          score += 4; // Exact phase match
        }
      }
      
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
    let queryBuilder = supabase
      .from('facts')
      .select('id, title, category, order_index')
      .neq('id', currentId)
      .order('order_index', { ascending: true })
      .limit(limit * 2);

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder;

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
  category?: string,
  currentContent?: string,
  currentExcerpt?: string
): Promise<{
  articles: ContentRelation[];
  materials: ContentRelation[];
  facts: ContentRelation[];
}> {
  const [articles, materials, facts] = await Promise.all([
    contentType === 'article' 
      ? findRelatedArticles(currentSlug, theme, geography, 3, currentContent, currentExcerpt, category)
      : contentType === 'material'
      ? findRelatedArticles(currentSlug, theme, geography, 2, currentContent, currentExcerpt, category)
      : findRelatedArticles(currentSlug, theme, geography, 2, currentContent, currentExcerpt, category),
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
