'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Sphere,
  Box,
  Plane,
  OrbitControls,
  Environment,
  Html,
  Effects,
  Text,
  MeshDistortMaterial,
  ContactShadows,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Glitch,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
// import * as THREE from 'three';
import { motion } from 'framer-motion';
import { NeonButton, NeonCard, useNeonContext } from '../ui/neon-ui';

interface FloatingNeonObjectProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  distortFactor?: number;
}

function FloatingNeonObject({
  position,
  color,
  speed = 1,
  distortFactor = 0.6,
}: FloatingNeonObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { is4DMode, frequencyData } = useNeonContext();

  useFrame(state => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const audioIntensity =
      is4DMode && frequencyData
        ? Array.from(frequencyData).reduce((a, b) => a + b, 0) /
          frequencyData.length /
          255
        : 0;

    // Bewegung basierend auf Audio oder Zeit
    const intensity = 1 + audioIntensity * 2;
    meshRef.current.position.y =
      position[1] + Math.sin(time * speed) * 0.5 * intensity;
    meshRef.current.rotation.x = time * 0.3 * speed * intensity;
    meshRef.current.rotation.y = time * 0.2 * speed * intensity;

    // Skalierung bei Audio
    const baseScale = 1 + audioIntensity * 0.3;
    meshRef.current.scale.setScalar(baseScale);
  });

  return (
    <Sphere ref={meshRef} position={position} args={[1, 32, 32]}>
      <MeshDistortMaterial
        color={color}
        distort={distortFactor}
        speed={2}
        roughness={0.1}
        metalness={0.8}
      />
    </Sphere>
  );
}

