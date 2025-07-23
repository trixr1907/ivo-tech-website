import React from 'react';
import { LayoutProps } from '../../types/react-core-types';
import dynamic from 'next/dynamic';
import { useIsomorphicLayoutEffect } from '../../types/react-core-types';

// Dynamically import header and footer
const NavigationHeader = dynamic(() => import('../ui/NavigationHeader'), {
  ssr: true,
  loading: () => <div className="h-16 bg-gray-900" />
});

const Footer = dynamic(() => import('../ui/Footer'), {
  ssr: true,
  loading: () => <div className="h-12 bg-gray-900" />
});

// Dynamically import performance monitoring
const PerformanceDashboard = dynamic(
  () => import('../monitoring/PerformanceDashboard'),
  {
    ssr: false,
    loading: () => null
  }
);

const BaseLayout = ({
  children,
  header,
  footer,
  className,
  ...props
}: LayoutProps) => {
  useIsomorphicLayoutEffect(() => {
    // Layout-specific effects
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${className || ''}`} {...props}>
      {/* Header */}
      {header || <NavigationHeader />}

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      {footer || <Footer />}

      {/* Performance Monitoring */}
      {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
    </div>
  );
};

export default BaseLayout;
