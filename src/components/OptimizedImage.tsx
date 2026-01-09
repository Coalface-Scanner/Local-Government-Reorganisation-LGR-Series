import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  width,
  height
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate responsive image URLs if using an image CDN
  // For now, we'll use the original image but with proper attributes
  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`bg-slate-100 flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="text-center p-8">
          <p className="text-slate-600 text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  // Calculate aspect ratio if width and height are provided
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : {};

  return (
    <div className="relative" style={aspectRatioStyle}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-lg" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        sizes={sizes}
        width={width}
        height={height}
      />
    </div>
  );
}
