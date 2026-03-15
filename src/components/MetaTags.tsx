import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string | string[];
  ogType?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  ogTitle?: string;
  ogDescription?: string;
  noindex?: boolean;
  canonical?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

const SEO_TITLE_MAX = 60;
const SEO_DESCRIPTION_MAX = 160;

function truncate(str: string, maxLen: number): string {
  const s = String(str).trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1).trim() + '…';
}

function toMetaContent(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : ''))
      .filter(Boolean)
      .join(', ');
  }
  return '';
}

export default function MetaTags({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = '/LGRI-Open-Graph.png',
  ogImageWidth = 1200,
  ogImageHeight = 630,
  ogImageAlt = 'Local Government Reorganisation Initiative',
  ogTitle,
  ogDescription,
  noindex = false,
  canonical,
  article
}: MetaTagsProps) {
  const fullTitleRaw = `${title.trim()} | LGR Initiative`;
  const fullTitle = truncate(fullTitleRaw, SEO_TITLE_MAX);
  const finalOgTitle = truncate(ogTitle || fullTitleRaw, SEO_TITLE_MAX);
  const finalOgDescription = truncate(ogDescription || description, SEO_DESCRIPTION_MAX);
  const metaDescription = truncate(description, SEO_DESCRIPTION_MAX);
  
  // Build canonical URL - remove query params, ensure HTTPS, handle trailing slashes
  const getCanonicalUrl = (): string => {
    if (typeof window === 'undefined') {
      return 'https://localgovernmentreorganisation.co.uk';
    }
    
    const url = new URL(window.location.href);
    // Remove query parameters
    url.search = '';
    // Remove hash
    url.hash = '';
    // Ensure HTTPS
    url.protocol = 'https:';
    // Remove trailing slash except for root
    let pathname = url.pathname;
    if (pathname !== '/' && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
      url.pathname = pathname;
    }
    
    return url.toString();
  };
  
  const canonicalUrl = canonical || getCanonicalUrl();

  useEffect(() => {
    document.title = fullTitle;

    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://localgovernmentreorganisation.co.uk';
    
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

    const metaTags: Array<{ name?: string; property?: string; content: string }> = [
      { name: 'description', content: toMetaContent(metaDescription) },
      { property: 'og:title', content: toMetaContent(finalOgTitle) },
      { property: 'og:description', content: toMetaContent(finalOgDescription) },
      { property: 'og:type', content: toMetaContent(ogType) },
      { property: 'og:url', content: toMetaContent(canonicalUrl) },
      { property: 'og:image', content: toMetaContent(fullOgImage) },
      { property: 'og:image:width', content: toMetaContent(ogImageWidth) },
      { property: 'og:image:height', content: toMetaContent(ogImageHeight) },
      { property: 'og:image:alt', content: toMetaContent(ogImageAlt) },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:site_name', content: 'LGR Initiative' },
      { property: 'og:locale', content: 'en_GB' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: toMetaContent(finalOgTitle) },
      { name: 'twitter:description', content: toMetaContent(finalOgDescription) },
      { name: 'twitter:image', content: toMetaContent(fullOgImage) },
      { name: 'geo.region', content: 'GB' },
      { name: 'geo.placename', content: 'England' },
    ];

    const normalizedKeywords = toMetaContent(keywords);
    if (normalizedKeywords) {
      metaTags.push({ name: 'keywords', content: normalizedKeywords });
    }

    // Add robots meta tag
    if (noindex) {
      metaTags.push({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      metaTags.push({ name: 'robots', content: 'index, follow' });
    }

    if (article) {
      if (article.publishedTime) {
        metaTags.push({ property: 'article:published_time', content: toMetaContent(article.publishedTime) });
      }
      if (article.modifiedTime) {
        metaTags.push({ property: 'article:modified_time', content: toMetaContent(article.modifiedTime) });
      }
      if (article.author) {
        metaTags.push({ property: 'article:author', content: toMetaContent(article.author) });
      }
      if (article.section) {
        metaTags.push({ property: 'article:section', content: toMetaContent(article.section) });
      }
      if (article.tags) {
        article.tags.forEach(tag => {
          const safeTag = toMetaContent(tag);
          if (safeTag) {
            metaTags.push({ property: 'article:tag', content: safeTag });
          }
        });
      }
    }

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (name) {
          element.setAttribute('name', name);
        } else if (property) {
          element.setAttribute('property', property);
        }
        document.head.appendChild(element);
      }

      element.setAttribute('content', toMetaContent(content));
    });

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    return () => {
      metaTags.forEach(({ name, property }) => {
        const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
        const element = document.querySelector(selector);
        if (element) {
          element.remove();
        }
      });
    };
  }, [fullTitle, description, metaDescription, keywords, ogType, ogImage, ogImageWidth, ogImageHeight, ogImageAlt, canonicalUrl, article, noindex, finalOgTitle, finalOgDescription]);

  return null;
}
