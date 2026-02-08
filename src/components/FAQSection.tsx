import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

interface FAQSectionProps {
  page: string;
}

export default function FAQSection({ page }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('page', page)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setFaqs(data);
      }
      setLoading(false);
    }

    fetchFAQs();
  }, [page]);

  if (loading) {
    return (
      <section className="bg-academic-cream py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-academic-neutral-500">Loading FAQs...</div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="bg-academic-cream py-16 mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-academic-3xl md:text-academic-4xl font-display font-bold text-academic-charcoal mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-academic-neutral-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                aria-expanded={expandedId === faq.id ? 'true' : 'false'}
                aria-controls={`faq-answer-${faq.id}`}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-academic-warm transition-colors group"
              >
                <h3 className="text-academic-lg md:text-academic-xl font-display font-bold text-academic-charcoal pr-4 group-hover:text-teal-700 transition-colors">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {expandedId === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-teal-600 transition-transform" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-academic-neutral-400 group-hover:text-teal-600 transition-colors" aria-hidden="true" />
                  )}
                </div>
              </button>

              {expandedId === faq.id && (
                <div 
                  id={`faq-answer-${faq.id}`} 
                  className="px-6 pb-5 pt-2 border-t border-academic-neutral-200 animate-in slide-in-from-top-2 duration-200"
                >
                  <div className="text-academic-base text-academic-neutral-700 leading-relaxed font-serif whitespace-pre-wrap prose prose-slate max-w-none">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}