'use client';

import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllTerms, getTermsByLetter, searchTerms } from '../../lib/glossaryData';
import GlossaryClient from '../../components/glossary/GlossaryClient';
import MetaTags from '../../components/MetaTags';
import PageBanner from '../../components/PageBanner';
import DefinedTermSetSchema from '../../components/glossary/DefinedTermSetSchema';
import FAQSection from '../../components/FAQSection';

/**
 * Glossary index page (Next.js App Router structure)
 * Route: /glossary
 */
export default function GlossaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
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
    title: 'Glossary | LGRI',
    description: 'Comprehensive glossary of Local Government Reorganisation terms and definitions. Learn about shadow authorities, vesting day, unitary councils, and more key LGR concepts.',
    keywords: 'LGR glossary, Local Government Reorganisation terms, shadow authority definition, vesting day, unitary authority, LGR timetable, LGR governance terms'
  };

  return (
    <>
      <MetaTags {...metadata} />
      <DefinedTermSetSchema terms={allTerms} />
      <div className="min-h-screen bg-academic-cream">
        <PageBanner
          heroLabel="LGR INITIATIVE"
          heroTitle="Glossary"
          heroSubtitle="Key terms and definitions for understanding Local Government Reorganisation (LGR), LGR governance, and the reorganisation process."
          currentPath={location.pathname}
        />

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
      <FAQSection page="glossary" />
    </>
  );
}
