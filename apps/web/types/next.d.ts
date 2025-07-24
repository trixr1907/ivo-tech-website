import { ReactNode } from 'react';

declare module 'next' {
  export interface PageProps {
    children?: ReactNode;
  }

  export interface GetStaticPropsContext {
    params?: { [key: string]: string };
    preview?: boolean;
    previewData?: any;
  }

  export interface GetStaticPathsContext {
    locales?: string[];
    defaultLocale?: string;
  }

  export interface GetServerSidePropsContext extends GetStaticPropsContext {
    req: any;
    res: any;
    query: { [key: string]: string | string[] };
  }
}

declare module 'next/link' {
  import { ComponentType } from 'react';
  
  interface LinkProps {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    children: ReactNode;
  }

  const Link: ComponentType<LinkProps>;
  export default Link;
}

declare module 'next/image' {
  import { ComponentType } from 'react';

  interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    quality?: number;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    unoptimized?: boolean;
  }

  const Image: ComponentType<ImageProps>;
  export default Image;
}
