export default function OrganizationStructuredData() {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LGR Initiative",
    "legalName": "Coalface Engagement Ltd",
    "alternateName": [
      "Local Government Reorganisation Initiative",
      "LGR Initiative by COALFACE", "LGR Series",
      "COALFACE"
    ],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/lgr_banner.png`
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Prebend House, 72 London Road",
      "addressLocality": "Leicester",
      "postalCode": "LE2 0QR",
      "addressCountry": "GB"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "knowsAbout": [
      "LGR",
      "Local Government Reorganisation",
      "Local Government Reform",
      "Council Reform",
      "English Devolution",
      "Unitary Authorities",
      "Devolution",
      "Public Policy",
      "Local Authority Reorganisation",
      "Council Restructuring",
      "Local Government Reform UK"
    ],
    "description": "The leading resource on Local Government Reorganisation (LGR), council reform, and English devolution. Expert analysis, evidence-based research, and practical insights on local government reform, unitary authorities, and devolution across the UK.",
    "foundingDate": "2019",
    "sameAs": [
      baseUrl,
      "https://www.linkedin.com/showcase/local-government-reorganisation",
      "https://x.com/LGRInitiative"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

