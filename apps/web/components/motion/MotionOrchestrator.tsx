'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PageTransition, AnimatedSection } from './PageTransition';
import { NeonCurtainSweep, useNeonRouteTransition } from './NeonCurtainSweep';
import { ScrollOrchestrator, ScrollLinked3D, ParallaxSection3D, ScrollProgressIndicator } from './ScrollOrchestrator';

// Motion Orchestrator Context
interface MotionOrchestratorContext {
  isTransitioning: boolean;
  currentRoute: string;
  transitionType: 'page' | 'curtain' | 'scroll';
  motionSettings: MotionSettings;
  updateMotionSettings: (settings: Partial<MotionSettings>) => void;
  triggerPageTransition: (route: string, type?: 'page' | 'curtain') => void;
}

interface MotionSettings {
  enablePageTransitions: boolean;
  enableCurtainSweep: boolean;
  enableScrollAnimations: boolean;
  enableParallax: boolean;
  transitionDuration: number;
  curtainColor: [number, number, number];
  debugMode: boolean;
  reducedMotion: boolean;
}

const defaultMotionSettings: MotionSettings = {
  enablePageTransitions: true,
  enableCurtainSweep: true,
  enableScrollAnimations: true,
  enableParallax: true,
  transitionDuration: 1.2,
  curtainColor: [0, 1, 0.8],
  debugMode: false,
  reducedMotion: false,
};

const MotionContext = createContext<MotionOrchestratorContext>({
  isTransitioning: false,
  currentRoute: '',
  transitionType: 'page',
  motionSettings: defaultMotionSettings,
  updateMotionSettings: () => {},
  triggerPageTransition: () => {},
});

