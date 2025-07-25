import { FC, memo } from 'react';
import Image, { ImageProps } from 'next/image';

export interface OptimizedImageProps extends Omit<ImageProps, 'loader'> {
  format?: 'webp' | 'avif' | 'auto';
  quality?: number;
}

const OptimizedImage: FC<OptimizedImageProps> = memo(
  ({ src, alt, width, height, format = 'auto', quality = 75, ...props }) => {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        {...props}
      />
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
