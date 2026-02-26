import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MetaTags from '../components/MetaTags';
import PageBanner from '../components/PageBanner';
import { faqData, aboutFaqData, getAllFaqItemsForSchema } from '../data/faqData';
import { enhanceContentWithGlossaryLinks } from '../lib/glossaryLinks';
import { enhanceContentWithInternalLinks } from '../lib/internalLinks';
import { sanitizeHtmlContent } from '../lib/htmlSanitizer';

const linkClass = 'text-teal-700 hover:text-teal-800 underline font-medium';

function enhanceFaqContent(text: string): string {
  const withGlossary = enhanceContentWithGlossaryLinks(text, {
    onlyFirstOccurrence: true,
    linkClass: `glossary-link ${linkClass}`,
  });
  const withInternal = enhanceContentWithInternalLinks(withGlossary, { linkClass });
  let out = sanitizeHtmlContent(withInternal);
  if (!/href="\/glossary\//.test(out)) {
    out += ' <a href="/glossary/local-government-reorganisation-lgr" class="glossary-link ' + linkClass + '">Learn more in our glossary</a>.';
  }
  return out;
}

/** Categories for grouping FAQs on the standalone page */
const CATEGORIES = [
  { id: 'basics' as const, label: 'Basics & History' },
  { id: 'process' as const, label: 'Process & Timeline' },
  { id: 'finance' as const, label: 'Finance & Savings' },
  { id: 'gov' as const, label: 'Governance' },
  { id: 'impact' as const, label: 'Service Impact' }
] as const;

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: getAllFaqItemsForSchema().map(({ question, answer }) => ({
    '@type': 'Question' as const,
    name: question,
    acceptedAnswer: { '@type': 'Answer' as const, text: answer }
  }))
};

export default function FAQ() {
  const location = useLocation();

  useEffect(() => {
    document.dispatchEvent(new Event('faq-page-ready'));
  }, []);

  return (
    <div className="min-h-screen bg-academic-cream" data-faq-page>
      <MetaTags
        title="FAQ - Local Government Reorganisation | LGR Initiative"
        description="Comprehensive FAQ covering all aspects of Local Government Reorganisation (LGR) in England, including timelines, processes, finance, governance, and service impacts."
        keywords="LGR FAQ, local government reorganisation questions, unitary authority FAQ, LGR answers, reorganisation FAQ"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <PageBanner
        heroLabel="FACTS & DATA"
        heroTitle="Frequently Asked Questions"
        heroSubtitle="Answers to common questions about Local Government Reorganisation (LGR) in England. Search and filter all questions."
        currentPath={location.pathname}
      />

      {/* FAQ content - all visible for SEO and pre-rendering */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/questions-and-answers"
          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Search & filter all questions
        </Link>
        {CATEGORIES.map((cat) => {
          const items = faqData.filter((f) => f.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} className="mb-12">
              <h2 className="text-2xl font-display font-bold text-academic-charcoal mb-6 pb-2 border-b border-teal-200">
                {cat.label}
              </h2>
              <dl className="space-y-6">
                {items.map((item, idx) => (
                  <div
                    key={`${cat.id}-${idx}`}
                    className="bg-white rounded-lg border border-academic-neutral-200 p-6 shadow-sm"
                  >
                    <dt className="text-lg font-display font-bold text-academic-charcoal mb-2">
                      <span dangerouslySetInnerHTML={{ __html: enhanceFaqContent(item.question) }} />
                    </dt>
                    <dd className="text-academic-neutral-700 prose prose-slate max-w-none">
                      <span dangerouslySetInnerHTML={{ __html: enhanceFaqContent(item.answer) }} />
                      <p className="mt-4 text-sm">
                        <Link to={item.relatedPath} className={`${linkClass} inline-flex items-center gap-1`}>
                          Read more: {item.relatedLabel} →
                        </Link>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}

        {/* About the Initiative - leadership FAQs */}
        <section className="mb-12 mt-16">
          <h2 className="text-2xl font-display font-bold text-academic-charcoal mb-6 pb-2 border-b border-teal-200">
            About the Initiative
          </h2>
          {aboutFaqData.map((section) => (
            <div key={section.label} className="mb-12">
              <h3 className="text-xl font-display font-bold text-academic-charcoal mb-4">
                <Link to={section.profilePath} className="hover:text-teal-700 transition-colors">
                  {section.label}
                </Link>
              </h3>
              <dl className="space-y-6">
                {section.items.map((item, idx) => (
                  <div
                    key={`${section.label}-${idx}`}
                    className="bg-white rounded-lg border border-academic-neutral-200 p-6 shadow-sm"
                  >
                    <dt className="text-lg font-display font-bold text-academic-charcoal mb-2">
                      <span dangerouslySetInnerHTML={{ __html: enhanceFaqContent(item.question) }} />
                    </dt>
                    <dd className="text-academic-neutral-700 prose prose-slate max-w-none">
                      <span dangerouslySetInnerHTML={{ __html: enhanceFaqContent(item.answer) }} />
                      <p className="mt-4 text-sm">
                        <Link to={item.relatedPath} className={`${linkClass} inline-flex items-center gap-1`}>
                          Read more: {item.relatedLabel} →
                        </Link>
                      </p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
