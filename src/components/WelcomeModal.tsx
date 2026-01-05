import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  onNavigate: (page: string) => void;
}

export default function WelcomeModal({ onNavigate }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenWelcomeModal');
    if (!hasSeenModal) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setIsVisible(false);
  };

  const handleEnterHub = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setIsVisible(false);
  };

  const handleSubscribe = () => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setIsVisible(false);
    onNavigate('subscribe');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white border-4 border-neutral-900 max-w-2xl w-full shadow-2xl animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-neutral-900 hover:bg-teal-700 text-white rounded-full transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-3 leading-tight">
              Decisions, Power and Place
            </h2>
            <p className="text-lg md:text-xl text-teal-700 font-medium">
              Evidence-based governance analysis of England's structural reforms.
            </p>
          </div>

          <div className="border-l-4 border-teal-700 pl-6 mb-8">
            <p className="text-neutral-700 leading-relaxed mb-4 text-lg">
              <span className="font-bold text-neutral-900">LGR is a structural intervention; Devolution is a power shift.</span>
            </p>
            <p className="text-neutral-700 leading-relaxed text-base">
              Join the LGR Governance Series for senior-level insight on how reorganisation reshapes planning behaviour, political risk, and the Five Year Housing Land Supply.
            </p>
            <p className="text-neutral-600 text-sm mt-4 italic">
              Edited by Rowan Cole.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleEnterHub}
              className="flex-1 py-4 px-6 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm tracking-wide rounded transition-all border-2 border-teal-700"
            >
              ENTER THE RESEARCH HUB
            </button>
            <button
              onClick={handleSubscribe}
              className="flex-1 py-4 px-6 bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-sm tracking-wide rounded transition-all border-2 border-neutral-900"
            >
              SUBSCRIBE TO THE SERIES
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-700 to-teal-600 h-2" />
      </div>
    </div>
  );
}
