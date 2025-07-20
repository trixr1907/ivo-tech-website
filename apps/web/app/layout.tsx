import type { Metadata, Viewport } from 'next';
import './globals.css';
import { VercelAnalytics } from '../components/analytics/VercelAnalytics';
import { MotionOrchestratorProvider } from '../components/motion/MotionOrchestrator';
import { NeonProvider } from '../components/ui/neon-ui/NeonProvider';
import { generateMetadata, viewportConfig, generateStructuredData } from '../lib/seo.config';
import ErrorBoundary from '../components/error/ErrorBoundary';
import { MonitoringProvider } from '../components/monitoring/MonitoringProvider';

// Optimierte Metadaten aus SEO-Konfiguration
export const metadata: Metadata = generateMetadata();

// Mobile-optimiertes Viewport aus SEO-Konfiguration
export const viewport: Viewport = viewportConfig;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = generateStructuredData();

  return (
    <html lang='de'>
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
      </head>
      <body className='bg-gray-900 text-white antialiased'>
        <MonitoringProvider>
          <ErrorBoundary>
            <NeonProvider enableAudio={true}>
              <MotionOrchestratorProvider
                initialSettings={{
                  enablePageTransitions: true,
                  enableCurtainSweep: true,
                  enableScrollAnimations: true,
                  enableParallax: true,
                  transitionDuration: 1.2,
                  curtainColor: [0, 1, 0.8],
                  debugMode: false,
                }}
              >
                {children}
              </MotionOrchestratorProvider>
            </NeonProvider>
          </ErrorBoundary>
        </MonitoringProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
