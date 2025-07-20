'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Box, Text, Html, useGLTF, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import * as THREE from 'three';
import { roastEngine, formatRoastForDisplay, type RoastEntry } from './RoastEngine';

// Types
interface RoastJoke {
  text: string;
  level: 'mild' | 'medium' | 'savage';
}

interface NewsHeadline {
  title: string;
  source: string;
  positive: boolean;
}

interface ParticleProps {
  position: [number, number, number];
  velocity: [number, number, number];
  life: number;
}

// Roast Jokes Database
const roastJokes: RoastJoke[] = [
  { text: 'Still waiting for that Bitcoin crash since 2009? 📉😂', level: 'mild' },
  { text: 'Your portfolio is flatter than the Earth you think it is 🌍💸', level: 'medium' },
  { text: 'Buying the dip... of traditional banking tears 🏦😭', level: 'mild' },
  { text: 'HODL? More like NOPE-L for you! 💎🙌', level: 'mild' },
  { text: 'Your fiat money printer goes BRRR... straight to zero 🖨️💸', level: 'medium' },
  { text: "Still believing in 'store of value' gold while missing digital gold? ⚡🪙", level: 'medium' },
  { text: "Web3? You're still stuck in Web0.5 mindset! 🕸️🧠", level: 'savage' },
  { text: 'Your investment strategy: Buy high, sell low, repeat 📊🤡', level: 'savage' },
  { text: 'Satoshi would be disappointed in your paper hands 📄🤲', level: 'savage' },
  { text: 'Still paying bank fees while DeFi laughs in your face 🏛️😂', level: 'medium' },
];

// Mock positive tech headlines
const techHeadlines: NewsHeadline[] = [
  { title: 'Revolutionary AI Breakthrough Promises Better Healthcare', source: 'TechCrunch', positive: true },
  { title: 'Sustainable Energy Solutions Reach New Efficiency Records', source: 'GreenTech', positive: true },
  { title: 'Quantum Computing Makes Major Leap Forward', source: 'ScienceDaily', positive: true },
  { title: 'Blockchain Technology Enhances Supply Chain Transparency', source: 'CoinDesk', positive: true },
  { title: 'Neural Interfaces Show Promise for Paralyzed Patients', source: 'MedTech', positive: true },
  { title: 'Clean Water Technology Deployed in Remote Areas', source: 'HumanitarianTech', positive: true },
];

// Konami Code sequence
const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

// Particle System Component
function ParticleSystem({ trigger, position }: { trigger: number; position: [number, number, number] }) {
  const particlesRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      // Create explosion particles
      const newParticles: ParticleProps[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          position: [...position] as [number, number, number],
          velocity: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
          life: 1.0,
        });
      }
      setParticles(newParticles);
    }
  }, [trigger, position]);

  useFrame((_, delta) => {
    setParticles(prev =>
      prev
        .map(particle => ({
          ...particle,
          position: [
            particle.position[0] + particle.velocity[0] * delta,
            particle.position[1] + particle.velocity[1] * delta,
            particle.position[2] + particle.velocity[2] * delta,
          ] as [number, number, number],
          velocity: [
            particle.velocity[0] * 0.98,
            particle.velocity[1] * 0.98 - delta * 5,
            particle.velocity[2] * 0.98,
          ] as [number, number, number],
          life: particle.life - delta * 2,
        }))
        .filter(particle => particle.life > 0)
    );
  });

  return (
    <group>
      {particles.map((particle, index) => (
        <Sphere key={index} position={particle.position} args={[0.05]}>
          <meshBasicMaterial color='#ffd700' transparent opacity={particle.life} />
        </Sphere>
      ))}
    </group>
  );
}

