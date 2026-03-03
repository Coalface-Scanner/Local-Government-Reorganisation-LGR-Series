import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SURVEY_DISMISSED_KEY = 'lgr-surrey-survey-dismissed';
const SURVEY_URL = 'https://lgri.commonplace.is/';

export default function SurreySurveyPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(SURVEY_DISMISSED_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(SURVEY_DISMISSED_KEY, 'true');
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      onClick={handleDismiss}
      aria-modal="true"
      aria-labelledby="surrey-survey-title"
      aria-describedby="surrey-survey-desc"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden border border-academic-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-800 px-6 py-4">
          <div className="flex justify-between items-start gap-4">
            <h2 id="surrey-survey-title" className="text-white font-display font-bold text-lg tracking-wider">
              Surrey Residents LGR Survey
            </h2>
            <button
              onClick={handleDismiss}
              aria-label="Close"
              className="flex-shrink-0 p-1 rounded text-white/90 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="px-6 py-5">
          <p id="surrey-survey-desc" className="text-academic-neutral-700 text-sm leading-relaxed mb-6">
            Have your say on local government reorganisation in Surrey. Share your views and help shape the future of local democracy in the county.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={SURVEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold text-sm uppercase tracking-wider rounded-lg transition-colors"
            >
              Take the survey
            </a>
            <button
              onClick={handleDismiss}
              className="px-5 py-3 text-academic-neutral-600 hover:text-academic-charcoal font-display font-medium text-sm transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
