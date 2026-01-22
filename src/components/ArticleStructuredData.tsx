interface ArticleStructuredDataProps {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  imageUrl?: string;
  slug: string;
  geography?: string | null;
  region?: string | null;
  theme?: string | null;
}

export default function ArticleStructuredData({
  title,
  description,
  author,
  publishedDate,
  updatedDate,
  imageUrl,
  slug,
  geography,
  region,
  theme
}: ArticleStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';
  
  // Build geographic coverage data
  const spatialCoverage = geography && geography !== 'National' 
    ? {
        "@type": "Place",
        "name": geography,
        ...(region && region !== geography ? {
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": region
          }
        } : {})
      }
    : undefined;
  
  const about = geography && geography !== 'National'
    ? [
        {
          "@type": "Place",
          "name": geography,
          ...(region && region !== geography ? {
            "containedInPlace": {
              "@type": "AdministrativeArea",
              "name": region
            }
          } : {})
        }
      ]
    : undefined;
  
  // Build keywords array with geography and theme
  const keywords = [
    "local government",
    "reorganisation",
    "LGR",
    "council reform",
    "devolution",
    "unitary authorities",
    ...(geography && geography !== 'National' ? [geography] : []),
    ...(region && region !== geography ? [region] : []),
    ...(theme ? [theme] : [])
  ];
  
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": author === "LGR Series Editorial Team" || author === "Coalface Engagement" || author === "Local Government Reorganisation" ? "Organization" : "Person",
      "name": author
    },
    "datePublished": publishedDate,
    "dateModified": updatedDate || publishedDate,
    "publisher": {
      "@type": "Organization",
      "name": "LGR Series",
      "legalName": "Coalface Engagement Ltd",
      "foundingDate": "2019",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Prebend House, 72 London Road",
        "addressLocality": "Leicester",
        "postalCode": "LE2 0QR",
        "addressCountry": "GB"
      },
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/lgr_banner.png`
      },
      "sameAs": [
        "https://localgovernmentreorganisation.co.uk"
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/article/${slug}`
    },
    ...(imageUrl && {
      "image": {
        "@type": "ImageObject",
        "url": imageUrl
      }
    }),
    "articleSection": theme || "Local Government Reform",
    "keywords": keywords.join(", ")
  };
  
  // Add geographic coverage if available
  if (spatialCoverage) {
    structuredData.spatialCoverage = spatialCoverage;
  }
  
  // Add about property if available
  if (about) {
    structuredData.about = about;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}