import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LastUpdated from '../components/LastUpdated';
import ShareButtons from '../components/ShareButtons';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import ArticleStructuredData from '../components/ArticleStructuredData';
import OptimizedImage from '../components/OptimizedImage';
import ReadingTime from '../components/ReadingTime';
import TableOfContents from '../components/TableOfContents';
import ReadingProgress from '../components/ReadingProgress';
import ErrorDisplay from '../components/ErrorDisplay';
import Breadcrumbs from '../components/Breadcrumbs';
import BreadcrumbStructuredData from '../components/BreadcrumbStructuredData';
import RelatedContent from '../components/RelatedContent';
import SeeAlsoSection from '../components/SeeAlsoSection';
import PrintButton from '../components/PrintButton';
import { ArrowLeft, Download, ExternalLink, Calendar, User, Eye } from 'lucide-react';
import { retryWithBackoff, getThemeDisplayName } from '../lib/utils';
import { enhanceContentWithGlossaryLinks } from '../lib/glossaryLinks';
import { useScrollDepthTracking } from '../hooks/useScrollDepthTracking';
import { useTimeOnPageTracking } from '../hooks/useTimeOnPageTracking';

interface Material {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  rich_content: string | null;
  main_image_url: string | null;
  additional_images: Array<{ url: string; caption?: string }> | null;
  published_date: string;
  updated_at: string;
  read_count: number;
  editors_pick: boolean;
  type: string;
  geography: string;
  theme: string;
  audience: string[];
  lgr_phase: string;
  format: string;
  author: string;
  author_name: string;
  image_url: string;
  pdf_url: string;
  external_url: string;
}

interface ArticleProps {
  slug?: string;
  onNavigate: (page: string) => void;
}

