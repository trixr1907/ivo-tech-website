'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { SparkleProps } from '../types';

interface SparkleParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  color: THREE.Color;
  size: number;
}

function SparkleSystem({
  count = 20,
  size = 0.05,
  colors = ['#00ff00', '#0080ff', '#ff0080'],
  duration = 1000,
  trigger,
}: SparkleProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesRef = useRef<SparkleParticle[]>([]);
  const { camera } = useThree();

  useEffect(() => {
    if (trigger) {
      // Neue Partikel generieren bei Trigger
      const newParticles: SparkleParticle[] = [];

      for (let i = 0; i < count; i++) {
        const particle: SparkleParticle = {
          position: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 0.5
          ),
          velocity: new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2),
          life: 1.0,
          maxLife: duration / 1000,
          color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
          size: size * (0.5 + Math.random() * 0.5),
        };
        newParticles.push(particle);
      }

      particlesRef.current = newParticles;
    }
  }, [trigger, count, size, colors, duration]);

  useFrame((state, delta) => {
    if (!pointsRef.current || particlesRef.current.length === 0) return;

    const positions = new Float32Array(particlesRef.current.length * 3);
    const colorsArray = new Float32Array(particlesRef.current.length * 3);
    const sizes = new Float32Array(particlesRef.current.length);

    // Partikel aktualisieren
    particlesRef.current = particlesRef.current.filter((particle, index) => {
      // Physik aktualisieren
      particle.velocity.multiplyScalar(0.98); // Luftwiderstand
      particle.velocity.y -= delta * 2; // Gravitation
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      particle.life -= delta / particle.maxLife;

      if (particle.life > 0) {
        const i = index * 3;
        positions[i] = particle.position.x;
        positions[i + 1] = particle.position.y;
        positions[i + 2] = particle.position.z;

        // Farbe mit Alpha basierend auf Lebensdauer
        const alpha = Math.max(0, particle.life);
        colorsArray[i] = particle.color.r * alpha;
        colorsArray[i + 1] = particle.color.g * alpha;
        colorsArray[i + 2] = particle.color.b * alpha;

        sizes[index] = particle.size * alpha;

        return true;
      }
      return false;
    });

    // Geometry aktualisieren
    if (pointsRef.current.geometry) {
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pointsRef.current.geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
      pointsRef.current.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[new Float32Array(count * 3), 3]}
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-color'
          args={[new Float32Array(count * 3), 3]}
          count={count}
          array={new Float32Array(count * 3)}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-size'
          args={[new Float32Array(count), 1]}
          count={count}
          array={new Float32Array(count)}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        alphaTest={0.01}
        size={size}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function Sparkles(props: SparkleProps) {
  return (
    <div className='pointer-events-none absolute inset-0' style={{ mixBlendMode: 'screen' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <SparkleSystem {...props} />
      </Canvas>
    </div>
  );
}
