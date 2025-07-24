'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useNeonContext } from './NeonProvider';
import { AnimatedGradient } from './effects/AnimatedGradient';
import { NeonCardProps } from './types';

function CardLayer({
  children,
  depth,
  opacity,
  glowColor,
  isHovered,
}: {
  children: React.ReactNode;
  depth: number;
  opacity: number;
  glowColor: string;
  isHovered: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={[0, 0, depth]}>
      <planeGeometry args={[6, 4]} />
      <meshBasicMaterial
        transparent
        opacity={opacity * (isHovered ? 1.2 : 1)}
        color={glowColor}
      />
      <Html
        center
        transform
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          width: '400px',
          height: '200px',
        }}
      >
        <div className="h-full w-full">{children}</div>
      </Html>
    </mesh>
  );
}

export function NeonCard({
  children,
  className = '',
  disabled = false,
  glowColor = '#00ff00',
  intensity = 1,
  variant = 'primary',
  title,
  subtitle,
  elevation = 2,
  interactive = true,
  hoverOffset = 15,
  '4d': enable4D = false,
}: NeonCardProps) {
  const { is4DMode } = useNeonContext();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tracking für Tilt-Effekt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return ['#00ff00', '#0080ff', '#00ffff'];
      case 'secondary':
        return ['#ff0080', '#8000ff', '#ff00ff'];
      case 'accent':
        return ['#ffff00', '#ff8000', '#ffaa00'];
      case 'ghost':
        return ['#ffffff', '#cccccc', '#eeeeee'];
      default:
        return ['#00ff00', '#0080ff', '#00ffff'];
    }
  };

  const cardVariants = {
    rest: {
      scale: 1,
      z: 0,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
    hover: {
      scale: interactive ? 1.02 : 1,
      z: hoverOffset,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
        type: 'spring' as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const isActive4D = enable4D || is4DMode;

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      initial="rest"
      animate={isHovered ? 'hover' : 'rest'}
    >
      <motion.div
        className="relative"
        style={{
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D Layered Planes im 4D Modus */}
        {isActive4D && (
          <div className="absolute inset-0" style={{ height: '300px' }}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              gl={{ alpha: true, antialias: true }}
            >
              <ambientLight intensity={0.4} />
              <pointLight
                position={[5, 5, 10]}
                intensity={0.8}
                color={glowColor}
              />
              <pointLight
                position={[-5, -5, 10]}
                intensity={0.4}
                color="#0080ff"
              />

              {/* Mehrere Kartenebenen für Tiefeneffekt */}
              <CardLayer
                depth={0.5}
                opacity={0.3}
                glowColor={glowColor}
                isHovered={isHovered}
              >
                <div className="rounded-xl bg-black bg-opacity-20 p-6 backdrop-blur-sm">
                  <AnimatedGradient
                    colors={getVariantColors()}
                    speed={1.5}
                    audioReactive={true}
                    className="absolute inset-0 rounded-xl opacity-30"
                  />
                </div>
              </CardLayer>

              <CardLayer
                depth={0.3}
                opacity={0.2}
                glowColor={glowColor}
                isHovered={isHovered}
              >
                <div className="rounded-xl bg-black bg-opacity-10 p-6">
                  <div className="text-center text-white opacity-50">
                    {title && (
                      <h3 className="mb-2 text-xl font-bold">{title}</h3>
                    )}
                    {subtitle && (
                      <p className="text-sm opacity-75">{subtitle}</p>
                    )}
                  </div>
                </div>
              </CardLayer>
            </Canvas>
          </div>
        )}

        {/* Hauptkarte */}
        <div
          className={`
            relative overflow-hidden rounded-xl border border-opacity-30 bg-black
            bg-opacity-80 p-6 backdrop-blur-lg
            ${disabled ? 'opacity-50' : ''}
            ${interactive ? 'cursor-pointer' : ''}
          `}
          style={{
            borderColor: glowColor,
            boxShadow: isActive4D
              ? `0 0 ${30 * intensity}px ${glowColor}40, 
                 0 ${elevation * 5}px ${elevation * 15}px rgba(0,0,0,0.5),
                 inset 0 0 ${20 * intensity}px ${glowColor}20`
              : `0 0 ${15 * intensity}px ${glowColor}60, 
                 0 ${elevation * 2}px ${elevation * 8}px rgba(0,0,0,0.3)`,
          }}
        >
          {/* Hintergrund-Gradient */}
          <AnimatedGradient
            colors={getVariantColors()}
            speed={isHovered ? 1.5 : 0.8}
            direction={Math.PI / 4}
            audioReactive={isActive4D}
            className="absolute inset-0 rounded-xl opacity-10"
          />

          {/* Glowing Border Animation */}
          <div
            className="absolute inset-0 rounded-xl opacity-60"
            style={{
              background: `linear-gradient(45deg, transparent, ${glowColor}40, transparent)`,
              backgroundSize: '200% 200%',
              animation: isHovered
                ? 'borderFlow 2s ease-in-out infinite'
                : 'none',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {title && (
              <motion.h3
                className="mb-2 text-xl font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h3>
            )}

            {subtitle && (
              <motion.p
                className="mb-4 text-sm text-gray-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {children}
            </motion.div>
          </div>

          {/* Hover-Glow Overlay */}
          {isHovered && (
            <div
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{
                background: `radial-gradient(circle at center, ${glowColor}15, transparent 70%)`,
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          )}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes borderFlow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </motion.div>
  );
}
