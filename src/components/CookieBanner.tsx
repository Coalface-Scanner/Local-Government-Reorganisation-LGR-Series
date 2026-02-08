import { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const COOKIE_CONSENT_KEY = 'lgr-cookie-consent';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: false,
    analytics: false,
  });

  const loadGoogleAnalytics = () => {
    // Check if script already loaded
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1CQR5MEY37';
    document.head.appendChild(script);
    script.onload = function() {
      if (typeof window.gtag === 'function') {
        window.gtag('js', new Date());
        window.gtag('config', 'G-1CQR5MEY37');
      }
    };
  };

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allAccepted));
    // Trigger storage event to notify analytics script (must be StorageEvent for cross-tab)
    window.dispatchEvent(new StorageEvent('storage', {
      key: COOKIE_CONSENT_KEY,
      newValue: JSON.stringify(allAccepted),
      storageArea: localStorage
    }));
    // Load analytics since user accepted all
    loadGoogleAnalytics();
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(essentialOnly));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const saved = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(saved));
    // Trigger storage event to notify analytics script (must be StorageEvent for cross-tab)
    window.dispatchEvent(new StorageEvent('storage', {
      key: COOKIE_CONSENT_KEY,
      newValue: JSON.stringify(saved),
      storageArea: localStorage
    }));
    // Load analytics if consent given
    if (saved.analytics) {
      loadGoogleAnalytics();
    }
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleClose = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-slide-up max-w-sm">
      <div className="bg-white border-l-4 border-teal-700 shadow-lg rounded-r">
        <div className="px-4 py-3">
          {!showSettings ? (
            <div className="relative">
              <button
                onClick={handleClose}
                className="absolute top-0 right-0 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Close banner"
              >
                <X size={16} />
              </button>

              <div className="flex items-start gap-2 mb-3 pr-6">
                <Cookie className="h-5 w-5 text-teal-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-1">
                    Cookie Preferences
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    We use cookies to improve your experience.{' '}
                    <a
                      href="https://coalfaceengagement.co.uk/cookies"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:text-teal-800 underline"
                    >
                      Learn more about our cookie policy
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-colors rounded"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 transition-colors rounded"
                  >
                    Reject All
                  </button>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors rounded"
                >
                  <Settings size={14} />
                  Manage Preferences
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-neutral-900">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                  aria-label="Close settings"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                <div className="border-l-2 border-teal-700 bg-teal-50 p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 mb-0.5">
                        Essential
                      </h4>
                      <p className="text-xs text-neutral-600">
                        Required for basic functionality.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-4 h-4 text-teal-700 opacity-50 cursor-not-allowed mt-0.5"
                    />
                  </div>
                </div>

                <div className="border-l-2 border-neutral-300 bg-neutral-50 p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 mb-0.5">
                        Functional
                      </h4>
                      <p className="text-xs text-neutral-600">
                        Enhanced features and personalization.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      className="w-4 h-4 text-teal-700 cursor-pointer accent-teal-700 mt-0.5"
                    />
                  </div>
                </div>

                <div className="border-l-2 border-neutral-300 bg-neutral-50 p-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-neutral-900 mb-0.5">
                        Analytics
                      </h4>
                      <p className="text-xs text-neutral-600">
                        Help us improve the website.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="w-4 h-4 text-teal-700 cursor-pointer accent-teal-700 mt-0.5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-neutral-200">
                <a
                  href="https://coalfaceengagement.co.uk/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-700 hover:text-teal-800 underline text-center"
                >
                  Read our full cookie policy
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 transition-colors rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-colors rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
