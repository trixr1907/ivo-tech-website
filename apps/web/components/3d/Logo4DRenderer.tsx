'use client';

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Effects } from './effects/Effects';
import { useMotionSupport } from '../../lib/motion/useMotionSupport';

interface Logo4DRendererProps {
  size?: number;
  themeColors: {
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

// Hauptkomponente für 3D-Rendering
export function Logo4DRenderer({
  size = 1,
  themeColors,
  fpsLimit = 60,
  enableParticles = true,
  enableScanLines = true,
  enableTimeMorphing = true,
  onClick,
  className = 'w-full h-96',
}: Logo4DRendererProps) {
  const supportsMotion = useMotionSupport();

  // Optimierte Einstellungen basierend auf Device-Fähigkeiten
  const rendererSettings = useMemo(
    () => ({
      dpr: supportsMotion ? Math.min(2, window.devicePixelRatio) : 1,
      powerPreference: 'high-performance' as const,
      antialias: supportsMotion,
      alpha: true,
      stencil: false,
      depth: true,
    }),
    [supportsMotion]
  );

  // Performance-optimierte Effekt-Einstellungen
  const effectSettings = useMemo(
    () => ({
      enableBloom: supportsMotion && enableParticles,
      enableGlow: supportsMotion,
      bloomStrength: 0.5,
      bloomRadius: 0.4,
      glowStrength: 0.3,
      fxaa: supportsMotion,
    }),
    [supportsMotion, enableParticles]
  );

  // Frame-Limiting für bessere Performance
  const frameLoop = useMemo(
    () => (fpsLimit < 60 ? 'demand' : 'always'),
    [fpsLimit]
  );

  return (
    <div className={className}>
      <Canvas
        frameloop={frameLoop}
        gl={rendererSettings}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        {/* Optimierte Beleuchtung */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* Haupt-Mesh mit Performance-Optimierungen */}
        <mesh scale={size} onClick={onClick}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={themeColors.primary}
            emissive={themeColors.glow}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Kamera-Kontrollen mit Performance-Einstellungen */}
        <OrbitControls
          enableDamping={supportsMotion}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={3}
          maxDistance={10}
        />

        {/* Post-Processing Effekte */}
        <Effects {...effectSettings} />
      </Canvas>
    </div>
  );
}

// Optimierte Export-Strategie
export default Logo4DRenderer;
