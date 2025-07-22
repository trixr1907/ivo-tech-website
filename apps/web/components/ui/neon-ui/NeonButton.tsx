'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useNeonContext } from './NeonProvider';
import { Sparkles } from './effects/Sparkles';
import { AnimatedGradient } from './effects/AnimatedGradient';
import { NeonButtonProps } from './types';

function ButtonLayer({
  children,
  depth,
  opacity,
  glowColor,
  variant,
  isHovered,
  isClicked,
}: {
  children: React.ReactNode;
  depth: number;
  opacity: number;
  glowColor: string;
  variant: string;
  isHovered: boolean;
  isClicked: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return ['#00ff00', '#0080ff'];
      case 'secondary':
        return ['#ff0080', '#8000ff'];
      case 'accent':
        return ['#ffff00', '#ff8000'];
      case 'ghost':
        return ['#ffffff', '#cccccc'];
      default:
        return ['#00ff00', '#0080ff'];
    }
  };

  return (
    <mesh ref={meshRef} position={[0, 0, depth]}>
      <planeGeometry args={[4, 1]} />
      <meshBasicMaterial transparent opacity={opacity} color={glowColor} />
      <Html
        center
        transform
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="relative">
          <AnimatedGradient
            colors={getVariantColors()}
            speed={isHovered ? 2 : 1}
            audioReactive={true}
            className="absolute inset-0 rounded-lg blur-sm"
          />
          <div className="relative z-10 px-6 py-3 text-lg font-bold text-white">
            {children}
          </div>
        </div>
      </Html>
    </mesh>
  );
}

export function NeonButton({
  children,
  className = '',
  disabled = false,
  glowColor = '#00ff00',
  intensity = 1,
  variant = 'primary',
  onClick,
  type = 'button',
  size = 'md',
  sparkles = true,
  tiltIntensity = 10,
  '4d': enable4D = false,
}: NeonButtonProps) {
  const { is4DMode } = useNeonContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [sparklesTrigger, setSparklesTrigger] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const handleClick = () => {
    if (disabled || !onClick) return;

    setIsClicked(true);
    setSparklesTrigger(true);
    onClick();

    setTimeout(() => {
      setIsClicked(false);
      setSparklesTrigger(false);
    }, 300);
  };

  const hoverVariants = {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      z: 0,
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.05,
      rotateX: isHovered
        ? Math.random() * tiltIntensity - tiltIntensity / 2
        : 0,
      rotateY: isHovered
        ? Math.random() * tiltIntensity - tiltIntensity / 2
        : 0,
      z: 20,
      transition: {
        duration: 0.3,
        type: 'spring' as const,
        stiffness: 400,
        damping: 10,
      },
    },
    click: {
      scale: 0.95,
      z: -10,
      transition: {
        duration: 0.1,
        type: 'spring' as const,
        stiffness: 600,
        damping: 20,
      },
    },
  };

  const isActive4D = enable4D || is4DMode;

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.button
        type={type}
        disabled={disabled}
        onClick={handleClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        variants={hoverVariants}
        initial="rest"
        animate={isClicked ? 'click' : isHovered ? 'hover' : 'rest'}
        className={`
          relative overflow-hidden rounded-lg border border-opacity-30
          ${sizeClasses[size]}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${variant === 'ghost' ? 'border-white bg-transparent' : 'border-current'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
        `}
        style={{
          borderColor: glowColor,
          boxShadow: isActive4D
            ? `0 0 ${20 * intensity}px ${glowColor}, inset 0 0 ${10 * intensity}px ${glowColor}20`
            : `0 0 ${10 * intensity}px ${glowColor}80`,
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D Layered Planes nur im 4D Modus */}
        {isActive4D && (
          <div className="absolute inset-0" style={{ height: '100px' }}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              gl={{ alpha: true, antialias: true }}
            >
              <ambientLight intensity={0.3} />
              <pointLight
                position={[0, 0, 10]}
                intensity={0.8}
                color={glowColor}
              />

              {/* Mehrere Schichten für Tiefeneffekt */}
              <ButtonLayer
                depth={0.3}
                opacity={0.6}
                glowColor={glowColor}
                variant={variant}
                isHovered={isHovered}
                isClicked={isClicked}
              >
                {children}
              </ButtonLayer>
              <ButtonLayer
                depth={0.2}
                opacity={0.4}
                glowColor={glowColor}
                variant={variant}
                isHovered={isHovered}
                isClicked={isClicked}
              >
                {children}
              </ButtonLayer>
              <ButtonLayer
                depth={0.1}
                opacity={0.2}
                glowColor={glowColor}
                variant={variant}
                isHovered={isHovered}
                isClicked={isClicked}
              >
                {children}
              </ButtonLayer>
            </Canvas>
          </div>
        )}

        {/* Standard 2D Content */}
        <div className="relative z-20">
          <AnimatedGradient
            colors={
              variant === 'primary'
                ? ['#00ff00', '#0080ff']
                : variant === 'secondary'
                  ? ['#ff0080', '#8000ff']
                  : variant === 'accent'
                    ? ['#ffff00', '#ff8000']
                    : ['#ffffff', '#cccccc']
            }
            speed={isHovered ? 2 : 1}
            audioReactive={isActive4D}
            className="absolute inset-0 rounded-lg opacity-20"
          />

          <span className="relative z-30 font-bold text-white drop-shadow-lg">
            {children}
          </span>
        </div>

        {/* Sparkles Effekt */}
        {sparkles && sparklesTrigger && (
          <Sparkles
            count={30}
            size={0.03}
            colors={[glowColor, '#ffffff', '#ff00ff']}
            duration={800}
            trigger={sparklesTrigger}
          />
        )}
      </motion.button>

      <style jsx>{`
        button:hover::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(
            45deg,
            ${glowColor}40,
            transparent,
            ${glowColor}40
          );
          border-radius: inherit;
          z-index: -1;
          animation: rotate 2s linear infinite;
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
