'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';

interface AsteroidFieldProps {
  count?: number;
}

export function ParallaxAsteroidField({ count = 200 }: AsteroidFieldProps) {
  const asteroidRef = useRef<THREE.Group>(null);

  // Generate random asteroid positions and properties
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100, -Math.random() * 50 - 10] as [
          number,
          number,
          number,
        ],
        rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2] as [
          number,
          number,
          number,
        ],
        scale: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.01 + 0.005,
        rotationSpeed: [(Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02] as [
          number,
          number,
          number,
        ],
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (asteroidRef.current) {
      asteroidRef.current.children.forEach((child, index) => {
        const asteroid = asteroids[index];

        // Move asteroid towards camera for parallax effect
        child.position.z += asteroid.speed;

        // Reset position if asteroid passes camera
        if (child.position.z > 5) {
          child.position.z = -50;
          child.position.x = (Math.random() - 0.5) * 100;
          child.position.y = (Math.random() - 0.5) * 100;
        }

        // Rotate asteroids
        child.rotation.x += asteroid.rotationSpeed[0];
        child.rotation.y += asteroid.rotationSpeed[1];
        child.rotation.z += asteroid.rotationSpeed[2];
      });
    }
  });

  return (
    <group ref={asteroidRef}>
      <Instances limit={count} range={count}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshLambertMaterial color={0x666666} />

        {asteroids.map((asteroid, index) => (
          <Instance key={index} position={asteroid.position} rotation={asteroid.rotation} scale={asteroid.scale} />
        ))}
      </Instances>

      {/* Volumetric Fog Effect */}
      <mesh position={[0, 0, -25]} scale={[100, 100, 50]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0x111122} transparent opacity={0.1} fog={false} />
      </mesh>
    </group>
  );
}
