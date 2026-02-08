import { generateDefinedTermSchema } from '../../lib/glossarySchema';
import type { GlossaryTerm } from '../../lib/glossaryData';

interface DefinedTermSchemaProps {
  term: GlossaryTerm;
  baseUrl?: string;
}

/**
 * Renders JSON-LD schema for a single DefinedTerm
 * Used on individual glossary term pages for SEO
 */
export default function DefinedTermSchema({ term, baseUrl }: DefinedTermSchemaProps) {
  const baseUrlToUse = baseUrl || 
    (typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://localgovernmentreorganisation.co.uk');

  const schema = generateDefinedTermSchema(term, baseUrlToUse);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
