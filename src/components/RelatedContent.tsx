import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, List, ArrowRight } from 'lucide-react';
import { ContentRelation, findAllRelatedContent } from '../lib/contentRelations';

interface RelatedContentProps {
  currentSlug: string;
  contentType: 'article' | 'material' | 'fact';
  theme?: string;
  geography?: string;
  lgrPhase?: string;
  category?: string;
  maxItems?: number; // Total max items across all types (default 6)
}

export default function RelatedContent({
  currentSlug,
  contentType,
  theme,
  geography,
  lgrPhase,
  category,
  maxItems = 6
}: RelatedContentProps) {
  const [related, setRelated] = useState<{
    articles: ContentRelation[];
    materials: ContentRelation[];
    facts: ContentRelation[];
  }>({
    articles: [],
    materials: [],
    facts: []
  });
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
        category
      );
      setRelated(content);
      setLoading(false);
    };

    fetchRelated();
  }, [currentSlug, contentType, theme, geography, lgrPhase, category]);

  if (loading) {
    return null; // Don't show loading state, just hide until ready
  }

  const allItems: (ContentRelation & { section: string })[] = [
    ...related.articles.map(item => ({ ...item, section: 'articles' })),
    ...related.materials.map(item => ({ ...item, section: 'materials' })),
    ...related.facts.map(item => ({ ...item, section: 'facts' }))
  ].slice(0, maxItems);

  if (allItems.length === 0) {
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
      case 'fact':
        return List;
      default:
        return FileText;
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Content</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allItems.map((item) => {
          const Icon = getIcon(item.type);
          return (
            <Link
              key={`${item.type}-${item.id}`}
              to={getRoute(item)}
              className="group bg-white rounded-lg border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                  <Icon size={20} className="text-teal-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-teal-700 mb-1 uppercase tracking-wide">
                    {item.type === 'article' ? 'Article' : item.type === 'material' ? 'Material' : 'Fact'}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {(item.excerpt || item.description) && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {item.excerpt || item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Read more</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
