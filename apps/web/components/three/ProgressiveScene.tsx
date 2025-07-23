'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useOptimizedAssets } from '../../hooks/useOptimizedAssets';

// Basis-Fallback für nicht-3D Geräte
const BasicFallback: React.FC = () => (
  <div className="flex h-full items-center justify-center bg-gray-900/50 p-8 text-center">
    <div>
      <div className="mb-4 text-4xl">🎮</div>
      <h3 className="mb-2 text-xl font-bold text-cyan-400">
        Epic 3D Experience
      </h3>
      <p className="text-sm text-gray-300">
        Eine optimierte Version wird für Ihr Gerät geladen...
      </p>
    </div>
  </div>
);

// Einfache Version für Low-End Geräte
const SimplifiedScene: React.FC = () => {
  const { load } = useOptimizedAssets('/models/simple-scene.glb', {
    quality: {
      resolution: 'low',
      textureCompression: 'jpg',
      geometryCompression: true,
    },
    progressive: true,
  });

  const model = load('/models/simple-scene.glb');

  return <primitive object={model.scene} />;
};

// Volle Version für High-End Geräte
const FullScene: React.FC = () => {
  const { load } = useOptimizedAssets('/models/epic-scene.glb', {
    progressive: true,
    cached: true,
  });

  const model = load('/models/epic-scene.glb');

  return <primitive object={model.scene} />;
};

// Loading-Indikator
const LoadingIndicator: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="rounded-lg bg-gray-900/80 p-4 text-center">
      <div className="mb-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
      <p className="text-sm text-cyan-400">Lade 3D Experience...</p>
    </div>
  </div>
);

// Progressive Scene mit verschiedenen Qualitätsstufen
export const ProgressiveScene: React.FC<{
  quality?: 'low' | 'high';
  enableEffects?: boolean;
}> = ({ quality = 'high', enableEffects = true }) => {
  const [deviceSupports3D, setDeviceSupports3D] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prüfe 3D-Unterstützung
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    setDeviceSupports3D(!!gl);

    // Simulated Loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!deviceSupports3D) {
    return <BasicFallback />;
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && <LoadingIndicator />}

      <Canvas
        camera={{ position: [0, 0, 5] }}
        shadows={enableEffects}
        dpr={quality === 'high' ? [1, 2] : 1}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
          {quality === 'high' ? <FullScene /> : <SimplifiedScene />}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ProgressiveScene;
