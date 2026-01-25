interface ContentTypeTagProps {
  contentType: string | null;
  className?: string;
}

export default function ContentTypeTag({ contentType, className = '' }: ContentTypeTagProps) {
  if (!contentType) return null;

  // Map content types to color schemes - filled backgrounds with white text
  const typeStyles: Record<string, string> = {
    'News Update': 'bg-blue-600 text-white border-blue-700',
    'Interview': 'bg-purple-600 text-white border-purple-700',
    'Article': 'bg-teal-600 text-white border-teal-700',
    'Research': 'bg-amber-600 text-white border-amber-700',
    'Lesson': 'bg-green-600 text-white border-green-700',
    'FAQ': 'bg-neutral-600 text-white border-neutral-700',
    'Other': 'bg-slate-600 text-white border-slate-700',
  };

  const style = typeStyles[contentType] || typeStyles['Other'];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${style} ${className}`}
    >
      {contentType}
    </span>
  );
}
