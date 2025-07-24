'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  ColorAverage,
  Glitch,
  Noise,
  Pixelation,
  Scanline,
  Vignette,
  FXAA,
  SMAA,
  ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize, ToneMappingMode } from 'postprocessing';
import * as THREE from 'three';
import { useAdvancedShaders } from '../shaders/AdvancedShaderManager';

interface EffectConfig {
  enabled: boolean;
  intensity: number;
  parameters: Record<string, any>;
}

interface EffectPreset {
  name: string;
  description: string;
  effects: Record<string, EffectConfig>;
}

interface ParticleSystem {
  id: string;
  count: number;
  positions: Float32Array;
  velocities: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  lifetimes: Float32Array;
  maxLifetime: number;
  emissionRate: number;
  material: THREE.PointsMaterial;
  geometry: THREE.BufferGeometry;
  points: THREE.Points;
}

export function VisualEffectsPipeline() {
  const { gl, scene, camera } = useThree();
  const shaderAPI = useAdvancedShaders();

  const [currentPreset, setCurrentPreset] = useState<string>('cyberpunk');
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const [audioReactive, setAudioReactive] = useState(false);

  const particleSystems = useRef<Map<string, ParticleSystem>>(new Map());
  const audioAnalyser = useRef<AnalyserNode | null>(null);

  // Effect presets
  const effectPresets: Record<string, EffectPreset> = {
    cyberpunk: {
      name: 'Cyberpunk',
      description: 'High-contrast neon aesthetic with glitch effects',
      effects: {
        bloom: {
          enabled: true,
          intensity: 2.0,
          parameters: {
            luminanceThreshold: 0.1,
            luminanceSmoothing: 0.9,
            kernelSize: KernelSize.LARGE,
          },
        },
        chromaticAberration: {
          enabled: true,
          intensity: 0.002,
          parameters: { offset: [0.002, 0.002], radialModulation: true },
        },
        glitch: {
          enabled: true,
          intensity: 0.3,
          parameters: {
            delay: [1.5, 3.5],
            duration: [0.6, 1.0],
            strength: [0.3, 1.0],
          },
        },
        scanline: {
          enabled: true,
          intensity: 0.3,
          parameters: { density: 1.25 },
        },
        vignette: {
          enabled: true,
          intensity: 0.5,
          parameters: { eskil: false, darkness: 0.5 },
        },
      },
    },
    dreamy: {
      name: 'Dreamy',
      description: 'Soft, ethereal look with subtle bloom',
      effects: {
        bloom: {
          enabled: true,
          intensity: 1.5,
          parameters: {
            luminanceThreshold: 0.3,
            luminanceSmoothing: 0.95,
            kernelSize: KernelSize.MEDIUM,
          },
        },
        chromaticAberration: {
          enabled: false,
          intensity: 0,
          parameters: {},
        },
        colorAverage: {
          enabled: true,
          intensity: 0.1,
          parameters: { blendFunction: BlendFunction.NORMAL },
        },
        vignette: {
          enabled: true,
          intensity: 0.3,
          parameters: { eskil: true, darkness: 0.3 },
        },
      },
    },
    retro: {
      name: 'Retro',
      description: 'Vintage CRT monitor simulation',
      effects: {
        pixelation: {
          enabled: true,
          intensity: 4.0,
          parameters: { granularity: 4 },
        },
        scanline: {
          enabled: true,
          intensity: 0.8,
          parameters: { density: 2.0 },
        },
        vignette: {
          enabled: true,
          intensity: 0.7,
          parameters: { eskil: false, darkness: 0.7 },
        },
        noise: {
          enabled: true,
          intensity: 0.1,
          parameters: { premultiply: true },
        },
      },
    },
    minimal: {
      name: 'Minimal',
      description: 'Clean, subtle enhancements',
      effects: {
        bloom: {
          enabled: true,
          intensity: 0.8,
          parameters: {
            luminanceThreshold: 0.8,
            luminanceSmoothing: 0.9,
            kernelSize: KernelSize.SMALL,
          },
        },
        fxaa: {
          enabled: true,
          intensity: 1.0,
          parameters: {},
        },
        toneMapping: {
          enabled: true,
          intensity: 1.0,
          parameters: { mode: ToneMappingMode.ACES_FILMIC, exposure: 1.0 },
        },
      },
    },
  };

  // Initialize audio analyser
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioAnalyser.current = analyser;
    }
  }, []);

  // Create particle system
  const createParticleSystem = (
    id: string,
    config: {
      count: number;
      emissionRate: number;
      maxLifetime: number;
      color: THREE.Color;
      size: number;
    }
  ) => {
    const { count, emissionRate, maxLifetime, color, size } = config;

    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);

    // Initialize arrays
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random initial positions
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 2;
      velocities[i3 + 1] = (Math.random() - 0.5) * 2;
      velocities[i3 + 2] = (Math.random() - 0.5) * 2;

      // Colors
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Sizes and lifetimes
      sizes[i] = size * (0.5 + Math.random() * 0.5);
      lifetimes[i] = Math.random() * maxLifetime;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: size,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.1,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const particleSystem: ParticleSystem = {
      id,
      count,
      positions,
      velocities,
      colors,
      sizes,
      lifetimes,
      maxLifetime,
      emissionRate,
      material,
      geometry,
      points,
    };

    particleSystems.current.set(id, particleSystem);
    return particleSystem;
  };

  // Update particle systems
  const updateParticles = (delta: number, audioData?: Uint8Array) => {
    particleSystems.current.forEach(system => {
      const { positions, velocities, lifetimes, maxLifetime, count } = system;

      let audioIntensity = 1.0;
      if (audioData && audioReactive) {
        const avgAudio =
          audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
        audioIntensity = 1.0 + (avgAudio / 255) * 2.0;
      }

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Update lifetime
        lifetimes[i] -= delta * audioIntensity;

        if (lifetimes[i] <= 0) {
          // Respawn particle
          positions[i3] = (Math.random() - 0.5) * 20;
          positions[i3 + 1] = (Math.random() - 0.5) * 20;
          positions[i3 + 2] = (Math.random() - 0.5) * 20;

          velocities[i3] = (Math.random() - 0.5) * 2;
          velocities[i3 + 1] = (Math.random() - 0.5) * 2;
          velocities[i3 + 2] = (Math.random() - 0.5) * 2;

          lifetimes[i] = maxLifetime;
        } else {
          // Update position
          positions[i3] += velocities[i3] * delta * audioIntensity;
          positions[i3 + 1] += velocities[i3 + 1] * delta * audioIntensity;
          positions[i3 + 2] += velocities[i3 + 2] * delta * audioIntensity;

          // Apply physics (gravity, drag)
          velocities[i3 + 1] -= 9.8 * delta * 0.1; // Gravity
          velocities[i3] *= 0.99; // Drag
          velocities[i3 + 1] *= 0.99;
          velocities[i3 + 2] *= 0.99;
        }
      }

      // Update geometry
      system.geometry.attributes.position.needsUpdate = true;

      // Update material opacity based on lifetime
      const opacities = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        opacities[i] = lifetimes[i] / maxLifetime;
      }
      system.geometry.setAttribute(
        'opacity',
        new THREE.BufferAttribute(opacities, 1)
      );
    });
  };

  // Animation loop
  useFrame((state, delta) => {
    let audioData: Uint8Array | undefined;

    // Get audio data
    if (audioAnalyser.current && audioReactive) {
      audioData = new Uint8Array(audioAnalyser.current.frequencyBinCount);
      audioAnalyser.current.getByteFrequencyData(audioData);
    }

    // Update particles
    updateParticles(delta, audioData);

    // Update shader uniforms with audio data
    if (shaderAPI && audioData) {
      const avgAudio =
        audioData.reduce((sum, val) => sum + val, 0) / audioData.length;
      const normalizedAudio = avgAudio / 255;

      // Update all registered shaders
      const activeShaders = shaderAPI.getActiveShaders();
      activeShaders.forEach(([id, config]: [string, any]) => {
        if (config.animated) {
          shaderAPI.updateUniform(id, 'audioReactive', normalizedAudio);
        }
      });
    }
  });

  // Initialize default particle systems
  useEffect(() => {
    createParticleSystem('sparks', {
      count: 1000,
      emissionRate: 50,
      maxLifetime: 3.0,
      color: new THREE.Color(0x00ffff),
      size: 0.1,
    });

    createParticleSystem('dust', {
      count: 2000,
      emissionRate: 100,
      maxLifetime: 8.0,
      color: new THREE.Color(0xffffff),
      size: 0.02,
    });

    return () => {
      // Cleanup
      particleSystems.current.forEach(system => {
        scene.remove(system.points);
        system.geometry.dispose();
        system.material.dispose();
      });
      particleSystems.current.clear();
    };
  }, [createParticleSystem, scene]);

  // Get current preset effects
  const currentEffects = effectPresets[currentPreset]?.effects || {};


  // Effect API Memo
  const effectsAPI = useMemo(() => ({
    setPreset: setCurrentPreset,
    toggleEffects: () => setEffectsEnabled(!effectsEnabled),
    toggleAudioReactive: () => setAudioReactive(!audioReactive),
    createParticleSystem,
    removeParticleSystem: (id: string) => {
      const system = particleSystems.current.get(id);
      if (system) {
        scene.remove(system.points);
        system.geometry.dispose();
        system.material.dispose();
        particleSystems.current.delete(id);
      }
    },
    getCurrentPreset: () => currentPreset,
    getAvailablePresets: () => Object.keys(effectPresets),
    isEnabled: effectsEnabled,
    isAudioReactive: audioReactive,
  }), [currentPreset, effectsEnabled, audioReactive, createParticleSystem, scene]);

  // Make API globally available
  useEffect(() => {
    (window as any).VisualEffectsPipeline = effectsAPI;
    return () => {
      delete (window as any).VisualEffectsPipeline;
    };
  }, [effectsAPI]);

  if (!effectsEnabled) {
    return null;
  }

  // Create array of effects to render
  const effects = [];

  // Bloom
  if (currentEffects.bloom?.enabled) {
    effects.push(
      <Bloom
        key="bloom"
        intensity={currentEffects.bloom.intensity}
        luminanceThreshold={currentEffects.bloom.parameters.luminanceThreshold}
        luminanceSmoothing={currentEffects.bloom.parameters.luminanceSmoothing}
      />
    );
  }

  // Chromatic Aberration
  if (currentEffects.chromaticAberration?.enabled) {
    effects.push(
      <ChromaticAberration
        key="chromatic-aberration"
        offset={
          new THREE.Vector2(
            ...(currentEffects.chromaticAberration.parameters.offset || [
              0.001, 0.001,
            ])
          )
        }
        radialModulation={
          currentEffects.chromaticAberration.parameters.radialModulation
        }
        blendFunction={BlendFunction.NORMAL}
      />
    );
  }

  // Glitch
  if (currentEffects.glitch?.enabled) {
    effects.push(
      <Glitch
        key="glitch"
        delay={currentEffects.glitch.parameters.delay}
        duration={currentEffects.glitch.parameters.duration}
        strength={currentEffects.glitch.parameters.strength}
        mode={1}
        active
        ratio={0.85}
      />
    );
  }

  // Scanlines
  if (currentEffects.scanline?.enabled) {
    effects.push(
      <Scanline
        key="scanline"
        density={currentEffects.scanline.parameters.density}
        blendFunction={BlendFunction.OVERLAY}
      />
    );
  }

  // Vignette
  if (currentEffects.vignette?.enabled) {
    effects.push(
      <Vignette
        key="vignette"
        eskil={currentEffects.vignette.parameters.eskil}
        offset={0.1}
        darkness={currentEffects.vignette.parameters.darkness}
        blendFunction={BlendFunction.MULTIPLY}
      />
    );
  }

  // Pixelation
  if (currentEffects.pixelation?.enabled) {
    effects.push(
      <Pixelation
        key="pixelation"
        granularity={currentEffects.pixelation.parameters.granularity}
      />
    );
  }

  // Noise
  if (currentEffects.noise?.enabled) {
    effects.push(
      <Noise
        key="noise"
        premultiply={currentEffects.noise.parameters.premultiply}
        blendFunction={BlendFunction.SCREEN}
      />
    );
  }

  // Color Average
  if (currentEffects.colorAverage?.enabled) {
    effects.push(
      <ColorAverage
        key="color-average"
        blendFunction={currentEffects.colorAverage.parameters.blendFunction}
      />
    );
  }

  // FXAA
  if (currentEffects.fxaa?.enabled) {
    effects.push(<FXAA key="fxaa" />);
  }

  // SMAA
  if (currentEffects.smaa?.enabled) {
    effects.push(<SMAA key="smaa" />);
  }

  // Tone Mapping
  if (currentEffects.toneMapping?.enabled) {
    effects.push(
      <ToneMapping
        key="tone-mapping"
        mode={currentEffects.toneMapping.parameters.mode}
        resolution={256}
        maxLuminance={16.0}
        whitePoint={4.0}
        middleGrey={0.6}
        minLuminance={0.01}
        adaptationRate={1.0}
      />
    );
  }

  return <EffectComposer>{effects}</EffectComposer>;
}

// Hook for external usage
export function useVisualEffects() {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    const checkAPI = () => {
      if ((window as any).VisualEffectsPipeline) {
        setApi((window as any).VisualEffectsPipeline);
      }
    };

    checkAPI();
    const interval = setInterval(checkAPI, 100);

    return () => clearInterval(interval);
  }, []);

  return api;
}
