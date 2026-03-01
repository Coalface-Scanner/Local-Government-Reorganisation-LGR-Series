// src/components/SEOHead.tsx
// ============================================================
// Drop-in SEO component. Usage:
//   <SEOHead page="home" />
//   <SEOHead page="playbook" />
//
// For dynamic pages (e.g. blog posts loaded from Supabase),
// pass overrides:
//   <SEOHead page="lgrSeries" overrides={{ title: post.title, description: post.excerpt }} />
// ============================================================

import { Helmet } from "react-helmet-async";
import {
  pages,
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_LOCALE,
  TWITTER_HANDLE,
  type PageSEO,
} from "../seo.config";

interface SEOHeadProps {
  page: string;
  overrides?: Partial<PageSEO>;
}

export function SEOHead({ page, overrides }: SEOHeadProps) {
  const base = pages[page];
  if (!base) {
    console.warn(`[SEOHead] No SEO config found for page "${page}"`);
    return null;
  }

  const seo: PageSEO = { ...base, ...overrides };
  const canonicalUrl = `${SITE_URL}${seo.path}`;
  const ogImage = seo.ogImage ?? DEFAULT_OG_IMAGE;

  // Build JSON-LD structured data
  const jsonLd = buildJsonLd(seo, canonicalUrl, ogImage);

  return (
    <Helmet>
      {/* Core */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={seo.schemaType === "Article" ? "article" : "website"} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={DEFAULT_LOCALE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={ogImage} />
      {TWITTER_HANDLE && <meta name="twitter:site" content={TWITTER_HANDLE} />}

      {/* Article dates (if applicable) */}
      {seo.datePublished && (
        <meta property="article:published_time" content={seo.datePublished} />
      )}
      {seo.dateModified && (
        <meta property="article:modified_time" content={seo.dateModified} />
      )}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}

// ============================================================
// JSON-LD builders
// ============================================================

function buildJsonLd(seo: PageSEO, url: string, image: string) {
  const org = {
    "@type": "Organization",
    name: "LGR Initiative",
    description:
      "A partnership between Coalface Engagement and the University of Surrey's Centre for Britain and Europe producing research on Local Government Reorganisation.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      // Add your social profile URLs here:
      // "https://www.linkedin.com/company/coalface-engagement",
      // "https://twitter.com/...",
    ],
    member: [
      {
        "@type": "Organization",
        name: "Coalface Engagement",
        url: "https://coalfaceengagement.co.uk",
      },
      {
        "@type": "Organization",
        name: "Centre for Britain and Europe, University of Surrey",
        url: "https://www.surrey.ac.uk",
      },
    ],
  };

  if (seo.schemaType === "Organization") {
    return {
      "@context": "https://schema.org",
      ...org,
    };
  }

  if (seo.schemaType === "Article") {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: seo.title,
      description: seo.description,
      url,
      image,
      datePublished: seo.datePublished ?? undefined,
      dateModified: seo.dateModified ?? seo.datePublished ?? undefined,
      publisher: org,
      author: {
        "@type": "Organization",
        name: "LGR Initiative",
      },
    };
  }

  // Default: WebPage
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url,
    publisher: org,
  };
}
