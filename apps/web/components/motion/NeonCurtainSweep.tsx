'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Neon Curtain Sweep Shader
const neonCurtainVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const neonCurtainFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uNeonColor;
  uniform float uIntensity;
  varying vec2 vUv;

  // Neon glow effect
  float neonGlow(float d, float intensity) {
    return 1.0 / (1.0 + d * 20.0) * intensity;
  }

  // Electric circuit pattern
  float circuitPattern(vec2 uv, float time) {
    vec2 grid = fract(uv * 8.0 + time * 0.5);
    float lines = min(
      step(0.02, grid.x) * step(grid.x, 0.98),
      step(0.02, grid.y) * step(grid.y, 0.98)
    );
    return 1.0 - lines;
  }

  void main() {
    vec2 uv = vUv;
    
    // Create sweep effect
    float sweep = smoothstep(uProgress - 0.1, uProgress + 0.1, uv.x);
    
    // Add vertical noise for organic curtain movement
    float noise = sin(uv.y * 20.0 + uTime * 5.0) * 0.05;
    float curtain = smoothstep(uProgress - 0.15 + noise, uProgress + 0.05 + noise, uv.x);
    
    // Circuit pattern overlay
    float circuit = circuitPattern(uv, uTime);
    
    // Neon edge glow
    float edge = abs(uv.x - uProgress);
    float glow = neonGlow(edge, uIntensity * 2.0);
    
    // Combine effects
    vec3 color = uNeonColor * (curtain + glow + circuit * 0.3);
    
    // Add scan lines
    float scanlines = sin(uv.y * uResolution.y * 2.0) * 0.1 + 0.9;
    color *= scanlines;
    
    // Fade out at edges
    float vignette = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x);
    
    gl_FragColor = vec4(color, curtain * vignette);
  }
`;

// 3D Curtain Component
const CurtainMesh: React.FC<{
  progress: number;
  color: [number, number, number];
  intensity: number;
}> = ({ progress, color, intensity }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: neonCurtainVertexShader,
        fragmentShader: neonCurtainFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: progress },
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
          uNeonColor: { value: color },
          uIntensity: { value: intensity },
        },
        transparent: true,
      }),
    [color, intensity, size]
  );

  useFrame(({ clock }) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = clock.elapsedTime;
      shaderMaterial.uniforms.uProgress.value = progress;
      shaderMaterial.uniforms.uIntensity.value = intensity;
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
};

// Main Neon Curtain Sweep Component
interface NeonCurtainSweepProps {
  isActive: boolean;
  direction:
    | 'left-to-right'
    | 'right-to-left'
    | 'top-to-bottom'
    | 'bottom-to-top';
  color?: [number, number, number];
  duration?: number;
  intensity?: number;
  onComplete?: () => void;
}

export const NeonCurtainSweep: React.FC<NeonCurtainSweepProps> = ({
  isActive,
  direction = 'left-to-right',
  color = [0, 1, 0.8],
  duration = 1.2,
  intensity = 1.0,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isActive && !isAnimating) {
      setIsAnimating(true);
      setProgress(0);

      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(elapsed / (duration * 1000), 1);

        setProgress(newProgress);

        if (newProgress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          onComplete?.();
          setTimeout(() => setProgress(0), 200); // Reset after completion
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isActive, duration, onComplete, isAnimating]);

  if (!isActive && progress === 0) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full w-full">
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <CurtainMesh
            progress={progress}
            color={color}
            intensity={intensity}
          />
        </Canvas>
      </div>

      {/* Additional CSS-based effect overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
        style={{
          transform: `translateX(${(progress - 0.5) * 200}%)`,
          filter: `blur(${(1 - progress) * 4}px)`,
        }}
      />
    </motion.div>
  );
};

// Hook for managing route transitions with Neon Curtain
export const useNeonRouteTransition = () => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const navigateWithCurtain = (href: string) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setPendingRoute(href);

    // Start curtain sweep
    setTimeout(() => {
      router.push(href);

      // Complete transition after curtain finishes
      setTimeout(() => {
        setIsTransitioning(false);
        setPendingRoute(null);
      }, 1400);
    }, 600); // Half-way through curtain animation
  };

  return {
    navigateWithCurtain,
    isTransitioning,
    pendingRoute,
  };
};

// Enhanced Link Component with Neon Curtain Transition
export const NeonLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  curtainColor?: [number, number, number];
}> = ({ href, children, className = '', curtainColor = [0, 1, 0.8] }) => {
  const { navigateWithCurtain, isTransitioning } = useNeonRouteTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isTransitioning) {
      navigateWithCurtain(href);
    }
  };

  return (
    <>
      <motion.a
        href={href}
        onClick={handleClick}
        className={`relative ${className}`}
        whileHover={{
          scale: 1.05,
          textShadow: '0 0 8px currentColor',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {children}

        {/* Neon underline effect */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-current"
          initial={{ width: '0%' }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            filter: 'blur(0.5px)',
            boxShadow: '0 0 4px currentColor',
          }}
        />
      </motion.a>

      <NeonCurtainSweep
        isActive={isTransitioning}
        direction="left-to-right"
        color={curtainColor}
        duration={1.2}
        intensity={1.5}
      />
    </>
  );
};
