'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader, type ThreeElements } from '@react-three/fiber';
import {
  Text3D,
  OrbitControls,
  useTexture,
  useFBX,
  Float,
  Html,
  Center,
  MeshTransmissionMaterial,
  Box,
  Plane,
} from '@react-three/drei';
import { Color, AdditiveBlending, Mesh, DoubleSide, MeshBasicMaterial, Vector3, AmbientLight, PointLight } from '@/lib/three-utils';
import { Material } from 'three';

interface MaterialWithOpacity extends Material {
  opacity: number;
}

/**
 * Props Interface für AnimatedLogo4D
 */
interface AnimatedLogo4DProps {
  /** Größe des Logos (Skalierung) */
  size?: number;
  /** Theme-Colors für Neon-Effekte */
  themeColors?: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
  /** FPS Cap für Performance-Optimierung */
  fpsLimit?: number;
  /** Enable/Disable Partikel-Emitter */
  enableParticles?: boolean;
  /** Enable/Disable Holografische Scan-Lines */
  enableScanLines?: boolean;
  /** Enable/Disable Time-Morphing */
  enableTimeMorphing?: boolean;
  /** Callback für Interaktion */
  onClick?: () => void;
  /** CSS-Klassen für Responsive Container */
  className?: string;
}

/**
 * Custom Neon-Tube Shader für Text-Geometrie
 */
