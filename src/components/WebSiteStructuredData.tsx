/**
 * WebSite Structured Data Component
 * Adds WebSite schema.org markup for better search visibility
 * Includes potentialAction for search functionality
 */

export default function WebSiteStructuredData() {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Local Government Reorganisation | LGR Series by COALFACE",
    "alternateName": [
      "Local Government Reorganisation Series",
      "LGR Series",
      "LGR Series by COALFACE"
    ],
    "url": baseUrl,
    "description": "The leading resource on Local Government Reorganisation (LGR), council reform, and English devolution. Expert analysis, evidence-based research, and practical insights on local government reform across the UK.",
    "inLanguage": "en-GB",
    "publisher": {
      "@type": "Organization",
      "name": "LGR Series",
      "alternateName": ["LGR Series by COALFACE", "COALFACE"],
      "legalName": "Coalface Engagement Ltd",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/lgr_banner.png`
      }
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": "LGR Series",
      "legalName": "Coalface Engagement Ltd"
    },
    "copyrightYear": new Date().getFullYear().toString(),
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/library?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Local Government Reorganisation (LGR)",
          "url": `${baseUrl}/insights`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Council Reform",
          "url": `${baseUrl}/lessons`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "English Devolution",
          "url": `${baseUrl}/surrey`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Local Government Reform UK",
          "url": `${baseUrl}/facts`
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
