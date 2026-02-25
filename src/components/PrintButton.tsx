import { Printer } from 'lucide-react';
import { trackPrint } from '../utils/analytics';

interface PrintButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'icon';
}

export default function PrintButton({ className = '', variant = 'default' }: PrintButtonProps) {
  const handlePrint = () => {
    trackPrint(window.location.pathname);
    window.print();
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handlePrint}
        className={`p-2 text-academic-neutral-700 hover:text-teal-700 transition-colors ${className}`}
        aria-label="Print this page"
        title="Print"
      >
        <Printer size={20} />
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        onClick={handlePrint}
        className={`inline-flex items-center gap-2 px-4 py-2 border-2 border-academic-neutral-300 hover:border-teal-700 text-academic-neutral-700 hover:text-teal-700 font-display font-semibold transition-colors ${className}`}
        aria-label="Print this page"
      >
        <Printer size={18} />
        Print
      </button>
    );
  }

  return (
    <button
      onClick={handlePrint}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-display font-bold rounded-full transition-colors ${className}`}
      aria-label="Print this page"
    >
      <Printer size={18} />
      Print Page
    </button>
  );
}
