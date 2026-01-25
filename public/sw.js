// Service Worker for LGR Series
// Provides offline support and caching

<<<<<<< Current (Your changes)
const CACHE_NAME = 'lgr-series-v1';
const STATIC_CACHE_NAME = 'lgr-static-v1';
const DYNAMIC_CACHE_NAME = 'lgr-dynamic-v1';
=======
const CACHE_NAME = 'lgr-series-v2';
const STATIC_CACHE_NAME = 'lgr-static-v2';
const DYNAMIC_CACHE_NAME = 'lgr-dynamic-v2';
>>>>>>> Incoming (Background Agent changes)

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lgr.png',
  '/lgr_banner.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE_NAME && name !== DYNAMIC_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip admin pages
  if (url.pathname.startsWith('/admin')) {
    return;
  }

  // Skip API calls (Supabase)
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If it's a navigation request and we have index.html cached, return that
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }

          // Return a basic offline page
          return new Response('Offline - Please check your connection', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});
