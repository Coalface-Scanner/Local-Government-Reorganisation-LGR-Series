'use client';

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTerms, getTermsByLetter, searchTerms } from '../../lib/glossaryData';
import GlossaryClient from '../../components/glossary/GlossaryClient';
import MetaTags from '../../components/MetaTags';
import Breadcrumbs from '../../components/Breadcrumbs';
import DefinedTermSetSchema from '../../components/glossary/DefinedTermSetSchema';

/**
 * Glossary index page (Next.js App Router structure)
 * Route: /glossary
 */
export default function GlossaryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  
  const allTerms = getAllTerms();
  const filteredTerms = useMemo(() => {
    if (searchQuery) {
      return searchTerms(searchQuery);
    }
    if (selectedLetter) {
      return getTermsByLetter(selectedLetter);
    }
    return allTerms;
  }, [searchQuery, selectedLetter, allTerms]);

  // Generate metadata (Next.js Metadata API pattern)
  const metadata = {
    title: 'Glossary | LGR Series',
    description: 'Comprehensive glossary of Local Government Reorganisation terms and definitions. Learn about shadow authorities, vesting day, unitary councils, and more key LGR concepts.',
    keywords: 'LGR glossary, Local Government Reorganisation terms, shadow authority definition, vesting day, unitary authority, LGR timetable, LGR governance terms'
  };

  return (
    <>
      <MetaTags {...metadata} />
      <DefinedTermSetSchema terms={allTerms} />
      <div className="min-h-screen bg-academic-cream">
        {/* Header section */}
        <div className="bg-academic-warm py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: 'Glossary' }]} />
            <div className="academic-section-header mb-6">
              <div className="academic-section-label">LGR SERIES</div>
              <h1 className="text-academic-5xl md:text-academic-6xl font-display font-black text-academic-charcoal leading-[1.1] mb-3">
                Glossary
              </h1>
              <p className="text-academic-xl text-academic-neutral-700 leading-relaxed max-w-3xl font-serif">
                Key terms and definitions for understanding Local Government Reorganisation (LGR), LGR governance, and the reorganisation process.
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <GlossaryClient
            terms={filteredTerms}
            searchQuery={searchQuery}
            selectedLetter={selectedLetter}
            onSearchChange={setSearchQuery}
            onLetterSelect={setSelectedLetter}
            onTermClick={(slug) => navigate(`/glossary/${slug}`)}
          />
        </div>
      </div>
    </>
  );
}
