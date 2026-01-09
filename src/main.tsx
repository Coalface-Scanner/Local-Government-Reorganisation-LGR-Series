import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// TEMPORARILY DISABLE SERVICE WORKER - Unregister any existing ones
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success && import.meta.env.DEV) {
          console.log('Service Worker unregistered');
        }
      });
    }
  });
  // Clear all caches
  caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => caches.delete(cacheName))
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </StrictMode>
);
