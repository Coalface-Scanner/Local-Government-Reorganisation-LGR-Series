import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';
import { SEOHead } from '../components/SEOHead';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import ArticleStructuredData from '../components/ArticleStructuredData';
import FAQSection from '../components/FAQSection';
import { ArrowLeft, AlertCircle, Users, DollarSign, FileText, CheckCircle, type LucideIcon } from 'lucide-react';
import { enhanceContentWithGlossaryLinks } from '../lib/glossaryLinks';
import { enhanceContentWithInternalLinks } from '../lib/internalLinks';
import { sanitizeHtmlContent } from '../lib/htmlSanitizer';

interface Fact {
  id: string;
  title: string;
  content: string;
  category: string | null;
  order_index: number;
  source_url?: string | null;
}

const categoryIcons: Record<string, LucideIcon> = {
  'Workforce Impact': Users,
  'Financial Performance': DollarSign,
  'Service Delivery': FileText,
  'Democratic Impact': CheckCircle,
  'Overview': AlertCircle,
};

const categoryColors: Record<string, string> = {
  'Workforce Impact': 'from-teal-600 to-cyan-700',
  'Financial Performance': 'from-emerald-500 to-teal-600',
  'Service Delivery': 'from-teal-500 to-cyan-600',
  'Democratic Impact': 'from-cyan-600 to-teal-700',
  'Overview': 'from-teal-700 to-teal-800',
};

const generateSlug = (title: string): string => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

