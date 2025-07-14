'use client';

import { useState, useEffect } from 'react';
import { usePerformance } from '../../hooks/usePerformance';

interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
  deployment: {
    vercel: string;
    region: string;
    git_commit: string;
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
    external: number;
  };
  checks: {
    database: string;
    cache: string;
    external_apis: string;
  };
}

export default function MonitoringDashboard() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const performance = usePerformance();

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) throw new Error('Health check failed');
        const data = await response.json();
        setHealthData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
    const interval = setInterval(fetchHealthData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className='rounded-lg border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm'>
        <div className='animate-pulse'>
          <div className='mb-4 h-4 w-1/4 rounded bg-gray-700'></div>
          <div className='space-y-2'>
            <div className='h-3 rounded bg-gray-700'></div>
            <div className='h-3 w-3/4 rounded bg-gray-700'></div>
            <div className='h-3 w-1/2 rounded bg-gray-700'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-lg border border-red-700 bg-red-900/20 p-6'>
        <h3 className='mb-2 text-lg font-semibold text-red-400'>Monitoring Error</h3>
        <p className='text-red-300'>Failed to fetch health data: {error}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* System Status Overview */}
      <div className='rounded-lg border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm'>
        <h3 className='mb-4 flex items-center text-xl font-bold text-white'>
          <div className='mr-3 h-3 w-3 animate-pulse rounded-full bg-green-400'></div>
          System Status
        </h3>

        {healthData && (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <div className='space-y-2'>
              <div className='text-sm text-gray-400'>Overall Status</div>
              <div className={`text-lg font-semibold ${getStatusColor(healthData.status)}`}>
                {healthData.status.toUpperCase()}
              </div>
            </div>

            <div className='space-y-2'>
              <div className='text-sm text-gray-400'>Environment</div>
              <div className='text-lg font-semibold text-blue-400'>{healthData.environment}</div>
            </div>

            <div className='space-y-2'>
              <div className='text-sm text-gray-400'>Version</div>
              <div className='text-lg font-semibold text-purple-400'>{healthData.version}</div>
            </div>

            <div className='space-y-2'>
              <div className='text-sm text-gray-400'>Uptime</div>
              <div className='text-lg font-semibold text-green-400'>{formatUptime(healthData.uptime)}</div>
            </div>

            <div className='space-y-2'>
              <div className='text-sm text-gray-400'>Memory Used</div>
              <div className='text-lg font-semibold text-orange-400'>{healthData.memory.used.toFixed(2)} MB</div>
            </div>

            <div className='space-y-2'>
              <div className='text-sm text-gray-400'>Region</div>
              <div className='text-lg font-semibold text-cyan-400'>{healthData.deployment.region}</div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className='rounded-lg border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm'>
        <h3 className='mb-4 text-xl font-bold text-white'>Real-time Performance</h3>

        <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-400'>{performance.fps}</div>
            <div className='text-sm text-gray-400'>FPS</div>
          </div>

          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-400'>{performance.memory}</div>
            <div className='text-sm text-gray-400'>Memory (MB)</div>
          </div>

          <div className='text-center'>
            <div className='text-2xl font-bold text-purple-400'>{performance.latency}ms</div>
            <div className='text-sm text-gray-400'>Latency</div>
          </div>

          <div className='text-center'>
            <div className='text-2xl font-bold text-orange-400'>{performance.loadTime}s</div>
            <div className='text-sm text-gray-400'>Load Time</div>
          </div>
        </div>
      </div>

      {/* Service Health Checks */}
      {healthData && (
        <div className='rounded-lg border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm'>
          <h3 className='mb-4 text-xl font-bold text-white'>Service Health</h3>

          <div className='space-y-3'>
            {Object.entries(healthData.checks).map(([service, status]) => (
              <div key={service} className='flex items-center justify-between rounded bg-gray-800/50 p-3'>
                <span className='capitalize text-gray-300'>{service.replace('_', ' ')}</span>
                <span className={`font-semibold ${getStatusColor(status)}`}>{status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployment Information */}
      {healthData && (
        <div className='rounded-lg border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm'>
          <h3 className='mb-4 text-xl font-bold text-white'>Deployment Info</h3>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Vercel URL:</span>
              <span className='font-mono text-sm text-blue-400'>{healthData.deployment.vercel}</span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Git Commit:</span>
              <span className='font-mono text-sm text-green-400'>
                {healthData.deployment.git_commit.substring(0, 8)}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Last Updated:</span>
              <span className='text-sm text-purple-400'>{new Date(healthData.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
