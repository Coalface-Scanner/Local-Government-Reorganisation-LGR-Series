import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import MetaTags from '../../components/MetaTags';
import LastUpdated from '../../components/LastUpdated';
import CollectionPageStructuredData from '../../components/CollectionPageStructuredData';
import OptimizedImage from '../../components/OptimizedImage';

interface Report {
  id: string;
  title: string;
  slug: string;
  description: string;
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

interface ReportsProps {
  onNavigate: (page: string, slug?: string) => void;
}

const ITEMS_PER_PAGE = 9;

export default function Reports({ onNavigate }: ReportsProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('format', 'Report')
        .order('published_date', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
      } else if (data) {
        setReports(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const paginatedReports = reports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-academic-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700 mb-4"></div>
          <p className="text-academic-neutral-600 font-serif">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Reports - LGR Research Reports"
        description="Browse research reports on local government reorganisation, planning, and governance. Comprehensive analysis and findings from the LGR Series."
        keywords="LGR reports, research reports, local government reports, council reform reports, reorganisation analysis"
      />
      <CollectionPageStructuredData
        name="Reports"
        description="Browse research reports on local government reorganisation, planning, and governance. Comprehensive analysis and findings from the LGR Series."
        url="/insights/reports"
        numberOfItems={reports.length}
        items={reports.map(report => ({
          name: report.title,
          url: `/article/${report.slug}`,
          description: report.description || undefined
        }))}
      />

      <div className="relative bg-academic-warm py-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="academic-section-header mb-6">
            <div className="academic-section-label">RESEARCH REPORTS</div>
            <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
              Reports{' '}
              <span className="text-teal-700 font-serif italic">
                & Research
              </span>
            </h1>
            <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
              Comprehensive research reports and analysis on local government reorganisation and council reform
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="mb-6">
          <div className="text-academic-neutral-600 font-serif">
            {reports.length} {reports.length === 1 ? 'report' : 'reports'}
          </div>
        </div>

        {paginatedReports.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-academic-neutral-600 text-academic-lg font-serif">No reports available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedReports.map(report => (
                <article
                  key={report.id}
                  className="academic-card cursor-pointer overflow-hidden group"
                >
                  {report.image_url && (
                    <div className="relative overflow-hidden border-b border-academic-neutral-300">
                      <OptimizedImage
                        src={report.image_url}
                        alt={report.title}
                        variant="thumbnail"
                        loading="lazy"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      {report.editors_pick && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-teal-700 text-white text-academic-xs font-display font-bold uppercase tracking-wider" style={{ borderRadius: '2px' }}>
                            Editor's Pick
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-start gap-2 mb-4">
                      <h2 className="text-academic-base font-display font-bold text-academic-charcoal group-hover:text-teal-700 transition-colors line-clamp-3 flex-1">
                        {report.title}
                      </h2>
                      {report.editors_pick && !report.image_url && (
                        <span className="px-2 py-1 bg-teal-700 text-white text-academic-xs font-display font-bold uppercase tracking-wider whitespace-nowrap" style={{ borderRadius: '2px' }}>
                          Editor's Pick
                        </span>
                      )}
                    </div>
                    {report.description && (
                      <p className="text-academic-base text-academic-neutral-700 mb-5 line-clamp-3 font-serif leading-relaxed">{report.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-academic-sm text-academic-neutral-600 mb-4 font-serif">
                      {report.author_name && <span>{report.author_name}</span>}
                      {report.published_date && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{new Date(report.published_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => onNavigate('article', report.slug)}
                        aria-label={`Read more about ${report.title}`}
                        className="academic-button academic-button-primary flex items-center gap-2"
                      >
                        Read more
                      </button>
                      {report.pdf_url && (
                        <a
                          href={report.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="academic-button academic-button-secondary flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download size={16} />
                          PDF
                        </a>
                      )}
                      {report.external_url && (
                        <a
                          href={report.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="academic-button academic-button-secondary flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} />
                          External Link
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="academic-button academic-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 font-display font-semibold transition-colors rounded-xl ${
                        currentPage === page
                          ? 'bg-teal-700 text-white'
                          : 'border border-academic-neutral-300 hover:bg-academic-warm text-academic-charcoal'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="academic-button academic-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <LastUpdated />
    </div>
  );
}
