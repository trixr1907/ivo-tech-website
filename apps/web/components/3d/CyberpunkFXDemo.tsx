'use client';

import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus, Plane, Float, Text3D } from '@react-three/drei';
import * as THREE from 'three';
import { SceneProvider, EnvironmentPresetComponent, CyberpunkPresets, ENVIRONMENT_PRESETS_KEYS } from './cyberpunk-fx';

/**
 * Interactive Cyberpunk Objects mit verschiedenen Shader-Effekten
 */
function CyberpunkObjects() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Neon Wireframe Torus */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Torus position={[-6, 2, 0]} args={[2, 0.5, 16, 32]}>
          <CyberpunkPresets.NeonWireframe />
        </Torus>
      </Float>

      {/* Hologram Grid Plane */}
      <Plane position={[0, 0, -5]} args={[8, 8]} rotation={[0, 0, 0]}>
        <CyberpunkPresets.HologramGrid />
      </Plane>

      {/* Liquid Metal Sphere */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Sphere position={[6, -1, 2]} args={[1.5, 32, 32]}>
          <CyberpunkPresets.LiquidMetal />
        </Sphere>
      </Float>

      {/* Datastream Flow Boxes */}
      {Array.from({ length: 5 }, (_, i) => (
        <Box key={i} position={[-4 + i * 2, -3, 3]} args={[1, 3, 0.2]}>
          <CyberpunkPresets.DatastreamFlow />
        </Box>
      ))}

      {/* Time Warp Noise Geometry */}
      <mesh position={[0, 4, 0]}>
        <icosahedronGeometry args={[1.5, 2]} />
        <CyberpunkPresets.TimeWarpNoise />
      </mesh>

      {/* Audio Color Shift Background Plane */}
      <Plane position={[0, 0, 8]} args={[20, 12]} rotation={[0, Math.PI, 0]}>
        <CyberpunkPresets.AudioColorShift />
      </Plane>
    </group>
  );
}

/**
 * Environment Control Panel
 */
interface ControlPanelProps {
  currentEnvironment: 'city-night' | 'space-tunnel' | 'retro-arcade';
  onEnvironmentChange: (env: 'city-night' | 'space-tunnel' | 'retro-arcade') => void;
}

function ControlPanel({ currentEnvironment, onEnvironmentChange }: ControlPanelProps) {
  const environmentNames = {
    [ENVIRONMENT_PRESETS_KEYS.CITY_NIGHT]: 'Cyberpunk City',
    [ENVIRONMENT_PRESETS_KEYS.SPACE_TUNNEL]: 'Space Tunnel',
    [ENVIRONMENT_PRESETS_KEYS.RETRO_ARCADE]: 'Retro Arcade',
  };

  return (
    <div className='absolute left-4 top-4 z-10 rounded-lg bg-black/80 p-4 text-white backdrop-blur-md'>
      <h3 className='mb-4 text-lg font-bold text-cyan-400'>🎮 Cyberpunk FX Demo</h3>

      <div className='mb-4'>
        <h4 className='mb-2 text-sm font-semibold text-purple-300'>Environment:</h4>
        <div className='space-y-2'>
          {Object.entries(ENVIRONMENT_PRESETS_KEYS).map(([key, value]) => (
            <button
              key={key}
              onClick={() => onEnvironmentChange(value as 'city-night' | 'space-tunnel' | 'retro-arcade')}
              className={`block w-full rounded px-3 py-1 text-left text-sm transition-colors ${
                currentEnvironment === value
                  ? 'bg-cyan-500 font-semibold text-black'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {environmentNames[value]}
            </button>
          ))}
        </div>
      </div>

      <div className='text-xs text-gray-400'>
        <p>
          <strong>🎨 Features:</strong>
        </p>
        <ul className='mt-1 space-y-1 text-xs'>
          <li>• 4D Audio-Reactive Shaders</li>
          <li>• Volumetric Light & God Rays</li>
          <li>• Post-Processing Pipeline</li>
          <li>• Time-Warp Noise Effects</li>
          <li>• Neon & Hologram Materials</li>
        </ul>
      </div>

      <div className='mt-4 text-xs text-yellow-300'>
        <p>
          🎧 <strong>Tipp:</strong> Aktiviere das Mikrofon für Audio-Reaktivität!
        </p>
      </div>
    </div>
  );
}

/**
 * Performance Stats Display
 */
function PerformanceStats() {
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(0);

  useFrame(state => {
    setFps(Math.round(1 / state.clock.getDelta()));
    setDrawCalls(state.gl.info.render.calls);
  });

  return (
    <div className='absolute right-4 top-4 z-10 rounded-lg bg-black/80 p-3 text-sm text-white backdrop-blur-md'>
      <div className='space-y-1'>
        <div className={`${fps > 45 ? 'text-green-400' : fps > 30 ? 'text-yellow-400' : 'text-red-400'}`}>
          FPS: {fps}
        </div>
        <div className='text-gray-300'>Draw Calls: {drawCalls}</div>
      </div>
    </div>
  );
}

/**
 * Cyberpunk FX Demo Scene
 */
export function CyberpunkFXDemo() {
  const [environment, setEnvironment] = useState<'city-night' | 'space-tunnel' | 'retro-arcade'>(
    ENVIRONMENT_PRESETS_KEYS.CITY_NIGHT
  );

  return (
    <div className='relative h-screen w-full bg-black'>
      <ControlPanel currentEnvironment={environment} onEnvironmentChange={setEnvironment} />
      <PerformanceStats />

      <Canvas
        camera={{ position: [0, 2, 12], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          precision: 'highp',
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <SceneProvider enableAudio={true} initialPreset={environment}>
          <EnvironmentPresetComponent preset={environment}>
            {/* Main Cyberpunk Objects */}
            <CyberpunkObjects />

            {/* 3D Title Text */}
            <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
              <Text3D
                position={[0, -6, 0]}
                size={1}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                font='/fonts/helvetiker_regular.typeface.json'
              >
                CYBERPUNK FX 2.0
                <CyberpunkPresets.AudioColorShift />
              </Text3D>
            </Float>

            {/* Interactive Camera Controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              zoomSpeed={0.6}
              panSpeed={0.5}
              rotateSpeed={0.4}
              maxDistance={30}
              minDistance={5}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 6}
            />
          </EnvironmentPresetComponent>
        </SceneProvider>
      </Canvas>

      {/* Instructions Overlay */}
      <div className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform rounded-lg bg-black/80 px-4 py-2 text-sm text-white backdrop-blur-md'>
        <p className='text-center'>
          <span className='text-cyan-400'>🖱️ Drag</span> to rotate •<span className='text-purple-300'> 🖱️ Scroll</span>{' '}
          to zoom •<span className='text-yellow-300'> ⌨️ Switch</span> environments
        </p>
      </div>
    </div>
  );
}

export default CyberpunkFXDemo;
