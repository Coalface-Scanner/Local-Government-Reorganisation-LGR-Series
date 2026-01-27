// Analytics utility for tracking user actions
// Supports Google Analytics and custom event tracking

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

interface WindowWithGtag extends Window {
  gtag?: (command: string, targetId: string, config?: Record<string, unknown>) => void;
}

// Check if Google Analytics is available
const isGAAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as WindowWithGtag).gtag === 'function';
};

// Track page view
export const trackPageView = (path: string, title?: string): void => {
  if (isGAAvailable()) {
    (window as WindowWithGtag).gtag?.('config', 'G-1CQR5MEY37', {
      page_path: path,
      page_title: title,
    });
  }

  // Custom analytics (can be extended)
  if (import.meta.env.DEV) {
    console.log('Page view:', { path, title });
  }
};

// Track custom event
export const trackEvent = (event: AnalyticsEvent): void => {
  if (isGAAvailable()) {
    (window as WindowWithGtag).gtag?.('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }

  // Custom analytics
  if (import.meta.env.DEV) {
    console.log('Event:', event);
  }
};

// Track article view
export const trackArticleView = (articleSlug: string, articleTitle: string): void => {
  trackEvent({
    action: 'view_article',
    category: 'Content',
    label: articleSlug,
  });
  trackPageView(`/insights/${articleSlug}`, articleTitle);
};

// Track search
export const trackSearch = (query: string, resultCount: number): void => {
  trackEvent({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultCount,
  });
};

// Track subscription
export const trackSubscription = (_email: string, topics?: string[]): void => {
  trackEvent({
    action: 'subscribe',
    category: 'Newsletter',
    label: topics ? topics.join(', ') : 'none',
  });
};

// Track download
export const trackDownload = (fileName: string): void => {
  trackEvent({
    action: 'download',
    category: 'Downloads',
    label: fileName,
  });
};

// Track share
export const trackShare = (platform: string, _url: string): void => {
  trackEvent({
    action: 'share',
    category: 'Social',
    label: platform,
  });
};

// Track contact form submission
export const trackContactForm = (): void => {
  trackEvent({
    action: 'contact_form_submit',
    category: 'Contact',
  });
};

// Track print
export const trackPrint = (page: string): void => {
  trackEvent({
    action: 'print',
    category: 'Print',
    label: page,
  });
};
