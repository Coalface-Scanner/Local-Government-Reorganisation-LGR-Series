interface DefinedTermStructuredDataProps {
  term: string;
  definition: string;
  url?: string;
  relatedTerms?: { name: string; url: string }[];
}

export default function DefinedTermStructuredData({
  term,
  definition,
  url,
  relatedTerms,
}: DefinedTermStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": term,
    "description": definition,
    ...(url && {
      "url": url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`
    }),
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "LGR Initiative Glossary",
      "url": `${baseUrl}/glossary`
    },
    ...(relatedTerms && relatedTerms.length > 0 && {
      "relatedTerm": relatedTerms.map(rt => ({
        "@type": "DefinedTerm",
        "name": rt.name,
        "url": rt.url.startsWith('http') ? rt.url : `${baseUrl}${rt.url}`
      }))
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
