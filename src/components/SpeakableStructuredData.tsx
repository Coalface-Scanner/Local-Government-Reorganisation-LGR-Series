interface SpeakableStructuredDataProps {
  name: string;
  url?: string;
  /** CSS selectors identifying speakable sections (e.g. ['.article-summary', '.key-facts']) */
  speakableSelectors?: string[];
}

export default function SpeakableStructuredData({
  name,
  url,
  speakableSelectors = ['h1', '.article-summary', '.key-takeaway'],
}: SpeakableStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://localgovernmentreorganisation.co.uk';

  const pageUrl = url
    ? (url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`)
    : (typeof window !== 'undefined' ? window.location.href : baseUrl);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": name,
    "url": pageUrl,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": speakableSelectors,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
