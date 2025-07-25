'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Text,
  Box,
  Sphere,
  Torus,
  Stars,
  Float,
  Html,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { ThreeElements } from '@react-three/fiber';

// Floating Tech Orbs Component
interface TechOrbProps {
  position: [number, number, number];
  color: string;
  tech: string;
  onClick?: () => void;
}

function TechOrb({ position, color, tech, onClick }: TechOrbProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(state => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.position.y =
        position[1] + Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Mesh
        ref={mesh}
        position={position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <Sphere args={[0.5, 32, 32]} />
        <MeshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent={true}
          opacity={0.8}
        />
        {hovered && (
          <Html center>
            <div className="rounded bg-black/80 p-2 font-mono text-sm text-white backdrop-blur">
              {tech}
            </div>
          </Html>
        )}
        </Mesh>
    </Float>
  );
}

// Animated Grid Component
function AnimatedGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (gridRef.current) {
      gridRef.current.rotation.y =
        Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={gridRef}>
      {Array.from({ length: 20 }, (_, i) => (
        <Box
          key={i}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
          ]}
          args={[0.1, 0.1, 0.1]}
        >
          <MeshBasicMaterial color="#0099ff" transparent={true} opacity={0.6} />
        </Box>
      ))}
    </group>
  );
}

// DNA Helix Component
function DNAHelix() {
  const helixRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  const points: THREE.Vector3[] = [];
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI * 4;
    const x = Math.cos(angle) * 2;
    const y = (i / 100) * 10 - 5;
    const z = Math.sin(angle) * 2;
    points.push(new THREE.Vector3(x, y, z));
  }

  return (
    <group ref={helixRef} position={[8, 0, 0]}>
      {points.map((point, index) => (
        <Sphere
          key={index}
          position={[point.x, point.y, point.z]}
          args={[0.05]}
        >
          <MeshStandardMaterial
            color={new THREE.Color(`hsl(${index * 3.6}, 70%, 60%)`)}
          />
</Sphere>
      ))}
    </group>
  );
}

// Import necessary components
import { AmbientLight, PointLight, SpotLight, Mesh, MeshStandardMaterial, MeshBasicMaterial } from '@react-three/drei';

// Main Epic Scene Component
function EpicScene3D({
  onTechClick,
}: {
  onTechClick?: (tech: string) => void;
}) {
  const technologies = [
    { name: 'React', position: [-4, 2, 0], color: '#61DAFB' },
    { name: 'TypeScript', position: [4, -2, 2], color: '#3178C6' },
    { name: 'Three.js', position: [-2, -3, -2], color: '#000000' },
    { name: 'Next.js', position: [6, 1, -3], color: '#000000' },
    { name: 'Node.js', position: [-6, -1, 3], color: '#339933' },
    { name: 'Python', position: [2, 4, 1], color: '#3776AB' },
  ];

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Lighting */}
        <AmbientLight intensity={0.3} />
        <PointLight position={[10, 10, 10]} intensity={1} />
        <PointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#ff0040"
        />
        <SpotLight
          position={[15, 15, 15]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          castShadow={true}
        />

        {/* Background Stars */}
        <Stars
          radius={300}
          depth={60}
          count={1000}
          factor={7}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Tech Orbs */}
        {technologies.map((tech, index) => (
          <TechOrb
            key={index}
            position={tech.position}
            color={tech.color}
            tech={tech.name}
            onClick={() => onTechClick?.(tech.name)}
          />
        ))}

        {/* Animated Grid */}
        <AnimatedGrid />

        {/* DNA Helix */}
        <DNAHelix />

        {/* Central Torus */}
        <Float speed={1} rotationIntensity={2}>
          <Torus position={[0, 0, 0]} args={[2, 0.5, 16, 32]}>
            <MeshStandardMaterial
              color={new THREE.Color('#ff6b6b')}
              emissive={new THREE.Color('#ff6b6b')}
              emissiveIntensity={0.2}
              wireframe={true}
            />
          </Torus>
        </Float>

        {/* 3D Text */}
        <Text
          position={[0, -6, 0]}
          fontSize={1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          IVO-TECH 3D
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
        />
      </Canvas>
    </div>
  );
}

export default EpicScene3D;
