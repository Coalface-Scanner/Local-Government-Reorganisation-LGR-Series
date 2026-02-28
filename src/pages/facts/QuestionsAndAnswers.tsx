import { useState, useEffect } from 'react';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { faqData, stripHtmlForSchema } from '../../data/faqData';

const stripHtml = stripHtmlForSchema;

export default function QuestionsAndAnswers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<number | null>(null);

  // Add FAQPage structured data to head
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": stripHtml(item.answer)
        }
      }))
    };

    let script = document.querySelector('script[data-faq-schema="questions-answers"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-faq-schema', 'questions-answers');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);

    return () => {
      const existingScript = document.querySelector('script[data-faq-schema="questions-answers"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'basics', label: 'Basics & History' },
    { id: 'process', label: 'Process & Timeline' },
    { id: 'finance', label: 'Finance & Savings' },
    { id: 'gov', label: 'Governance' },
    { id: 'impact', label: 'Service Impact' }
  ];

  const getCategoryLabel = (category: string): string => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.label : category;
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(item.answer).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setActiveItem(activeItem === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-academic-cream">
      <MetaTags
        title="Questions & Answers - Facts & Data"
        description="Comprehensive FAQ covering all aspects of Local Government Reorganisation (LGR) in England, including timelines, processes, finance, governance, and service impacts."
        keywords="LGR FAQ, local government reorganisation questions, unitary authority FAQ, LGR answers, reorganisation FAQ"
      />
      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Questions & Answers"
        heroSubtitle="Comprehensive guide to structural reforms in England. Search and filter frequently asked questions about Local Government Reorganisation."
        currentPath={location.pathname}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate('/facts')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Facts & Data
        </button>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 bg-teal-50 border-b border-slate-200">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search all 26 questions..."
                className="w-full py-3 px-5 pr-12 rounded-full text-neutral-900 focus:outline-none focus:ring-4 focus:ring-teal-300 shadow-inner border border-slate-300"
              />
              <div className="absolute right-4 top-3.5 text-slate-400">
                <Search className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs/Filters */}
          <div className="flex flex-wrap gap-2 p-4 border-b border-slate-100 bg-slate-50/50">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchTerm('');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat.id
                    ? 'bg-teal-100 text-teal-700 border-teal-700'
                    : 'border-transparent hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="divide-y divide-slate-100">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((item, index) => {
                const isActive = activeItem === index;
                return (
                  <div key={index} className="transition-colors hover:bg-slate-50">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full flex items-start justify-between p-5 md:p-6 text-left"
                      aria-expanded={isActive}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <div className="flex-1 pr-4">
                        <div className="mb-2">
                          <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-700 border border-teal-200">
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-neutral-900 block">{item.question}</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform text-teal-600 flex-shrink-0 mt-1 ${
                          isActive ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={`faq-answer-${index}`}
                      className={`overflow-hidden transition-all duration-400 ease-in-out ${
                        isActive ? 'max-h-[3000px] pb-6' : 'max-h-0'
                      }`}
                    >
                      <div 
                        className="px-5 md:px-6 text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center text-slate-500">
                <p>No matching questions found. Try keywords like "timeline" or "savings".</p>
              </div>
            )}
          </div>

        </div>
      </div>

      <FAQSection page="facts" />
    </div>
  );
}
