interface LocalPlaceStructuredDataProps {
  name: string;
  description?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  containedInPlace?: {
    name: string;
    type?: 'Place' | 'AdministrativeArea';
  };
  areaServed?: string[];
  url?: string;
  type?: 'Place' | 'AdministrativeArea';
}

export default function LocalPlaceStructuredData({
  name,
  description,
  address,
  geo,
  containedInPlace,
  areaServed,
  url,
  type = 'Place'
}: LocalPlaceStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
    "name": name,
    ...(description && { "description": description }),
    ...(url && { "url": url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}` }),
    ...(address && {
      "address": {
        "@type": "PostalAddress",
        ...(address.streetAddress && { "streetAddress": address.streetAddress }),
        ...(address.addressLocality && { "addressLocality": address.addressLocality }),
        ...(address.addressRegion && { "addressRegion": address.addressRegion }),
        ...(address.postalCode && { "postalCode": address.postalCode }),
        ...(address.addressCountry && { "addressCountry": address.addressCountry })
      }
    }),
    ...(geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geo.latitude,
        "longitude": geo.longitude
      }
    }),
    ...(containedInPlace && {
      "containedInPlace": {
        "@type": containedInPlace.type || "Place",
        "name": containedInPlace.name
      }
    }),
    ...(areaServed && areaServed.length > 0 && {
      "areaServed": areaServed.map(area => ({
        "@type": "Place",
        "name": area
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
