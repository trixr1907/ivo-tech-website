'use client';

import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsap';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// Advanced ScrollTrigger Configuration
interface ScrollOrchestratorProps {
  globalEasing?: string;
  refreshDelay?: number;
  enableSmoothing?: boolean;
  debugMode?: boolean;
}

// Main ScrollOrchestrator Component
export const ScrollOrchestrator: React.FC<ScrollOrchestratorProps> = ({
  globalEasing = 'none',
  refreshDelay = 100,
  enableSmoothing = true,
  debugMode = false,
}) => {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    // Global ScrollTrigger configuration
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 0,
    });

    // Enable smooth scrolling if requested
    if (enableSmoothing) {
      ScrollTrigger.normalizeScroll(true);
    }

    // Refresh ScrollTrigger after setup
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, refreshDelay);

    // Window resize handler with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.killAll();
    };
  }, [globalEasing, refreshDelay, enableSmoothing]);

  // Provide scroll context data
  return null; // This component only sets up scroll triggers
};

// Scroll-Linked Animation Component for Individual Elements
export const ScrollLinked3D: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div
      ref={containerRef}
      className={`scroll-linked-3d ${className}`}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

// Parallax Section Component
export const ParallaxSection3D: React.FC<{
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
}> = ({ children, speed = 0.5, direction = 'up', className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up'
      ? [100 * speed, -100 * speed]
      : [-100 * speed, 100 * speed]
  );

  return (
    <motion.div
      ref={containerRef}
      className={`parallax-section ${className}`}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

// Scroll Progress Indicator
export const ScrollProgressIndicator: React.FC<{
  color?: string;
  thickness?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ color = '#00ffcc', thickness = 3, position = 'top' }) => {
  const { scrollYProgress } = useScroll();

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const positionStyles = {
    top: { top: 0, left: 0, right: 0, height: thickness },
    bottom: { bottom: 0, left: 0, right: 0, height: thickness },
    left: { left: 0, top: 0, bottom: 0, width: thickness },
    right: { right: 0, top: 0, bottom: 0, width: thickness },
  };

  return (
    <motion.div
      className="pointer-events-none fixed z-[9998]"
      style={{
        ...positionStyles[position],
        backgroundColor: color,
        scaleX: position === 'top' || position === 'bottom' ? scaleX : 1,
        scaleY: position === 'left' || position === 'right' ? scaleX : 1,
        transformOrigin:
          position === 'top' || position === 'bottom' ? 'left' : 'top',
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
    />
  );
};
