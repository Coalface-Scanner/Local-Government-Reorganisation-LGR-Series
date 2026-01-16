interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  // Build breadcrumb list starting with home
  const breadcrumbList = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 2,
      "name": item.label,
      "item": item.path ? `${baseUrl}${item.path.startsWith('/') ? item.path : `/${item.path}`}` : undefined
    })).filter(item => item.item) // Only include items with valid URLs
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbList
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
