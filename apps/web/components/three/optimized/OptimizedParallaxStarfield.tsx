'use client';

import React, { useRef, useEffect } from 'react';

const OptimizedParallaxStarfield: React.FC<{}> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    let animationFrameId: number;

    const render = () => {
      if (!context) return;
      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;

      context.fillStyle = '#000';
      context.fillRect(0, 0, width, height);

      // Simple starfield logic
      const stars = Array.from({ length: 100 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
      }));

      stars.forEach(star => {
        context.fillStyle = '#fff';
        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} />;
};

export default OptimizedParallaxStarfield;

