import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, BookOpen, List, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';

interface CouncilContentLinksProps {
  councilName: string;
  maxItems?: number;
}

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: 'article' | 'material' | 'fact';
  excerpt?: string;
  description?: string;
}

export default function CouncilContentLinks({ councilName, maxItems = 6 }: CouncilContentLinksProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const allContent: ContentItem[] = [];

      try {
        // Search for articles mentioning this council
        const { data: articles } = await prerenderSafe(
          supabase.from('articles').select('id, title, slug, excerpt, geography, region').eq('status', 'published').or(`geography.ilike.%${councilName}%,region.ilike.%${councilName}%,title.ilike.%${councilName}%,body.ilike.%${councilName}%`).limit(3),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { data: [], error: null } as any
        );

        if (articles) {
          articles.forEach((article: any) => {
            allContent.push({
              id: article.id,
              title: article.title,
              slug: article.slug,
              type: 'article',
              excerpt: article.excerpt || undefined
            });
          });
        }

        // Search for materials mentioning this council
        const { data: materials } = await prerenderSafe(
          supabase.from('materials').select('id, title, slug, description, geography').or(`geography.ilike.%${councilName}%,title.ilike.%${councilName}%,description.ilike.%${councilName}%,content.ilike.%${councilName}%`).limit(2),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { data: [], error: null } as any
        );

        if (materials) {
          materials.forEach((material: any) => {
            allContent.push({
              id: material.id,
              title: material.title,
              slug: material.slug,
              type: 'material',
              description: material.description || undefined
            });
          });
        }

        // Search for facts mentioning this council (in content)
        const { data: facts } = await prerenderSafe(
          supabase.from('facts').select('id, title, content').ilike('content', `%${councilName}%`).limit(2),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { data: [], error: null } as any
        );

        if (facts) {
          facts.forEach((fact: any) => {
            const generateSlug = (title: string): string => {
              return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            };
            allContent.push({
              id: fact.id,
              title: fact.title,
              slug: generateSlug(fact.title),
              type: 'fact'
            });
          });
        }
      } catch (error) {
        console.error('Error fetching council content:', error);
      }

      // Limit total items
      setContent(allContent.slice(0, maxItems));
      setLoading(false);
    };

    if (councilName) {
      fetchContent();
    }
  }, [councilName, maxItems]);

  if (loading) {
    return null;
  }

  if (content.length === 0) {
    return null;
  }

  const getRoute = (item: ContentItem) => {
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
    <section className="mt-8 pt-8 border-t border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Related Content About {councilName}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item: any) => {
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
