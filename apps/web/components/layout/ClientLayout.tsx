'use client';

import dynamic from 'next/dynamic';

const DynamicMotionProvider = dynamic(
  () => import('../motion/DynamicMotionOrchestrator')
    .then(mod => mod.DynamicMotionProvider),
  { ssr: false }
);

const DynamicAnalytics = dynamic(
  () => import('../analytics/DynamicAnalytics')
    .then(mod => mod.DynamicAnalytics),
  { ssr: false }
);

const PWAProvider = dynamic(
  () => import('../PWAProvider')
    .then(mod => mod.PWAProvider),
  { ssr: false }
);

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PWAProvider />
      <DynamicMotionProvider>
        {children}
      </DynamicMotionProvider>
      <DynamicAnalytics />
    </>
  );
}
