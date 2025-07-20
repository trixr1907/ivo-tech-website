'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Environment, Stars, PerspectiveCamera, Float } from '@react-three/drei';
import * as THREE from 'three';
import { StarGate } from './StarGate';
import { ParallaxAsteroidField } from './ParallaxAsteroidField';
import { FloatingCTAButton } from './FloatingCTAButton';

// Camera Controller for dolly-in effect
function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (cameraRef.current && scroll) {
      const scrollOffset = scroll.offset;
      // Dolly-in effect: move camera closer to the portal as user scrolls
      cameraRef.current.position.z = 5 - scrollOffset * 8;
      cameraRef.current.position.y = scrollOffset * 2;

      // Slight rotation for cinematic effect
      cameraRef.current.rotation.x = scrollOffset * 0.2;
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} fov={75} />;
}

// Animated Text Component
interface AnimatedHeroTextProps {
  scrollOffset: number;
}

function AnimatedHeroText({ scrollOffset }: AnimatedHeroTextProps) {
  return (
    <div
      className='pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center'
      style={{
        transform: `translateY(${scrollOffset * 100}px)`,
        opacity: Math.max(0, 1 - scrollOffset * 2),
      }}
    >
      <h1 className='mb-6 text-4xl font-bold md:text-7xl lg:text-8xl'>
        <span className='bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent'>
          IVO-TECH
        </span>
      </h1>

      <div className='mb-4 text-xl font-semibold text-purple-300 md:text-2xl'>
        Transforming ideas into{' '}
        <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>
          3D interactive experiences
        </span>
      </div>

      <p className='mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl'>
        Enter the Portal • Experience the Future • Transform Reality
        <br />
        mit cutting-edge 3D-Technologien und immersiven Lösungen
      </p>
    </div>
  );
}

// ScrollBased Text Component
function ScrollBasedText() {
  const scroll = useScroll();
  const scrollOffset = scroll?.offset || 0;

  return <AnimatedHeroText scrollOffset={scrollOffset} />;
}

// Scene Content
function SceneContent() {
  const scroll = useScroll();
  const scrollOffset = scroll?.offset || 0;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} color={0x4060ff} intensity={0.5} />

      {/* Environment and Stars */}
      <Environment preset='night' />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Main Star Gate Portal */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <StarGate position={[0, 0, -5]} scale={1 + scrollOffset * 0.5} />
      </Float>

      {/* Parallax Asteroid Field */}
      <ParallaxAsteroidField count={150} />

      {/* 3D CTA Buttons */}
      <FloatingCTAButton text='ENTER PORTAL' position={[0, -3, 2]} onClick={() => scrollToSection('services')} />

      <FloatingCTAButton text='CONTACT' position={[4, -3.5, 1]} onClick={() => scrollToSection('contact')} />

      {/* Volumetric Fog */}
      <mesh position={[0, 0, -10]} scale={[50, 50, 20]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0x000033} transparent opacity={0.05} fog={false} />
      </mesh>
    </>
  );
}

interface ImmersiveHeroSection3DProps {
  className?: string;
}

export function ImmersiveHeroSection3D({ className = '' }: ImmersiveHeroSection3DProps) {
  return (
    <div className={`relative h-screen overflow-hidden ${className}`}>
      <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]} style={{ position: 'absolute', inset: 0 }}>
        <fog attach='fog' args={['#000011', 10, 50]} />

        <ScrollControls pages={3} damping={0.25}>
          <CameraController />

          <Scroll>
            <Suspense fallback={null}>
              <SceneContent />
            </Suspense>
          </Scroll>

          <Scroll html style={{ width: '100%' }}>
            <div className='h-[300vh]'>
              <ScrollBasedText />
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>

      {/* Fallback content for browsers without WebGL */}
      <noscript>
        <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black'>
          <div className='text-center'>
            <h1 className='mb-4 text-6xl font-bold text-white'>IVO-TECH</h1>
            <p className='text-xl text-gray-300'>Transforming ideas into interactive digital experiences</p>
          </div>
        </div>
      </noscript>
    </div>
  );
}
