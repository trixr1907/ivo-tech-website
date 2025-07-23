import { ReactNode } from 'react';
import { Footer } from '../ui/Footer';
import { NavigationHeader } from '../ui/NavigationHeader';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <NavigationHeader />}
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
