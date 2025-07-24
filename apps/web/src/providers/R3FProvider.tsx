'use client';

import { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';

interface R3FProviderProps {
  children: ReactNode;
}

export function R3FProvider({ children }: R3FProviderProps) {
  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 0, 5],
      }}
    >
      {children}
    </Canvas>
  );
}
