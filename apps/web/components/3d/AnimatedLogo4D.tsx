'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useMotionSupport } from '../../lib/motion/useMotionSupport';

// Dynamisch geladener Renderer
const Logo4DRenderer = dynamic(
  () => import('./Logo4DRenderer').then(mod => mod.Logo4DRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    ),
  }
);

interface AnimatedLogo4DProps {
  size?: number;
  themeColors?: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  fpsLimit?: number;
  enableParticles?: boolean;
  enableScanLines?: boolean;
  enableTimeMorphing?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AnimatedLogo4D({
  size = 1,
  themeColors = {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    glow: '#ffffff',
  },
  fpsLimit = 60,
  enableParticles = true,
  enableScanLines = true,
  enableTimeMorphing = true,
  onClick,
  className = 'w-full h-96',
}: AnimatedLogo4DProps) {
  const supportsMotion = useMotionSupport();

  // Fallback für Geräte ohne Motion-Support
  if (!supportsMotion) {
    return (
      <div className={className}>
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-400">
            3D-Effekte sind auf diesem Gerät nicht verfügbar
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        </div>
      }
    >
      <Logo4DRenderer
        size={size}
        themeColors={themeColors}
        fpsLimit={fpsLimit}
        enableParticles={enableParticles}
        enableScanLines={enableScanLines}
        enableTimeMorphing={enableTimeMorphing}
        onClick={onClick}
        className={className}
      />
    </Suspense>
  );
}

export default AnimatedLogo4D;
