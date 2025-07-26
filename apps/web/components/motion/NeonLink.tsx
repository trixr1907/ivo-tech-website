'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Enhanced Link Component with Neon Effect
export const NeonLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
  color?: string;
}> = ({ href, children, className = '', color = '#00ffcc' }) => {
  const router = useRouter();

  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        className={`group relative ${className}`}
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 w-full origin-left transform scale-x-0 transition-transform group-hover:scale-x-100"
          style={{
            backgroundColor: color,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 4px ${color}`,
          }}
          initial={false}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </motion.a>
    </Link>
  );
};
