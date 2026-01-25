import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, ArrowRight } from 'lucide-react';
import { ContentRelation, findAllRelatedContent } from '../lib/contentRelations';

interface SeeAlsoSectionProps {
  currentSlug: string;
  contentType: 'article' | 'material' | 'fact';
  theme?: string;
  geography?: string;
  lgrPhase?: string;
  category?: string;
  currentContent?: string;
  currentExcerpt?: string;
  maxItems?: number;
}

/**
 * SeeAlsoSection component - displays related content in a "See also" format
 * More focused than RelatedContent, showing only the most relevant items
 */
export default function SeeAlsoSection({
  currentSlug,
  contentType,
  theme,
  geography,
  lgrPhase,
  category,
  currentContent,
  currentExcerpt,
  maxItems = 4
}: SeeAlsoSectionProps) {
  const [related, setRelated] = useState<ContentRelation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      const content = await findAllRelatedContent(
        currentSlug,
        contentType,
        theme,
        geography,
        lgrPhase,
        category,
        currentContent,
        currentExcerpt
      );

      // Combine all types and take top items by relevance score
      const allItems = [
        ...content.articles,
        ...content.materials,
        ...content.facts
      ]
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, maxItems);

      setRelated(allItems);
      setLoading(false);
    };

    fetchRelated();
  }, [currentSlug, contentType, theme, geography, lgrPhase, category, currentContent, currentExcerpt, maxItems]);

  if (loading || related.length === 0) {
    return null;
  }

  const getRoute = (item: ContentRelation) => {
    switch (item.type) {
      case 'article':
        return `/insights/${item.slug}`;
      case 'material':
        return `/materials/${item.slug}`;
      case 'fact':
        return `/facts/${item.slug}`;
      default:
        return '#';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'article':
        return FileText;
      case 'material':
        return BookOpen;
      default:
        return FileText;
    }
  };

  return (
    <section className="mt-16 pt-8 border-t border-academic-neutral-300">
      <h3 className="text-academic-xl font-display font-bold text-academic-charcoal mb-6">
        See also
      </h3>
      <ul className="space-y-4">
        {related.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <li key={`${item.type}-${item.id}`}>
              <Link
                to={getRoute(item)}
                className="group flex items-start gap-4 p-4 rounded-lg hover:bg-academic-warm transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <Icon size={20} className="text-teal-700 group-hover:text-teal-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-academic-base font-display font-semibold text-academic-charcoal group-hover:text-teal-700 transition-colors mb-1">
                    {item.title}
                  </h4>
                  {(item.excerpt || item.description) && (
                    <p className="text-academic-sm text-academic-neutral-600 line-clamp-2 font-serif">
                      {item.excerpt || item.description}
                    </p>
                  )}
                </div>
                <ArrowRight 
                  size={16} 
                  className="flex-shrink-0 mt-1 text-academic-neutral-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" 
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
