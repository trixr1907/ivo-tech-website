'use client';

import Image from 'next/image';
import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  className?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

// Standard responsive sizes für verschiedene Breakpoints
const RESPONSIVE_SIZES = {
  mobile: '(max-width: 640px) 100vw',
  tablet: '(max-width: 1024px) 80vw',
  desktop: '(max-width: 1200px) 60vw',
  large: '40vw',
};

const DEFAULT_SIZES = `${RESPONSIVE_SIZES.mobile}, ${RESPONSIVE_SIZES.tablet}, ${RESPONSIVE_SIZES.desktop}, ${RESPONSIVE_SIZES.large}`;

// Placeholder für Blur-Effekt generieren
function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Erstelle einen einfachen Farbverlauf als Blur-Placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  sizes = DEFAULT_SIZES,
  className = '',
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  // Auto-generate blur placeholder wenn nicht vorhanden
  const finalBlurDataURL =
    blurDataURL ||
    (placeholder === 'blur' && typeof window !== 'undefined'
      ? generateBlurDataURL(width || 10, height || 10)
      : undefined);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm text-gray-400">Bild nicht verfügbar</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={finalBlurDataURL}
        sizes={sizes}
        loading={loading}
        style={{
          objectFit: fill ? objectFit : undefined,
          objectPosition: fill ? objectPosition : undefined,
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500" />
        </div>
      )}
    </div>
  );
}

// Spezielle Varianten für häufige Use Cases
export function HeroImage(
  props: Omit<OptimizedImageProps, 'priority' | 'sizes'>
) {
  return (
    <OptimizedImage {...props} priority={true} sizes="100vw" quality={90} />
  );
}

export function ThumbnailImage(
  props: Omit<OptimizedImageProps, 'sizes' | 'quality'>
) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
      quality={75}
    />
  );
}

export function AvatarImage(
  props: Omit<OptimizedImageProps, 'sizes' | 'quality' | 'objectFit'>
) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 640px) 50px, (max-width: 1024px) 75px, 100px"
      quality={80}
      objectFit="cover"
      className={`rounded-full ${props.className || ''}`}
    />
  );
}

export function GalleryImage(props: Omit<OptimizedImageProps, 'sizes'>) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
    />
  );
}

export default OptimizedImage;