export default function Article({ slug, onNavigate }: ArticleProps) {
  const location = useLocation();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track scroll depth and time on page
  useScrollDepthTracking();
  useTimeOnPageTracking();

  const fetchMaterial = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (error) throw error;
        return data;
      });

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const parsedData = {
        ...data,
        additional_images: typeof data.additional_images === 'string'
          ? JSON.parse(data.additional_images)
          : data.additional_images
      };

      setMaterial(parsedData);
      setLoading(false);

      // Update read count (non-blocking, errors are ignored)
      supabase
        .from('materials')
        .update({ read_count: (data.read_count || 0) + 1 })
        .eq('id', data.id)
        .then(({ error }) => {
          if (error) {
            console.error('Failed to update read count:', error);
          }
        });
    } catch (err) {
      setError('Failed to load article. Please try again.');
      setLoading(false);
      console.error('Error fetching material:', err);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchMaterial();
    }
  }, [slug, fetchMaterial]);

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
          <p className="text-academic-neutral-600 font-serif">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !material) {
    return (
      <div className="min-h-screen bg-academic-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => onNavigate('materials')}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-display font-medium mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Materials
          </button>
          <div className="academic-card p-12 text-center">
            <h1 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-4">Article Not Found</h1>
            <p className="text-academic-neutral-600 mb-6 font-serif">The article you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => onNavigate('materials')}
              className="academic-button academic-button-primary"
            >
              Browse All Materials
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhance title with geography when available, ensuring it stays under 70 chars total
  const getTitle = () => {
    const maxTitleLength = 56; // 70 - 14 (" | LGR Series")
    let title = material.title;
    
    // Add geography prefix if available and not already in title
    if (material.geography && material.geography !== 'National') {
      const geographyPrefix = `${material.geography}: `;
      const geographyInTitle = title.toLowerCase().includes(material.geography.toLowerCase());
      
      if (!geographyInTitle && (geographyPrefix.length + title.length) <= maxTitleLength) {
        title = geographyPrefix + title;
      }
    }
    
    // Truncate if still too long
    if (title.length > maxTitleLength) {
      title = title.substring(0, maxTitleLength - 3) + '...';
    }
    
    return title;
  };

  // Enhance content with glossary links
  const enhancedContent = useMemo(() => {
    const content = material?.rich_content || material?.content;
    if (!content) return '';
    return enhanceContentWithGlossaryLinks(content, {
      onlyFirstOccurrence: true,
      excludeSlugs: [],
      linkClass: 'glossary-link text-teal-700 hover:text-teal-800 underline font-medium'
    });
  }, [material?.rich_content, material?.content]);

  // Generate description from material description or content, including geography context (25-160 chars)
  const getDescription = () => {
    let desc = '';
    
    if (material.description && material.description.trim().length >= 25) {
      desc = material.description.trim();
    } else if (material.content) {
      // Strip HTML and get text content
      const textContent = material.content.replace(/<[^>]*>/g, '').trim();
      if (textContent.length >= 25) {
        desc = textContent;
      }
    }
    
    // Ensure description is between 25-160 chars and includes geography context
    if (desc.length < 25) {
      const geographyContext = material.geography && material.geography !== 'National' 
        ? ` in ${material.geography}` 
        : '';
      
      const phaseContext = material.lgr_phase ? ` during ${material.lgr_phase.toLowerCase()}` : '';
      const themeContext = material.theme ? ` on ${material.theme.toLowerCase()}` : '';
      
      desc = `Research material on ${material.title}${geographyContext}${phaseContext}${themeContext}. Explore insights on local government reorganisation.`;
    } else {
      // Add geography context to existing description if not present and space allows
      if (material.geography && material.geography !== 'National') {
        const geographyInDesc = desc.toLowerCase().includes(material.geography.toLowerCase());
        if (!geographyInDesc && (desc.length + material.geography.length + 10) <= 160) {
          desc = `${desc} Material focuses on ${material.geography}.`;
        }
      }
    }
    
    // Ensure description is between 25-160 chars
    if (desc.length < 25) {
      desc = `Research material on ${material.title}. Explore insights on local government reorganisation and ${material.theme || 'council reform'}.`;
    }
    if (desc.length > 160) {
      desc = desc.substring(0, 157) + '...';
    }
    
    return desc;
  };

  return (
    <div className="min-h-screen bg-academic-cream">
      <ReadingProgress />
      <MetaTags
        title={getTitle()}
        description={getDescription()}
        keywords={`local government, reorganisation, LGR, ${material.theme}, ${material.geography}`}
        ogType="article"
        ogImage={material.main_image_url || material.image_url || undefined}
        article={{
          publishedTime: material.published_date,
          author: material.author_name,
          section: material.theme,
          tags: [material.type, material.geography, material.theme, ...material.audience]
        }}
      />
      <ArticleStructuredData
        title={material.title}
        description={material.description}
        author={material.author_name || material.author || "LGR Series Editorial Team"}
        publishedDate={material.published_date}
        updatedDate={material.updated_at}
        imageUrl={material.main_image_url || material.image_url || undefined}
        slug={material.slug}
        geography={material.geography}
        theme={material.theme}
      />
      <PageBanner
        heroLabel={material.type ? material.type.toUpperCase() : 'MATERIALS'}
        heroTitle={material.title}
        heroSubtitle={material.description || undefined}
        currentPath={location.pathname}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BreadcrumbStructuredData
          items={[
            { label: 'Materials', path: '/materials' },
            { label: material.title }
          ]}
        />
        <div className="flex items-center justify-between mb-6">
          <Breadcrumbs 
            items={[
              { label: 'Materials', path: '/materials' },
              { label: material.title }
            ]}
            className="text-academic-neutral-600"
          />
          <button
            onClick={() => onNavigate('materials')}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-display font-medium group"
            aria-label="Back to Materials"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            Back to Materials
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-teal-100 border border-teal-500 text-teal-800 text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
            {material.type}
          </span>
          <span className="px-3 py-1 bg-academic-neutral-100 border border-academic-neutral-300 text-academic-charcoal text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
            {material.format}
          </span>
          {material.editors_pick && (
            <span className="px-3 py-1 bg-amber-100 border border-amber-400 text-amber-800 text-academic-xs font-display font-semibold" style={{ borderRadius: '2px' }}>
              Editor's Pick
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6 text-academic-sm text-academic-neutral-600 font-serif mb-8">
          {material.author_name && (
            <div className="flex items-center gap-2">
              <User size={16} aria-hidden="true" />
              <span>{material.author_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={16} aria-hidden="true" />
            <span>{new Date(material.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          {material.read_count > 0 && (
            <div className="flex items-center gap-2">
              <Eye size={16} aria-hidden="true" />
              <span>{material.read_count} reads</span>
            </div>
          )}
          <ReadingTime content={material.rich_content || material.content} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && (
          <ErrorDisplay
            message={error}
            onRetry={fetchMaterial}
            className="mb-8"
          />
        )}

        {(material.main_image_url || material.image_url) && (
          <div className="mb-16">
            <OptimizedImage
              src={material.main_image_url || material.image_url}
              alt={material.title}
              variant="hero"
              className="w-full"
              priority={true}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <div className="academic-card p-8 md:p-12 mb-12">
              {(material.rich_content || material.content) ? (
                <div className="academic-prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: enhancedContent }} />
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-lg text-slate-600 mb-6">
                    This content is available as a downloadable document.
                  </p>
                  {material.pdf_url && (
                    <a
                      href={material.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="academic-button academic-button-primary inline-flex items-center gap-2"
                    >
                      <Download size={20} aria-hidden="true" />
                      Download Document
                    </a>
                  )}
                </div>
              )}

              {material.additional_images && material.additional_images.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {material.additional_images.map((img, index) => (
                    <OptimizedImage
                      key={index}
                      src={img.url}
                      alt={img.caption || `Image ${index + 1}`}
                      variant="article"
                      caption={img.caption}
                      priority={false}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8 print:hidden">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <ShareButtons
                  title={material.title}
                  description={material.description}
                  url={`${window.location.origin}${window.location.pathname}`}
                />
                <PrintButton variant="outline" />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <TableOfContents content={material.rich_content || material.content} />
            </div>
          </aside>
        </div>

        {(material.pdf_url || material.external_url) && (
          <div className="bg-academic-warm academic-card p-8 mb-10">
            <h3 className="font-display font-bold text-academic-charcoal mb-5 text-academic-lg">Additional Resources</h3>
            <div className="flex flex-wrap gap-3">
              {material.pdf_url && (
                <a
                  href={material.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="academic-button academic-button-secondary flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </a>
              )}
              {material.external_url && (
                <a
                  href={material.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="academic-button academic-button-secondary flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  External Link
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mb-10 print:hidden">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <ShareButtons
              title={material.title}
              description={material.description}
              url={`${window.location.origin}${window.location.pathname}`}
            />
            <PrintButton variant="outline" />
          </div>
        </div>

        <div className="bg-academic-warm academic-card p-8">
          <h3 className="font-display font-bold text-academic-charcoal mb-6 text-academic-lg">Article Information</h3>
          <div className="grid md:grid-cols-2 gap-5 text-academic-base font-serif">
            {material.theme && (
              <div>
                <span className="text-academic-neutral-600">Theme:</span>
                <span className="ml-2 font-medium text-academic-charcoal">{getThemeDisplayName(material.theme)}</span>
              </div>
            )}
            {material.geography && (
              <div>
                <span className="text-academic-neutral-600">Geography:</span>
                <span className="ml-2 font-medium text-academic-charcoal">{material.geography}</span>
              </div>
            )}
            {material.lgr_phase && (
              <div>
                <span className="text-academic-neutral-600">LGR Phase:</span>
                <span className="ml-2 font-medium text-academic-charcoal">{material.lgr_phase}</span>
              </div>
            )}
            {material.audience && material.audience.length > 0 && (
              <div>
                <span className="text-academic-neutral-600">Audience:</span>
                <span className="ml-2 font-medium text-academic-charcoal">{material.audience.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <SeeAlsoSection
          currentSlug={material.slug}
          contentType="material"
          theme={material.theme ?? undefined}
          geography={material.geography ?? undefined}
          lgrPhase={material.lgr_phase ?? undefined}
          currentContent={material.rich_content || material.content || undefined}
          currentExcerpt={material.description ?? undefined}
          maxItems={4}
        />

        <RelatedContent
          currentSlug={material.slug}
          contentType="material"
          theme={material.theme ?? undefined}
          geography={material.geography ?? undefined}
          lgrPhase={material.lgr_phase ?? undefined}
          currentContent={material.rich_content || material.content || undefined}
          currentExcerpt={material.description ?? undefined}
          maxItems={6}
        />
        <div className="mt-8">
          <LastUpdated />
        </div>
      </div>
    </div>
  );
}
