'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface CubeProps {
  position: [number, number, number];
  color: string;
  targetColor: string;
  onClick: () => void;
  isCorrect: boolean;
  index: number;
}

function PuzzleCube({
  position,
  color,
  targetColor,
  onClick,
  isCorrect,
  index,
}: CubeProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(state => {
    if (mesh.current) {
      mesh.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() + index) * 0.1;
      mesh.current.rotation.y =
        Math.cos(state.clock.getElapsedTime() + index) * 0.1;

      if (isCorrect) {
        mesh.current.scale.setScalar(
          1.1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.05
        );
      } else {
        mesh.current.scale.setScalar(hovered ? 1.1 : 1);
      }
    }
  });

  return (
    <Box
      ref={mesh}
      position={position}
      args={[1, 1, 1]}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={color}
        emissive={isCorrect ? targetColor : '#000000'}
        emissiveIntensity={isCorrect ? 0.3 : 0}
        transparent
        opacity={0.9}
      />
      {hovered && !isCorrect && (
        <Html center>
          <div className="rounded bg-white/90 p-2 text-xs font-bold text-black backdrop-blur">
            Target: {targetColor}
          </div>
        </Html>
      )}
    </Box>
  );
}

const colors = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ffa500',
  '#800080',
  '#008000',
];
const targetPattern = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#ffa500',
  '#800080',
  '#008000',
];

export function CubePuzzle({ onComplete }: { onComplete: () => void }) {
  const [cubeColors, setCubeColors] = useState<string[]>(
    Array(9)
      .fill(0)
      .map(() => colors[Math.floor(Math.random() * colors.length)])
  );
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      // Game over
      setGameStarted(false);
    }
  }, [timeLeft, gameStarted, isCompleted]);

  useEffect(() => {
    const correctCount = cubeColors.filter(
      (color, index) => color === targetPattern[index]
    ).length;
    setScore(correctCount);

    if (correctCount === 9 && !isCompleted) {
      setIsCompleted(true);
      onComplete();
    }
  }, [cubeColors, isCompleted, onComplete]);

  const handleCubeClick = (index: number) => {
    if (!gameStarted || isCompleted) return;

    setCubeColors(prev => {
      const newColors = [...prev];
      const currentColorIndex = colors.indexOf(newColors[index]);
      newColors[index] = colors[(currentColorIndex + 1) % colors.length];
      return newColors;
    });
  };

  const resetGame = () => {
    setCubeColors(
      Array(9)
        .fill(0)
        .map(() => colors[Math.floor(Math.random() * colors.length)])
    );
    setScore(0);
    setIsCompleted(false);
    setTimeLeft(60);
    setGameStarted(true);
  };

  const getCubePosition = (index: number): [number, number, number] => {
    const x = ((index % 3) - 1) * 2;
    const y = (Math.floor(index / 3) - 1) * -2;
    return [x, y, 0];
  };

  return (
    <div className="relative h-full w-full">
      {/* Game UI Overlay */}
      <div className="absolute left-4 top-4 z-10 rounded-lg bg-black/80 p-4 text-white backdrop-blur">
        <h3 className="mb-2 text-xl font-bold">🧩 3D Cube Puzzle</h3>
        <div className="space-y-2 text-sm">
          <div>Score: {score}/9</div>
          <div>Time: {timeLeft}s</div>
          <div className="text-xs text-gray-300">
            Click cubes to change colors!
          </div>
        </div>
      </div>

      {/* Target Pattern Display */}
      <div className="absolute right-4 top-4 z-10 rounded-lg bg-black/80 p-4 text-white backdrop-blur">
        <h4 className="mb-2 text-sm font-bold">Target Pattern:</h4>
        <div className="grid grid-cols-3 gap-1">
          {targetPattern.map((color, index) => (
            <div
              key={index}
              className="h-6 w-6 rounded border border-white/30"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Game Controls */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform">
        {!gameStarted && !isCompleted && (
          <button
            onClick={resetGame}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white transition-all hover:from-blue-700 hover:to-purple-700"
          >
            Start Game
          </button>
        )}

        {(gameStarted || isCompleted) && (
          <button
            onClick={resetGame}
            className="rounded-lg bg-gradient-to-r from-green-600 to-blue-600 px-6 py-3 font-bold text-white transition-all hover:from-green-700 hover:to-blue-700"
          >
            Reset Game
          </button>
        )}
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur"
          >
            <div className="rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 p-8 text-center text-white">
              <div className="mb-4 text-6xl">🎉</div>
              <h2 className="mb-2 text-3xl font-bold">Puzzle Solved!</h2>
              <p className="text-lg">Amazing work! You're a 3D master!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#0099ff"
        />

        {/* Puzzle Cubes */}
        {cubeColors.map((color, index) => (
          <PuzzleCube
            key={index}
            position={getCubePosition(index)}
            color={color}
            targetColor={targetPattern[index]}
            onClick={() => handleCubeClick(index)}
            isCorrect={color === targetPattern[index]}
            index={index}
          />
        ))}

        {/* Background Elements */}
        <Box position={[0, 0, -5]} args={[12, 8, 0.1]}>
          <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
        </Box>

        <Text
          position={[0, -4, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Match the Target Pattern!
        </Text>
      </Canvas>
    </div>
  );
}
