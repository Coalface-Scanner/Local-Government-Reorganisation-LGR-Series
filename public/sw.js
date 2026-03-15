// Service Worker for LGR Initiative
// Provides offline support with bounded caching and LRU eviction

const CACHE_VERSION = 'v3';
const STATIC_CACHE_NAME = `lgr-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `lgr-dynamic-${CACHE_VERSION}`;

// Maximum entries in the dynamic cache (LRU eviction beyond this)
const MAX_DYNAMIC_CACHE_ENTRIES = 50;

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

// LRU eviction: trim cache to MAX_DYNAMIC_CACHE_ENTRIES
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    // Delete oldest entries (FIFO approximation of LRU)
    const deleteCount = keys.length - maxEntries;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

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

  // Skip analytics and third-party scripts
  if (url.hostname.includes('googletagmanager.com') || url.hostname.includes('google-analytics.com')) {
    return;
  }

  // Skip large media files from dynamic caching (over-aggressive caching)
  const isLargeMedia = /\.(mp4|webm|ogg|mp3|wav|pdf|zip|tar|gz|docx)$/i.test(url.pathname);

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();

        // Cache successful responses (except large media)
        if (response.status === 200 && !isLargeMedia) {
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
            // Trim cache after adding new entry
            trimCache(DYNAMIC_CACHE_NAME, MAX_DYNAMIC_CACHE_ENTRIES);
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

          // Return a basic offline response
          return new Response('Offline — Please check your connection', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});
