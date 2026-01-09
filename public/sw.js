// Service Worker for LGR Series
const CACHE_NAME = 'lgr-series-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/lgr.png',
  '/lgr_banner.png'
];
// Note: JS/CSS files are cached dynamically via fetch handler
// since Vite generates hashed filenames

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-HTTP(S) requests (chrome-extension, data:, blob:, etc.)
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) {
    return; // Let the browser handle it normally
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Only cache same-origin requests
          const responseUrl = new URL(response.url);
          const requestUrl = new URL(event.request.url);
          if (responseUrl.origin !== requestUrl.origin) {
            return response; // Don't cache cross-origin requests
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache with error handling
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch((err) => {
              // Silently fail if caching fails (e.g., chrome-extension URLs)
              console.warn('Failed to cache request:', event.request.url, err);
            });
          });

          return response;
        });
      })
      .catch(() => {
        // Return offline page if available
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});
