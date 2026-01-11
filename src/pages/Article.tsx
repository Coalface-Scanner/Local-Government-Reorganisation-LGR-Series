import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LastUpdated from '../components/LastUpdated';
import ShareButtons from '../components/ShareButtons';
import MetaTags from '../components/MetaTags';
import ArticleStructuredData from '../components/ArticleStructuredData';
import OptimizedImage from '../components/OptimizedImage';
import ReadingTime from '../components/ReadingTime';
import TableOfContents from '../components/TableOfContents';
import ReadingProgress from '../components/ReadingProgress';
import ErrorDisplay from '../components/ErrorDisplay';
import { ArrowLeft, Download, ExternalLink, Calendar, User, Eye } from 'lucide-react';
import { retryWithBackoff } from '../lib/utils';

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
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchMaterial();
    }
  }, [slug]);

  const fetchMaterial = async () => {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !material) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => onNavigate('materials')}
            className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Materials
          </button>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => onNavigate('materials')}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Browse All Materials
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ReadingProgress />
      <MetaTags
        title={material.title}
        description={material.description}
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
        author={material.author_name}
        publishedDate={material.published_date}
        imageUrl={material.main_image_url || material.image_url || undefined}
        slug={material.slug}
      />
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate('materials')}
            className="flex items-center gap-2 text-slate-300 hover:text-white font-medium mb-6 group"
            aria-label="Back to Materials"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
            Back to Materials
          </button>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-cyan-600/30 border border-cyan-400 text-cyan-200 text-xs font-semibold rounded-full">
              {material.type}
            </span>
            <span className="px-3 py-1 bg-white/10 border border-white/30 text-white text-xs font-semibold rounded-full">
              {material.format}
            </span>
            {material.editors_pick && (
              <span className="px-3 py-1 bg-amber-500/30 border border-amber-400 text-amber-200 text-xs font-semibold rounded-full">
                Editor's Pick
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{material.title}</h1>
          {material.description && (
            <p className="text-xl text-slate-300 mb-6 leading-relaxed">{material.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
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
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <ErrorDisplay
            message={error}
            onRetry={fetchMaterial}
            className="mb-8"
          />
        )}

        {(material.main_image_url || material.image_url) && (
          <OptimizedImage
            src={material.main_image_url || material.image_url}
            alt={material.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg mb-8"
            priority={false}
          />
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-lg border-2 border-slate-200 mb-8">
              {(material.rich_content || material.content) ? (
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none print:prose-sm
              prose-headings:font-bold prose-headings:text-neutral-900 prose-headings:tracking-tight
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-3
              prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-h4:text-lg sm:prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-neutral-900 prose-strong:font-bold
              prose-a:text-teal-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-teal-700 prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:text-base sm:prose-blockquote:text-lg
              prose-hr:border-slate-300 prose-hr:my-8
              prose-ul:list-disc prose-ul:ml-4 sm:prose-ul:ml-6 prose-ul:space-y-2
              prose-ol:list-decimal prose-ol:ml-4 sm:prose-ol:ml-6 prose-ol:space-y-2
              prose-li:text-slate-700
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
              prose-table:w-full prose-table:text-sm prose-table:border-collapse
              prose-thead:bg-slate-100 prose-thead:border-b-2 prose-thead:border-slate-300
              prose-th:p-2 sm:prose-th:p-3 prose-th:text-left prose-th:font-bold prose-th:text-slate-900
              prose-td:p-2 sm:prose-td:p-3 prose-td:border-b prose-td:border-slate-200 prose-td:text-slate-700
              [&_table]:block [&_table]:overflow-x-auto [&_table]:whitespace-nowrap sm:[&_table]:whitespace-normal">
                  <div dangerouslySetInnerHTML={{ __html: material.rich_content || material.content }} />
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
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
                    <div key={index} className="space-y-2">
                      <OptimizedImage
                        src={img.url}
                        alt={img.caption || `Image ${index + 1}`}
                        className="w-full rounded-lg shadow-md"
                        priority={false}
                      />
                      {img.caption && (
                        <p className="text-sm text-slate-600 italic text-center">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-8 print:hidden">
              <ShareButtons
                title={material.title}
                description={material.description}
                url={`${window.location.origin}${window.location.pathname}`}
              />
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <TableOfContents content={material.rich_content || material.content} />
            </div>
          </aside>
        </div>

        {(material.pdf_url || material.external_url) && (
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Additional Resources</h3>
            <div className="flex flex-wrap gap-3">
              {material.pdf_url && (
                <a
                  href={material.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors text-slate-700 hover:text-cyan-700"
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
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-colors text-slate-700 hover:text-cyan-700"
                >
                  <ExternalLink size={16} />
                  External Link
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mb-8">
          <ShareButtons
            title={material.title}
            description={material.description}
            url={`${window.location.origin}${window.location.pathname}`}
          />
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Article Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {material.theme && (
              <div>
                <span className="text-slate-600">Theme:</span>
                <span className="ml-2 font-medium text-slate-900">{material.theme}</span>
              </div>
            )}
            {material.geography && (
              <div>
                <span className="text-slate-600">Geography:</span>
                <span className="ml-2 font-medium text-slate-900">{material.geography}</span>
              </div>
            )}
            {material.lgr_phase && (
              <div>
                <span className="text-slate-600">LGR Phase:</span>
                <span className="ml-2 font-medium text-slate-900">{material.lgr_phase}</span>
              </div>
            )}
            {material.audience && material.audience.length > 0 && (
              <div>
                <span className="text-slate-600">Audience:</span>
                <span className="ml-2 font-medium text-slate-900">{material.audience.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <LastUpdated />
        </div>
      </div>
    </div>
  );
}
