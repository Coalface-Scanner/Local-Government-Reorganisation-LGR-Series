interface AuthorStructuredDataProps {
  name: string;
  url?: string;
  jobTitle?: string;
  worksFor?: {
    name: string;
    url?: string;
  };
}

export default function AuthorStructuredData({
  name,
  url,
  jobTitle,
  worksFor
}: AuthorStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    ...(url && { "url": url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}` }),
    ...(jobTitle && { "jobTitle": jobTitle }),
    ...(worksFor && {
      "worksFor": {
        "@type": "Organization",
        "name": worksFor.name,
        ...(worksFor.url && { "url": worksFor.url.startsWith('http') ? worksFor.url : `${baseUrl}${worksFor.url.startsWith('/') ? worksFor.url : `/${worksFor.url}`}` })
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
