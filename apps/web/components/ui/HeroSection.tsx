'use client';

import { motion } from 'framer-motion';
import { AnimatedLogo4D } from '../3d/AnimatedLogo4D';

export function HeroSection() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* 3D Logo Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedLogo4D
          className="h-full w-full"
          enableParticles={true}
          enableTimeMorphing={true}
          fpsLimit={60}
          themeColors={{
            primary: '#00ffff',
            secondary: '#ff00ff',
            accent: '#ffff00',
            glow: '#ffffff',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              IVO TECH
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-lg text-xl text-gray-300 sm:max-w-3xl"
          >
            Innovative Softwarelösungen für die digitale Zukunft
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex justify-center gap-x-6"
          >
            <a
              href="#contact"
              className="rounded-md bg-cyan-500 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              Kontakt aufnehmen
            </a>
            <a
              href="#portfolio"
              className="rounded-md border border-cyan-500 bg-transparent px-8 py-3 text-base font-semibold text-cyan-400 shadow-sm transition-colors hover:bg-cyan-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              Portfolio ansehen
            </a>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-500 to-blue-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
}

'use client';

import React, { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for 3D components to avoid SSR issues
const ImmersiveHeroSection3D = dynamic(
  () =>
    import('../3d/ImmersiveHeroSection3D').then(mod => ({
      default: mod.ImmersiveHeroSection3D,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-2 border-purple-500"></div>
          <p className="text-purple-300">Loading Portal...</p>
        </div>
      </div>
    ),
  }
);

export function HeroSection() {
  const [use3D, setUse3D] = useState(false); // Temporarily disabled for deployment

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fallback 2D version for compatibility
  const Fallback2D = () => (
    <div className="relative flex min-h-screen flex-col justify-center text-center">
      {/* Animated Background Elements */}
      <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"></div>

      {/* Terminal Window */}
      <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div className="font-mono text-sm text-gray-400">ivo@tech:~</div>
        </div>
        <div className="p-6 text-left font-mono">
          <div className="text-green-400">
            <span className="text-gray-500">$</span> whoami
          </div>
          <div className="mt-2 text-blue-400">
            Software Developer & IT Consultant
          </div>
          <div className="mt-4 text-green-400">
            <span className="text-gray-500">$</span> echo $SERVICES
          </div>
          <div className="mt-2 text-purple-400">
            "3D Portal Development | Immersive Experiences | Reality
            Transformation"
          </div>
          <div className="mt-4 flex items-center text-green-400">
            <span className="text-gray-500">$</span>
            <span className="ml-2 animate-pulse">|</span>
          </div>
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="mb-6 text-4xl font-bold md:text-7xl lg:text-8xl">
        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          IVO-TECH
        </span>
      </h1>

      {/* Subtitle */}
      <div className="mb-4 text-xl font-semibold text-purple-300 md:text-2xl">
        Transforming ideas into{' '}
        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          3D interactive experiences
        </span>
      </div>

      <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
        Enter the Portal • Experience the Future • Transform Reality
        <br />
        mit cutting-edge 3D-Technologien und immersiven Lösungen
      </p>

      {/* Tech Stack with 3D Focus */}
      <div className="mb-12 flex items-center justify-center space-x-6 overflow-hidden">
        <div className="animate-marquee flex space-x-6">
          {[
            'Three.js',
            'React',
            'WebGL',
            'TypeScript',
            'Next.js',
            'Blender',
            'GLSL',
          ].map((tech, index) => (
            <div
              key={tech}
              className="group flex items-center space-x-2 rounded-full bg-gray-800/30 px-4 py-2 transition-all hover:bg-gray-700/50"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <span className="font-mono text-sm text-gray-300 group-hover:text-white">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <button
          onClick={() => scrollToSection('services')}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all hover:-translate-y-1 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl hover:shadow-blue-500/25"
        >
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-10"></div>
          <span className="relative flex items-center justify-center space-x-2">
            <span>Enter Portal</span>
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </button>

        <button
          onClick={() => setUse3D(!use3D)}
          className="group relative overflow-hidden rounded-xl border border-purple-600 bg-transparent px-8 py-4 font-semibold text-white transition-all hover:-translate-y-1 hover:border-purple-500 hover:bg-purple-800/20"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{use3D ? 'Exit Portal' : 'Enter Portal'}</span>
          </span>
        </button>
      </div>

      {/* Live Stats */}
      <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4">
        {[
          {
            label: '3D Portals Created',
            value: '12+',
            color: 'from-green-400 to-blue-500',
          },
          {
            label: 'Immersive Experiences',
            value: '25+',
            color: 'from-blue-400 to-purple-500',
          },
          {
            label: 'Years in 3D',
            value: '3+',
            color: 'from-purple-400 to-pink-500',
          },
          {
            label: 'Reality Transformations',
            value: '∞',
            color: 'from-cyan-400 to-blue-500',
          },
        ].map((stat, index) => (
          <div key={index} className="group text-center">
            <div
              className={`bg-gradient-to-r text-2xl font-bold ${stat.color} bg-clip-text text-transparent transition-transform group-hover:scale-110`}
            >
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {use3D ? (
        <Suspense fallback={<Fallback2D />}>
          <ImmersiveHeroSection3D />
        </Suspense>
      ) : (
        <Fallback2D />
      )}
    </>
  );
}
