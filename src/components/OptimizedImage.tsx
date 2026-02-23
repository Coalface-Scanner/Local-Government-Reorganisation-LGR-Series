import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  /** Alt text for the image. Omit or use empty string when decorative=true so screen readers skip it. */
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  variant?: 'hero' | 'article' | 'thumbnail' | 'default';
  caption?: string;
  /** When true, image is decorative: alt="" and role="presentation" so assistive tech ignores it. */
  decorative?: boolean;
  /** When set with variant="thumbnail", positions the crop (e.g. "50% 25%" to show more of the top). */
  objectPosition?: string;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  width,
  height,
  variant = 'default',
  caption,
  decorative = false,
  objectPosition
}: OptimizedImageProps) {
  const effectiveAlt = decorative ? '' : alt;
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  if (imageError) {
    return (
      <div className={`bg-academic-warm flex items-center justify-center min-h-[200px] ${className}`}>
        <div className="text-center p-8">
          <p className="text-academic-neutral-600 text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  // Variant-specific wrapper and image styling
  let wrapperClasses = '';
  let imageClasses = '';
  
  if (variant === 'hero') {
    // Hero: 16:9 aspect ratio wrapper
    wrapperClasses = `aspect-[16/9] w-full overflow-hidden relative ${className}`;
    imageClasses = 'w-full h-full object-cover object-center academic-hero-image';
  } else if (variant === 'thumbnail') {
    // Thumbnail: 4:3 aspect ratio wrapper - ensure image fills completely
    wrapperClasses = `aspect-[4/3] w-full overflow-hidden relative border border-academic-neutral-300 ${className}`;
    imageClasses = 'w-full h-full object-cover object-center';
  } else if (variant === 'article') {
    // Article: keep natural aspect ratio, no crop
    wrapperClasses = `relative ${className}`;
    imageClasses = 'academic-article-image';
  } else {
    // Default: no special styling
    wrapperClasses = `relative ${className}`;
    imageClasses = '';
  }

  // Calculate aspect ratio if width and height are provided (for non-variant cases)
  const aspectRatio = width && height && variant === 'default' ? `${width} / ${height}` : undefined;
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : {};

  const imageElement = (
    <div className={wrapperClasses} style={aspectRatioStyle}>
      {isLoading && (
        <div className="absolute inset-0 bg-academic-warm animate-pulse z-10" />
      )}
      {variant === 'hero' && (
        <div className="academic-hero-overlay" />
      )}
      <img
        src={src}
        alt={effectiveAlt}
        loading={priority || variant === 'hero' ? 'eager' : loading}
        fetchpriority={priority || variant === 'hero' ? 'high' : 'auto'}
        decoding={priority || variant === 'hero' ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={`${imageClasses} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={variant === 'thumbnail' ? {
          objectFit: 'cover',
          objectPosition: objectPosition ?? 'center',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
          display: 'block'
        } : undefined}
        sizes={sizes}
        width={width}
        height={height}
      />
    </div>
  );

  if (caption) {
    return (
      <figure className="my-8">
        {imageElement}
        <figcaption className="academic-image-caption">{caption}</figcaption>
      </figure>
    );
  }

  return imageElement;
}
