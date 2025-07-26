'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Helper to convert RGB array to CSS color string
const rgbToString = (color: [number, number, number]) => 
  `rgb(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)})`;

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
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${rgbToString(color)} ${progress * 100 - 10}%, 
            ${rgbToString(color)} ${progress * 100}%, 
            transparent 100%
          )`,
          filter: `blur(20px) brightness(${1 + intensity})`,
          mixBlendMode: 'screen',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${rgbToString(color)} ${progress * 100 - 5}%, 
            ${rgbToString(color)} ${progress * 100 + 5}%, 
            transparent 100%
          )`,
          filter: `blur(10px)`,
          opacity: 0.7,
          mixBlendMode: 'screen',
        }}
      />

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
