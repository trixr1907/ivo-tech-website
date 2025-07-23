import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';
import { useMotionSupport } from '../../lib/motion/useMotionSupport';

// Lazy-load the motion orchestrator
const MotionOrchestratorProvider = dynamic(
  () => import('./MotionOrchestrator').then(mod => mod.MotionOrchestratorProvider),
  {
    ssr: false,
    loading: () => <div className="min-h-screen w-full bg-gray-900" />
  }
);

export function DynamicMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supportsMotion = useMotionSupport();

  const motionSettings = useMemo(() => ({
    enablePageTransitions: supportsMotion,
    enableCurtainSweep: supportsMotion,
    enableScrollAnimations: supportsMotion,
    enableParallax: supportsMotion,
    transitionDuration: supportsMotion ? 1.2 : 0,
    curtainColor: [0, 1, 0.8],
    debugMode: false,
  }), [supportsMotion]);
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-gray-900" />}>
      <MotionOrchestratorProvider
        initialSettings={motionSettings}
      >
        {children}
      </MotionOrchestratorProvider>
    </Suspense>
  );
}