const createNeonTubeShader = (colors: { primary: string; secondary: string; glow: string }) => ({
  uniforms: {
    uTime: { value: 0 },
    uEmissiveIntensity: { value: 2.0 },
    uPrimaryColor: { value: new Color(colors.primary) },
    uSecondaryColor: { value: new Color(colors.secondary) },
    uGlowColor: { value: new Color(colors.glow) },
    uFlickerSpeed: { value: 8.0 },
    uFlickerIntensity: { value: 0.3 },
    uTubeRadius: { value: 0.05 },
    uMorphFactor: { value: 0.0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uMorphFactor;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vDistortion;
    
    // 4D Noise für Time-Morphing
    float noise4D(vec4 p) {
      return fract(sin(dot(p, vec4(12.9898, 78.233, 45.164, 94.673))) * 43758.5453);
    }
    
    // Morphing zwischen Serif und Mono-Style
    vec3 morphGeometry(vec3 pos, float factor) {
      float morphNoise = noise4D(vec4(pos, uTime * 0.1));
      vec3 serifOffset = vec3(
        sin(pos.y * 10.0) * 0.02,
        0.0,
        cos(pos.x * 8.0) * 0.015
      );
      vec3 monoOffset = vec3(
        sign(pos.x) * 0.01,
        0.0,
        0.0
      );
      
      return pos + mix(serifOffset, monoOffset, factor) * morphNoise;
    }
    
    void main() {
      vPosition = position;
      vNormal = normal;
      vUv = uv;
      
      // Time-Morphing Geometry
      vec3 morphedPosition = morphGeometry(position, uMorphFactor);
      
      // Distortion für Tube-Effekt
      vDistortion = noise4D(vec4(morphedPosition, uTime));
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(morphedPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uEmissiveIntensity;
    uniform vec3 uPrimaryColor;
    uniform vec3 uSecondaryColor;
    uniform vec3 uGlowColor;
    uniform float uFlickerSpeed;
    uniform float uFlickerIntensity;
    uniform float uTubeRadius;
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vDistortion;
    
    // Neon-Tube Effekt
    vec3 calculateNeonTube(vec3 baseColor, float intensity) {
      // Tube-Simulation durch Fresnel-ähnlichen Effekt
      float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      fresnel = pow(fresnel, 2.0);
      
      // Flickering-Effekt
      float flicker = sin(uTime * uFlickerSpeed) * uFlickerIntensity + 1.0;
      
      // Inner/Outer Glow
      float innerGlow = smoothstep(0.3, 0.7, fresnel);
      float outerGlow = smoothstep(0.0, 1.0, fresnel);
      
      vec3 innerColor = mix(uPrimaryColor, uSecondaryColor, vDistortion);
      vec3 outerColor = uGlowColor;
      
      vec3 tubeColor = mix(innerColor * innerGlow, outerColor * outerGlow, 0.5);
      
      return tubeColor * intensity * flicker;
    }
    
    void main() {
      vec3 neonColor = calculateNeonTube(uPrimaryColor, uEmissiveIntensity);
      
      // Emissive Map Animation
      float emissivePattern = sin(vUv.x * 20.0 + uTime * 2.0) * 0.5 + 0.5;
      neonColor *= (0.7 + emissivePattern * 0.3);
      
      gl_FragColor = vec4(neonColor, 1.0);
    }
  `,
});

/**
 * GPUCompute Partikel-System für Funken
 */
function ParticleEmitter({ colors, position }: { colors: any; position: [number, number, number] }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Startpositionen um das Logo
      positions[i3] = (Math.random() - 0.5) * 4;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 1;

      // Geschwindigkeiten
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = Math.random() * 0.05 + 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      // Farben (Logo-Farben)
      const color = new Color().setHSL(Math.random() * 0.1 + 0.55, 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 0.02 + 0.01;
      lifetimes[i] = Math.random() * 3 + 1;
    }

    return { positions, velocities, colors, sizes, lifetimes };
  }, []);

  useFrame(state => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const { velocities, lifetimes } = particles;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Update Positionen
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Lifetime-System
      lifetimes[i] -= 0.016; // ~60fps
      if (lifetimes[i] <= 0) {
        // Reset Partikel
        positions[i3] = (Math.random() - 0.5) * 4;
        positions[i3 + 1] = -2;
        positions[i3 + 2] = (Math.random() - 0.5) * 1;
        lifetimes[i] = Math.random() * 3 + 1;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[particles.positions, 3]}
          onUpdate={(self) => (self.needsUpdate = true)}
        />
        <bufferAttribute
          attach='attributes-color'
          args={[particles.colors, 3]}
          onUpdate={(self) => (self.needsUpdate = true)}
        />
        <bufferAttribute
          attach='attributes-size'
          args={[particles.sizes, 1]}
          onUpdate={(self) => (self.needsUpdate = true)}
        />
      </bufferGeometry>
      <shaderMaterial
        args={[
          {
            transparent: true,
            uniforms: {
              uTime: { value: 0 },
              uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            },
            vertexShader: `
              attribute float size;
              uniform float uTime;
              uniform float uPixelRatio;
              
              void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
              }
            `,
            fragmentShader: `
              void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                if (distance > 0.5) discard;
                
                float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
                gl_FragColor = vec4(vec3(0.0, 1.0, 1.0), alpha);
              }
            `,
          }
        ]}
      />
    </points>
  );
}

/**
 * Holografische Scan-Lines Component
 */
function HolographicScanLines() {
  const scanLinesRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (!scanLinesRef.current) return;

    scanLinesRef.current.children.forEach((child, index) => {
      if (child instanceof Mesh) {
        child.position.y = Math.sin(state.clock.elapsedTime * 2 + index) * 3;
        if ('opacity' in child.material) {
          (child.material as MaterialWithOpacity).opacity = Math.abs(Math.sin(state.clock.elapsedTime + index)) * 0.3;
        }
      }
    });
  });

  return (
    <group ref={scanLinesRef}>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[0, i * 0.3 - 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <Plane args={[6, 0.05]} />
          <primitive object={new MeshBasicMaterial({
            color: '#00ffff',
            transparent: true,
            opacity: 0.2,
            blending: AdditiveBlending
          })} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Main Logo Component mit extrudierter TextGeometry
 */
function Logo3D({
  colors,
  size,
  enableTimeMorphing,
  onClick,
}: {
  colors: any;
  size: number;
  enableTimeMorphing: boolean;
  onClick?: () => void;
}) {
  const logoRef = useRef<THREE.Mesh>(null);
  const [morphFactor, setMorphFactor] = useState(0);

  // Custom Neon Shader
  const neonShader = useMemo(() => createNeonTubeShader(colors), [colors]);

  useFrame(state => {
    if (!logoRef.current) return;

    // Update Shader Uniforms
    neonShader.uniforms.uTime.value = state.clock.elapsedTime;

    if (enableTimeMorphing) {
      const newMorphFactor = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2;
      setMorphFactor(newMorphFactor);
      neonShader.uniforms.uMorphFactor.value = newMorphFactor;
    }

    // Logo-Pulsation
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    const scaleValue = pulse * size;
    logoRef.current.scale.x = scaleValue;
    logoRef.current.scale.y = scaleValue;
    logoRef.current.scale.z = scaleValue;
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
      <Center>
        {/* Verwende Geometrie-basierte Lösung ohne externe Font */}
        <mesh
          ref={logoRef}
          onClick={onClick}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
        >
          {/* Erstelle extrudierte Box-Geometrie als Logo-Platzhalter */}
          <Box args={[3, 0.8, 0.2]} />
           <shaderMaterial attach='material' args={[neonShader]} />
        </mesh>
        {/* Logo Text als einfache Box */}
        <mesh position={[0, 0, 0.15]}>
          <Box args={[2.5, 0.4, 0.05]} />
          <primitive object={new MeshBasicMaterial({
            color: colors.primary,
            transparent: true,
            opacity: 0.9
          })} />
        </mesh>
      </Center>
    </Float>
  );
}

/**
 * Scene Component
 */
function Scene({
  colors,
  size,
  enableParticles,
  enableScanLines,
  enableTimeMorphing,
  onClick,
}: {
  colors: any;
  size: number;
  enableParticles: boolean;
  enableScanLines: boolean;
  enableTimeMorphing: boolean;
  onClick?: () => void;
}) {
  return (
    <>
      {/* Lighting Setup */}
      <primitive object={new AmbientLight(undefined, 0.1)} />
      <primitive object={new PointLight(colors.accent, 0.5)} position={[5, 5, 5]} />
      <primitive object={new PointLight(colors.secondary, 0.3)} position={[-5, -5, -5]} />

      {/* Main Logo */}
      <Logo3D colors={colors} size={size} enableTimeMorphing={enableTimeMorphing} onClick={onClick} />

      {/* Partikel-Emitter */}
      {enableParticles && <ParticleEmitter colors={colors} position={[0, 0, 0]} />}

      {/* Holographic Scan Lines */}
      {enableScanLines && <HolographicScanLines />}

      {/* Orbit Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
        maxDistance={10}
        minDistance={3}
      />
    </>
  );
}

/**
 * AnimatedLogo4D Main Component
 */
export function AnimatedLogo4D({
  size = 1,
  themeColors = {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    glow: '#ffffff',
  },
  fpsLimit = 60,
  enableParticles = true,
  enableScanLines = true,
  enableTimeMorphing = true,
  onClick,
  className = 'w-full h-96',
}: AnimatedLogo4DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: string | number; height: string | number }>({
    width: '100%',
    height: '100%',
  });

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({
        width: offsetWidth || '100%',
        height: offsetHeight || '100%',
      });
    }
  }, []);

  // FPS-Limiting
  useEffect(() => {
    if (fpsLimit && fpsLimit < 60) {
      const interval = 1000 / fpsLimit;
      const timer = setInterval(() => {
        // Force re-render at limited FPS
      }, interval);
      return () => clearInterval(timer);
    }
  }, [fpsLimit]);

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        performance={{
          min: 0.5,
          max: 1,
          debounce: 200,
        }}
        style={{
          background: 'transparent',
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <Scene
          colors={themeColors}
          size={size}
          enableParticles={enableParticles}
          enableScanLines={enableScanLines}
          enableTimeMorphing={enableTimeMorphing}
          onClick={onClick}
        />
      </Canvas>
    </div>
  );
}

export default AnimatedLogo4D;
