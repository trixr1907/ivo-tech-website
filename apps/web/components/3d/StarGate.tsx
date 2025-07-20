'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Torus } from '@react-three/drei';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// Portal Shader Material
const PortalMaterial = shaderMaterial(
  {
    time: 0,
    depth: 1.0,
    color1: new THREE.Color(0.2, 0.6, 1.0),
    color2: new THREE.Color(0.8, 0.3, 1.0),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform float depth;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Depth-based displacement
      float wave = sin(pos.x * 3.0 + time) * sin(pos.y * 3.0 + time * 0.5);
      pos.z += wave * depth * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    
    void main() {
      vec2 uv = vUv;
      
      // Create portal effect
      float dist = distance(uv, vec2(0.5));
      float mask = smoothstep(0.5, 0.2, dist);
      
      // Animated rings
      float rings = sin((dist - time * 0.3) * 20.0) * 0.5 + 0.5;
      rings *= mask;
      
      // Color mixing
      vec3 color = mix(color1, color2, rings);
      
      // Add glow
      float glow = smoothstep(0.5, 0.0, dist);
      color += glow * 0.5;
      
      gl_FragColor = vec4(color, mask + glow * 0.5);
    }
  `
);

// Create a Portal Material component
const PortalMaterialImpl = PortalMaterial as any;

interface StarGateProps {
  position?: [number, number, number];
  scale?: number;
}

export function StarGate({ position = [0, 0, -5], scale = 1 }: StarGateProps) {
  const portalRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const innerMaterialRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.time += delta;
    }
    if (innerMaterialRef.current) {
      innerMaterialRef.current.time += delta;
    }

    if (portalRef.current) {
      portalRef.current.rotation.x += delta * 0.2;
      portalRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Outer Ring */}
      <Torus ref={portalRef} args={[2, 0.1, 16, 100]} rotation={[0, 0, 0]}>
        <PortalMaterialImpl ref={materialRef} transparent={true} side={THREE.DoubleSide} />
      </Torus>

      {/* Inner Portal Effect */}
      <mesh rotation={[0, 0, 0]}>
        <planeGeometry args={[3.5, 3.5, 32, 32]} />
        <PortalMaterialImpl ref={innerMaterialRef} transparent={true} side={THREE.DoubleSide} />
      </mesh>

      {/* Additional Rings for Depth */}
      <Torus args={[1.5, 0.05, 16, 100]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color={0x4060ff} transparent opacity={0.6} />
      </Torus>

      <Torus args={[2.5, 0.05, 16, 100]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color={0x8030ff} transparent opacity={0.4} />
      </Torus>
    </group>
  );
}
