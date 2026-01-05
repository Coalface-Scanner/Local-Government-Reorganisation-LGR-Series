interface ArticleStructuredDataProps {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  imageUrl?: string;
  slug: string;
}

export default function ArticleStructuredData({
  title,
  description,
  author,
  publishedDate,
  imageUrl,
  slug
}: ArticleStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "publisher": {
      "@type": "Organization",
      "name": "LGR Series",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lgrreform.com/lgr_banner.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://lgrreform.com/article/${slug}`
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