'use client';

import React, { useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Text,
  Stars,
  Float,
  Html,
  Instance,
  Instances,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Loading Fallback
function SceneLoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black/20 backdrop-blur">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400" />
      <span className="ml-4 font-mono text-cyan-400">Loading 3D Scene...</span>
    </div>
  );
}

// Optimierte Tech Orbs mit InstancedMesh
function OptimizedTechOrbs({
  technologies,
  onTechClick,
}: {
  technologies: any[];
  onTechClick?: (tech: string) => void;
}) {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Shared geometry und material für bessere Performance
  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(0.5, 16, 16),
    []
  ); // Reduzierte Segmente
  const materials = useMemo(
    () =>
      technologies.map(
        tech =>
          new THREE.MeshStandardMaterial({
            color: tech.color,
            emissive: tech.color,
            emissiveIntensity: 0.1,
            transparent: true,
            opacity: 0.8,
          })
      ),
    [technologies]
  );

  useFrame(state => {
    if (!instancedMeshRef.current) return;

    technologies.forEach((tech, index) => {
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3(...tech.position);
      position.y += Math.sin(state.clock.elapsedTime + index) * 0.2;

      const scale = hoveredIndex === index ? 1.2 : 1;
      matrix.compose(
        position,
        new THREE.Quaternion(),
        new THREE.Vector3(scale, scale, scale)
      );
      instancedMeshRef.current!.setMatrixAt(index, matrix);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  const handlePointerMove = useCallback((event: any) => {
    if (event.instanceId !== undefined) {
      setHoveredIndex(event.instanceId);
    }
  }, []);

  const handlePointerOut = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  const handleClick = useCallback(
    (event: any) => {
      if (event.instanceId !== undefined) {
        const tech = technologies[event.instanceId];
        onTechClick?.(tech.name);
      }
    },
    [technologies, onTechClick]
  );

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[sphereGeometry, materials[0], technologies.length]}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Instances werden automatisch durch die InstancedMesh gerendert */}
    </instancedMesh>
  );
}

// Optimiertes Animated Grid mit reduzierter Anzahl
function OptimizedAnimatedGrid() {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const count = 10; // Reduziert von 20 auf 10

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 0.1), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#0099ff',
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  const positions = useMemo(
    () =>
      Array.from({ length: count }, () => [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ]),
    [count]
  );

  useFrame(state => {
    if (!instancedMeshRef.current) return;

    positions.forEach((pos, index) => {
      const matrix = new THREE.Matrix4();
      const position = new THREE.Vector3(
        pos[0] + Math.sin(state.clock.elapsedTime + index) * 0.5,
        pos[1],
        pos[2]
      );
      matrix.setPosition(position);
      instancedMeshRef.current!.setMatrixAt(index, matrix);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[boxGeometry, material, count]}
    />
  );
}

// Optimierte DNA Helix mit weniger Punkten
function OptimizedDNAHelix() {
  const helixRef = useRef<THREE.Group>(null);
  const sphereCount = 50; // Reduziert von 100 auf 50

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(0.05, 8, 8),
    []
  ); // Weniger Segmente

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < sphereCount; i++) {
      const angle = (i / sphereCount) * Math.PI * 4;
      const x = Math.cos(angle) * 2;
      const y = (i / sphereCount) * 10 - 5;
      const z = Math.sin(angle) * 2;
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [sphereCount]);

  useFrame(state => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.3; // Langsamere Rotation
    }
  });

  return (
    <group ref={helixRef} position={[8, 0, 0]}>
      <Instances geometry={sphereGeometry}>
        <meshStandardMaterial />
        {points.map((point, index) => (
          <Instance
            key={index}
            position={[point.x, point.y, point.z]}
            color={`hsl(${index * (360 / sphereCount)}, 70%, 60%)`}
          />
        ))}
      </Instances>
    </group>
  );
}

// Lazy Loading für schwere 3D-Assets
const LazyAnimatedLogo4D = React.lazy(() => import('../AnimatedLogo4D'));

// Performance Monitor Hook
function usePerformanceMonitor() {
  const { gl, scene } = useThree();
  const [performance, setPerformance] = useState({ fps: 60, drawCalls: 0 });

  useFrame(() => {
    const info = gl.info;
    setPerformance({
      fps: Math.round(1 / 0.016), // Approximation
      drawCalls: info.render.calls,
    });
  });

  return performance;
}

// Hauptkomponente mit Performance-Optimierungen
function OptimizedEpicScene3D({
  onTechClick,
}: {
  onTechClick?: (tech: string) => void;
}) {
  const technologies = useMemo(
    () => [
      { name: 'React', position: [-4, 2, 0], color: '#61DAFB' },
      { name: 'TypeScript', position: [4, -2, 2], color: '#3178C6' },
      { name: 'Three.js', position: [-2, -3, -2], color: '#000000' },
      { name: 'Next.js', position: [6, 1, -3], color: '#000000' },
      { name: 'Node.js', position: [-6, -1, 3], color: '#339933' },
      { name: 'Python', position: [2, 4, 1], color: '#3776AB' },
    ],
    []
  );

  const [showAdvancedEffects, setShowAdvancedEffects] = useState(false);

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{
          antialias: false, // Deaktiviert für bessere Performance
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 1.5)]} // Begrenzte DPR
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        frameloop="demand" // Render nur bei Bedarf
      >
        <Suspense fallback={null}>
          {/* Optimierte Beleuchtung */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.3}
            color="#ff0040"
          />

          {/* Reduzierte Sterne */}
          <Stars
            radius={200}
            depth={40}
            count={500}
            factor={5}
            saturation={0}
            fade
            speed={0.3}
          />

          {/* Optimierte Komponenten */}
          <OptimizedTechOrbs
            technologies={technologies}
            onTechClick={onTechClick}
          />
          <OptimizedAnimatedGrid />
          <OptimizedDNAHelix />

          {/* Vereinfachter Torus */}
          <Float speed={0.5} rotationIntensity={1}>
            <mesh position={[0, 0, 0]}>
              <torusGeometry args={[2, 0.5, 8, 16]} /> {/* Weniger Segmente */}
              <meshStandardMaterial
                color="#ff6b6b"
                emissive="#ff6b6b"
                emissiveIntensity={0.2}
                wireframe
              />
            </mesh>
          </Float>

          {/* Optimierter Text */}
          <Text
            position={[0, -6, 0]}
            fontSize={1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/inter-bold.woff"
          >
            IVO-TECH 3D OPTIMIZED
          </Text>

          {/* Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.4}
            maxDistance={20}
            minDistance={3}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* Performance Toggle */}
      <div className="absolute right-4 top-4 rounded bg-black/80 p-2 font-mono text-xs text-white">
        <button
          onClick={() => setShowAdvancedEffects(!showAdvancedEffects)}
          className="rounded bg-cyan-600 px-2 py-1 hover:bg-cyan-700"
        >
          {showAdvancedEffects ? 'High Quality' : 'Performance Mode'}
        </button>
      </div>
    </div>
  );
}

export default OptimizedEpicScene3D;
