'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface SVGLogoFallbackProps {
  /** Größe des SVG-Logos */
  size?: number;
  /** CSS-Klassen */
  className?: string;
  /** Animationen aktivieren (wenn motion erlaubt) */
  enableAnimations?: boolean;
  /** Klick-Handler */
  onClick?: () => void;
  /** Theme-Farben */
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
  };
}

/**
 * SVG-Logo-Fallback-Komponente für bessere Accessibility
 * Wird bei prefers-reduced-motion: reduce oder schwacher Hardware verwendet
 */
export function SVGLogoFallback({
  size = 200,
  className = '',
  enableAnimations = true,
  onClick,
  colors = {
    primary: '#00ffff',
    secondary: '#ff00ff',
    accent: '#ffff00',
    glow: '#ffffff',
  },
}: SVGLogoFallbackProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Media Query für reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Animation nur wenn erwünscht und erlaubt
  useEffect(() => {
    setShouldAnimate(enableAnimations && !prefersReducedMotion);
  }, [enableAnimations, prefersReducedMotion]);

  return (
    <div
      className={cn(
        'flex cursor-pointer items-center justify-center transition-transform duration-300',
        shouldAnimate && 'hover:scale-105',
        className
      )}
      onClick={onClick}
      role="img"
      aria-label="IVO-TECH Logo"
      style={{ width: size, height: size * 0.6 }}
    >
      <svg
        width={size}
        height={size * 0.6}
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Definiere Gradients und Filter */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
            <stop offset="50%" stopColor={colors.secondary} stopOpacity="1" />
            <stop offset="100%" stopColor={colors.accent} stopOpacity="1" />
          </linearGradient>

          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.glow} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0.4" />
          </linearGradient>

          {/* Nur animieren wenn erlaubt */}
          {shouldAnimate && (
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
              <animateTransform
                attributeName="stdDeviation"
                values="2;4;2"
                dur="2s"
                repeatCount="indefinite"
              />
            </filter>
          )}

          {!shouldAnimate && (
            <filter
              id="staticGlow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Hintergrund-Glow */}
        <rect
          x="20"
          y="20"
          width="360"
          height="200"
          rx="20"
          fill="url(#glowGradient)"
          opacity="0.1"
          filter={shouldAnimate ? 'url(#glow)' : 'url(#staticGlow)'}
        />

        {/* Haupt-Logo-Container */}
        <rect
          x="30"
          y="30"
          width="340"
          height="180"
          rx="15"
          fill="none"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          className={shouldAnimate ? 'animate-pulse' : ''}
        />

        {/* IVO-TECH Text */}
        <g transform="translate(50, 80)">
          {/* I */}
          <rect x="0" y="0" width="8" height="80" fill="url(#logoGradient)" />
          <rect x="-5" y="0" width="18" height="8" fill="url(#logoGradient)" />
          <rect x="-5" y="72" width="18" height="8" fill="url(#logoGradient)" />

          {/* V */}
          <polygon points="30,0 38,0 55,72 47,72" fill="url(#logoGradient)" />
          <polygon points="62,0 70,0 53,72 45,72" fill="url(#logoGradient)" />

          {/* O */}
          <rect x="85" y="0" width="35" height="8" fill="url(#logoGradient)" />
          <rect x="85" y="72" width="35" height="8" fill="url(#logoGradient)" />
          <rect x="85" y="0" width="8" height="80" fill="url(#logoGradient)" />
          <rect x="112" y="0" width="8" height="80" fill="url(#logoGradient)" />

          {/* Trennzeichen */}
          <rect x="140" y="35" width="8" height="10" fill={colors.accent} />

          {/* T */}
          <rect x="165" y="0" width="50" height="8" fill="url(#logoGradient)" />
          <rect x="185" y="0" width="8" height="80" fill="url(#logoGradient)" />

          {/* E */}
          <rect x="230" y="0" width="8" height="80" fill="url(#logoGradient)" />
          <rect x="230" y="0" width="35" height="8" fill="url(#logoGradient)" />
          <rect
            x="230"
            y="36"
            width="30"
            height="8"
            fill="url(#logoGradient)"
          />
          <rect
            x="230"
            y="72"
            width="35"
            height="8"
            fill="url(#logoGradient)"
          />

          {/* C */}
          <rect x="280" y="0" width="35" height="8" fill="url(#logoGradient)" />
          <rect
            x="280"
            y="72"
            width="35"
            height="8"
            fill="url(#logoGradient)"
          />
          <rect x="280" y="0" width="8" height="80" fill="url(#logoGradient)" />

          {/* H */}
          <rect x="330" y="0" width="8" height="80" fill="url(#logoGradient)" />
          <rect x="355" y="0" width="8" height="80" fill="url(#logoGradient)" />
          <rect
            x="330"
            y="36"
            width="33"
            height="8"
            fill="url(#logoGradient)"
          />
        </g>

        {/* Technische Akzente */}
        <g opacity="0.6">
          {/* Grid-Pattern */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke={colors.primary}
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="400" height="240" fill="url(#grid)" />
        </g>

        {/* Animierte Scan-Linien (nur bei erlaubten Animationen) */}
        {shouldAnimate && (
          <g>
            <line
              x1="0"
              y1="60"
              x2="400"
              y2="60"
              stroke={colors.primary}
              strokeWidth="1"
              opacity="0.4"
            >
              <animateTransform
                attributeName="y1"
                values="60;180;60"
                dur="3s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="y2"
                values="60;180;60"
                dur="3s"
                repeatCount="indefinite"
              />
            </line>

            <line
              x1="0"
              y1="120"
              x2="400"
              y2="120"
              stroke={colors.secondary}
              strokeWidth="1"
              opacity="0.3"
            >
              <animateTransform
                attributeName="y1"
                values="120;240;120"
                dur="4s"
                repeatCount="indefinite"
              />
              <animateTransform
                attributeName="y2"
                values="120;240;120"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
          </g>
        )}

        {/* Statische Scan-Linien für reduced motion */}
        {!shouldAnimate && (
          <g opacity="0.3">
            <line
              x1="0"
              y1="100"
              x2="400"
              y2="100"
              stroke={colors.primary}
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="140"
              x2="400"
              y2="140"
              stroke={colors.secondary}
              strokeWidth="1"
            />
          </g>
        )}

        {/* Accessibility-Beschreibung */}
        <title>IVO-TECH Logo</title>
        <desc>
          Logo der IVO-TECH Firma mit modernem Design und optionalen
          Animationen. Bei deaktivierter Animation wird eine statische Version
          gezeigt.
        </desc>
      </svg>

      {/* Screen Reader Text */}
      <span className="sr-only">IVO-TECH - Innovative Technologielösungen</span>
    </div>
  );
}

export default SVGLogoFallback;
