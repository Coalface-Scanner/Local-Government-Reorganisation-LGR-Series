import { BookOpen } from 'lucide-react';
import type { GlossaryTerm } from '../../lib/glossaryData';
import { getAllTerms } from '../../lib/glossaryData';
import SearchBar from '../admin/SearchBar';

interface GlossaryClientProps {
  terms: GlossaryTerm[];
  searchQuery: string;
  selectedLetter: string | null;
  onSearchChange: (query: string) => void;
  onLetterSelect: (letter: string | null) => void;
  onTermClick: (slug: string) => void;
}

/**
 * Client component for glossary index page
 * Handles search, A-Z filtering, and term card rendering
 */
export default function GlossaryClient({
  terms,
  searchQuery,
  selectedLetter,
  onSearchChange,
  onLetterSelect,
  onTermClick
}: GlossaryClientProps) {
  // Generate A-Z letters
  const letters = Array.from({ length: 26 }, (_, i) => 
    String.fromCharCode(65 + i)
  );

  // Get first sentence of definition for preview
  const getDefinitionPreview = (definition: string): string => {
    const plainText = definition.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const firstSentence = plainText.split(/[.!?]/)[0];
    return firstSentence.length > 150 
      ? firstSentence.substring(0, 147) + '...'
      : firstSentence || plainText.substring(0, 150);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search glossary terms..."
          className="w-full"
        />
      </div>

      {/* A-Z Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => onLetterSelect(null)}
            className={`academic-button academic-button-outline ${
              selectedLetter === null 
                ? 'bg-teal-600 text-white border-teal-600' 
                : ''
            }`}
          >
            All
          </button>
          {letters.map(letter => {
            const hasTerms = terms.some(term => 
              term.term.charAt(0).toUpperCase() === letter
            );
            return (
              <button
                key={letter}
                onClick={() => onLetterSelect(letter)}
                disabled={!hasTerms}
                className={`academic-button academic-button-outline ${
                  selectedLetter === letter 
                    ? 'bg-teal-600 text-white border-teal-600' 
                    : ''
                } ${
                  !hasTerms 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-teal-50'
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms Grid */}
      {terms.length > 0 ? (
        <div className="space-y-6">
          {terms.map(term => (
            <div
              key={term.slug}
              className="academic-card p-6 md:p-8 cursor-pointer transition-all"
              onClick={() => onTermClick(term.slug)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onTermClick(term.slug);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View definition for ${term.term}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <BookOpen className="text-teal-700" size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-display font-bold text-academic-charcoal mb-3">
                    {term.term}
                  </h2>
                  <p className="text-lg text-academic-neutral-700 leading-relaxed font-serif mb-4">
                    {getDefinitionPreview(term.definition)}
                  </p>
                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-academic-neutral-200">
                      <p className="text-sm font-medium text-academic-neutral-600 mb-2">
                        Related terms:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {term.relatedTerms.slice(0, 3).map((relatedSlug, idx) => {
                          // Find the related term to get its display name (search in all terms, not just filtered)
                          const allTerms = getAllTerms();
                          const relatedTerm = allTerms.find(t => t.slug === relatedSlug);
                          if (!relatedTerm) return null;
                          return (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-teal-50 text-teal-700 rounded-md text-sm font-medium"
                            >
                              {relatedTerm.term}
                            </span>
                          );
                        })}
                        {term.relatedTerms.length > 3 && (
                          <span className="px-3 py-1 bg-academic-neutral-100 text-academic-neutral-600 rounded-md text-sm font-medium">
                            +{term.relatedTerms.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="academic-card p-12 text-center">
          <p className="text-lg text-academic-neutral-600 font-serif">
            {searchQuery 
              ? `No terms found matching "${searchQuery}". Try a different search term.`
              : 'No terms found for this filter.'}
          </p>
        </div>
      )}
    </>
  );
}
