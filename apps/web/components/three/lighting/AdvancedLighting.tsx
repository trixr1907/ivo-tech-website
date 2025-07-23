import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useHelper } from '@react-three/drei';

interface LightingProps {
  type?: 'basic' | 'dramatic' | 'studio' | 'outdoor' | 'custom';
  intensity?: number;
  color?: THREE.ColorRepresentation;
  position?: [number, number, number];
  target?: [number, number, number];
  castShadow?: boolean;
  showHelpers?: boolean;
  animated?: boolean;
}

const AdvancedLighting: React.FC<LightingProps> = ({
  type = 'basic',
  intensity = 1,
  color = '#ffffff',
  position = [10, 10, 10],
  target = [0, 0, 0],
  castShadow = true,
  showHelpers = false,
  animated = false
}) => {
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const { scene } = useThree();

  // Light helpers
  if (showHelpers) {
    useHelper(mainLightRef, THREE.DirectionalLightHelper, 1, 'red');
    useHelper(fillLightRef, THREE.DirectionalLightHelper, 1, 'green');
    useHelper(rimLightRef, THREE.DirectionalLightHelper, 1, 'blue');
  }

  useEffect(() => {
    if (mainLightRef.current) {
      mainLightRef.current.shadow.mapSize.width = 2048;
      mainLightRef.current.shadow.mapSize.height = 2048;
      mainLightRef.current.shadow.camera.near = 0.5;
      mainLightRef.current.shadow.camera.far = 500;
      mainLightRef.current.shadow.bias = -0.0001;
    }
  }, []);

  useFrame((state, delta) => {
    if (animated && mainLightRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Animate main light
      mainLightRef.current.position.x = Math.sin(time * 0.5) * 10;
      mainLightRef.current.position.z = Math.cos(time * 0.5) * 10;
      
      // Animate fill light
      if (fillLightRef.current) {
        fillLightRef.current.position.x = Math.sin(time * 0.3) * 8;
        fillLightRef.current.position.z = Math.cos(time * 0.3) * 8;
      }
      
      // Animate rim light
      if (rimLightRef.current) {
        rimLightRef.current.position.x = Math.sin(time * 0.4) * 12;
        rimLightRef.current.position.z = Math.cos(time * 0.4) * 12;
      }
    }
  });

  const getLightingSetup = () => {
    switch (type) {
      case 'dramatic':
        return (
          <>
            <directionalLight
              ref={mainLightRef}
              position={[5, 5, -5]}
              intensity={intensity * 1.5}
              color={color}
              castShadow={castShadow}
            />
            <directionalLight
              ref={fillLightRef}
              position={[-5, 3, 5]}
              intensity={intensity * 0.5}
              color="#4b4b4b"
            />
            <ambientLight intensity={0.2} />
          </>
        );

      case 'studio':
        return (
          <>
            <directionalLight
              ref={mainLightRef}
              position={[0, 5, 5]}
              intensity={intensity}
              color={color}
              castShadow={castShadow}
            />
            <directionalLight
              ref={fillLightRef}
              position={[-5, 3, -5]}
              intensity={intensity * 0.6}
              color="#ffffff"
            />
            <directionalLight
              ref={rimLightRef}
              position={[5, 3, -5]}
              intensity={intensity * 0.6}
              color="#ffffff"
            />
            <ambientLight intensity={0.4} />
          </>
        );

      case 'outdoor':
        return (
          <>
            <directionalLight
              ref={mainLightRef}
              position={[5, 10, 5]}
              intensity={intensity * 1.2}
              color="#ffd6aa"
              castShadow={castShadow}
            />
            <hemisphereLight
              skyColor="#80a4e6"
              groundColor="#3d2413"
              intensity={intensity * 0.6}
            />
            <ambientLight intensity={0.3} />
          </>
        );

      case 'custom':
        return (
          <>
            <directionalLight
              ref={mainLightRef}
              position={position}
              intensity={intensity}
              color={color}
              castShadow={castShadow}
            />
            {/* Custom lighting setup can be added here */}
          </>
        );

      default: // 'basic'
        return (
          <>
            <directionalLight
              ref={mainLightRef}
              position={position}
              intensity={intensity}
              color={color}
              castShadow={castShadow}
            />
            <ambientLight intensity={0.5} />
          </>
        );
    }
  };

  return getLightingSetup();
};

export default AdvancedLighting;

// Preset configurations
export const lightingPresets = {
  dramatic: {
    type: 'dramatic',
    intensity: 1.2,
    color: '#ffffff',
    position: [5, 5, -5],
    animated: false
  },
  studio: {
    type: 'studio',
    intensity: 1,
    color: '#ffffff',
    position: [0, 5, 5],
    animated: false
  },
  outdoor: {
    type: 'outdoor',
    intensity: 1.2,
    color: '#ffd6aa',
    position: [5, 10, 5],
    animated: true
  }
} as const;
