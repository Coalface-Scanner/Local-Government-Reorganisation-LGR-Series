import { FileText } from 'lucide-react';

interface InBriefSectionProps {
  content: string;
  className?: string;
}

/**
 * InBriefSection Component
 * 
 * Displays a quotable summary section optimized for featured snippets and AI extraction.
 * Positioned at the top of key pages to provide concise, answer-style content.
 */
export default function InBriefSection({ content, className = '' }: InBriefSectionProps) {
  // Check if h-full is in className to determine if we should remove margin
  const hasFullHeight = className.includes('h-full');
  const marginClass = hasFullHeight ? '' : 'mb-8 sm:mb-10 md:mb-12';
  
  return (
    <div className={`academic-card p-4 sm:p-6 md:p-8 ${marginClass} bg-teal-50 border-l-4 border-teal-700 ${className} ${hasFullHeight ? 'flex flex-col' : ''}`}>
      <div className={`flex items-start gap-3 sm:gap-4 ${hasFullHeight ? 'flex-grow' : ''}`}>
        <div className="flex-shrink-0 mt-1">
          <FileText className="text-teal-700" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-display font-bold text-academic-charcoal mb-3 sm:mb-4">
            In Brief
          </h2>
          <p className={`text-base sm:text-lg text-academic-neutral-800 leading-relaxed font-serif break-words ${hasFullHeight ? 'flex-grow' : ''}`}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