// Shader Material for Screen Effect
const ScreenMaterial = ({ text, isRaptor }: { text: string; isRaptor: boolean }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform vec3 color;
    uniform bool isRaptor;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Scanlines
      float scanline = sin(uv.y * 800.0) * 0.1;
      
      // Pixel grid
      vec2 pixelUv = floor(uv * 64.0) / 64.0;
      
      // Moving text effect
      float textScroll = fract(time * 0.1);
      float textMask = step(0.3, sin((pixelUv.y + textScroll) * 20.0));
      
      vec3 finalColor = isRaptor 
        ? mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.5, 0.0), sin(time * 5.0) * 0.5 + 0.5)
        : color;
      
      // Add glow effect
      float glow = 1.0 + sin(time * 3.0) * 0.2;
      
      gl_FragColor = vec4(finalColor * textMask * glow + scanline, 0.8);
    }
  `;

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      color: { value: new THREE.Color(isRaptor ? '#ff4500' : '#00ff00') },
      isRaptor: { value: isRaptor },
    }),
    [isRaptor]
  );

  useFrame(state => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
      transparent
    />
  );
};

// Arcade Cabinet Component
function ArcadeCabinet({
  onClick,
  isTransformed,
  screenText,
}: {
  onClick: () => void;
  isTransformed: boolean;
  screenText: string;
}) {
  const cabinetRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame(state => {
    if (cabinetRef.current && !isTransformed) {
      cabinetRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const cabinetGeometry = useMemo(() => {
    if (isTransformed) {
      // Laser Raptor transformation
      const geometry = new THREE.ConeGeometry(1, 3, 8);
      return geometry;
    } else {
      // Regular arcade cabinet
      return new THREE.BoxGeometry(2, 3, 1);
    }
  }, [isTransformed]);

  return (
    <group ref={cabinetRef} onClick={onClick}>
      {/* Main Cabinet Body */}
      <mesh geometry={cabinetGeometry}>
        <meshStandardMaterial
          color={isTransformed ? '#ff4500' : '#2a0845'}
          emissive={isTransformed ? '#ff2200' : '#4a1a5a'}
          emissiveIntensity={isTransformed ? 0.5 : 0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0.5, 0.51]}>
        <boxGeometry args={[1.6, 1, 0.02]} />
        <ScreenMaterial text={screenText} isRaptor={isTransformed} />
      </mesh>

      {/* Screen Frame */}
      <Box position={[0, 0.5, 0.52]} args={[1.8, 1.2, 0.05]}>
        <meshStandardMaterial color='#1a1a1a' metalness={0.8} roughness={0.2} />
      </Box>

      {/* Control Panel */}
      {!isTransformed && (
        <Box position={[0, -0.5, 0.51]} args={[1.5, 0.5, 0.1]}>
          <meshStandardMaterial color='#333333' metalness={0.5} roughness={0.5} />
        </Box>
      )}

      {/* Coin Slot */}
      {!isTransformed && (
        <Box position={[0.6, 0, 0.51]} args={[0.2, 0.05, 0.02]}>
          <meshStandardMaterial color='#000000' />
        </Box>
      )}

      {/* LED Strips (only in raptor mode) */}
      {isTransformed && (
        <>
          <Box position={[-0.8, 1, 0]} args={[0.05, 2, 0.05]}>
            <meshBasicMaterial color='#ff0000' />
          </Box>
          <Box position={[0.8, 1, 0]} args={[0.05, 2, 0.05]}>
            <meshBasicMaterial color='#ff0000' />
          </Box>
        </>
      )}
    </group>
  );
}

// Virtual Coin Component
function VirtualCoin({ position, onLand }: { position: [number, number, number]; onLand: () => void }) {
  const coinRef = useRef<THREE.Mesh>(null);
  const [velocity, setVelocity] = useState<[number, number, number]>([0, 0, 0]);
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    setVelocity([(Math.random() - 0.5) * 2, 5, (Math.random() - 0.5) * 2]);
  }, []);

  useFrame((_, delta) => {
    if (coinRef.current && !hasLanded) {
      coinRef.current.position.x += velocity[0] * delta;
      coinRef.current.position.y += velocity[1] * delta;
      coinRef.current.position.z += velocity[2] * delta;

      // Apply gravity
      setVelocity(prev => [prev[0], prev[1] - 9.8 * delta, prev[2]]);

      // Rotation
      coinRef.current.rotation.x += delta * 10;
      coinRef.current.rotation.y += delta * 15;

      // Check if landed
      if (coinRef.current.position.y < -2 && !hasLanded) {
        setHasLanded(true);
        onLand();
      }
    }
  });

  return (
    <mesh ref={coinRef} position={position}>
      <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
      <meshStandardMaterial color='#ffd700' metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Main Component
export function NoCoinerRoastMachine({ onComplete }: { onComplete?: () => void }) {
  const [currentRoast, setCurrentRoast] = useState<RoastEntry | null>(null);
  const [currentHeadline, setCurrentHeadline] = useState<NewsHeadline>(techHeadlines[0]);
  const [humorLevel, setHumorLevel] = useState<'mild' | 'medium' | 'savage'>('mild');
  const [coins, setCoins] = useState<Array<{ id: number; position: [number, number, number] }>>([]);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [isTransformed, setIsTransformed] = useState(false);
  const [score, setScore] = useState(0);
  const [rssHeadlines, setRssHeadlines] = useState<NewsHeadline[]>(techHeadlines);
  const [enableMarkdown, setEnableMarkdown] = useState(true);

  // Sound effects (mock URLs - in production use actual sound files)
  const [playToss] = useSound('/sounds/coin-toss.mp3', { volume: 0.5 });
  const [playLand] = useSound('/sounds/coin-land.mp3', { volume: 0.7 });
  const [playTransform] = useSound('/sounds/laser-raptor.mp3', { volume: 0.8 });

  // Initialize RoastEngine with current settings
  useEffect(() => {
    roastEngine.updateSettings({
      humorLevel,
      enableMarkdown,
      rotationInterval: 3000,
    });
  }, [humorLevel, enableMarkdown]);

  // Fetch RSS feeds
  useEffect(() => {
    const fetchRSSFeeds = async () => {
      try {
        const response = await fetch('/api/rss-feeds?positive=true&limit=20');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.items) {
            const headlines = data.items.map((item: any) => ({
              title: item.title,
              source: item.source,
              positive: item.positive || true,
            }));
            setRssHeadlines(prev => [...prev, ...headlines]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch RSS feeds:', error);
      }
    };

    fetchRSSFeeds();
    const rssInterval = setInterval(fetchRSSFeeds, 300000); // Fetch every 5 minutes

    return () => clearInterval(rssInterval);
  }, []);

  // Rotate content using RoastEngine
  useEffect(() => {
    const interval = setInterval(() => {
      // Get roast from RoastEngine
      const roast = roastEngine.getRandomRoast();
      setCurrentRoast(roast);

      // Rotate headlines from RSS or fallback
      const randomHeadline = rssHeadlines[Math.floor(Math.random() * rssHeadlines.length)];
      setCurrentHeadline(randomHeadline);
    }, roastEngine.getSettings().rotationInterval);

    return () => clearInterval(interval);
  }, [humorLevel, rssHeadlines]);

  // Konami Code Detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKonamiSequence(prev => {
        const newSequence = [...prev, event.code].slice(-KONAMI_CODE.length);

        if (
          newSequence.length === KONAMI_CODE.length &&
          newSequence.every((key, index) => key === KONAMI_CODE[index])
        ) {
          if (!isTransformed) {
            setIsTransformed(true);
            playTransform();
            setTimeout(() => setIsTransformed(false), 10000); // Transform for 10 seconds
          }
          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransformed, playTransform]);

  const throwCoin = () => {
    const newCoin = {
      id: Date.now(),
      position: [Math.random() * 4 - 2, 5, Math.random() * 2 - 1] as [number, number, number],
    };

    setCoins(prev => [...prev, newCoin]);
    setParticleTrigger(prev => prev + 1);
    playToss();
  };

  const handleCoinLand = (coinId: number) => {
    setCoins(prev => prev.filter(coin => coin.id !== coinId));
    setScore(prev => prev + 1);
    playLand();
  };

  const getScreenText = () => {
    if (isTransformed) {
      return '🦖 LASER RAPTOR MODE ACTIVATED! 🔥';
    }

    if (Math.random() > 0.5 && currentRoast) {
      return formatRoastForDisplay(currentRoast, enableMarkdown);
    }

    return currentHeadline.title;
  };

  return (
    <div className='relative h-full w-full bg-gradient-to-b from-purple-900 via-blue-900 to-black'>
      {/* Game UI Overlay */}
      <div className='absolute left-4 top-4 z-10 rounded-lg bg-black/80 p-4 text-white backdrop-blur'>
        <h3 className='mb-2 text-xl font-bold'>{isTransformed ? '🦖 LASER RAPTOR' : '🎰 No-Coiner Roast Machine'}</h3>
        <div className='space-y-2 text-sm'>
          <div>Score: {score} coins</div>
          <div>
            Humor Level:
            <select
              value={humorLevel}
              onChange={e => setHumorLevel(e.target.value as 'mild' | 'medium' | 'savage')}
              className='ml-2 rounded bg-gray-800 px-2 text-white'
              disabled={isTransformed}
            >
              <option value='mild'>😊 Mild</option>
              <option value='medium'>😏 Medium</option>
              <option value='savage'>🔥 Savage</option>
            </select>
          </div>
          <div className='text-xs text-gray-300'>
            {isTransformed ? 'RAPTOR MODE ACTIVE!' : 'Klick to throw coins! Try the Konami Code...'}
          </div>
        </div>
      </div>

      {/* Current Message Display */}
      <div className='absolute right-4 top-4 z-10 max-w-md rounded-lg bg-black/80 p-4 text-white backdrop-blur'>
        <h4 className='mb-2 text-sm font-bold'>
          {isTransformed ? 'ROAR!' : Math.random() > 0.5 ? '🔥 Current Roast:' : '📰 Tech News:'}
        </h4>
        <div className='text-sm leading-relaxed'>{getScreenText()}</div>
        {!isTransformed && currentHeadline.source && Math.random() <= 0.5 && (
          <div className='mt-1 text-xs text-gray-400'>Source: {currentHeadline.source}</div>
        )}
      </div>

      {/* Throw Coin Button */}
      <div className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2 transform'>
        <button
          onClick={throwCoin}
          className={`rounded-lg px-6 py-3 font-bold transition-all ${
            isTransformed
              ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
          } text-white`}
          disabled={isTransformed}
        >
          {isTransformed ? '🦖 RAWWWWR!' : '🪙 Throw Coin'}
        </button>
      </div>

      {/* Konami Code Hint */}
      <div className='absolute bottom-4 right-4 z-10 text-xs text-gray-400'>Easter Egg: ↑↑↓↓←→←→BA</div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }} gl={{ antialias: true }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color='#ffffff' />
        <pointLight position={[-10, 5, 5]} intensity={0.8} color={isTransformed ? '#ff4500' : '#00ffff'} />
        <spotLight
          position={[0, 8, 0]}
          angle={0.3}
          penumbra={1}
          intensity={isTransformed ? 2 : 1}
          color={isTransformed ? '#ff0000' : '#ffffff'}
        />

        {/* Arcade Cabinet */}
        <ArcadeCabinet onClick={throwCoin} isTransformed={isTransformed} screenText={getScreenText()} />

        {/* Virtual Coins */}
        {coins.map(coin => (
          <VirtualCoin key={coin.id} position={coin.position} onLand={() => handleCoinLand(coin.id)} />
        ))}

        {/* Particle Systems */}
        <ParticleSystem trigger={particleTrigger} position={[0, 0, 0]} />

        {/* Background Elements */}
        <Box position={[0, 0, -5]} args={[20, 12, 0.1]}>
          <meshStandardMaterial color={isTransformed ? '#2a0000' : '#0a0a2a'} transparent opacity={0.3} />
        </Box>

        {/* Floor */}
        <Box position={[0, -3, 0]} args={[20, 0.2, 10]}>
          <meshStandardMaterial color='#1a1a1a' metalness={0.8} roughness={0.3} />
        </Box>

        {/* Floating Text */}
        <Text
          position={[0, -1.5, 2]}
          fontSize={0.3}
          color={isTransformed ? '#ff4500' : '#00ff88'}
          anchorX='center'
          anchorY='middle'
        >
          {isTransformed ? '🦖 LASER RAPTOR ACTIVATED! 🔥' : 'Click the Machine to Throw Coins!'}
        </Text>

        {/* Success particles when transformed */}
        {isTransformed && (
          <group>
            {Array.from({ length: 20 }).map((_, i) => (
              <Sphere
                key={i}
                position={[Math.sin(i * 0.5) * 3, Math.cos(i * 0.3) * 2 + 2, Math.sin(i * 0.7) * 2]}
                args={[0.1]}
              >
                <meshBasicMaterial color='#ff4500' />
              </Sphere>
            ))}
          </group>
        )}
      </Canvas>

      {/* Transformation Animation Overlay */}
      <AnimatePresence>
        {isTransformed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='pointer-events-none absolute inset-0 z-30'
          >
            <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-red-500/20 to-orange-500/20' />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-6xl'
            >
              🦖
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
