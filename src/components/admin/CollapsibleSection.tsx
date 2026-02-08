import { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = false,
  className = '' 
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-neutral-500" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-500" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <div 
          id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="p-6 pt-0 border-t border-neutral-200"
        >
          {children}
        </div>
      )}
    </div>
  );
}
