// Service Worker DISABLED - This file is now a no-op
// All requests pass through to the network without caching

// Immediately unregister and clear caches
self.addEventListener('install', (event) => {
  // Skip waiting and unregister immediately
  self.skipWaiting();
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      return self.registration.unregister();
    })
  );
});

self.addEventListener('activate', (event) => {
  // Clear all caches and unregister
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Don't intercept any fetches - let everything go to network
self.addEventListener('fetch', (event) => {
  // Do nothing - let browser handle all requests normally
  return;
});
