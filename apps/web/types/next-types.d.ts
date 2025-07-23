import { ComponentType, ReactNode } from 'react';
import { LoaderComponent } from './react-types';

export interface NextDynamicOptions<P = {}> {
  loading?: ComponentType<{ error?: Error; retry?: () => void; timedOut?: boolean }>;
  loader?: () => Promise<ComponentType<P> | { default: ComponentType<P> }>;
  ssr?: boolean;
  suspense?: boolean;
}

export interface NextDynamicProps<P = {}> extends NextDynamicOptions<P> {
  children?: ReactNode;
}

export type NextDynamicComponent<P = {}> = ComponentType<P> & {
  preload?: () => Promise<void>;
  displayName?: string;
};

export interface NextPageProps {
  params?: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] };
}

export interface NextLayoutProps {
  children: ReactNode;
  params?: { [key: string]: string };
}

export interface NextErrorProps {
  error: Error;
  reset: () => void;
}

export interface NextLoadingProps {
  error?: Error;
  retry?: () => void;
  timedOut?: boolean;
}

export interface NextMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  authors?: Array<{ name: string; url?: string }>;
  creator?: string;
  publisher?: string;
  robots?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  twitter?: {
    card?: string;
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      alt?: string;
    }>;
  };
  viewport?: {
    width?: number;
    initialScale?: number;
    minimumScale?: number;
    maximumScale?: number;
    userScalable?: boolean;
    viewportFit?: 'auto' | 'cover' | 'contain';
  };
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
    bing?: string;
  };
}

export interface NextImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  blurDataURL?: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export interface NextScriptProps {
  src?: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  onLoad?: () => void;
  onError?: (error: Error) => void;
  dangerouslySetInnerHTML?: {
    __html: string;
  };
}

export interface NextLinkProps {
  href: string;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  locale?: string | false;
  className?: string;
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

// Dynamic Import Types
export type DynamicImportType<P> = Promise<{
  default: ComponentType<P>;
  [key: string]: any;
}>;

export interface DynamicImportOptions {
  ssr?: boolean;
  loading?: ComponentType;
  loader?: () => DynamicImportType<any>;
  suspense?: boolean;
  loadableGenerated?: {
    webpack?: () => number[];
    modules?: string[];
  };
}

// Server Component Types
export type ServerComponent<P = {}> = (props: P) => Promise<ReactNode>;
export type ClientComponent<P = {}> = ComponentType<P>;

// Data Fetching Types
export interface GetStaticPropsContext {
  params?: { [key: string]: string };
  preview?: boolean;
  previewData?: any;
  locale?: string;
  locales?: string[];
  defaultLocale?: string;
}

export interface GetServerSidePropsContext extends GetStaticPropsContext {
  req: IncomingMessage;
  res: ServerResponse;
  query: { [key: string]: string | string[] };
}

// API Route Types
export interface NextApiRequest extends IncomingMessage {
  query: { [key: string]: string | string[] };
  cookies: { [key: string]: string };
  body: any;
}

export interface NextApiResponse extends ServerResponse {
  json: (body: any) => void;
  status: (statusCode: number) => NextApiResponse;
  send: (body: any) => void;
  redirect: (statusOrUrl: number | string, url?: string) => void;
}

// Middleware Types
export interface NextMiddleware {
  (req: NextApiRequest, res: NextApiResponse, next: () => void): void | Promise<void>;
}
