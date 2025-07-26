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
  sectionId: string;
  keyframes: Keyframe3D[];
  className?: string;
}> = ({ children, sectionId, keyframes, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Transform scroll progress to animation values
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.9]
  );
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -10]);

  return (
    <motion.div
      ref={containerRef}
      className={`scroll-linked-3d ${className}`}
      style={{
        opacity,
        scale,
        y,
        rotateX,
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </motion.div>
  );
};

// Complex Parallax Section Component
export const ParallaxSection3D: React.FC<{
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  enable3D?: boolean;
}> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  enable3D = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Calculate movement based on direction and speed
  const getTransform = (direction: string, progress: MotionValue<number>) => {
    const movement = progress.get() * 100 * speed;

    switch (direction) {
      case 'up':
        return `translateY(${-movement}px)`;
      case 'down':
        return `translateY(${movement}px)`;
      case 'left':
        return `translateX(${-movement}px)`;
      case 'right':
        return `translateX(${movement}px)`;
      default:
        return `translateY(${-movement}px)`;
    }
  };

  const transform3D = enable3D
    ? useTransform(
        scrollYProgress,
        [0, 1],
        [
          `${getTransform(direction, scrollYProgress)} rotateX(0deg) rotateY(0deg)`,
          `${getTransform(direction, scrollYProgress)} rotateX(5deg) rotateY(2deg)`,
        ]
      )
    : useTransform(scrollYProgress, progress =>
        getTransform(direction, { get: () => progress } as MotionValue<number>)
      );

  return (
    <motion.div
      ref={containerRef}
      className={`parallax-section-3d ${className}`}
      style={{
        transform: transform3D,
        transformStyle: enable3D ? 'preserve-3d' : 'flat',
      }}
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
