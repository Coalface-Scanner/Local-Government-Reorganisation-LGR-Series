export default function OrganizationStructuredData() {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LGR Series",
    "legalName": "Coalface Engagement Ltd",
    "alternateName": "Local Government Reorganisation Series",
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
      "Local Government",
      "Local Government Reorganisation",
      "Council Reform",
      "Unitary Authorities",
      "Devolution",
      "Public Policy"
    ],
    "description": "Independent analysis and expert perspectives on local government reorganisation across the United Kingdom. Evidence-based research, interviews with sector leaders, and practical lessons from reorganisation experiences.",
    "foundingDate": "2019",
    "sameAs": [
      baseUrl
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

