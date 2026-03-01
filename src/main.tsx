import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Preload Home chunk so it’s requested in parallel with app init (reduces time on loading screen)
import('./pages/Home').catch(() => {});

// Register service worker for offline support (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('Service Worker registered:', registration);
        }
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error('Service Worker registration failed:', error);
        }
      });
  });
}

const rootEl = document.getElementById('root')!;
createRoot(rootEl).render(
  <StrictMode>
    <HelmetProvider>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </HelmetProvider>
  </StrictMode>
);
