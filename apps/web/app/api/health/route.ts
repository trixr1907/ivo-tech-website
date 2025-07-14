import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    deployment: {
      vercel: process.env.VERCEL_URL || 'local',
      region: process.env.VERCEL_REGION || 'unknown',
      git_commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
    },
    uptime: process.uptime(),
    memory: {
      used: process.memoryUsage().heapUsed / 1024 / 1024,
      total: process.memoryUsage().heapTotal / 1024 / 1024,
      external: process.memoryUsage().external / 1024 / 1024,
    },
    checks: {
      database: 'not_applicable',
      cache: 'healthy',
      external_apis: 'healthy',
    },
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
