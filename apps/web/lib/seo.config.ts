import type { Metadata } from 'next';

/**
 * IVO-TECH SEO Konfiguration
 * Zentrale Verwaltung aller SEO-relevanten Metadaten
 */

export interface SEOConfig {
  site: {
    name: string;
    title: string;
    description: string;
    url: string;
    locale: string;
    alternativeLocales: string[];
  };
  company: {
    name: string;
    logo: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    contact: {
      email: string;
      phone: string;
    };
    social: {
      twitter: string;
      linkedin: string;
      github: string;
    };
  };
  seo: {
    keywords: string[];
    category: string;
    robots: string;
    author: string;
    publisher: string;
    themeColor: string;
    backgroundColor: string;
  };
  images: {
    ogImage: string;
    twitterCard: string;
    favicon: string;
    appleTouchIcon: string;
  };
  verification: {
    google: string;
    bing: string;
    yandex: string;
    pinterest: string;
  };
}

export const seoConfig: SEOConfig = {
  site: {
    name: 'IVO-TECH',
    title: 'IVO-TECH | Innovative Technologielösungen für moderne Unternehmen',
    description:
      'Professionelle Webentwicklung mit Next.js, React & TypeScript. 3D-Druck Services, API-Entwicklung und maßgeschneiderte Software-Lösungen. Ihr Partner für digitale Innovation.',
    url: 'https://ivo-tech.com',
    locale: 'de_DE',
    alternativeLocales: ['en_US'],
  },
  company: {
    name: 'IVO-TECH GmbH',
    logo: '/images/ivo-tech-logo.png',
    address: {
      street: 'Musterstraße 123',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Deutschland',
    },
    contact: {
      email: 'kontakt@ivo-tech.com',
      phone: '+49 30 12345678',
    },
    social: {
      twitter: '@ivotech_de',
      linkedin: 'company/ivo-tech',
      github: 'ivo-tech',
    },
  },
  seo: {
    keywords: [
      'Webentwicklung',
      'Next.js',
      'React',
      'TypeScript',
      '3D-Druck',
      'API-Entwicklung',
      'Software-Entwicklung',
      'PWA',
      'Frontend',
      'Backend',
      'Full-Stack',
      'Berlin',
      'Deutschland',
      'Technologieberatung',
      'Digitale Lösungen',
      'Web Apps',
      'Mobile Apps',
      'E-Commerce',
      'CMS',
      'Responsive Design',
    ],
    category: 'technology',
    robots:
      'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    author: 'IVO-TECH Team',
    publisher: 'IVO-TECH GmbH',
    themeColor: '#00ffff',
    backgroundColor: '#111827',
  },
  images: {
    ogImage: '/images/og-image-1200x630.png',
    twitterCard: '/images/twitter-card-1200x630.png',
    favicon: '/favicon.ico',
    appleTouchIcon: '/icons/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-site-verification-code',
    bing: 'your-bing-verification-code',
    yandex: 'your-yandex-verification-code',
    pinterest: 'your-pinterest-verification-code',
  },
};

/**
 * Generiert optimierte Metadaten für Next.js basierend auf der SEO-Konfiguration
 */
