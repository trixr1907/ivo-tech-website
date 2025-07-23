'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from '../error/ErrorBoundary';
import { errorTracker } from '../../lib/services/errorTracking';

const DynamicMotionProvider = dynamic(
  () =>
    import('../motion/DynamicMotionOrchestrator').then(
      mod => mod.DynamicMotionProvider
    ),
  { ssr: false }
);

const DynamicAnalytics = dynamic(
  () =>
    import('../analytics/DynamicAnalytics').then(mod => mod.DynamicAnalytics),
  { ssr: false }
);

const PWAProvider = dynamic(
  () => import('../PWAProvider').then(mod => mod.PWAProvider),
  { ssr: false }
);

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PWAProvider />
      <DynamicMotionProvider>
        <header className="fixed top-0 left-0 right-0 z-50">
          <nav className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <a href="/" className="text-xl font-bold">Ivo-Tech</a>
                <button data-testid="dark-mode-toggle" className="p-2">
                  🌓
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <a href="/portfolio" className="hover:text-cyan-400">Portfolio</a>
                <a href="/about" className="hover:text-cyan-400">Über uns</a>
                <a href="/contact" className="hover:text-cyan-400">Kontakt</a>
              </div>
              <button className="md:hidden p-2">☰</button>
            </div>
          </nav>
        </header>
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <footer className="bg-gray-800 py-8">
          <div className="container mx-auto px-4">
            {/* Hier kommen die Footer-Inhalte hin */}
          </div>
        </footer>
      </DynamicMotionProvider>
      <DynamicAnalytics />
    </>
  );
};

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        errorTracker.trackError({
          error,
          errorInfo,
          location: window.location.href
        });
      }}
    >
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </ErrorBoundary>
  );
}
