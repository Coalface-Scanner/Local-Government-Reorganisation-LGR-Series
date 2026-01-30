import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
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

export default function MetaTags({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = '/lgr_banner.png',
  ogTitle,
  ogDescription,
  noindex = false,
  canonical,
  article
}: MetaTagsProps) {
  const fullTitle = `${title} | LGR Series by COALFACE`;
  const finalOgTitle = ogTitle || fullTitle;
  const finalOgDescription = ogDescription || description;
  
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
      { name: 'description', content: description },
      { property: 'og:title', content: finalOgTitle },
      { property: 'og:description', content: finalOgDescription },
      { property: 'og:type', content: ogType },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:image', content: fullOgImage },
      { property: 'og:site_name', content: 'LGR Series by COALFACE' },
      { property: 'og:locale', content: 'en_GB' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: finalOgTitle },
      { name: 'twitter:description', content: finalOgDescription },
      { name: 'twitter:image', content: fullOgImage },
      { name: 'geo.region', content: 'GB' },
      { name: 'geo.placename', content: 'United Kingdom' },
      { name: 'geo.position', content: '51.5074;-0.1278' },
      { name: 'ICBM', content: '51.5074, -0.1278' },
    ];

    if (keywords) {
      metaTags.push({ name: 'keywords', content: keywords });
    }

    // Add robots meta tag
    if (noindex) {
      metaTags.push({ name: 'robots', content: 'noindex, nofollow' });
    } else {
      metaTags.push({ name: 'robots', content: 'index, follow' });
    }

    if (article) {
      if (article.publishedTime) {
        metaTags.push({ property: 'article:published_time', content: article.publishedTime });
      }
      if (article.modifiedTime) {
        metaTags.push({ property: 'article:modified_time', content: article.modifiedTime });
      }
      if (article.author) {
        metaTags.push({ property: 'article:author', content: article.author });
      }
      if (article.section) {
        metaTags.push({ property: 'article:section', content: article.section });
      }
      if (article.tags) {
        article.tags.forEach(tag => {
          metaTags.push({ property: 'article:tag', content: tag });
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

      element.setAttribute('content', content);
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
  }, [fullTitle, description, keywords, ogType, ogImage, canonicalUrl, article, noindex, finalOgTitle, finalOgDescription]);

  return null;
}