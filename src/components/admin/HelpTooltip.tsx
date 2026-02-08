import { Info } from 'lucide-react';
import { ReactNode } from 'react';

interface HelpTooltipProps {
  content: ReactNode;
  className?: string;
}

export default function HelpTooltip({ content, className = '' }: HelpTooltipProps) {
  return (
    <div className={`relative group inline-block ${className}`}>
      <Info 
        size={16} 
        className="text-neutral-400 hover:text-teal-600 cursor-help transition-colors" 
        aria-label="Help information"
      />
      <div className="absolute left-full ml-2 top-0 w-80 max-w-[calc(100vw-2rem)] bg-neutral-900 text-white text-xs rounded-lg p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
        <div className="space-y-2">
          {content}
        </div>
        <div className="absolute right-full top-3 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-neutral-900"></div>
      </div>
    </div>
  );
}
