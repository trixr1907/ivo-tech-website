import React from 'react';
import { LayoutProps } from '../../types/react-core-types';
import BaseLayout from './BaseLayout';
import dynamic from 'next/dynamic';

// Dynamically import dashboard-specific components
const Sidebar = dynamic(() => import('../ui/Sidebar'), {
  ssr: true,
  loading: () => <div className="w-64 bg-gray-900" />
});

const DashboardHeader = dynamic(() => import('../ui/DashboardHeader'), {
  ssr: true,
  loading: () => <div className="h-16 bg-gray-900" />
});

interface DashboardLayoutProps extends LayoutProps {
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
}

const DashboardLayout = ({
  children,
  showSidebar = true,
  sidebarContent,
  ...props
}: DashboardLayoutProps) => {
  return (
    <BaseLayout
      header={<DashboardHeader />}
      {...props}
    >
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {showSidebar && (
          <aside className="w-64 bg-gray-900">
            {sidebarContent || <Sidebar />}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </BaseLayout>
  );
};

export default DashboardLayout;
