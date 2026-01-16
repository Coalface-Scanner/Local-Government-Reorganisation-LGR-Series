interface ArticleStructuredDataProps {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  imageUrl?: string;
  slug: string;
}

export default function ArticleStructuredData({
  title,
  description,
  author,
  publishedDate,
  updatedDate,
  imageUrl,
  slug
}: ArticleStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';
  
  const structuredData = {
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
    "articleSection": "Local Government Reform",
    "keywords": [
      "local government",
      "reorganisation",
      "LGR",
      "council reform",
      "devolution",
      "unitary authorities"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}