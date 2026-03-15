interface PersonStructuredDataProps {
  name: string;
  jobTitle: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  worksFor: {
    name: string;
    url?: string;
  };
  alumniOf?: string[];
  knowsAbout?: string[];
  sameAs?: string[];
}

export default function PersonStructuredData({
  name,
  jobTitle,
  description,
  url,
  imageUrl,
  worksFor,
  alumniOf,
  knowsAbout,
  sameAs,
}: PersonStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    ...(description && { "description": description }),
    ...(url && {
      "url": url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`
    }),
    ...(imageUrl && {
      "image": {
        "@type": "ImageObject",
        "url": imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`
      }
    }),
    "worksFor": {
      "@type": "Organization",
      "name": worksFor.name,
      ...(worksFor.url && {
        "url": worksFor.url.startsWith('http') ? worksFor.url : `${baseUrl}${worksFor.url}`
      })
    },
    ...(alumniOf && alumniOf.length > 0 && {
      "alumniOf": alumniOf.map(org => ({
        "@type": "Organization",
        "name": org
      }))
    }),
    ...(knowsAbout && knowsAbout.length > 0 && {
      "knowsAbout": knowsAbout
    }),
    ...(sameAs && sameAs.length > 0 && {
      "sameAs": sameAs
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
