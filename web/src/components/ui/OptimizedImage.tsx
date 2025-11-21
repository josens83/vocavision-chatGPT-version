// Phase 3-2: Optimized Image Component
// WebP/AVIF support, lazy loading, responsive images, blur placeholder

'use client';

import { useState, useEffect, CSSProperties } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean; // Load immediately (for above-the-fold images)
  quality?: number; // 1-100, default 75
  sizes?: string; // Responsive sizes
  fill?: boolean; // Fill parent container
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  blurDataURL?: string;
  placeholder?: 'blur' | 'empty';
}

/**
 * Optimized Image Component with:
 * - Automatic WebP/AVIF conversion
 * - Lazy loading by default
 * - Responsive srcset
 * - Blur placeholder
 * - Error handling
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  sizes,
  fill = false,
  objectFit = 'cover',
  className = '',
  style,
  onLoad,
  onError,
  blurDataURL,
  placeholder = 'blur',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if not provided
  const defaultBlurDataURL =
    blurDataURL || generateBlurPlaceholder(width || 400, height || 300);

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (onError) onError();
  };

  // Show error fallback
  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{
          width: width || '100%',
          height: height || '100%',
          ...style,
        }}
      >
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          objectFit: fill ? objectFit : undefined,
        }}
      />
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            width: width || '100%',
            height: height || '100%',
          }}
        />
      )}
    </div>
  );
}

/**
 * Generate blur placeholder data URL
 */
function generateBlurPlaceholder(width: number, height: number): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#e5e7eb"/>
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Responsive Image with srcset
 */
export function ResponsiveImage({
  src,
  alt,
  aspectRatio = '16/9',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height' | 'fill'> & {
  aspectRatio?: string;
}) {
  return (
    <div
      className="relative w-full"
      style={{
        aspectRatio,
      }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        {...props}
      />
    </div>
  );
}

/**
 * Avatar Image with automatic sizing
 */
export function AvatarImage({
  src,
  alt,
  size = 40,
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'width' | 'height'> & {
  size?: number;
}) {
  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        objectFit="cover"
        {...props}
      />
    </div>
  );
}

/**
 * Hero Image with priority loading
 */
export function HeroImage({
  src,
  alt,
  className = '',
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority
      quality={90}
      fill
      objectFit="cover"
      className={className}
      {...props}
    />
  );
}

/**
 * Lazy Image - only loads when in viewport
 */
export function LazyImage({
  src,
  alt,
  threshold = 0.1,
  ...props
}: OptimizedImageProps & {
  threshold?: number;
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!imgRef || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(imgRef);

    return () => observer.disconnect();
  }, [imgRef, shouldLoad, threshold]);

  if (!shouldLoad) {
    return (
      <div
        ref={setImgRef}
        className={`bg-gray-200 ${props.className || ''}`}
        style={{
          width: props.width || '100%',
          height: props.height || '100%',
          ...props.style,
        }}
      />
    );
  }

  return <OptimizedImage src={src} alt={alt} {...props} />;
}

console.log('[OptimizedImage] Module loaded');
