import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  DotScreen,
  Glitch,
  Noise,
  Pixelation,
  SMAA,
  SSAO,
  Vignette
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { useThree, useFrame } from '@react-three/fiber';

export interface PostProcessingProps {
  enabled?: boolean;
  effects?: {
    bloom?: {
      enabled?: boolean;
      intensity?: number;
      luminanceThreshold?: number;
      luminanceSmoothing?: number;
      kernelSize?: KernelSize;
    };
    chromaticAberration?: {
      enabled?: boolean;
      offset?: [number, number];
    };
    depthOfField?: {
      enabled?: boolean;
      focusDistance?: number;
      focalLength?: number;
      bokehScale?: number;
    };
    dotScreen?: {
      enabled?: boolean;
      angle?: number;
      scale?: number;
    };
    glitch?: {
      enabled?: boolean;
      delay?: [number, number];
      duration?: [number, number];
      strength?: [number, number];
    };
    noise?: {
      enabled?: boolean;
      intensity?: number;
      blendFunction?: BlendFunction;
    };
    pixelation?: {
      enabled?: boolean;
      granularity?: number;
    };
    ssao?: {
      enabled?: boolean;
      intensity?: number;
      radius?: number;
      scale?: number;
      bias?: number;
    };
    vignette?: {
      enabled?: boolean;
      darkness?: number;
      offset?: number;
    };
  };
  onEffectsUpdate?: (effectState: any) => void;
}

const PostProcessing: React.FC<PostProcessingProps> = ({
  enabled = true,
  effects = {},
  onEffectsUpdate
}) => {
  const composerRef = useRef<EffectComposer>();
  const { gl, size, scene, camera } = useThree();

  // Dynamic effect state management
  const effectStateRef = useRef({
    bloom: { active: false },
    chromaticAberration: { active: false },
    depthOfField: { active: false },
    dotScreen: { active: false },
    glitch: { active: false },
    noise: { active: false },
    pixelation: { active: false },
    ssao: { active: false },
    vignette: { active: false }
  });

  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
  }, [size]);

  useFrame((state, delta) => {
    if (enabled && composerRef.current) {
      composerRef.current.render(delta);
    }
  }, 1);

  if (!enabled) return null;

  return (
    <EffectComposer ref={composerRef}>
      <SMAA />

      {/* Bloom Effect */}
      {effects.bloom?.enabled && (
        <Bloom
          intensity={effects.bloom.intensity ?? 1}
          luminanceThreshold={effects.bloom.luminanceThreshold ?? 0.9}
          luminanceSmoothing={effects.bloom.luminanceSmoothing ?? 0.025}
          kernelSize={effects.bloom.kernelSize ?? KernelSize.LARGE}
        />
      )}

      {/* Chromatic Aberration */}
      {effects.chromaticAberration?.enabled && (
        <ChromaticAberration
          offset={effects.chromaticAberration.offset ?? [0.002, 0.002]}
        />
      )}

      {/* Depth of Field */}
      {effects.depthOfField?.enabled && (
        <DepthOfField
          focusDistance={effects.depthOfField.focusDistance ?? 0.0}
          focalLength={effects.depthOfField.focalLength ?? 0.048}
          bokehScale={effects.depthOfField.bokehScale ?? 2.0}
        />
      )}

      {/* Dot Screen */}
      {effects.dotScreen?.enabled && (
        <DotScreen
          angle={effects.dotScreen.angle ?? 1.57}
          scale={effects.dotScreen.scale ?? 1.0}
        />
      )}

      {/* Glitch */}
      {effects.glitch?.enabled && (
        <Glitch
          delay={effects.glitch.delay ?? [1.5, 3.5]}
          duration={effects.glitch.duration ?? [0.6, 1.0]}
          strength={effects.glitch.strength ?? [0.3, 1.0]}
        />
      )}

      {/* Noise */}
      {effects.noise?.enabled && (
        <Noise
          intensity={effects.noise.intensity ?? 0.025}
          blendFunction={effects.noise.blendFunction ?? BlendFunction.MULTIPLY}
        />
      )}

      {/* Pixelation */}
      {effects.pixelation?.enabled && (
        <Pixelation
          granularity={effects.pixelation.granularity ?? 8}
        />
      )}

      {/* SSAO (Screen Space Ambient Occlusion) */}
      {effects.ssao?.enabled && (
        <SSAO
          intensity={effects.ssao.intensity ?? 20}
          radius={effects.ssao.radius ?? 0.1}
          scale={effects.ssao.scale ?? 0.5}
          bias={effects.ssao.bias ?? 0.025}
        />
      )}

      {/* Vignette */}
      {effects.vignette?.enabled && (
        <Vignette
          offset={effects.vignette.offset ?? 0.5}
          darkness={effects.vignette.darkness ?? 0.5}
        />
      )}
    </EffectComposer>
  );
};

export default PostProcessing;

// Effect presets
export const effectPresets = {
  cinematic: {
    bloom: {
      enabled: true,
      intensity: 1.5,
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.05
    },
    chromaticAberration: {
      enabled: true,
      offset: [0.002, 0.002]
    },
    vignette: {
      enabled: true,
      darkness: 0.6,
      offset: 0.5
    }
  },
  retro: {
    dotScreen: {
      enabled: true,
      angle: 1.57,
      scale: 1.0
    },
    noise: {
      enabled: true,
      intensity: 0.05,
      blendFunction: BlendFunction.OVERLAY
    },
    pixelation: {
      enabled: true,
      granularity: 8
    }
  },
  dramatic: {
    bloom: {
      enabled: true,
      intensity: 2,
      luminanceThreshold: 0.7
    },
    depthOfField: {
      enabled: true,
      focusDistance: 0.0,
      focalLength: 0.048,
      bokehScale: 2.0
    },
    vignette: {
      enabled: true,
      darkness: 0.7,
      offset: 0.3
    }
  },
  horror: {
    chromaticAberration: {
      enabled: true,
      offset: [0.004, 0.004]
    },
    glitch: {
      enabled: true,
      delay: [2.0, 4.0],
      duration: [0.2, 0.4],
      strength: [0.2, 0.4]
    },
    noise: {
      enabled: true,
      intensity: 0.1
    },
    vignette: {
      enabled: true,
      darkness: 0.8,
      offset: 0.2
    }
  }
} as const;
