'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useNeonContext } from './NeonProvider';
import { AnimatedGradient } from './effects/AnimatedGradient';
import { NeonModalProps } from './types';
import * as THREE from 'three';

function ModalLayer({
  children,
  depth,
  opacity,
  glowColor,
  isVisible,
}: {
  children: React.ReactNode;
  depth: number;
  opacity: number;
  glowColor: string;
  isVisible: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.01);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, depth]} visible={isVisible}>
      <planeGeometry args={[8, 6]} />
      <meshBasicMaterial transparent opacity={opacity} color={glowColor} />
      <Html
        center
        transform
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          width: '500px',
          height: '400px',
        }}
      >
        <div className='flex h-full w-full items-center justify-center'>{children}</div>
      </Html>
    </mesh>
  );
}

export function NeonModal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  showCloseButton = true,
  backdropBlur = true,
  glowColor = '#00ff00',
  intensity = 1,
  variant = 'primary',
  '4d': enable4D = false,
}: NeonModalProps) {
  const { is4DMode } = useNeonContext();
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setIsAnimating(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsAnimating(false);
      onClose();
    }, 400);
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

  const modalVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      rotateX: -15,
      z: -50,
      transition: { duration: 0.4, ease: 'easeInOut' as const },
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      z: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      scale: 0.6,
      opacity: 0,
      rotateX: 15,
      z: -100,
      transition: { duration: 0.3, ease: 'easeIn' as const },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const isActive4D = enable4D || is4DMode;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center' style={{ perspective: '1000px' }}>
      {/* Backdrop */}
      <motion.div
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-filter ${backdropBlur ? 'backdrop-blur-md' : ''}`}
        variants={backdropVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        transition={{ duration: 0.3 }}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <motion.div
        className={`relative ${className}`}
        variants={modalVariants}
        initial='hidden'
        animate={isClosing ? 'exit' : 'visible'}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3D Layered Planes im 4D Modus */}
        {isActive4D && (
          <div className='absolute inset-0' style={{ width: '600px', height: '400px', left: '-50px', top: '-50px' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: true, antialias: true }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 15]} intensity={1.2} color={glowColor} />
              <pointLight position={[-10, -10, 15]} intensity={0.6} color='#0080ff' />

              {/* Mehrere Modalebenen für Tiefeneffekt */}
              <ModalLayer depth={1.0} opacity={0.15} glowColor={glowColor} isVisible={!isClosing}>
                <div className='rounded-2xl border border-white border-opacity-10 bg-black bg-opacity-30 p-8 backdrop-blur-lg'>
                  <AnimatedGradient
                    colors={getVariantColors()}
                    speed={2}
                    audioReactive={true}
                    className='absolute inset-0 rounded-2xl opacity-20'
                  />
                </div>
              </ModalLayer>

              <ModalLayer depth={0.6} opacity={0.1} glowColor={glowColor} isVisible={!isClosing}>
                <div className='rounded-2xl bg-black bg-opacity-20 p-8'>
                  <div className='text-center text-white opacity-30'>
                    {title && <h3 className='mb-4 text-2xl font-bold'>{title}</h3>}
                  </div>
                </div>
              </ModalLayer>

              <ModalLayer depth={0.3} opacity={0.05} glowColor={glowColor} isVisible={!isClosing}>
                <div className='from-opacity-10 rounded-2xl bg-gradient-to-br from-black to-transparent p-8' />
              </ModalLayer>
            </Canvas>
          </div>
        )}

        {/* Hauptmodal */}
        <div
          className='relative max-h-[80vh] w-[500px] overflow-hidden overflow-y-auto rounded-2xl border border-opacity-30 bg-black bg-opacity-90 p-8 shadow-2xl backdrop-blur-xl'
          style={{
            borderColor: glowColor,
            boxShadow: isActive4D
              ? `0 0 ${40 * intensity}px ${glowColor}60, 
                 0 20px 60px rgba(0,0,0,0.8),
                 inset 0 0 ${30 * intensity}px ${glowColor}15`
              : `0 0 ${20 * intensity}px ${glowColor}80, 
                 0 10px 40px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Hintergrund-Gradienten */}
          <AnimatedGradient
            colors={getVariantColors()}
            speed={1}
            direction={Math.PI / 3}
            audioReactive={isActive4D}
            className='absolute inset-0 rounded-2xl opacity-5'
          />

          {/* Animated Border */}
          <div
            className='absolute inset-0 rounded-2xl opacity-40'
            style={{
              background: `conic-gradient(from 0deg, transparent, ${glowColor}60, transparent)`,
              animation: 'spin 8s linear infinite',
            }}
          />
          <div className='absolute inset-[1px] rounded-2xl bg-black bg-opacity-80' />

          {/* Close Button */}
          {showCloseButton && (
            <motion.button
              className='absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50 text-white transition-all duration-200 hover:bg-opacity-80'
              onClick={handleClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{
                boxShadow: `0 0 10px ${glowColor}60`,
              }}
            >
              <span className='text-lg font-light'>×</span>
            </motion.button>
          )}

          {/* Content */}
          <div className='relative z-10'>
            {title && (
              <motion.h3
                className='mb-6 text-center text-2xl font-bold text-white'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                style={{
                  textShadow: `0 0 20px ${glowColor}80`,
                }}
              >
                {title}
              </motion.h3>
            )}

            <motion.div
              className='text-white'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>

          {/* Glow Effect */}
          <div
            className='pointer-events-none absolute inset-0 rounded-2xl'
            style={{
              background: `radial-gradient(ellipse at center, ${glowColor}08, transparent 70%)`,
              animation: isActive4D ? 'modalPulse 3s ease-in-out infinite' : 'none',
            }}
          />
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes modalPulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}
