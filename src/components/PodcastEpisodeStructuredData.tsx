interface PodcastEpisodeStructuredDataProps {
  name: string;
  description: string;
  audioUrl?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  datePublished?: string;
  duration?: string;
  transcript?: string | null;
}

/**
 * PodcastEpisode Structured Data Component
 * Adds PodcastEpisode schema.org markup for interview pages with audio/video
 */
export default function PodcastEpisodeStructuredData({
  name,
  description,
  audioUrl,
  videoUrl,
  imageUrl,
  datePublished,
  duration,
  transcript
}: PodcastEpisodeStructuredDataProps) {
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://localgovernmentreorganisation.co.uk';

  // Only render if there's audio or video content
  if (!audioUrl && !videoUrl) {
    return null;
  }

  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    "name": name,
    "description": description,
    "partOfSeries": {
      "@type": "PodcastSeries",
      "name": "LGR Series Interviews",
      "description": "In-depth interviews with council leaders, officers, and practitioners on Local Government Reorganisation (LGR) and LGR governance.",
      "publisher": {
        "@type": "Organization",
        "name": "LGR Series",
        "alternateName": ["LGR Series by COALFACE", "COALFACE"],
        "legalName": "Coalface Engagement Ltd"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "LGR Series",
      "alternateName": ["LGR Series by COALFACE", "COALFACE"],
      "legalName": "Coalface Engagement Ltd"
    }
  };

  // Only add datePublished and duration if they have values
  if (datePublished) {
    structuredData.datePublished = datePublished;
  }

  if (duration) {
    structuredData.duration = duration;
  }

  if (audioUrl) {
    structuredData.associatedMedia = {
      "@type": "MediaObject",
      "contentUrl": audioUrl.startsWith('http') ? audioUrl : `${baseUrl}${audioUrl}`,
      "encodingFormat": "audio/mpeg"
    };
  }

  if (videoUrl) {
    structuredData.associatedMedia = {
      "@type": "VideoObject",
      "contentUrl": videoUrl.startsWith('http') ? videoUrl : `${baseUrl}${videoUrl}`,
      "embedUrl": videoUrl.startsWith('http') ? videoUrl : `${baseUrl}${videoUrl}`
    };
  }

  if (imageUrl) {
    structuredData.image = {
      "@type": "ImageObject",
      "url": imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`
    };
  }

  if (transcript) {
    structuredData.transcript = transcript;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
