import type { Metadata, Viewport } from 'next';
import './globals.css';
import {
  generateMetadata,
  viewportConfig,
  generateStructuredData,
} from '../lib/seo.config';
import { ClientLayout } from '../components/layout/ClientLayout';

// Optimierte Metadaten aus SEO-Konfiguration
export const metadata: Metadata = generateMetadata();

// Mobile-optimiertes Viewport aus SEO-Konfiguration
export const viewport: Viewport = viewportConfig;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = generateStructuredData();

  return (
    <html lang="de">
      <head>
        {/* Strukturierte Daten für SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              structuredData.organization,
              structuredData.website,
              structuredData.webpage,
            ]),
          }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ffff" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
      </head>
      <body className="bg-gray-900 text-white antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
