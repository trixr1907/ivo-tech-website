'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export function VercelAnalytics() {
  const isDev = process.env.NEXT_PUBLIC_NODE_ENV === 'development';
  const analyticsId = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID;

  // Only enable in production or when explicitly configured
  if (!analyticsId && isDev) {
    console.log('Vercel Analytics disabled in development environment');
    return null;
  }

  return (
    <>
      <Analytics debug={isDev} />
      <SpeedInsights debug={isDev} />
    </>
  );
}
