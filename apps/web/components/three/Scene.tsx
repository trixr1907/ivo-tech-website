import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { BaseComponentProps } from '../../types/react-event-types';
import MaterialManager from './materials/MaterialManager';
import AdvancedLighting, { lightingPresets } from './lighting/AdvancedLighting';
import PostProcessing, { effectPresets } from './effects/PostProcessing';
import AdvancedRenderer, { qualityPresets } from './renderer/AdvancedRenderer';
import InteractionManager, { interactionPresets } from './interaction/InteractionManager';
import PerformanceMonitor, { performancePresets } from './performance/PerformanceMonitor';
import PhysicsSystem, { physicsPresets, createRigidBody, createStaticPlane } from './physics/PhysicsSystem';
import { MaterialProps } from '../../types/three-types';

interface SceneProps extends BaseComponentProps {
  backgroundColor?: string;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  controlsEnabled?: boolean;
  environment?: string;
  lighting?: typeof lightingPresets[keyof typeof lightingPresets];
  effects?: typeof effectPresets[keyof typeof effectPresets];
  quality?: keyof typeof qualityPresets;
  interaction?: typeof interactionPresets[keyof typeof interactionPresets];
  performance?: typeof performancePresets[keyof typeof performancePresets];
  physics?: typeof physicsPresets[keyof typeof physicsPresets];
  materials?: {
    [key: string]: MaterialProps;
  };
  onInteraction?: (event: any) => void;
  onPerformanceDrop?: (metrics: any) => void;
  onCollision?: (event: any) => void;
}

const Scene: React.FC<SceneProps> = ({
  backgroundColor = '#000000',
  cameraPosition = [0, 5, 10],
  cameraFov = 75,
  controlsEnabled = true,
  environment,
  lighting = lightingPresets.studio,
  effects = effectPresets.cinematic,
  quality = 'medium',
  interaction = interactionPresets.default,
  performance = performancePresets.balanced,
  physics = physicsPresets.default,
  materials,
  children,
  onInteraction,
  onPerformanceDrop,
  onCollision
}) => {
  const controlsRef = useRef(null);

  useEffect(() => {
    if (controlsRef.current) {
      // Additional controls setup if needed
    }
  }, []);

const [sceneMaterials, setSceneMaterials] = useState<{ [key: string]: THREE.Material }>({});

  return (
    <Canvas
      style={{ background: backgroundColor }}
      camera={{ position: cameraPosition, fov: cameraFov }}
      shadows
    >
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Controls */}
      {controlsEnabled && (
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
        />
      )}
      
      {/* Environment */}
      {environment && <Environment preset={environment} />}

      {/* Lighting */}
      <AdvancedLighting {...lighting} />

      {/* Materials */}
      {materials && (
        <MaterialManager
          materials={materials}
          onMaterialsReady={setSceneMaterials}
        />
      )}

      {/* Physics System */}
      <PhysicsSystem {...physics} onCollide={onCollision}>
        {/* Scene Content */}
        <group position={[0, 0, 0]}>
          {children}
        </group>
      </PhysicsSystem>

      {/* Post Processing */}
      <PostProcessing {...effects} />

      {/* Advanced Renderer */}
      <AdvancedRenderer {...qualityPresets[quality]} />

      {/* Interaction Manager */}
      <InteractionManager {...interaction} onClick={onInteraction} />

      {/* Performance Monitor */}
      <PerformanceMonitor {...performance} onPerformanceDrop={onPerformanceDrop} />
    </Canvas>
  );
};

export default Scene;
