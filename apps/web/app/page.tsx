'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { HeroSection } from '../components/ui/HeroSection';
import { NavigationHeader } from '../components/ui/NavigationHeader';
import { AboutSection } from '../components/ui/AboutSection';
import { TechShowcase } from '../components/ui/TechShowcase';
import { CTASection } from '../components/ui/CTASection';
import { Footer } from '../components/ui/Footer';
import { LiveUpdatePanel } from '../components/ui/LiveUpdatePanel';
import { CLIInterface } from '../components/ui/CLIInterface';
import { usePerformance } from '../hooks/usePerformance';
import { ServicesSection } from '../components/ui/ServicesSection';
import { LoginModal } from '../components/ui/LoginModal';

// Dynamic imports sind temporär auskommentiert, da sie aktuell nicht verwendet werden

// Hook import (not dynamic)
// import { useMotionOrchestrator } from '../components/motion/MotionOrchestrator';

export default function HomePage() {
  const metrics = usePerformance();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // const { motionSettings } = useMotionOrchestrator();

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-900 text-white">
      {/* Background Elements - TEMPORARILY DISABLED FOR DEPLOYMENT */}
      <div className="fixed inset-0 z-0">
        {/* Temporär deaktiviert für PWA-Test */}
        {/*<ClientOnly3D>
        <ParallaxStarfield />
        <Scene3D />
      </ClientOnly3D>*/}
        <div className="h-full w-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 opacity-50"></div>
      </div>

      {/* Performance Engine - Temporarily disabled */}
      {/* <AdaptivePerformanceEngine /> */}

      {/* Grid Pattern Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-20"></div>

      {/* Live Update Panel */}
      <div className="fixed right-4 top-4 z-50">
        <LiveUpdatePanel />
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        <NavigationHeader onLoginClick={handleLoginClick} />

        <main className="relative pt-16" role="main" aria-label="Hauptinhalt">
          {/* Hero Section */}
          {/* OrchestatedSection temporarily disabled */}
          <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-radial absolute inset-0 from-blue-500/10 via-transparent to-transparent"></div>
              <HeroSection />
            </div>
          </div>

          {/* About Section */}
          {/* About Section - OrchestatedSection temporarily disabled */}
          <div className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div id="about" className="relative px-4 py-20 sm:px-6 lg:px-8">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/50 to-transparent"></div>
              <div className="relative mx-auto max-w-7xl">
                <AboutSection />
              </div>
            </div>
          </div>

          {/* Services Section */}
          {/* Services Section - OrchestatedSection temporarily disabled */}
          <div className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div id="services" className="relative px-4 py-20 sm:px-6 lg:px-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5"></div>
              <div className="relative mx-auto max-w-7xl">
                <ServicesSection />
              </div>
            </div>
          </div>

          {/* Tech Showcase */}
          <section className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
            <div className="relative mx-auto max-w-7xl">
              <TechShowcase />
            </div>
          </section>

          {/* 🚀 EPIC 3D INTERACTIVE SECTION */}
          <section id="epic-3d" className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
            <div className="relative mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
                  🚀 EPIC 3D EXPERIENCE
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-gray-300">
                  Interaktive 3D-Welten powered by WebGL und Three.js
                </p>
              </div>
              <div className="flex h-96 items-center justify-center rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                <p className="text-xl text-cyan-400">
                  🚀 3D Experience - Coming Soon!
                </p>
              </div>
            </div>
          </section>

          {/* 🎰 NO-COINER ROAST MACHINE */}
          <section
            id="game-zone"
            className="relative px-4 py-20 sm:px-6 lg:px-8"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-red-500/10 to-purple-500/10"></div>
            <div className="relative mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
                  🎰 NO-COINER ROAST MACHINE
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-gray-300">
                  3D Arcade Cabinet mit live Shader-Effekten, Roast-Engine und
                  Laser-Raptor Easter Egg! <br />
                  <span className="text-sm text-yellow-400">
                    💡 Tipp: Versuche den Konami-Code ↑↑↓↓←→←→BA
                  </span>
                </p>
              </div>
              <div className="flex justify-center">
                <div className="flex h-96 w-full max-w-4xl items-center justify-center rounded-2xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10">
                  <p className="text-xl text-orange-400">
                    🎰 Roast Machine - Coming Soon!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 💰 LIVE CRYPTO DASHBOARD */}
          <section id="crypto" className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10"></div>
            <div className="relative mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
                  💰 LIVE CRYPTO TRACKER
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-gray-300">
                  Echtzeit-Kryptowährungsdaten mit interaktiven Charts und
                  Live-Updates
                </p>
              </div>
              <div className="flex h-96 items-center justify-center rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                <p className="text-xl text-yellow-400">
                  💰 Crypto Dashboard - Coming Soon!
                </p>
              </div>
            </div>
          </section>

          {/* 🌈 NEON UI LIBRARY SHOWCASE */}
          <section id="neon-ui" className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-purple-500/10"></div>
            <div className="relative mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
                  🌈 NEON UI LIBRARY
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-gray-300">
                  3D/4D Micro-Interactions mit CSS Houdini Paint API + React
                  Three Fiber Portals
                </p>
              </div>
              {/* <NeonUIDemo /> */}
              <div className="flex h-96 items-center justify-center rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
                <p className="text-xl text-pink-400">
                  🌈 Neon UI Demo - Coming Soon!
                </p>
              </div>
            </div>
          </section>

          {/* CLI Interface */}
          <section className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/30 to-transparent"></div>
            <div className="relative mx-auto max-w-7xl">
              <CLIInterface />
            </div>
          </section>

          {/* 📊 ADVANCED 3D PERFORMANCE MONITOR */}
          <section
            id="performance"
            className="relative px-4 py-20 sm:px-6 lg:px-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-blue-500/10"></div>
            <div className="relative mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-4 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
                  📊 3D PERFORMANCE MONITOR
                </h2>
                <p className="mx-auto max-w-3xl text-xl text-gray-300">
                  Echtzeit-Analyse und Optimierung der 3D/4D Komponenten mit
                  erweiterten Metriken
                </p>
              </div>
              {/* <Advanced3DPerformanceDashboard /> */}
              <div className="flex h-96 items-center justify-center rounded-2xl border border-green-500/30 bg-gradient-to-r from-green-500/10 to-blue-500/10">
                <p className="text-xl text-green-400">
                  📊 3D Performance Monitor - Coming Soon!
                </p>
              </div>
            </div>
          </section>

          {/* Monitoring Dashboard */}
          <section className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="bg-gradient-radial absolute inset-0 from-green-500/10 via-transparent to-transparent"></div>
            <div className="relative mx-auto max-w-7xl">
              {/* <MonitoringDashboard /> */}
              <div className="flex h-64 items-center justify-center rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-500/5 to-cyan-500/5">
                <p className="text-green-400">
                  🔧 Monitoring Dashboard - Coming Soon!
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section id="contact" className="relative px-4 py-20 sm:px-6 lg:px-8">
            <div className="bg-gradient-radial absolute inset-0 from-purple-500/10 via-transparent to-transparent"></div>
            <div className="relative mx-auto max-w-7xl">
              <CTASection />
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Floating Elements */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className="font-mono text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
            <span>SYSTEM ONLINE</span>
          </div>
          <div className="mt-1 text-purple-400">
            FPS: {metrics.fps} | LATENCY: {metrics.latency}ms
          </div>
          {metrics.memory > 0 && (
            <div className="mt-1 text-green-400">MEM: {metrics.memory}MB</div>
          )}
          {metrics.loadTime > 0 && (
            <div className="mt-1 text-yellow-400">
              LOAD: {metrics.loadTime}ms
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} />

      {/* Motion Control Panel - TEMPORARILY DISABLED */}

      {/* PWA Provider für Service Worker und Installation - Temporarily disabled */}
      {/* <PWAProvider /> */}
    </div>
  );
}
