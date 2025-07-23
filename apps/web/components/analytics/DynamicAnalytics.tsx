import dynamic from 'next/dynamic';

// Lazy-load analytics components
const VercelAnalytics = dynamic(
  () => import('./VercelAnalytics').then(mod => mod.VercelAnalytics),
  { ssr: false }
);

const MonitoringProvider = dynamic(
  () =>
    import('../monitoring/MonitoringProvider').then(
      mod => mod.MonitoringProvider
    ),
  { ssr: false }
);

export function DynamicAnalytics({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <VercelAnalytics />
      <MonitoringProvider>
        {children}
      </MonitoringProvider>
    </>
  );
}