// Main Motion Orchestrator Provider
export const MotionOrchestratorProvider: React.FC<{
  children: React.ReactNode;
  initialSettings?: Partial<MotionSettings>;
}> = ({ children, initialSettings = {} }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<'page' | 'curtain' | 'scroll'>('page');
  const [motionSettings, setMotionSettings] = useState<MotionSettings>({
    ...defaultMotionSettings,
    ...initialSettings,
  });

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionSettings(prev => ({
      ...prev,
      reducedMotion: mediaQuery.matches,
    }));

    const handleChange = (e: MediaQueryListEvent) => {
      setMotionSettings(prev => ({
        ...prev,
        reducedMotion: e.matches,
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updateMotionSettings = useCallback((settings: Partial<MotionSettings>) => {
    setMotionSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const triggerPageTransition = useCallback(
    (route: string, type: 'page' | 'curtain' = 'page') => {
      if (isTransitioning || motionSettings.reducedMotion) return;

      setIsTransitioning(true);
      setTransitionType(type);

      const duration = motionSettings.transitionDuration * 1000;
      setTimeout(() => {
        setIsTransitioning(false);
      }, duration);
    },
    [isTransitioning, motionSettings.reducedMotion, motionSettings.transitionDuration]
  );

  const contextValue: MotionOrchestratorContext = {
    isTransitioning,
    currentRoute: pathname,
    transitionType,
    motionSettings,
    updateMotionSettings,
    triggerPageTransition,
  };

  // 3D Section Configurations for ScrollTrigger
  const scrollSections = [
    {
      id: 'hero',
      element: '#hero',
      keyframes: [
        {
          progress: 0,
          position: [0, 0, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
          opacity: 1,
        },
        {
          progress: 1,
          position: [0, -2, -1] as [number, number, number],
          rotation: [0.2, 0, 0] as [number, number, number],
          scale: [0.9, 0.9, 0.9] as [number, number, number],
          opacity: 0.8,
        },
      ],
    },
    {
      id: 'about',
      element: '#about',
      keyframes: [
        {
          progress: 0,
          position: [2, 0, 0] as [number, number, number],
          rotation: [0, -0.3, 0] as [number, number, number],
          scale: [0.8, 0.8, 0.8] as [number, number, number],
          opacity: 0,
        },
        {
          progress: 0.5,
          position: [0, 0, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
          opacity: 1,
        },
        {
          progress: 1,
          position: [-1, 0, -0.5] as [number, number, number],
          rotation: [0, 0.2, 0] as [number, number, number],
          scale: [0.95, 0.95, 0.95] as [number, number, number],
          opacity: 0.9,
        },
      ],
    },
    {
      id: 'services',
      element: '#services',
      keyframes: [
        {
          progress: 0,
          position: [0, 3, 0] as [number, number, number],
          rotation: [-0.5, 0, 0] as [number, number, number],
          scale: [0.7, 0.7, 0.7] as [number, number, number],
          opacity: 0,
        },
        {
          progress: 0.3,
          position: [0, 0, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
          opacity: 1,
        },
        {
          progress: 1,
          position: [0, -1, 0.5] as [number, number, number],
          rotation: [0.1, 0, 0] as [number, number, number],
          scale: [1.05, 1.05, 1.05] as [number, number, number],
          opacity: 1,
        },
      ],
    },
  ];

  return (
    <MotionContext.Provider value={contextValue}>
      {/* Reduced Motion Fallback */}
      {motionSettings.reducedMotion ? (
        <div className='motion-reduced'>{children}</div>
      ) : (
        <>
          {/* Global Scroll Orchestrator */}
          {motionSettings.enableScrollAnimations && (
            <ScrollOrchestrator sections={scrollSections} debugMode={motionSettings.debugMode} enableSmoothing={true} />
          )}

          {/* Scroll Progress Indicator */}
          <ScrollProgressIndicator color='#00ffcc' thickness={2} position='top' />

          {/* Page Transitions */}
          {motionSettings.enablePageTransitions ? <PageTransition>{children}</PageTransition> : children}

          {/* Neon Curtain Sweep */}
          {motionSettings.enableCurtainSweep && (
            <NeonCurtainSweep
              isActive={isTransitioning && transitionType === 'curtain'}
              direction='left-to-right'
              color={motionSettings.curtainColor}
              duration={motionSettings.transitionDuration}
              intensity={1.5}
            />
          )}
        </>
      )}
    </MotionContext.Provider>
  );
};

// Hook to use Motion Orchestrator
export const useMotionOrchestrator = () => {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error('useMotionOrchestrator must be used within a MotionOrchestratorProvider');
  }
  return context;
};

// Enhanced Section Component with Motion Orchestration
export const OrchestatedSection: React.FC<{
  children: React.ReactNode;
  id: string;
  className?: string;
  enableParallax?: boolean;
  parallaxSpeed?: number;
  enable3D?: boolean;
  delayAnimation?: number;
}> = ({
  children,
  id,
  className = '',
  enableParallax = true,
  parallaxSpeed = 0.5,
  enable3D = true,
  delayAnimation = 0,
}) => {
  const { motionSettings } = useMotionOrchestrator();

  if (motionSettings.reducedMotion) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <AnimatedSection id={id} className={className} delay={delayAnimation}>
      {enableParallax && motionSettings.enableParallax ? (
        <ParallaxSection3D speed={parallaxSpeed} enable3D={enable3D} className='h-full'>
          {children}
        </ParallaxSection3D>
      ) : (
        children
      )}
    </AnimatedSection>
  );
};

// Motion Control Panel (Development/Admin)
export const MotionControlPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { motionSettings, updateMotionSettings } = useMotionOrchestrator();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className='w-full max-w-md rounded-xl border border-cyan-500/30 bg-gray-900 p-6'
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <h3 className='mb-4 text-xl font-bold text-cyan-400'>🎭 Motion Control Panel</h3>

          <div className='space-y-4'>
            <label className='flex items-center justify-between'>
              <span className='text-gray-300'>Page Transitions</span>
              <input
                type='checkbox'
                checked={motionSettings.enablePageTransitions}
                onChange={e => updateMotionSettings({ enablePageTransitions: e.target.checked })}
                className='h-4 w-4 text-cyan-600'
              />
            </label>

            <label className='flex items-center justify-between'>
              <span className='text-gray-300'>Curtain Sweep</span>
              <input
                type='checkbox'
                checked={motionSettings.enableCurtainSweep}
                onChange={e => updateMotionSettings({ enableCurtainSweep: e.target.checked })}
                className='h-4 w-4 text-cyan-600'
              />
            </label>

            <label className='flex items-center justify-between'>
              <span className='text-gray-300'>Scroll Animations</span>
              <input
                type='checkbox'
                checked={motionSettings.enableScrollAnimations}
                onChange={e => updateMotionSettings({ enableScrollAnimations: e.target.checked })}
                className='h-4 w-4 text-cyan-600'
              />
            </label>

            <label className='flex items-center justify-between'>
              <span className='text-gray-300'>Parallax Effects</span>
              <input
                type='checkbox'
                checked={motionSettings.enableParallax}
                onChange={e => updateMotionSettings({ enableParallax: e.target.checked })}
                className='h-4 w-4 text-cyan-600'
              />
            </label>

            <label className='flex items-center justify-between'>
              <span className='text-gray-300'>Debug Mode</span>
              <input
                type='checkbox'
                checked={motionSettings.debugMode}
                onChange={e => updateMotionSettings({ debugMode: e.target.checked })}
                className='h-4 w-4 text-cyan-600'
              />
            </label>

            <div>
              <label className='mb-2 block text-gray-300'>
                Transition Duration: {motionSettings.transitionDuration}s
              </label>
              <input
                type='range'
                min='0.5'
                max='3'
                step='0.1'
                value={motionSettings.transitionDuration}
                onChange={e => updateMotionSettings({ transitionDuration: parseFloat(e.target.value) })}
                className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700'
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className='mt-6 w-full rounded bg-cyan-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-cyan-700'
          >
            Close Panel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
