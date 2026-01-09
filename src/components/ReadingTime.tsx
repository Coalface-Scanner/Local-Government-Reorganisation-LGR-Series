import { Clock } from 'lucide-react';
import { calculateReadingTime, formatReadingTime } from '../lib/utils';

interface ReadingTimeProps {
  content: string | null;
  className?: string;
}

export default function ReadingTime({ content, className = '' }: ReadingTimeProps) {
  if (!content) return null;

  const minutes = calculateReadingTime(content);
  const readingTime = formatReadingTime(minutes);

  return (
    <div className={`flex items-center gap-2 text-sm text-slate-400 ${className}`}>
      <Clock size={14} />
      <span>{readingTime}</span>
    </div>
  );
}