export default function FactDetail() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [fact, setFact] = useState<Fact | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchFact = useCallback(async () => {
    setLoading(true);
    // Generate slug from title for matching
    const { data: facts, error } = await prerenderSafe(
      supabase.from('facts').select('*').order('order_index'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { data: [], error: null } as any
    );

    if (error) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (facts && slug) {
      // Find fact by matching slug (generated from title)
      const matchedFact = facts.find(f => generateSlug(f.title) === slug);

      if (matchedFact) {
        setFact(matchedFact);
      } else {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchFact();
    }
  }, [slug, fetchFact]);

  // Must run unconditionally (before any early return) to satisfy Rules of Hooks
  const linkClass = 'text-teal-700 hover:text-teal-800 underline font-medium';
  const enhancedContent = useMemo(() => {
    if (!fact?.content) return '';
    const withGlossary = enhanceContentWithGlossaryLinks(fact.content, {
      onlyFirstOccurrence: true,
      excludeSlugs: [],
      linkClass: `glossary-link ${linkClass}`
    });
    const withInternalLinks = enhanceContentWithInternalLinks(withGlossary, { linkClass });
    return sanitizeHtmlContent(withInternalLinks);
  }, [fact?.content]);

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
          <p className="text-academic-neutral-600 font-serif">Loading fact...</p>
        </div>
      </div>
    );
  }

  if (notFound || !fact) {
    return (
      <div className="min-h-screen bg-academic-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/facts-and-data')}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-medium mb-8 group font-display"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts & Data
          </button>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-academic-neutral-200 text-center academic-card">
            <h1 className="text-3xl font-bold text-academic-charcoal mb-4 font-display">Fact Not Found</h1>
            <p className="text-academic-neutral-600 mb-6 font-serif">The fact you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/facts-and-data')}
              className="px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-display font-bold"
            >
              View All Facts & Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const _Icon = categoryIcons[fact.category || 'Overview'] || AlertCircle;
  const _gradientClass = categoryColors[fact.category || 'Overview'] || 'from-slate-500 to-slate-700';

  const getDescription = () => {
    const textContent = fact.content.replace(/<[^>]*>/g, '').trim();
    let desc = textContent.length > 0 ? textContent : `Key facts about ${fact.title} in local government reorganisation.`;
    
    // Add category context if available
    if (fact.category && desc.length < 140) {
      const categoryInDesc = desc.toLowerCase().includes(fact.category.toLowerCase());
      if (!categoryInDesc) {
        desc = `${desc} ${fact.category} insights on local government reorganisation.`;
      }
    }
    
    if (desc.length < 25) {
      desc = `Key facts about ${fact.title} in local government reorganisation and council reform.`;
    }
    if (desc.length > 160) {
      desc = desc.substring(0, 157) + '...';
    }
    return desc;
  };

  const getTitle = () => {
    // Include category in title if available and space allows
    let title = fact.title;
    if (fact.category) {
      const categoryTitle = `${fact.category}: ${fact.title}`;
      const maxTitleLength = 52; // 70 - 18 (" | LGR Initiative")
      if (categoryTitle.length <= maxTitleLength) {
        title = categoryTitle;
      }
    }
    
    const fullTitle = `${title} - Facts & Figures`;
    const maxTitleLength = 52; // 70 - 18 (" | LGR Initiative")
    return fullTitle.length > maxTitleLength ? fullTitle.substring(0, maxTitleLength - 3) + '...' : fullTitle;
  };

  const factSlug = slug || (fact ? generateSlug(fact.title) : '');
  return (
    <>
      <SEOHead
        page="factsKeyFacts"
        overrides={{
          title: `${fact.title} | LGR Initiative`,
          description: fact.content?.replace(/<[^>]*>/g, '').substring(0, 160) || fact.title,
          path: `/facts/${factSlug}`,
        }}
      />
      <PageBanner
        heroLabel={fact.category ? fact.category.toUpperCase() : 'FACTS & FIGURES'}
        heroTitle={fact.title}
        heroSubtitle={fact.category ? `${fact.category} insights on local government reorganisation` : undefined}
        currentPath={location.pathname}
        breadcrumbCurrentLabel={fact.title}
      />
      <div data-page-nav className="bg-academic-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <button
            onClick={() => navigate('/facts-and-data')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts & Data
          </button>
        </div>
      </div>
      <div data-page-main className="min-h-screen bg-academic-cream">
        <MetaTags
          title={getTitle()}
          description={getDescription()}
          keywords="local government, reorganisation, facts, LGR, evidence"
          ogType="article"
        />
        <ArticleStructuredData
          title={fact.title}
          description={getDescription()}
          author="LGR Initiative Editorial Team"
          publishedDate={new Date().toISOString()}
          imageUrl={undefined}
          slug={generateSlug(fact.title)}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <article className="prose prose-lg max-w-none">
          <style>{`
            .prose h2 {
              font-size: 1.875rem;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
              line-height: 1.2;
              color: #171717;
            }

            .prose h3 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 1.75rem;
              margin-bottom: 0.75rem;
              line-height: 1.3;
              color: #262626;
            }

            .prose p {
              font-size: 1.125rem;
              line-height: 1.75;
              margin-bottom: 1.25rem;
              color: #404040;
            }

            .prose blockquote {
              border-left: 4px solid #0f766e;
              padding-left: 1.5rem;
              margin: 2rem 0;
              font-style: italic;
              color: #525252;
              font-size: 1.25rem;
            }

            .prose ul,
            .prose ol {
              padding-left: 1.75rem;
              margin: 1.5rem 0;
            }

            .prose li {
              margin-bottom: 0.75rem;
              line-height: 1.75;
              color: #404040;
            }

            .prose a {
              color: #0f766e;
              text-decoration: underline;
              font-weight: 500;
            }

            .prose a:hover {
              color: #115e59;
            }

            .prose strong {
              color: #171717;
              font-weight: 600;
            }
          `}</style>
          <div 
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-academic-neutral-200 academic-card"
            dangerouslySetInnerHTML={{ __html: enhancedContent }}
          />
          {fact.source_url && (
            <p className="mt-6 text-sm text-slate-600">
              Source:{' '}
              <a
                href={fact.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-800 underline font-medium"
              >
                View source
              </a>
            </p>
          )}
        </article>

        <div className="mt-12 pt-8 border-t border-academic-neutral-200">
          <button
            onClick={() => navigate('/facts-and-data')}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-medium group font-display"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            View All Facts & Data
          </button>
        </div>
        </div>

        <FAQSection page="facts" />
      </div>
    </>
  );
}
