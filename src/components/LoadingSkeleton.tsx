interface LoadingSkeletonProps {
  variant?: 'card' | 'article' | 'list' | 'text';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({ variant = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'card') {
    return (
      <>
        {skeletons.map((idx) => (
          <div key={idx} className={`academic-card p-8 animate-pulse ${className}`}>
            <div className="h-6 bg-academic-neutral-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-academic-neutral-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-academic-neutral-200 rounded w-5/6"></div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'article') {
    return (
      <>
        {skeletons.map((idx) => (
          <div key={idx} className={`academic-card p-8 animate-pulse ${className}`}>
            <div className="h-8 bg-academic-neutral-200 rounded w-2/3 mb-4"></div>
            <div className="aspect-[16/9] bg-academic-neutral-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-academic-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-academic-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-academic-neutral-200 rounded w-4/5"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'list') {
    return (
      <>
        {skeletons.map((idx) => (
          <div key={idx} className={`flex items-center gap-4 p-4 border-b border-academic-neutral-200 animate-pulse ${className}`}>
            <div className="w-16 h-16 bg-academic-neutral-200 rounded flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-5 bg-academic-neutral-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-academic-neutral-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  // text variant
  return (
    <>
      {skeletons.map((idx) => (
        <div key={idx} className={`animate-pulse ${className}`}>
          <div className="h-4 bg-academic-neutral-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-academic-neutral-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-academic-neutral-200 rounded w-3/4"></div>
        </div>
      ))}
    </>
  );
}
