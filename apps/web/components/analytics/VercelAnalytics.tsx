'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export function VercelAnalytics() {
  // Only enable in production or when explicitly configured
  const analyticsEnabled =
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID;

  if (!analyticsEnabled) {
    console.log('Vercel Analytics disabled in development environment');
    return null;
  }

  return (
    <>
      <Analytics debug={process.env.NODE_ENV === 'development'} />
      <SpeedInsights debug={process.env.NODE_ENV === 'development'} />
    </>
  );
}
