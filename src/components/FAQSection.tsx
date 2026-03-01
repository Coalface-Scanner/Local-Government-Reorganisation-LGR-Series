import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';
import { faqFallback } from '../data/faqFallback';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

/** Display item: from DB (id) or fallback (synthetic id for key) */
interface DisplayFAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  page: string;
  /** Minimum number of Q&As to show (default 3). Pad from fallback if needed. */
  minItems?: number;
  /** Maximum number of Q&As to show (default 4). */
  maxItems?: number;
  /** Use hub styling: light neutral background, more accordion spacing, lighter border */
  variant?: 'default' | 'hub';
}

const DEFAULT_MIN_ITEMS = 3;
const DEFAULT_MAX_ITEMS = 4;

export default function FAQSection({ page, minItems = DEFAULT_MIN_ITEMS, maxItems = DEFAULT_MAX_ITEMS, variant = 'default' }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      const { data, error } = await prerenderSafe(
        supabase.from('faqs').select('*').eq('page', page).order('order_index', { ascending: true }),
        { data: [], error: null }
      );

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

  const displayList = useMemo((): DisplayFAQ[] => {
    const fromDb: DisplayFAQ[] = faqs.map(f => ({ id: f.id, question: f.question, answer: f.answer }));
    const questionSet = new Set(fromDb.map(f => f.question.trim().toLowerCase()));

    if (fromDb.length >= maxItems) {
      return fromDb.slice(0, maxItems);
    }

    const combined = [...fromDb];
    for (const item of faqFallback) {
      if (combined.length >= maxItems) break;
      const key = item.question.trim().toLowerCase();
      if (!questionSet.has(key)) {
        questionSet.add(key);
        combined.push({ id: `fallback-${combined.length}`, question: item.question, answer: item.answer });
      }
    }

    if (combined.length < minItems) {
      return combined.length > 0 ? combined : faqFallback.slice(0, maxItems).map((item, i) => ({
        id: `fallback-${i}`,
        question: item.question,
        answer: item.answer,
      }));
    }

    return combined.slice(0, maxItems);
  }, [faqs, minItems, maxItems]);

  if (loading) {
    return (
      <section className="bg-academic-cream py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-academic-neutral-500">Loading FAQs...</div>
        </div>
      </section>
    );
  }

  if (displayList.length === 0) {
    return null;
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": displayList.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const sectionClassName = variant === 'hub'
    ? 'faq-section-hub py-16'
    : 'bg-academic-cream py-16 mt-16';

  return (
    <section className={sectionClassName} aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="faq-heading" className="text-academic-3xl md:text-academic-4xl font-display font-bold text-academic-charcoal mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {displayList.map((faq) => (
            <div
              key={faq.id}
              className={`bg-white rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${variant === 'hub' ? 'faq-accordion-item border-[var(--hub-border-faq)]' : 'border-academic-neutral-300'}`}
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                aria-expanded={expandedId === faq.id}
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
