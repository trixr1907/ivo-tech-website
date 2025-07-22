'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

// Page Transition Variants
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    rotateX: 5,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
  out: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    rotateX: -5,
    transition: {
      duration: 0.6,
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  },
};

// Layout Transition Variants
const layoutVariants: Variants = {
  hidden: {
    opacity: 0,
    clipPath: 'inset(50% 0% 50% 0%)',
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    clipPath: 'inset(0% 50% 0% 50%)',
    transition: {
      duration: 0.8,
      ease: [0.64, 0, 0.78, 0],
    },
  },
};

// Section Animation Variants
const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
}) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        className={`min-h-screen ${className}`}
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          variants={layoutVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-10"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Section Wrapper Component
export const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}> = ({ children, className = '', id, delay = 0 }) => {
  return (
    <motion.section
      id={id}
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay }}
    >
      {children}
    </motion.section>
  );
};

// Enhanced Layout Transition Hook
export const usePageTransition = () => {
  const pathname = usePathname();

  const transitionConfig = {
    type: 'spring',
    damping: 30,
    stiffness: 100,
    mass: 0.8,
  };

  return {
    pathname,
    transitionConfig,
    isTransitioning: false, // Would be managed by context in full implementation
  };
};

// Layout ID Constants for shared element transitions
export const LAYOUT_IDS = {
  MAIN_CONTENT: 'main-content',
  HEADER: 'site-header',
  FOOTER: 'site-footer',
  NAVIGATION: 'main-navigation',
  HERO_TITLE: 'hero-title',
  CTA_BUTTON: 'primary-cta',
} as const;
