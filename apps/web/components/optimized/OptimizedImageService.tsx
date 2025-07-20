'use client';

import Image from 'next/image';
import { useState, useCallback, memo, forwardRef, Ref } from 'react';

// Responsive sizes für verschiedene Breakpoints
const RESPONSIVE_SIZES = {
  mobile: '(max-width: 768px) 100vw',
  tablet: '(max-width: 1024px) 50vw',
  desktop: '33vw'
};

const DEFAULT_SIZES = `${RESPONSIVE_SIZES.mobile}, ${RESPONSIVE_SIZES.tablet}, ${RESPONSIVE_SIZES.desktop}`;

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
  fill?: boolean;
}

// Blur-Placeholder für bessere UX
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

// Optimierte Image-Komponente mit Lazy Loading
const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  sizes = DEFAULT_SIZES,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  quality = 75,
  onLoad,
  onError,
  fill = false,
  ...props
}, ref: Ref<HTMLImageElement>) => {
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const defaultBlurDataURL = blurDataURL || 
    `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <span className="text-gray-500 text-sm">Bild konnte nicht geladen werden</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        ref={ref}
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${fill ? 'object-cover' : ''}`}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Hook für progressive Bildladung
export const useProgressiveImage = (src: string, placeholderSrc?: string) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || '');
  const [isLoading, setLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setImgSrc(src);
    setLoading(false);
  }, [src]);

  return { src: imgSrc, isLoading, onLoad: handleLoad };
};

// Avatar-Komponente mit optimierter Performance
export const OptimizedAvatar = memo(({ 
  src, 
  alt, 
  size = 64,
  className = '' 
}: { 
  src: string; 
  alt: string; 
  size?: number;
  className?: string;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={`rounded-full ${className}`}
    sizes={`${size}px`}
    quality={80}
  />
));

OptimizedAvatar.displayName = 'OptimizedAvatar';

// Hero-Image mit WebP-Unterstützung
export const OptimizedHeroImage = memo(({
  src,
  alt,
  className = '',
  priority = true
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    fill
    className={className}
    sizes="100vw"
    priority={priority}
    quality={85}
    placeholder="blur"
  />
));

OptimizedHeroImage.displayName = 'OptimizedHeroImage';

// Galerie-Image mit Lazy Loading
export const OptimizedGalleryImage = memo(({
  src,
  alt,
  width = 300,
  height = 200,
  className = ''
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    quality={75}
  />
));

OptimizedGalleryImage.displayName = 'OptimizedGalleryImage';

export default OptimizedImage;
