interface DatasetStructuredDataProps {
  name: string;
  description: string;
  keywords?: string[];
  datePublished?: string;
  dateModified?: string;
  url: string;
  creator?: {
    name: string;
    url?: string;
  };
  distribution?: {
    format: string;
    contentUrl?: string;
  }[];
}

export default function DatasetStructuredData({
  name,
  description,
  keywords = [],
  datePublished,
  dateModified,
  url,
  creator = {
    name: 'LGR Initiative',
    url: 'https://localgovernmentreorganisation.co.uk'
  },
  distribution = []
}: DatasetStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": name,
    "description": description,
    "url": url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`,
    "creator": {
      "@type": "Organization",
      "name": creator.name,
      ...(creator.url && { "url": creator.url.startsWith('http') ? creator.url : `${baseUrl}${creator.url.startsWith('/') ? creator.url : `/${creator.url}`}` })
    },
    "publisher": {
      "@type": "Organization",
      "name": "LGR Initiative",
      "url": baseUrl
    },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    ...(keywords.length > 0 && { "keywords": keywords.join(", ") }),
    ...(datePublished && { "datePublished": datePublished }),
    ...(dateModified && { "dateModified": dateModified }),
    ...(distribution.length > 0 && {
      "distribution": distribution.map(dist => ({
        "@type": "DataDownload",
        "encodingFormat": dist.format,
        ...(dist.contentUrl && { "contentUrl": dist.contentUrl.startsWith('http') ? dist.contentUrl : `${baseUrl}${dist.contentUrl.startsWith('/') ? dist.contentUrl : `/${dist.contentUrl}`}` })
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
