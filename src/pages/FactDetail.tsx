import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import MetaTags from '../components/MetaTags';
import LastUpdated from '../components/LastUpdated';
import FAQSection from '../components/FAQSection';
import { ArrowLeft, AlertCircle, Users, DollarSign, FileText, CheckCircle } from 'lucide-react';

interface Fact {
  id: string;
  title: string;
  content: string;
  category: string | null;
  order_index: number;
}

const categoryIcons: Record<string, any> = {
  'Workforce Impact': Users,
  'Financial Performance': DollarSign,
  'Service Delivery': FileText,
  'Democratic Impact': CheckCircle,
  'Overview': AlertCircle,
};

const categoryColors: Record<string, string> = {
  'Workforce Impact': 'from-blue-500 to-cyan-600',
  'Financial Performance': 'from-emerald-500 to-teal-600',
  'Service Delivery': 'from-purple-500 to-indigo-600',
  'Democratic Impact': 'from-amber-500 to-orange-600',
  'Overview': 'from-slate-500 to-slate-700',
};

export default function FactDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [fact, setFact] = useState<Fact | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchFact();
    }
  }, [slug]);

  const generateSlug = (title: string): string => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const fetchFact = async () => {
    setLoading(true);
    // Generate slug from title for matching
    const { data: facts, error } = await supabase
      .from('facts')
      .select('*')
      .order('order_index');

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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
          <p className="text-slate-600">Loading fact...</p>
        </div>
      </div>
    );
  }

  if (notFound || !fact) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts
          </button>
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Fact Not Found</h1>
            <p className="text-slate-600 mb-6">The fact you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/facts')}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              View All Facts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[fact.category || 'Overview'] || AlertCircle;
  const gradientClass = categoryColors[fact.category || 'Overview'] || 'from-slate-500 to-slate-700';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <MetaTags
        title={`${fact.title} - Facts & Figures`}
        description={fact.content.replace(/<[^>]*>/g, '').substring(0, 160)}
        keywords="local government, reorganisation, facts, LGR, evidence"
      />

      <div className={`bg-gradient-to-br ${gradientClass} text-white py-12`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-white/80 hover:text-white font-medium mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Facts
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="text-white" size={32} />
            </div>
            <div className="flex-1">
              {fact.category && (
                <div className="text-sm font-bold tracking-wider text-white/90 mb-2 uppercase">
                  {fact.category}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{fact.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200"
            dangerouslySetInnerHTML={{ __html: fact.content }}
          />
        </article>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <button
            onClick={() => navigate('/facts')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            View All Facts
          </button>
        </div>
      </div>

      <FAQSection page="facts" />
      <LastUpdated />
    </div>
  );
}

