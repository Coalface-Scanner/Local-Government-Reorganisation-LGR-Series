interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

interface HowToStructuredDataProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration, e.g. "P100D" for 100 days
  imageUrl?: string;
}

export default function HowToStructuredData({
  name,
  description,
  steps,
  totalTime,
  imageUrl,
}: HowToStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://localgovernmentreorganisation.co.uk';

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(totalTime && { "totalTime": totalTime }),
    ...(imageUrl && {
      "image": {
        "@type": "ImageObject",
        "url": imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`
      }
    }),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.url && {
        "url": step.url.startsWith('http') ? step.url : `${baseUrl}${step.url}`
      }),
    })),
    "publisher": {
      "@type": "Organization",
      "name": "LGR Initiative",
      "legalName": "Coalface Engagement Ltd",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/lgr_banner.png`
      }
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
