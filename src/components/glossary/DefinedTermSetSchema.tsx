import { generateDefinedTermSetSchema } from '../../lib/glossarySchema';
import type { GlossaryTerm } from '../../lib/glossaryData';

interface DefinedTermSetSchemaProps {
  terms: GlossaryTerm[];
  baseUrl?: string;
}

/**
 * Renders JSON-LD schema for a DefinedTermSet (glossary index)
 * Used on the glossary index page for SEO
 */
export default function DefinedTermSetSchema({ terms, baseUrl }: DefinedTermSetSchemaProps) {
  const baseUrlToUse = baseUrl || 
    (typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://localgovernmentreorganisation.co.uk');

  const schema = generateDefinedTermSetSchema(terms, baseUrlToUse);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
