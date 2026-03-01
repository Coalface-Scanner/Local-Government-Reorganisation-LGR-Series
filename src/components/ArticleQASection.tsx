import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { prerenderSafe } from '../utils/prerender';
import { sanitizeHtmlContent } from '../lib/htmlSanitizer';

interface ArticleQA {
  id: string;
  article_slug: string;
  question: string;
  answer: string;
  order_index: number;
}

interface ArticleQASectionProps {
  articleSlug: string;
}

export default function ArticleQASection({ articleSlug }: ArticleQASectionProps) {
  const [qas, setQAs] = useState<ArticleQA[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQAs() {
      const { data, error } = await prerenderSafe(
        supabase.from('article_qa').select('*').eq('article_slug', articleSlug).order('order_index', { ascending: true }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { data: [], error: null } as any
      );

      if (!error && data) {
        setQAs(data);
      }
      setLoading(false);
    }

    if (articleSlug) {
      fetchQAs();
    }
  }, [articleSlug]);

  if (loading || qas.length === 0) {
    return null;
  }

  const qaStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": qas.map(qa => ({
      "@type": "Question",
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": sanitizeHtmlContent(qa.answer)
      }
    }))
  };

  return (
    <section className="bg-slate-50 py-16 mt-16 border-t border-slate-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaStructuredData) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Questions & Answers
        </h2>

        <div className="space-y-4">
          {qas.map((qa) => (
            <div
              key={qa.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setExpandedId(expandedId === qa.id ? null : qa.id)}
                aria-expanded={expandedId === qa.id}
                aria-controls={`qa-answer-${qa.id}`}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900 pr-4">
                  {qa.question}
                </h3>
                {expandedId === qa.id ? (
                  <ChevronUp className="w-5 h-5 text-teal-600 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden="true" />
                )}
              </button>

              {expandedId === qa.id && (
                <div id={`qa-answer-${qa.id}`} className="px-6 pb-4 pt-2 border-t border-slate-100">
                  <div 
                    className="text-slate-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(qa.answer) }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
