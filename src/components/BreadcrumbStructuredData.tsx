interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb Structured Data Component
 * Adds BreadcrumbList schema.org markup for navigation
 */
export default function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.path && {
        "item": `${baseUrl}${item.path}`
      })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
