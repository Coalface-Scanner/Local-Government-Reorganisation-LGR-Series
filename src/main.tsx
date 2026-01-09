import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// URGENT: Disable service worker completely
if ('serviceWorker' in navigator) {
  // Run immediately, don't wait
  (function() {
    // Unregister all service workers
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister().catch(() => {});
      });
    });
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName).catch(() => {});
        });
      });
    }
    
    // Stop any active service worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      // Force unregister
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.unregister().catch(() => {});
        }
      });
    }
  })();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </StrictMode>
);