export function generateMetadata(pageConfig?: {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}): Metadata {
  const title = pageConfig?.title
    ? `${pageConfig.title} | ${seoConfig.site.name}`
    : seoConfig.site.title;

  const description = pageConfig?.description || seoConfig.site.description;

  const keywords = pageConfig?.keywords
    ? [...seoConfig.seo.keywords, ...pageConfig.keywords]
    : seoConfig.seo.keywords;

  const ogImage = pageConfig?.ogImage || seoConfig.images.ogImage;
  const fullOgImageUrl = `${seoConfig.site.url}${ogImage}`;

  const robots = pageConfig?.noIndex
    ? 'noindex, nofollow'
    : seoConfig.seo.robots;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: seoConfig.seo.author }],
    creator: seoConfig.seo.author,
    publisher: seoConfig.seo.publisher,
    robots,
    category: seoConfig.seo.category,

    // PWA Manifest
    manifest: '/manifest.json',

    // App Icons für verschiedene Plattformen
    icons: {
      icon: [
        { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        {
          url: '/icons/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
        { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/icons/safari-pinned-tab.svg',
          color: seoConfig.seo.themeColor,
        },
        { rel: 'shortcut icon', url: '/favicon.ico' },
      ],
    },

    // Mobile & PWA Optimierungen
    other: {
      'application-name': seoConfig.site.name,
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': seoConfig.site.name,
      'msapplication-TileColor': seoConfig.seo.themeColor,
      'msapplication-config': '/browserconfig.xml',
      'format-detection': 'telephone=no',
      'theme-color': seoConfig.seo.themeColor,
    },

    // OpenGraph Metadaten
    openGraph: {
      type: 'website',
      locale: seoConfig.site.locale,
      alternateLocale: seoConfig.site.alternativeLocales,
      url: seoConfig.site.url,
      title,
      description,
      siteName: seoConfig.site.name,
      images: [
        {
          url: fullOgImageUrl,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },

    // Twitter Card Metadaten
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.company.social.twitter,
      creator: seoConfig.company.social.twitter,
      title,
      description,
      images: [fullOgImageUrl],
    },

    // Canonical URLs und Alternativ-Sprachen
    alternates: {
      canonical: pageConfig?.canonical || seoConfig.site.url,
      languages: {
        'de-DE': seoConfig.site.url,
        'en-US': `${seoConfig.site.url}/en`,
      },
    },

    // Suchmaschinen-Verifizierung
    verification: {
      google: seoConfig.verification.google,
      other: {
        'msvalidate.01': seoConfig.verification.bing,
        'yandex-verification': seoConfig.verification.yandex,
        'p:domain_verify': seoConfig.verification.pinterest,
      },
    },
  };
}

/**
 * Strukturierte Daten für Schema.org (JSON-LD)
 */
export function generateStructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.company.name,
    alternateName: seoConfig.site.name,
    url: seoConfig.site.url,
    logo: `${seoConfig.site.url}${seoConfig.company.logo}`,
    description: seoConfig.site.description,
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: 'IVO-TECH Team',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: seoConfig.company.address.street,
      addressLocality: seoConfig.company.address.city,
      postalCode: seoConfig.company.address.postalCode,
      addressCountry: seoConfig.company.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: seoConfig.company.contact.phone,
      contactType: 'customer service',
      email: seoConfig.company.contact.email,
    },
    sameAs: [
      `https://twitter.com/${seoConfig.company.social.twitter.replace('@', '')}`,
      `https://linkedin.com/${seoConfig.company.social.linkedin}`,
      `https://github.com/${seoConfig.company.social.github}`,
    ],
    knowsAbout: [
      'Web Development',
      'Software Engineering',
      '3D Printing',
      'API Development',
      'TypeScript',
      'React',
      'Next.js',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.site.name,
    alternateName: seoConfig.company.name,
    url: seoConfig.site.url,
    description: seoConfig.site.description,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.company.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${seoConfig.site.url}/suche?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seoConfig.site.title,
    description: seoConfig.site.description,
    url: seoConfig.site.url,
    inLanguage: 'de-DE',
    isPartOf: {
      '@type': 'WebSite',
      name: seoConfig.site.name,
      url: seoConfig.site.url,
    },
    about: {
      '@type': 'Organization',
      name: seoConfig.company.name,
    },
    mainEntity: {
      '@type': 'Organization',
      name: seoConfig.company.name,
    },
  };

  return {
    organization: organizationSchema,
    website: websiteSchema,
    webpage: webPageSchema,
  };
}

/**
 * Viewport Konfiguration für mobile Optimierung
 */
export const viewportConfig = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: seoConfig.seo.backgroundColor,
    },
    { media: '(prefers-color-scheme: dark)', color: seoConfig.seo.themeColor },
  ],
  colorScheme: 'dark' as const,
};
