'use client';

import React from 'react';

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
  className = 'w-full h-96',
}: AnimatedLogo4DProps) {
  return (
    <div className={className}>
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-400">4D Logo temporär deaktiviert</p>
      </div>
    </div>
  );
}

export default AnimatedLogo4D;
