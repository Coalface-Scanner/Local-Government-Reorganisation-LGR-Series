import { useState, useEffect } from 'react';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import FAQSection from '../../components/FAQSection';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: 'basics' | 'process' | 'finance' | 'gov' | 'impact';
}

const faqData: FAQItem[] = [
  // BASICS & HISTORY
  {
    question: 'What is Local Government Reorganisation (LGR)?',
    answer: 'LGR is a structural reform programme to simplify England\'s system by replacing two-tier local government (county and district) with unitary authorities. It is the fourth major wave of restructuring since 1965, announced in the December 2024 Devolution White Paper.',
    category: 'basics'
  },
  {
    question: 'What are Unitary Authorities?',
    answer: 'A single local government organisation responsible for all services in an area. It combines functions split between county and district tiers (like education, social care, planning, and waste) into one body.',
    category: 'basics'
  },
  {
    question: 'Why Does the Government Want to Reorganise?',
    answer: 'Strategic reasons include: streamlining services, improving financial sustainability by removing administrative duplication, and creating governance structures strong enough for devolution.',
    category: 'basics'
  },
  {
    question: 'What are the "Six Priority Programme" Areas?',
    answer: 'Selected in Feb 2025: Cheshire & Warrington, Cumbria, Greater Essex, Hampshire & the Solent, Norfolk & Suffolk, and Sussex & Brighton. These combine devolution with LGR.',
    category: 'basics'
  },
  {
    question: 'Which Areas are Involved in LGR?',
    answer: '21 two-tier areas including Surrey (accelerated), Kent, Essex, Hertfordshire, Norfolk, Suffolk, Cambridgeshire, Lancashire, Cheshire, Cumbria, Hampshire, and Sussex.',
    category: 'basics'
  },
  {
    question: 'What Happened in Previous Local Government Reorganisations?',
    answer: 'England restructured in 1974 (establishing the current two-tier system), 1995–1998, 2009, and most recently in 2019–2023 creating unitaries like Somerset and North Yorkshire.',
    category: 'basics'
  },
  {
    question: 'How Does LGR Compare to Other Countries?',
    answer: 'Scotland and Wales already use fully unitary systems. England\'s two-tier structure is an anomaly within the UK. Most European nations also prefer single-tier models for local services.',
    category: 'basics'
  },
  // PROCESS & TIMELINE
  {
    question: 'What is the Timeline for Implementation?',
    answer: '<ul class="list-disc pl-5 space-y-1 mb-2"><li><strong>Nov 2025:</strong> Final proposal deadline.</li><li><strong>Spring/Summer 2026:</strong> Government decisions.</li><li><strong>May 2027:</strong> First elections.</li><li><strong>April 2028:</strong> New councils operational.</li></ul><p class="mt-2 italic">Note: Surrey follows an accelerated timeline (operational April 2027).</p>',
    category: 'process'
  },
  {
    question: 'How Will the Proposals Process Work?',
    answer: 'A 5-stage process: 1) Proposal Development, 2) Public Consultation, 3) Decision & Statutory Process, 4) Secondary Legislation (Structural Changes Order), and 5) Elections & Implementation.',
    category: 'process'
  },
  {
    question: 'What Do Different Models Look Like?',
    answer: 'Options include <strong>Single Unitary</strong> (one council per county), <strong>Two-Unitary</strong> splits (e.g., East and West Surrey), or <strong>Three+ Unitary</strong> models which maintain more local identity but increase costs.',
    category: 'process'
  },
  {
    question: 'What Happens if a Council Proposes a Model the Government Rejects?',
    answer: 'If councils cannot agree on a consensus model, the government has the power to impose a structure as a "backstop" to ensure the reorganisation proceeds according to the national timeline.',
    category: 'process'
  },
  {
    question: 'Will There Be Elections Before New Councils are Established?',
    answer: 'Most scheduled elections for 2025/2026 have been postponed. The primary elections for new unitary authorities will occur on 6 May 2027, with the councils becoming operational a year later.',
    category: 'process'
  },
  // FINANCE & SAVINGS
  {
    question: 'What is the Population Threshold for New Unitary Authorities?',
    answer: 'The target is <strong>500,000+ residents</strong>. Analysis suggests larger authorities achieve higher economies of scale. Smaller councils (300k population) can actually cost an area more due to disaggregation.',
    category: 'finance'
  },
  {
    question: 'How Much Could LGR Save?',
    answer: 'PwC and County Councils Network analyses estimate potential savings of <strong>£1.8bn to £2.9bn</strong> over five years if implemented at a large scale (500,000+ population).',
    category: 'finance'
  },
  {
    question: 'What is Disaggregation?',
    answer: 'This is the cost of splitting up integrated county services—especially social care—across multiple new councils. It requires duplicating management, IT systems, and admin structures, making it expensive.',
    category: 'finance'
  },
  {
    question: 'How Much Will LGR Cost?',
    answer: 'Upfront transition costs are significant: IT consolidation, redundancy packages, rebranding, and office rationalisation. These often exceed initial expectations in previous reorganisations.',
    category: 'finance'
  },
  {
    question: 'What is the Financial Impact on Council Tax?',
    answer: 'While the government argues LGR saves money, councils may freeze taxes during transition or face rises if costs exceed savings. Rates usually "harmonize" across the new area over several years.',
    category: 'finance'
  },
  // GOVERNANCE
  {
    question: 'Will There Be Fewer Councillors?',
    answer: 'Yes. Unitary authorities typically have fewer councillors than the combined totals of the previous county and district tiers. A boundary review by the LGBCE decides exact numbers later.',
    category: 'gov'
  },
  {
    question: 'What Happens to Parish Councils?',
    answer: 'Parish and town councils remain. They are an opportunity to maintain community-level governance, and many new unitaries may devolve hyperlocal functions to them.',
    category: 'gov'
  },
  {
    question: 'What Are the Governance and Democratic Implications?',
    answer: 'Accountability is clearer as one council is responsible for everything, but larger authorities may feel more "distant" from local communities compared to smaller districts.',
    category: 'gov'
  },
  {
    question: 'What is the Role of Combined Authorities?',
    answer: 'These legal bodies (often with a Mayor) manage devolved powers like transport. They require constituent councils to be unitary, which is a key driver for the LGR process.',
    category: 'gov'
  },
  // SERVICE IMPACT
  {
    question: 'What are the Advantages of Unitary Authorities?',
    answer: 'Efficiency through economies of scale, better integration of services like housing and care, financial resilience, clearer voter accountability, and greater capacity for devolution.',
    category: 'impact'
  },
  {
    question: 'What are the Disadvantages and Risks?',
    answer: 'Risks include a loss of local responsiveness, service disruption during transition, high upfront costs, and a potential "one-size-fits-all" approach that doesn\'t suit diverse towns.',
    category: 'impact'
  },
  {
    question: 'How Will Services Transfer Between Councils?',
    answer: 'Via a managed transition: staff transfer under TUPE, IT systems are migrated, assets like buildings move to the new authority, and budgets are consolidated under the Structural Changes Order.',
    category: 'impact'
  },
  {
    question: 'What are the Key Challenges for Councils in Transition?',
    answer: 'Digital transformation (merging systems), dual delivery (operating while merging), strategic collaborative leadership, and maintaining "business as usual" for residents.',
    category: 'impact'
  },
  {
    question: 'How Will LGR Affect My Local Services?',
    answer: 'Residents should see better integration (e.g., waste and housing in one place), but there may be changes to office locations, contact numbers, and unified policies for services like planning.',
    category: 'impact'
  }
];

// Helper function to strip HTML tags for schema.org (schema.org doesn't support HTML in text fields)
const stripHtml = (html: string): string => {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  // Clean up whitespace
  return text.replace(/\s+/g, ' ').trim();
};

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
