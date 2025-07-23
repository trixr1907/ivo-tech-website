'use client';

// @ts-ignore
import { useState, useEffect } from 'react';

interface ClientOnly3DProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly3D({
  children,
  fallback = null,
}: ClientOnly3DProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
