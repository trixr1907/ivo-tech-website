import React from 'react';
import { LayoutProps } from '../../types/react-core-types';
import BaseLayout from './BaseLayout';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '../error/ErrorBoundary';

// Dynamically import components
const MonitoringProvider = dynamic(() => import('../monitoring/MonitoringProvider'), {
  ssr: false
});

const AppLayout = ({ children, ...props }: LayoutProps) => {
  return (
    <ErrorBoundary>
      <MonitoringProvider>
        <BaseLayout {...props}>
          {/* Additional app-specific layout elements */}
          <div className="container mx-auto px-4">
            {children}
          </div>
        </BaseLayout>
      </MonitoringProvider>
    </ErrorBoundary>
  );
};

export default AppLayout;