function InteractiveNeonPlane() {
  const planeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { is4DMode } = useNeonContext();

  useFrame(state => {
    if (!planeRef.current || !planeRef.current.material) return;

    const time = state.clock.getElapsedTime();
    const material = planeRef.current.material as THREE.ShaderMaterial;
    if (material.uniforms && material.uniforms.uTime) {
      material.uniforms.uTime.value = time;
    }
  });

  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uHovered: { value: hovered ? 1.0 : 0.0 },
      u4DMode: { value: is4DMode ? 1.0 : 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uHovered;
      uniform float u4DMode;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // Grid-Pattern
        vec2 grid = abs(fract(uv * 20.0) - 0.5);
        float line = smoothstep(0.0, 0.1, min(grid.x, grid.y));
        
        // Neon-Glow basierend auf 4D-Modus
        float glow = 0.5 + 0.5 * sin(uTime * 2.0 + length(uv - 0.5) * 10.0);
        glow *= (1.0 + u4DMode * 2.0);
        
        // Hover-Effekt
        float hoverGlow = uHovered * (0.8 + 0.2 * sin(uTime * 5.0));
        
        vec3 neonColor = mix(
          vec3(0.0, 1.0, 1.0), 
          vec3(1.0, 0.0, 1.0), 
          0.5 + 0.5 * sin(uTime)
        );
        
        vec3 finalColor = neonColor * (line * glow + hoverGlow) * 0.8;
        
        gl_FragColor = vec4(finalColor, line * 0.6 + hoverGlow);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  return (
    <Plane
      ref={planeRef}
      args={[20, 20]}
      position={[0, -5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={shaderMaterial}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    />
  );
}

function NeonText3D() {
  const textRef = useRef<THREE.Mesh>(null);
  const { is4DMode, frequencyData } = useNeonContext();

  useFrame(state => {
    if (!textRef.current) return;

    const time = state.clock.getElapsedTime();
    const audioIntensity =
      is4DMode && frequencyData
        ? Array.from(frequencyData).reduce((a, b) => a + b, 0) /
          frequencyData.length /
          255
        : 0;

    // Audio-reaktive Farbe
    const hue = (time * 0.1 + audioIntensity * 2) % 1;
    const color = new THREE.Color().setHSL(
      hue,
      0.8,
      0.5 + audioIntensity * 0.3
    );
    (textRef.current.material as THREE.MeshStandardMaterial).color = color;

    // Audio-reaktive Skalierung
    const scale = 1 + audioIntensity * 0.5;
    textRef.current.scale.setScalar(scale);
  });

  return (
    <Text
      ref={textRef}
      position={[0, 3, 0]}
      fontSize={2}
      color="#00ffff"
      anchorX="center"
      anchorY="middle"
      font="/fonts/orbitron-black.woff"
    >
      NEON 3D
      <meshStandardMaterial
        color="#00ffff"
        emissive="#006666"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </Text>
  );
}

function NeonUI3DInterface() {
  const { camera } = useThree();
  const [showInterface, setShowInterface] = useState(false);

  return (
    <Html
      position={[5, 2, 0]}
      distanceFactor={10}
      transform
      sprite
      style={{
        transition: 'all 0.3s ease',
        opacity: showInterface ? 1 : 0.7,
        transform: `scale(${showInterface ? 1.1 : 1})`,
      }}
    >
      <div className="pointer-events-auto p-4">
        <NeonCard
          title="3D Interface"
          subtitle="Direkt im 3D-Raum"
          variant="primary"
          interactive={true}
          className="w-64"
        >
          <div className="space-y-3">
            <NeonButton
              variant="secondary"
              size="sm"
              onClick={() => setShowInterface(!showInterface)}
              sparkles={true}
            >
              {showInterface ? 'Minimieren' : 'Erweitern'}
            </NeonButton>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Kamera:</span>
                <span className="text-cyan-400">Aktiv</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Objekte:</span>
                <span className="text-green-400">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">FPS:</span>
                <span className="text-purple-400">60</span>
              </div>
            </div>
          </div>
        </NeonCard>
      </div>
    </Html>
  );
}

export function NeonEnhanced3DScene() {
  const { is4DMode, toggle4DMode } = useNeonContext();

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-2xl bg-black">
      <Canvas
        camera={{ position: [10, 5, 10], fov: 75 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#ff00ff" />
        <directionalLight
          position={[0, 10, 5]}
          intensity={0.3}
          color="#ffffff"
        />

        {/* 3D-Objekte */}
        <FloatingNeonObject position={[-3, 2, 0]} color="#00ff00" speed={0.8} />
        <FloatingNeonObject position={[3, 2, -2]} color="#0080ff" speed={1.2} />
        <FloatingNeonObject position={[0, 4, 3]} color="#ff0080" speed={1.5} />
        <FloatingNeonObject position={[-2, 1, 4]} color="#ffff00" speed={0.6} />

        {/* Interaktive Neon-Fläche */}
        <InteractiveNeonPlane />

        {/* 3D-Text */}
        <NeonText3D />

        {/* 3D-UI-Interface */}
        <NeonUI3DInterface />

        {/* Schatten */}
        <ContactShadows
          position={[0, -4.9, 0]}
          opacity={0.3}
          scale={20}
          blur={2}
          far={20}
        />

        {/* Kamera-Steuerung */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={!is4DMode}
          autoRotateSpeed={0.5}
        />

        {/* Post-Processing-Effekte - Temporarily disabled */}
        {/* Effekte werden später wieder aktiviert */}

        {/* Environment Mapping */}
        <Environment preset="night" />
      </Canvas>

      {/* 4D-Toggle Overlay */}
      <div className="absolute right-4 top-4 z-10">
        <NeonButton
          variant={is4DMode ? 'accent' : 'ghost'}
          size="sm"
          onClick={toggle4DMode}
          sparkles={is4DMode}
        >
          {is4DMode ? '4D 🎵' : '3D 👁️'}
        </NeonButton>
      </div>

      {/* Info Overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded bg-black bg-opacity-50 p-2 font-mono text-xs text-white backdrop-blur-sm"
        >
          <div className="mb-1 flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${is4DMode ? 'animate-pulse bg-pink-400' : 'bg-cyan-400'}`}
            />
            <span>{is4DMode ? '4D Audio Mode' : '3D Visual Mode'}</span>
          </div>
          <div className="text-gray-400">
            Klicken & Ziehen zum Rotieren • Scrollen zum Zoomen
          </div>
        </motion.div>
      </div>
    </div>
  );
}
