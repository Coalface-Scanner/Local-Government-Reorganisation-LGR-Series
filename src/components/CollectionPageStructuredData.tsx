interface CollectionItem {
  name: string;
  url: string;
  description?: string;
}

interface CollectionPageStructuredDataProps {
  name: string;
  description?: string;
  url: string;
  numberOfItems: number;
  items: CollectionItem[];
  mainEntityOfPage?: string;
}

export default function CollectionPageStructuredData({
  name,
  description,
  url,
  numberOfItems,
  items,
  mainEntityOfPage
}: CollectionPageStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "url": fullUrl,
    ...(description && { "description": description }),
    "numberOfItems": numberOfItems,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": numberOfItems,
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": item.name,
          "url": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
          ...(item.description && { "description": item.description })
        }
      }))
    },
    ...(mainEntityOfPage && { "mainEntityOfPage": mainEntityOfPage })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
