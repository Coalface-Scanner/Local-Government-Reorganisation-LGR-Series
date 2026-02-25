import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { GlossaryTerm } from '../../lib/glossaryData';
import { getRelatedTerms } from '../../lib/glossaryData';
import TableOfContents from '../TableOfContents';

interface GlossaryTermClientProps {
  term: GlossaryTerm;
}

/**
 * Client component for individual glossary term page
 * Renders term definition with academic prose styling and related terms
 */
export default function GlossaryTermClient({ term }: GlossaryTermClientProps) {
  const relatedTerms = getRelatedTerms(term);

  return (
    <>
      {/* Definition Content */}
      <article className="academic-prose mb-12">
        <div 
          dangerouslySetInnerHTML={{ __html: term.definition }}
          className="academic-prose"
        />
      </article>

      {/* Table of Contents if definition has headings */}
      {term.definition.includes('<h2') || term.definition.includes('<h3') ? (
        <div className="mb-12">
          <TableOfContents content={term.definition} />
        </div>
      ) : null}

      {/* Related Terms Section */}
      {relatedTerms.length > 0 && (
        <div className="mt-12 pt-8 border-t border-academic-neutral-300">
          <h2 className="text-2xl font-display font-bold text-academic-charcoal mb-6">
            Related Terms
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedTerms.map(relatedTerm => (
              <Link
                key={relatedTerm.slug}
                to={`/glossary/${relatedTerm.slug}`}
                className="academic-card p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-academic-charcoal mb-2 group-hover:text-teal-700 transition-colors">
                      {relatedTerm.term}
                    </h3>
                    <p className="text-academic-neutral-700 font-serif text-sm line-clamp-2">
                      {relatedTerm.definition
                        .replace(/<[^>]*>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .substring(0, 120)}...
                    </p>
                  </div>
                  <ArrowRight 
                    className="text-teal-700 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform" 
                    size={20} 
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* External Related Link */}
      {term.relatedLink && (
        <div className="mt-8 pt-8 border-t border-academic-neutral-300">
          <Link
            to={term.relatedLink}
            className="academic-button academic-button-primary inline-flex items-center gap-2"
          >
            Learn More
            <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </>
  );
}
