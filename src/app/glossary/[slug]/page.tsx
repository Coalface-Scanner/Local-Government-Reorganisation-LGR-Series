'use client';

import { useParams, useNavigate } from 'react-router-dom';
import { getGlossaryTerm, generateMetadata } from '../../../lib/glossaryData';
import GlossaryTermClient from '../../../components/glossary/GlossaryTermClient';
import MetaTags from '../../../components/MetaTags';
import Breadcrumbs from '../../../components/Breadcrumbs';
import DefinedTermSchema from '../../../components/glossary/DefinedTermSchema';
import { ArrowLeft } from 'lucide-react';

/**
 * Dynamic glossary term page (Next.js App Router structure)
 * Route: /glossary/:slug
 */
export default function GlossaryTermPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const term = slug ? getGlossaryTerm(slug) : undefined;

  if (!term) {
    return (
      <div className="min-h-screen bg-academic-cream flex items-center justify-center">
        <div className="academic-card p-12 text-center max-w-2xl mx-4">
          <h1 className="text-academic-3xl font-display font-bold text-academic-charcoal mb-4">
            Term Not Found
          </h1>
          <p className="text-academic-neutral-600 mb-6 font-serif">
            The glossary term you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/glossary')}
            className="academic-button academic-button-primary"
          >
            Back to Glossary
          </button>
        </div>
      </div>
    );
  }

  // Generate metadata (Next.js Metadata API pattern)
  const metadata = generateMetadata(term);

  return (
    <>
      <MetaTags 
        title={`What is ${term.term}?`}
        description={metadata.description}
        keywords={`${term.term}, LGR, Local Government Reorganisation, ${term.category || ''}`}
      />
      <DefinedTermSchema term={term} />
      <div className="min-h-screen bg-academic-cream">
        {/* Header */}
        <div className="bg-academic-warm py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs 
              items={[
                { label: 'Glossary', path: '/glossary' },
                { label: term.term }
              ]} 
            />
            <button
              onClick={() => navigate('/glossary')}
              className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-display font-medium mb-6 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Glossary
            </button>
            <div className="academic-section-header mb-6">
              <div className="academic-section-label">GLOSSARY</div>
              <h1 className="text-academic-5xl md:text-academic-6xl font-serif font-bold text-academic-charcoal leading-[1.1]">
                {term.term}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <GlossaryTermClient term={term} />
        </div>
      </div>
    </>
  );
}
