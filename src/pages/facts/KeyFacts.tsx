import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import DatasetStructuredData from '../../components/DatasetStructuredData';
import RelatedContent from '../../components/RelatedContent';
import { ArrowLeft, Users, DollarSign, FileText, CheckCircle, AlertCircle, ArrowRight, type LucideIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Fact {
  id: string;
  title: string;
  content: string;
  category: string | null;
  order_index: number;
}

export default function KeyFacts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryIcons: Record<string, LucideIcon> = {
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

  const generateSlug = (title: string): string => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  useEffect(() => {
    const fetchFacts = async () => {
      const { data, error } = await supabase
        .from('facts')
        .select('*')
        .order('order_index');

      if (!error && data) {
        setFacts(data);
      }
      setLoading(false);
    };

    fetchFacts();
  }, []);

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Key Facts - Facts & Data"
        description="Evidence-based analysis of local government reorganisation outcomes, including workforce, financial performance, service delivery, and democratic outcomes."
        keywords="LGR facts, reorganisation evidence, unitary authority outcomes, local government reorganisation analysis"
      />
      <DatasetStructuredData
        name="Local Government Reorganisation Key Facts"
        description="Evidence-based analysis of local government reorganisation outcomes, including workforce impact, financial performance, service delivery, and democratic representation. Curated dataset of key facts from recent reorganisations across England."
        keywords={['local government reorganisation', 'LGR', 'unitary authority', 'council reform', 'reorganisation outcomes', 'workforce impact', 'financial performance', 'service delivery', 'democratic impact']}
        datePublished={facts.length > 0 ? facts[0]?.order_index ? new Date().toISOString() : undefined : undefined}
        url="/facts/key-facts"
        creator={{
          name: 'LGRI',
          url: baseUrl
        }}
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Key Facts"
        heroSubtitle="Evidence from recent reorganisations across England. What recent experience shows and what this means for future reorganisations."
        currentPath={location.pathname}
      />
      <div className="layout-container layout-content-sub">
        <button
          onClick={() => navigate('/facts')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Facts & Data
        </button>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-6 text-slate-600">Loading facts...</div>
        ) : facts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {facts.map((fact) => {
              const Icon = categoryIcons[fact.category || 'Overview'] || AlertCircle;
              const gradientClass = categoryColors[fact.category || 'Overview'] || 'from-slate-500 to-slate-700';
              const slug = generateSlug(fact.title);
              const excerpt = fact.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

              return (
                <button
                  key={fact.id}
                  onClick={() => navigate(`/facts/${slug}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-slate-200 hover:border-teal-400 hover:shadow-2xl transition-all duration-300 text-left"
                >
                  <div className={`bg-gradient-to-br ${gradientClass} p-6 text-white`}>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="text-white" size={28} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {fact.category && (
                          <div className="text-xs font-bold tracking-wider text-white/90 mb-2 uppercase">
                            {fact.category}
                          </div>
                        )}
                        <h3 className="text-xl font-bold leading-tight group-hover:underline">
                          {fact.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
                      {excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:gap-3 transition-all">
                      <span>Read more</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
            <p className="text-slate-600">No facts available yet.</p>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <RelatedContent
          currentSlug="key-facts"
          contentType="fact"
          maxItems={6}
        />
      </div>

      <FAQSection page="facts" />
    </div>
  );
}

