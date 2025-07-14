'use client';

import React from 'react';
import { HeroSection } from '../components/ui/HeroSection';
import { NavigationHeader } from '../components/ui/NavigationHeader';
import { AboutSection } from '../components/ui/AboutSection';
import { TechShowcase } from '../components/ui/TechShowcase';
import { CTASection } from '../components/ui/CTASection';
import { Footer } from '../components/ui/Footer';
import { LiveUpdatePanel } from '../components/ui/LiveUpdatePanel';
import { CLIInterface } from '../components/ui/CLIInterface';
import { Scene3D } from '../components/3d/Scene3D';
import { ParallaxStarfield } from '../components/3d/ParallaxStarfield';
import { usePerformance } from '../hooks/usePerformance';

export default function HomePage() {
  const metrics = usePerformance();

  return (
    <div className='relative min-h-screen overflow-hidden bg-gray-900 text-white'>
      {/* Background Elements */}
      <div className='fixed inset-0 z-0'>
        <ParallaxStarfield />
        <Scene3D />
      </div>

      {/* Grid Pattern Overlay */}
      <div className='pointer-events-none fixed inset-0 z-10 opacity-20'></div>

      {/* Live Update Panel */}
      <div className='fixed right-4 top-4 z-50'>
        <LiveUpdatePanel />
      </div>

      {/* Main Content */}
      <div className='relative z-20'>
        <NavigationHeader />

        <main className='relative pt-16'>
          {/* Hero Section */}
          <section className='relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8'>
            <div className='bg-gradient-radial absolute inset-0 from-blue-500/10 via-transparent to-transparent'></div>
            <HeroSection />
          </section>

          {/* About Section */}
          <section className='relative px-4 py-20 sm:px-6 lg:px-8'>
            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/50 to-transparent'></div>
            <div className='relative mx-auto max-w-7xl'>
              <AboutSection />
            </div>
          </section>

          {/* Tech Showcase */}
          <section className='relative px-4 py-20 sm:px-6 lg:px-8'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5'></div>
            <div className='relative mx-auto max-w-7xl'>
              <TechShowcase />
            </div>
          </section>

          {/* CLI Interface */}
          <section className='relative px-4 py-20 sm:px-6 lg:px-8'>
            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/30 to-transparent'></div>
            <div className='relative mx-auto max-w-7xl'>
              <CLIInterface />
            </div>
          </section>

          {/* CTA Section */}
          <section className='relative px-4 py-20 sm:px-6 lg:px-8'>
            <div className='bg-gradient-radial absolute inset-0 from-purple-500/10 via-transparent to-transparent'></div>
            <div className='relative mx-auto max-w-7xl'>
              <CTASection />
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Floating Elements */}
      <div className='fixed bottom-4 left-4 z-50'>
        <div className='font-mono text-xs text-gray-400'>
          <div className='flex items-center space-x-2'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500'></div>
            <span>SYSTEM ONLINE</span>
          </div>
          <div className='mt-1 text-purple-400'>
            FPS: {metrics.fps} | LATENCY: {metrics.latency}ms
          </div>
          {metrics.memory > 0 && <div className='mt-1 text-green-400'>MEM: {metrics.memory}MB</div>}
          {metrics.loadTime > 0 && <div className='mt-1 text-yellow-400'>LOAD: {metrics.loadTime}ms</div>}
        </div>
      </div>
    </div>
  );
}
