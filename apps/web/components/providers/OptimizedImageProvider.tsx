'use client';

import React, { createContext, useContext, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageContextType {
  getImageProps: (src: string, dimensions: { width: number; height: number }) => ImageProps;
  preloadImage: (src: string) => void;
}

const OptimizedImageContext = createContext<OptimizedImageContextType>({
  getImageProps: () => ({} as ImageProps),
  preloadImage: () => {},
});

interface OptimizedImageProviderProps {
  children: React.ReactNode;
  imageSizes?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function OptimizedImageProvider({
  children,
  imageSizes = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
}: OptimizedImageProviderProps) {
  // Generiert responsive Bildgrößen basierend auf den Breakpoints
  const getSizes = useCallback(
    (dimension: { width: number; height: number }) => {
      const aspectRatio = dimension.width / dimension.height;
      return Object.entries(imageSizes)
        .map(([size, width]) => {
          const height = Math.round(width / aspectRatio);
          return `(max-width: ${width}px) ${width}px`;
        })
        .join(', ');
    },
    [imageSizes]
  );

  // Konfiguriert optimierte Image Props
  const getImageProps = useCallback(
    (src: string, dimensions: { width: number; height: number }): ImageProps => {
      return {
        src,
        width: dimensions.width,
        height: dimensions.height,
        sizes: getSizes(dimensions),
        loading: 'lazy',
        quality: 85,
        placeholder: 'blur',
        blurDataURL: `data:image/svg+xml;base64,${Buffer.from(
          `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#2563eb"/></svg>`
        ).toString('base64')}`,
      };
    },
    [getSizes]
  );

  // Preload wichtige Bilder
  const preloadImage = useCallback((src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }, []);

  return (
    <OptimizedImageContext.Provider
      value={{
        getImageProps,
        preloadImage,
      }}
    >
      {children}
    </OptimizedImageContext.Provider>
  );
}

// Custom Hook für einfache Verwendung
export function useOptimizedImage() {
  const context = useContext(OptimizedImageContext);
  if (!context) {
    throw new Error('useOptimizedImage must be used within an OptimizedImageProvider');
  }
  return context;
}

// Optimierte Image Komponente
interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  dimensions: { width: number; height: number };
  priority?: boolean;
}

export function OptimizedImage({ src, dimensions, priority, ...props }: OptimizedImageProps) {
  const { getImageProps } = useOptimizedImage();
  const imageProps = getImageProps(src, dimensions);

  return (
    <Image
      {...imageProps}
      {...props}
      priority={priority}
      className={`transition-opacity duration-300 ${props.className || ''}`}
    />
  );
}
