import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// TEMPORARILY DISABLE SERVICE WORKER - Aggressively unregister and clear
if ('serviceWorker' in navigator) {
  // Immediately unregister all service workers
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().catch(() => {
        // Ignore errors
      });
    });
  });
  
  // Clear all caches immediately
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName).catch(() => {
          // Ignore errors
        });
      });
    });
  }
  
  // Also try to unregister via the service worker controller
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </StrictMode>
);
