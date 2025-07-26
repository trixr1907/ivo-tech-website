'use client';

import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsap';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useThree } from '@react-three/fiber';

// 3D Keyframe Configuration Interface
interface Keyframe3D {
  progress: number;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  opacity?: number;
  material?: {
    color?: string;
    emissive?: string;
    metalness?: number;
    roughness?: number;
  };
}

interface ScrollSection3D {
  id: string;
  element: string;
  keyframes: Keyframe3D[];
  easing?: string;
  duration?: number;
  markers?: boolean;
}

// Advanced ScrollTrigger Configuration
interface ScrollOrchestratorProps {
  sections: ScrollSection3D[];
  globalEasing?: string;
  refreshDelay?: number;
  enableSmoothing?: boolean;
  debugMode?: boolean;
}

// Custom Hook for 3D Scroll Animations
export const useScroll3D = (
  sectionConfig: ScrollSection3D,
  targetRef: React.RefObject<any>
) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!targetRef.current || typeof window === 'undefined') return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionConfig.element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        markers: sectionConfig.markers || false,
        refreshPriority: -1,
        onUpdate: trigger => {
          const progress = trigger.progress;

          // Find current keyframes
          const keyframes = sectionConfig.keyframes;
          let currentKeyframe: Keyframe3D | null = null;
          let nextKeyframe: Keyframe3D | null = null;

          for (let i = 0; i < keyframes.length - 1; i++) {
            if (
              progress >= keyframes[i].progress &&
              progress <= keyframes[i + 1].progress
            ) {
              currentKeyframe = keyframes[i];
              nextKeyframe = keyframes[i + 1];
              break;
            }
          }

          if (currentKeyframe && nextKeyframe && targetRef.current) {
            const localProgress =
              (progress - currentKeyframe.progress) /
              (nextKeyframe.progress - currentKeyframe.progress);

            // Interpolate 3D properties
            const position = [
              gsap.utils.interpolate(
                currentKeyframe.position[0],
                nextKeyframe.position[0],
                localProgress
              ),
              gsap.utils.interpolate(
                currentKeyframe.position[1],
                nextKeyframe.position[1],
                localProgress
              ),
              gsap.utils.interpolate(
                currentKeyframe.position[2],
                nextKeyframe.position[2],
                localProgress
              ),
            ];

            const rotation = [
              gsap.utils.interpolate(
                currentKeyframe.rotation[0],
                nextKeyframe.rotation[0],
                localProgress
              ),
              gsap.utils.interpolate(
                currentKeyframe.rotation[1],
                nextKeyframe.rotation[1],
                localProgress
              ),
              gsap.utils.interpolate(
                currentKeyframe.rotation[2],
                nextKeyframe.rotation[2],
                localProgress
              ),
            ];

            const scale = [
              gsap.utils.interpolate(
                currentKeyframe.scale[0],
                nextKeyframe.scale[0],
                localProgress
              ),
              gsap.utils.interpolate(
                currentKeyframe.scale[1],
                nextKeyframe.scale[1],
                localProgress
              ),
              gsap.utils.interpolate(
                currentKeyframe.scale[2],
                nextKeyframe.scale[2],
                localProgress
              ),
            ];

            // Apply transformations
            if (targetRef.current.position) {
              targetRef.current.position.set(...position);
            }
            if (targetRef.current.rotation) {
              targetRef.current.rotation.set(...rotation);
            }
            if (targetRef.current.scale) {
              targetRef.current.scale.set(...scale);
            }

            // Apply material changes if available
            if (nextKeyframe.material && targetRef.current.material) {
              const material = targetRef.current.material;
              if (nextKeyframe.material.color) {
                material.color.setHex(nextKeyframe.material.color);
              }
              if (nextKeyframe.material.emissive) {
                material.emissive.setHex(nextKeyframe.material.emissive);
              }
            }
          }
        },
      },
    });

    timelineRef.current = timeline;

    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.trigger === sectionConfig.element) {
          trigger.kill();
        }
      });
    };
  }, [sectionConfig, targetRef]);

  return timelineRef.current;
};

// Main ScrollOrchestrator Component
export const ScrollOrchestrator: React.FC<ScrollOrchestratorProps> = ({
  sections,
  globalEasing = 'none',
  refreshDelay = 100,
  enableSmoothing = true,
  debugMode = false,
}) => {
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);

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

    // Create master timeline
    const masterTimeline = gsap.timeline();
    masterTimelineRef.current = masterTimeline;

    // Set up section-specific scroll triggers
    sections.forEach(section => {
      const sectionTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section.element,
          start: 'top bottom-=100',
          end: 'bottom top+=100',
          scrub: 1.2,
          markers: debugMode || section.markers,
          id: section.id,
          refreshPriority: 0,
        },
      });

      // Add section timeline to master
      masterTimeline.add(sectionTimeline, section.id);
    });

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
      masterTimeline.kill();
      ScrollTrigger.killAll();
    };
  }, [sections, globalEasing, refreshDelay, enableSmoothing, debugMode]);

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
