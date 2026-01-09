import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminAuthProvider } from './contexts/AdminAuthContext';

// Register service worker for PWA support - Deferred for performance
if ('serviceWorker' in navigator) {
  // Wait for page to be fully interactive before registering service worker
  if (document.readyState === 'complete') {
    registerServiceWorker();
  } else {
    window.addEventListener('load', registerServiceWorker);
  }
}

function registerServiceWorker() {
  // Use requestIdleCallback to register SW when browser is idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          if (import.meta.env.DEV) {
            console.log('Service Worker registered:', registration);
          }
        })
        .catch((error) => {
          if (import.meta.env.DEV) {
            console.log('Service Worker registration failed:', error);
          }
        });
    }, { timeout: 5000 });
  } else {
    // Fallback: register after a delay
    setTimeout(() => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          if (import.meta.env.DEV) {
            console.log('Service Worker registered:', registration);
          }
        })
        .catch((error) => {
          if (import.meta.env.DEV) {
            console.log('Service Worker registration failed:', error);
          }
        });
    }, 2000);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </StrictMode>
);
