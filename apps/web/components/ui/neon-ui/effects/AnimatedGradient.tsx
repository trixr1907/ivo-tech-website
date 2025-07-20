'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useNeonContext } from '../NeonProvider';
import { AnimatedGradientProps } from '../types';

export function AnimatedGradient({
  colors,
  speed = 1,
  direction = 0,
  audioReactive = false,
  className = '',
}: AnimatedGradientProps) {
  const { is4DMode, frequencyData } = useNeonContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const [supportsHoudini, setSupportsHoudini] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    // CSS Houdini Paint API Support prüfen
    if ('CSS' in window && 'paintWorklet' in CSS) {
      (CSS as any).paintWorklet
        .addModule('/worklets/gradient-worklet.js')
        .then(() => {
          setSupportsHoudini(true);
        })
        .catch(() => {
          setSupportsHoudini(false);
        });
    }
  }, []);

  useEffect(() => {
    // Animation Timer
    const startTime = Date.now();
    const animate = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      setTime(currentTime);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const getHoudiniStyle = () => {
    if (!supportsHoudini) return {};

    const audioData = audioReactive && is4DMode && frequencyData ? JSON.stringify(Array.from(frequencyData)) : '';

    return {
      background: 'paint(neon-gradient)',
      '--neon-colors': colors.join(','),
      '--neon-speed': speed.toString(),
      '--neon-time': time.toString(),
      '--neon-direction': direction.toString(),
      '--neon-frequency-data': audioData,
    } as React.CSSProperties;
  };

  const getFallbackStyle = () => {
    if (supportsHoudini) return {};

    // Fallback für Browser ohne Houdini Support
    const audioIntensity =
      audioReactive && is4DMode && frequencyData
        ? 1 + (Array.from(frequencyData).reduce((a, b) => a + b, 0) / frequencyData.length / 255) * 0.5
        : 1;

    const animatedAngle = ((direction * 180) / Math.PI + time * speed * 10 * audioIntensity) % 360;

    return {
      background: `linear-gradient(${animatedAngle}deg, ${colors.join(', ')})`,
      animation: `neonPulse ${2 / speed}s ease-in-out infinite${audioReactive && is4DMode ? ' alternate' : ''}`,
    } as React.CSSProperties;
  };

  return (
    <>
      <style jsx global>{`
        @keyframes neonPulse {
          0%,
          100% {
            filter: brightness(1) saturate(1);
          }
          50% {
            filter: brightness(1.2) saturate(1.3);
          }
        }

        @supports (background: paint(neon-gradient)) {
          .neon-gradient-houdini {
            background: paint(neon-gradient);
          }
        }
      `}</style>
      <div
        ref={elementRef}
        className={`neon-gradient ${supportsHoudini ? 'neon-gradient-houdini' : ''} ${className}`}
        style={{
          ...getHoudiniStyle(),
          ...getFallbackStyle(),
          backgroundSize: '200% 200%',
          transition: 'all 0.3s ease',
        }}
      />
    </>
  );
}
