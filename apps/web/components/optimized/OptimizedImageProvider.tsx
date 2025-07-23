'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { performanceManager } from '../../lib/performance/PerformanceManager';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  lowResSrc?: string;
  blurhash?: string;
  preload?: boolean;
}

const shimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stop-color="#0A0A0A" offset="0%" />
        <stop stop-color="#161616" offset="50%" />
        <stop stop-color="#0A0A0A" offset="100%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)" />
  </svg>
`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export function OptimizedImage({
  src,
  lowResSrc,
  blurhash,
  preload,
  alt,
  width,
  height,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (preload && src) {
      const img = new Image();
      img.src = src;
    }
  }, [src, preload]);

  const optimizedProps = performanceManager.getImageOptimization(src, {
    priority: props.priority,
    sizes: props.sizes ? [props.sizes] : undefined,
  });

  const placeholder = blurhash
    ? 'blur'
    : `data:image/svg+xml;base64,${toBase64(shimmer(width as number, height as number))}`;

  const blurDataURL = blurhash || placeholder;

  return (
    <div className="relative overflow-hidden">
      <Image
        ref={imageRef}
        {...props}
        {...optimizedProps}
        src={src}
        alt={alt}
        width={width}
        height={height}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${props.className || ''}`}
      />

      {/* Low Resolution Placeholder */}
      {lowResSrc && !isLoaded && (
        <Image
          src={lowResSrc}
          alt={alt}
          width={width}
          height={height}
          className="absolute inset-0 blur-sm"
          priority
        />
      )}

      {/* Loading Indicator */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-900 to-gray-800"
          style={{ backdropFilter: 'blur(8px)' }}
        />
      )}
    </div>
  );
}
